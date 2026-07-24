# MaplatTin API reference

This directory holds the **release-dependent API signatures** for `@maplat/tin`.

ADR-0012 splits Maplat documentation into two layers:

- **Release-dependent signatures** (constructor options, method names,
  constants, utility functions) — this `docs/api/` directory. Updated on each
  release.
- **Release-independent conceptual guide** (TIN theory, strict/loose modes,
  usage patterns) — the
  [Wiki API-Reference](https://github.com/code4history/MaplatTin/wiki/API-Reference).

Signatures are intentionally not duplicated on the Wiki; the Wiki links back
here for the canonical list.

## Files

- [`maplat-tin.md`](maplat-tin.md) — `Tin` class signatures (constructor
  options, methods, constants, utility functions)

## Relationship to README

The README's Quick Start section points here for signatures and to the Wiki
for the conceptual guide. See [../README.md](../README.md) for installation
and minimal usage.
