# Contributing to Relay Console

Thanks for your interest. Relay Console is one self-contained HTML file with no build step, no backend, and no dependencies, so a change is just an edit to that file, opened in a browser to test.

## License and the CLA

Relay Console is dual-licensed: the public version is under the GNU GPL version 3, and a separate commercial license is available from the maintainer. So contributions can ship in both editions, all contributions require agreement to the Contributor License Agreement in [CLA.md](CLA.md).

A Developer Certificate of Origin (DCO) on its own is not enough here, because the maintainer needs the right to relicense contributions for the commercial edition, and a DCO does not grant that. The CLA does, while leaving you full ownership of your work. By opening a pull request you confirm you have read and agree to the CLA.

## What makes a contribution mergeable

- It stays one file, no build, no backend, no network calls. The offline-and-privacy promise and the Content-Security-Policy are core to the product; a change that adds a remote resource will not be accepted.
- It matches the existing code style and keeps the page working when opened directly from disk.
- It does not introduce a third-party dependency. The clean, dependency-free codebase is what keeps the dual-license workable.

## The chatbot suggestion list

Pull requests to the built-in `PROVIDERS` list are welcome when they follow the four rules:

1. Store brands, not model names or versions.
2. Use stable homepages, not deep paths.
3. Treat every value as an editable suggestion.
4. No logos, tiers, pricing, or "best for" blurbs.

## Issues

Bug reports and feature ideas are welcome through the issue tracker. For anything touching state, persistence, or what gets sent between models, a short description of the steps to reproduce helps a lot.

## Security reports

Do not open a public issue for a suspected security or privacy vulnerability. Follow [SECURITY.md](SECURITY.md) and contact lonelysoul.projects@gmail.com.
