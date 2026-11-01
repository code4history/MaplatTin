#!/usr/bin/env node
/**
 * Consumer smoke test for the published types: installs @maplat/tin the way a user would (as a
 * package, never as a source checkout) with npm and with pnpm, then type-checks a small TypeScript
 * file against it with moduleResolution bundler and node16.
 *
 * The compiler options are the strict end of what a user can set: `strict: true`,
 * `skipLibCheck: false` and `types: []`. `skipLibCheck: true` would hide a broken declaration file.
 *
 *   (no option)            the package is packed from this checkout (build dist first).
 *   --from-registry <ver>  the package is <ver> from npm, to compare with a published version.
 *
 * Output: one line of JSON on stdout, `{ "cases": [{ "manager", "moduleResolution", "exit" }],
 * "missing": [...], "ok" }`; logs go to stderr. `missing` lists the relative imports of the
 * installed declaration files that point at no file. Exit code 0 when every case holds, 1
 * otherwise. The temporary directory stays after a failed run, so it can be inspected.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const TIME_LIMIT_MS = 300_000;
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const typescriptVersion = JSON.parse(readFileSync(join(packageRoot, 'node_modules/typescript/package.json'), 'utf8')).version;

const CONSUMER_SOURCE = `import DefaultTin, {
  Tin,
  constrainedTin,
  counterPoint,
  createPoint,
  findIntersections,
  format_version,
  insertSearchIndex,
  vertexCalc,
} from "@maplat/tin";
import type {
  Compiled,
  Edge,
  EdgeSet,
  EdgeSetLegacy,
  IntersectionPoint,
  Options,
  PointSet,
  PropertyTriKey,
  SearchIndex,
  StrictMode,
  StrictStatus,
  Tins,
  Transform,
  Tri,
  TriangleProperties,
  VertexMode,
  YaxisMode,
} from "@maplat/tin";

export type PublicTypes = [
  Compiled,
  Edge,
  EdgeSet,
  EdgeSetLegacy,
  Options,
  PointSet,
  PropertyTriKey,
  SearchIndex,
  StrictMode,
  StrictStatus,
  Tins,
  Transform,
  Tri,
  TriangleProperties,
  VertexMode,
  YaxisMode,
];

export const values = [
  constrainedTin,
  counterPoint,
  createPoint,
  findIntersections,
  format_version,
  insertSearchIndex,
  vertexCalc,
];

export const tin: Tin = new DefaultTin({ wh: [100, 100] });
export const point: IntersectionPoint = { x: 0, y: 0, a: [0, 1], b: [2, 3] };
// @ts-expect-error A type that resolves to any would accept this.
export const notPoint: IntersectionPoint = { x: "0" };
`;

const baseOptions = { target: 'ES2022', strict: true, skipLibCheck: false, types: [], noEmit: true };
const TSCONFIGS = {
  bundler: { ...baseOptions, module: 'ESNext', moduleResolution: 'bundler' },
  node16: { ...baseOptions, module: 'node16', moduleResolution: 'node16' },
};

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: ['ignore', process.stderr, 'inherit'], timeout: TIME_LIMIT_MS });
}

/** Packs this checkout. Scripts stay off: `prepare` would rebuild dist. */
function pack(destination) {
  run('npm', ['pack', '--ignore-scripts', '--pack-destination', destination], packageRoot);
  const tarballs = readdirSync(destination).filter((name) => name.endsWith('.tgz'));
  if (tarballs.length !== 1) throw new Error(`packing made ${tarballs.length} tarballs`);
  return `file:${join(destination, tarballs[0])}`;
}

function writeConsumer(dir, tinSpec) {
  mkdirSync(dir);
  const dependencies = { '@maplat/tin': tinSpec, typescript: typescriptVersion };
  const manifest = { name: 'tin-consumer-smoke', private: true, type: 'module', dependencies };
  writeFileSync(join(dir, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(join(dir, 'consumer.ts'), CONSUMER_SOURCE);
  for (const [name, compilerOptions] of Object.entries(TSCONFIGS)) {
    writeFileSync(join(dir, `tsconfig.${name}.json`), `${JSON.stringify({ compilerOptions, files: ['consumer.ts'] }, null, 2)}\n`);
  }
}

const INSTALL = {
  npm: (dir) => run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], dir),
  pnpm: (dir) => {
    // Our own packages may be younger than the default release age of pnpm.
    writeFileSync(join(dir, 'pnpm-workspace.yaml'), 'minimumReleaseAgeExclude:\n  - "@maplat/*"\n');
    run('pnpm', ['install', '--no-frozen-lockfile', '--ignore-scripts'], dir);
  },
};

/** Runs tsc with one of the configurations and returns its exit code. */
function typecheck(dir, resolution) {
  const tsc = join(dir, 'node_modules/typescript/bin/tsc');
  const result = spawnSync(process.execPath, [tsc, '-p', `tsconfig.${resolution}.json`], {
    cwd: dir,
    encoding: 'utf8',
    timeout: TIME_LIMIT_MS,
  });
  process.stderr.write(result.stdout ?? '');
  return result.status ?? -1;
}

/** Every relative import of the declaration files, resolved to the file it needs on disk. */
function missingDeclarations(dir) {
  const root = realpathSync(join(dir, 'node_modules/@maplat/tin'));
  const files = readdirSync(join(root, 'dist'), { recursive: true }).map((name) => join(root, 'dist', name));
  const missing = [];
  for (const file of files.filter((name) => name.endsWith('.d.ts'))) {
    const text = readFileSync(file, 'utf8');
    for (const [, specifier] of text.matchAll(/(?:from\s+|import\s*\(\s*|import\s+)["'](\.{1,2}\/[^"']+)["']/g)) {
      const target = resolve(dirname(file), specifier.replace(/\.js$/, '.d.ts'));
      if (!existsSync(target)) missing.push(`${relative(root, file)}: ${specifier}`);
    }
  }
  return missing;
}

function parseArgs(argv) {
  if (argv.length === 0) return { version: null };
  if (argv.length === 2 && argv[0] === '--from-registry') return { version: argv[1] };
  throw new Error(`unknown arguments: ${argv.join(' ')}`);
}

function main() {
  const { version } = parseArgs(process.argv.slice(2));
  const root = mkdtempSync(join(tmpdir(), 'tin-consumer-'));
  let ok = false;
  try {
    const tinSpec = version ?? pack(root);
    const cases = [];
    let missing = [];
    for (const manager of Object.keys(INSTALL)) {
      const dir = join(root, manager);
      writeConsumer(dir, tinSpec);
      INSTALL[manager](dir);
      for (const moduleResolution of Object.keys(TSCONFIGS)) {
        console.error(`consumer-smoke: ${manager} / ${moduleResolution}`);
        cases.push({ manager, moduleResolution, exit: typecheck(dir, moduleResolution) });
      }
      missing = missingDeclarations(dir);
    }
    ok = cases.every((entry) => entry.exit === 0) && missing.length === 0;
    return { cases, missing, ok };
  } finally {
    if (ok) rmSync(root, { recursive: true, force: true });
    else console.error(`consumer-smoke: keeping ${root} after a failed run`);
  }
}

let outcome;
try {
  outcome = main();
} catch (error) {
  outcome = { cases: [], missing: [], ok: false, reason: error instanceof Error ? error.message : String(error) };
}
process.stdout.write(`${JSON.stringify(outcome)}\n`);
process.exit(outcome.ok ? 0 : 1);
