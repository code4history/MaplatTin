<!-- SECTION 1: Header (logo, badges, title) -->
<h1 align="center">MaplatTin</h1>

<p align="center">
  <a href="https://github.com/code4history/MaplatTin/actions/workflows/ci.yml"><img src="https://github.com/code4history/MaplatTin/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/@maplat/tin"><img src="https://img.shields.io/npm/v/@maplat/tin" alt="npm version" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/@maplat/tin" alt="License" /></a>
</p>

<!-- SECTION 2: Elevator Pitch -->
## About MaplatTin

MaplatTin is a JavaScript library that defines and executes homeomorphic
conversion between two plane coordinate systems based on control points. It
guarantees a nonlinear but topology-preserving (homeomorphic) bidirectional
mapping, which is the core property that lets the
[Maplat](https://github.com/code4history/Maplat) viewer overlay historical
maps on accurate modern maps **without distorting the original images**.

MaplatTin is open-source under the Apache License 2.0 (from version 0.14.2).

<!-- SECTION 3: Language switch link -->
**[Read this document in Japanese / 日本語で読む](README.ja.md)**

<!-- SECTION 4: Key Features -->
## Key Features

- **Generate Transformation Definitions** — create coordinate transformation
  definitions based on control points and edge constraints
- **Bidirectional Coordinate Transformation** — convert coordinates between
  two planes in both directions
- **Topology Preservation** — maintains homeomorphic properties during
  transformation
- **Flexible Configuration** — vertex handling modes (normal / bird's-eye
  view), topology check modes (strict / auto / loose), Y-axis direction control
- **Edge Constraints** — specify constrained edges for more accurate transform
- **State Management** — save and restore transformation definitions
- Open-source (Apache 2.0 from version 0.14.2) — part of the Maplat ecosystem

<!-- SECTION 5: Quick Start -->
## Quick Start

> Release-dependent information (ADR-0012). The version `1.0.0-rc1` below is the
> current release; update it on each new release.

### Install

```bash
# pnpm (recommended)
pnpm add @maplat/tin

# npm
npm install @maplat/tin
```

### Minimal usage

```typescript
import Tin from '@maplat/tin';

// Create a new instance with basic configuration
const tin = new Tin({
  wh: [500, 500], // Width and height of the source plane
  yaxisMode: Tin.YAXIS_FOLLOW,
});

// Set control points: Array of [source, target] coordinates
tin.setPoints([
  [[100, 100], [200, 200]],
  [[200, 200], [400, 400]],
  [[150, 150], [320, 350]],
  [[200, 100], [420, 220]],
]);

// Initialize the TIN network
tin.updateTin();

// Forward transform: source to target
const transformed = tin.transform([160, 160], false);

// Backward transform: target to source
const restored = tin.transform(transformed, true);
```

### CDN (jsDelivr)

```html
<!-- MaplatTin (UMD) -->
<script src="https://cdn.jsdelivr.net/npm/@maplat/tin@1.0.0-rc1/dist/maplat_tin.umd.js"></script>
<script>
  const tin = new maplatTin.default({ wh: [500, 500] });
</script>
```

Or using ES modules:

```html
<script type="module">
  import Tin from 'https://cdn.jsdelivr.net/npm/@maplat/tin@1.0.0-rc1/dist/maplat_tin.js';
  const tin = new Tin({ wh: [500, 500] });
</script>
```

*Note: Make sure to use the latest compatible versions.*

### API reference

- **API signatures** (release-dependent): see [`docs/api/`](docs/api/)
- **Conceptual guide** (release-independent): see the
  [Wiki API-Reference](https://github.com/code4history/MaplatTin/wiki/API-Reference)

### Development

#### Setup
Clone the repository and install dependencies.

```bash
git clone https://github.com/code4history/MaplatTin.git
cd MaplatTin
pnpm install
```

#### Development Server
Start the development server with hot reload.

```bash
pnpm dev
```

#### Build

```bash
pnpm build         # Build library (dist/)
pnpm build:demo    # Build demo site (dist-demo/)
```

#### Test

```bash
pnpm test          # Run unit tests (Vitest)
pnpm typecheck     # Run type checks (TypeScript)
pnpm lint          # Run linter and formatter (ESLint/Prettier)
```

Test coverage:

- `tests/edgebound/` — internal EdgeBound constraint engine tests (455 tests)
- `tests/tin.test.ts` — TIN transformation tests with real map data
- `tests/transform.test.ts` — coordinate transformation tests

<!-- SECTION 6: Prerequisites -->
## Prerequisites

> Derived from the `engines` field in `package.json` (ADR-0012: release-dependent).

- Node.js: `>=20.0.0` (LTS tested via GitHub Actions)
- pnpm: `>=9.0.0` (required; `package.json` enforces pnpm)

<!-- SECTION 7 Peer Dependencies: omitted (no OpenLayers dependency) -->

<!-- SECTION 8: Ecosystem / Related Repositories -->
## Ecosystem

MaplatTin is part of the Maplat ecosystem by [Code for History](https://github.com/code4history).
See the full ecosystem map (8 repositories + product/corporate sites):

📖 **Ecosystem Map** — *(the diagram is currently kept in a private planning
repository; the Sister repositories table below is the public substitute)*

### Sister repositories

| Repository | License | npm | Role |
|---|---|---|---|
| [Maplat](https://github.com/code4history/Maplat) | Apache 2.0 | `@maplat/ui` | Main viewer |
| [MaplatCore](https://github.com/code4history/MaplatCore) | Apache 2.0 | `@maplat/core` | Core library |
| [MaplatTin](https://github.com/code4history/MaplatTin) | Apache 2.0 | `@maplat/tin` | TIN conversion |
| [MaplatTransform](https://github.com/code4history/MaplatTransform) | Apache 2.0 | `@maplat/transform` | Coordinate transform |
| [MaplatEditor](https://github.com/code4history/MaplatEditor) | Apache 2.0 | — | Data authoring tool (desktop) |

> MaplatEditor is the data authoring tool used to create the maps and POIs
> that the viewers above render. The Maplat ecosystem is end-to-end:
> author with MaplatEditor, serve with any of the viewer libraries.

<!-- SECTION 9: Nayuta links -->
## Links

| Audience | Link | Purpose |
|---|---|---|
| Project info / features / cases | <https://www.maplat.jp/en/> | Product site |
| Sponsor / business inquiry | <https://www.nayuta-inc.co.jp/en/> | Corporate site (Nayuta, Inc.) |

> ADR-0013: Apache-licensed repositories (this one) link to both sites.
> MIT-licensed sister repos (Weiwudi / Quyuan / Chuci) carry no Nayuta link.

<!-- SECTION 10: License -->
## License

Apache License 2.0 — see [LICENSE](LICENSE).

```
Copyright 2019-2026 Kohei Otsuka, Code for History / Nayuta, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

> **Patent notice**: The Maplat coordinate-transform technology is patented
> in Japan (Patent No. 6684776).

> **Past versions**: Versions before 0.14.2 were distributed under the
> Maplat Limited License 1.1. The license restoration to Apache 2.0 takes
> effect from version 1.0.0-rc1 onward. Earlier versions available on npmjs.com
> remain under their original limited-license terms.

<!-- SECTION 11: Contributors / Sponsors -->
## Contributors

- Kohei Otsuka
- Code for History

We welcome your contributions! Feel free to submit
[issues and pull requests](https://github.com/code4history/MaplatTin/issues).
