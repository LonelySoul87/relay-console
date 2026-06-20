# Changelog

## v1.8.2

Final review corrections. No new features.

### Fixed
- **Storage warning now honest in every case.** `saveState()` previously suppressed the banner when local storage was unavailable from the start (the update sat behind an `if (Store.ok)` guard). It now shows the warning whenever a write fails, so a user whose browser blocks storage is told that autosave isn't working and prompted to use Save file. The banner text now covers full, disabled, and unavailable storage.
- **New relay fully resets the session.** Clicking New relay now also clears the in-memory `state` and transient editor/UI state, not just local storage. Previously a finished or abandoned session could linger in memory and make a later import wrongly believe a relay was in progress.
- **Tidy spacing persists.** The Tidy spacing button now writes the cleaned text into the answer draft and autosaves, so a refresh straight after tidying keeps the cleaned version rather than reverting.
- **Safer import of duplicate names.** `validateSession()` no longer reconciles an orphaned turn by participant name when that name is shared by more than one participant. Ambiguous names are left unlinked instead of being silently attributed to the first match. Valid ids are still preserved exactly.

### Docs
- README now uses generic download wording ("download the HTML file from the latest release") and `relay-console-v1.8.2.html` as the version example, with no reference to the unpublished v1.8.

### Tested
- Re-ran the full headless smoke suite plus targeted runtime tests for each fix: storage-disabled shows the banner and stays usable, New relay clears state so a following import does not re-prompt and loads cleanly, Tidy persists the cleaned draft, and a duplicate-named orphan turn imports as unlinked rather than misattributed. All pass.

## v1.8.1

Release-candidate fixes after review. v1.8 was never published.

### Fixed
- **Crash on Start (release blocker).** `saveState()` called itself instead of `Store.save(state)`, causing infinite recursion the moment a relay started. It now calls `Store.save(state)` and surfaces a warning banner only on a genuine write failure.
- **Resume after an early refresh.** Resume is now offered for any saved session, including one refreshed on turn 1 before any answer is entered. The question is stored in the session, and the setup draft is cleared on Start, so the earlier condition could strand a just-started relay.

### Changed
- **Stronger Content-Security-Policy.** Replaced the connection-only policy with one that blocks every remote subresource type (script, style, image, font, media, frame, worker, manifest, object) as well as outbound connections. `default-src` is deliberately left unset so blob downloads and opening a chatbot in a new tab keep working.
- **README accuracy.** The CSP description now matches what the policy actually enforces. The copyright statement now says contributors keep ownership of their contributions while granting the maintainer the relicensing rights in the CLA, rather than implying the maintainer holds copyright in everything.

### Hardened
- Guarded `Element.scrollTo` (the relay-lane auto-scroll) and the `navigator.clipboard` fallback, so neither throws on `file://` or in older or non-secure contexts where those APIs may be missing. The primary copy path (a temporary textarea with `execCommand`) is unchanged.

### Tested
- Added an automated runtime smoke test that drives the real page in a headless DOM: boot, role-suggestion default, Start, copy, answer-draft persistence, Save and advance, Back, curate/trim with a fail-closed re-edit and review flag, export and save, preset save/load/delete, mode switch, the no-role escape, a forced storage-write failure, a refresh-and-resume on turn 1, a full synthesis completion, and operation with `localStorage` disabled. All checks pass.

### Release preparation
- Public maintainer identity changed to **Lonely Soul / @LonelySoul87**.
- Commercial and security contact set to `lonelysoul.projects@gmail.com`.
- CLA governing law set to France.
- Privacy wording clarified: Relay Console does not upload session data, while **Copy & open** intentionally opens the configured provider website.

### Still requires a human check before publishing
- A one-time manual smoke test in a real browser, opened both as a local `file://` document and from GitHub Pages, confirming clipboard copy, opening a provider tab, JSON import, and `.md` / `.json` / session downloads. A headless DOM cannot enforce CSP or perform real downloads, so this last pass has to be done by eye.
