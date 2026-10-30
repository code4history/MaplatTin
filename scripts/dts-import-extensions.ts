const RELATIVE_IMPORT = /(\bfrom\s+|\bimport\s*\(\s*|\bimport\s+)["'](\.{1,2}\/[^"']+)["']/g;

/**
 * Gives every relative import of a declaration file the extension that moduleResolution node16
 * needs. `isDirectory` says whether a specifier names a directory, which becomes its index file.
 */
export function addJsExtensions(
  content: string,
  isDirectory: (specifier: string) => boolean,
): string {
  return content.replace(RELATIVE_IMPORT, (_match, keyword: string, specifier: string) => {
    const path = specifier.replace(/\.ts$/, "");
    if (/\.(js|json)$/.test(path)) return `${keyword}"${path}"`;
    return `${keyword}"${path}${isDirectory(path) ? "/index" : ""}.js"`;
  });
}
