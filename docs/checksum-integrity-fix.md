# Checksum integrity audit and correction, 24 August 2026

## Result

`SHA256SUMS.txt` contained three values that did not match the corresponding
versioned HTML files on the current `main` branch. The v1.8.4 GitHub release
also contained an HTML asset that did not match the file stored in its own tag.

No tag was moved and no application code was changed.

## Repository checksum corrections

| Artifact | Superseded value | Current `main` artifact |
| --- | --- | --- |
| `relay-console-v1.8.2.html` | `a247da62...` | `5a9558c3...` |
| `relay-console-v1.8.3.html` | `e3f68615...` | `ea78e8f2...` |
| `relay-console-v1.8.4.html` | `9bae6f9c...` | `1195e1e1...` |

The former v1.8.2 and v1.8.3 values reproduce only after converting the
repository artifacts from LF to CRLF. The versioned HTML files are byte-exact
artifacts and must not be transformed by checkout settings.

The former v1.8.4 value was not a missing or phantom build. It matched the HTML
asset uploaded to the v1.8.4 GitHub release, but that asset did not match the
file stored in the immutable v1.8.4 tag.

## Tag and release-asset audit

Every public HTML release asset was downloaded and compared with the file in
its own tag.

| Tag | Tag SHA-256 | Asset before correction | Result |
| --- | --- | --- | --- |
| `v1.8.2` | `7184a7b0...` | `7184a7b0...` | Preserved |
| `v1.8.3` | `ea78e8f2...` | `ea78e8f2...` | Preserved |
| `v1.8.4` | `1195e1e1...` | `9bae6f9c...` | Asset replaced from tag |
| `v1.9.0` | `be52507c...` | `be52507c...` | Preserved |
| `v2.0.0` | `3d2288fc...` | `3d2288fc...` | Preserved |
| `v2.1.0` | `ec5ab738...` | `ec5ab738...` | Preserved |
| `v2.2.0` | `2a0f65bd...` | `2a0f65bd...` | Preserved |

The v1.8.2 asset intentionally differs from today's file on `main`. Two
copyright lines were corrected after the v1.8.2 tag. The published asset still
matches its tag exactly, so rewriting it would damage historical integrity.

The v1.8.4 checksum attachment was replaced with a one-file manifest that
describes the corrected v1.8.4 HTML asset.

## Prevention

- `SHA256SUMS.txt` was regenerated from the exact current repository bytes.
- The v2.2 regression suite now checks every entry in the repository checksum
  manifest, not only the latest release.
- The GitHub workflow now runs when the checksum manifest, attributes, Pages
  entrypoint, any versioned release artifact, or a regression test changes.
- `.gitattributes` now makes text normalization explicit while preserving all
  versioned HTML release artifacts as byte-exact files.
- Ignored local release bundles use checksum files scoped to the artifact they
  actually contain.

## Verification

All seven current repository artifacts match `SHA256SUMS.txt`. The complete v2
regression suite passes with 86 checks. The active files changed by this fix
contain no em dash characters.
