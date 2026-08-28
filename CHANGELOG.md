# Changelog

## v2.4.0 draft

Development draft focused on safer file workflows, faster navigation, recovery,
accessibility, and deeper everyday polish. The release theme is **Nothing is
lost by accident**.

### Added

- **Bounded local recovery.** Before a restart, a saved-relay discard, or an
  imported session replacing your work, Relay Console keeps one local recovery
  copy. Restore and Remove are both offered directly, and the copy is removed
  automatically after seven days.
- **Honest autosave status.** The relay shows the time of the last successful
  local save. A failed save stays visibly failed until a save succeeds, and never
  reports a newer time than the last one that actually worked.
- **Storage visibility.** The presets panel reports how much browser storage
  Relay Console is using in total and for the session, presets, and recovery
  copy, with specific guidance when space runs short.
- **Import review before apply.** Session files and portable preset bundles are
  validated and summarized before any active relay or local preset data changes.
- **Session import details.** The review shows version, participants, turns,
  captured-answer count, current position, plan, interface language, and prompt
  language.
- **Preset normalization warnings.** The review lists collision-safe renames,
  removed non-web URLs, and roles shortened to the existing safety limit.

### Fixed and hardened

- Ballot dropdowns rebuilt after an earlier answer is removed now write only the
  labels visible in the rebuilt ballot.
- A manual ballot always offers direct re-parsing, even when its saved ranking no
  longer matches the available answer labels.
- The tally, transcript badge, Markdown transcript, and review packet now share
  one definition of a valid effective ballot.
- Discarding the saved relay from the resume bar now requires confirmation.
- Changing the interface language during a relay keeps keyboard focus on the
  language selector instead of moving it to the answer field.
- Import previews render selected-file content only as text. Previewing does not
  mutate the active relay or storage, and applying presets performs one write.
- Preset imports now re-check current storage immediately before applying. If
  another tab changed the saved presets, the review refreshes and no data is
  overwritten.
- Website addresses longer than the 300-character safety limit are removed
  instead of being silently shortened into a different working address.
- Import review opens with focus on its heading so keyboard and screen-reader
  users encounter the summary before either action.
- Loading or importing a preset with more than 26 participants once again shows
  the specific participant-limit explanation.
- A relay larger than one megabyte is refused as a recovery copy rather than
  being shortened. Relay Console now asks whether to continue without the copy,
  so Cancel preserves the active work and gives the user time to save a file.
- A recovery copy is validated through the same session validator as any import
  before it can be restored, and unusable or expired data is dropped on sight.
- Starting a new relay while the resume bar is visible now preserves the saved
  relay in recovery before the new session replaces it.
- A restored recovery copy remains available until the restored session has
  autosaved successfully. Failed local storage can no longer consume the only
  checkpoint.
- Failed recovery writes now require an explicit choice before restart,
  discard, or replacement continues.
- Storage totals are labeled as estimates, account for browser string storage
  instead of treating characters as bytes, and explain that quotas vary by
  browser.
- The saved-relay banner wraps long unbroken questions at phone width instead
  of creating horizontal page scrolling.
- Restart and discard confirmations now describe the seven-day recovery window
  instead of claiming that the action can never be undone.

- A restore that is waiting for a successful autosave is now tied to the exact
  checkpoint it came from, so an ordinary later save can never delete a
  different checkpoint captured in the meantime.
- Continuing a destructive action after a failed or oversize replacement now
  disarms the earlier restore relationship. A later save cannot delete the old
  checkpoint that remained in storage.
- A backward clock correction no longer destroys a valid recovery checkpoint.
  Only a date more than a day ahead is treated as bogus.
- Every stored size the user can see now uses one unit, so the recovery ceiling
  and the storage report cannot disagree by a factor of two.
- Typing a question or editing the roster no longer re-measures all of local
  storage on every keystroke.

- The recovery banner now announces itself to assistive technology when it
  arrives, and its Restore and Remove buttons carry names that say what they
  act on.

### Privacy

- Discarded or replaced work can now remain in local browser storage for up to
  seven days unless you remove it. The footer privacy note states this in
  English, French, and Spanish. Nothing is ever uploaded.

## v2.3.0

Feature release focused on portable workflows and safer independent review
handoffs.

### Added
- **Portable preset bundles.** Export up to 50 saved presets as one versioned
  JSON file and import them on another browser or computer.
- **Collision-safe imports.** Imported names receive a visible numeric suffix
  when needed, so an existing preset is never silently replaced.
- **Review packets.** Export a compact Markdown review handoff containing the
  question, configuration, roles, captured answers, actual forwarded context,
  warnings, and ballot results without duplicating generated prompts.
- **Review privacy guidance.** The transcript panel now states that captured
  answers remain in review packets and that context trimming is not redaction.

### Fixed and hardened
- Imported presets are normalized through one strict validator before storage
  or use, with limits for file size, count, roster size, custom steps, rounds,
  names, roles, and URLs.
- Preset URLs now accept only HTTP and HTTPS addresses. Unknown fields are
  discarded, and a failed import leaves every existing preset unchanged.
- Existing local presets use the same validation path and remain compatible.
- Export continues with every valid stored preset when another local entry is
  malformed, and reports which entries were skipped.
- Saving and importing now use the same case-insensitive preset-name collision
  rule, and the preset-only file button rejects session files clearly.
- Loading a preset now persists its complete setup, including the recipe,
  format, rounds, closing choice, custom steps, and prompt language.
- Missing rounds now consistently fall back to one.
- The quick-start status clears as soon as the applied setup is edited, while a
  display-only interface language change correctly preserves it.
- Review packets refer back to the captured answer instead of repeating the
  full text when untrimmed context is forwarded unchanged.
- The no-em-dash regression check now scans active product, repository,
  planning, and test text instead of a fixed list of files.

### Unchanged by design
- Relay Console remains one offline HTML file with no backend, external
  dependencies, trackers, APIs, or automated answer capture.
- Earlier tagged release files and tags remain untouched.

## v2.2.0

Feature release focused on reusable localization and faster real-world
workflows for ChatGPT and Claude subscribers.

### Added
- **Registered language packs.** Locale catalogs now register through one
  validation path that checks key coverage and placeholder parity against the
  English source catalog.
- **Spanish interface and prompts.** Setup, relay controls, recipes, coaching,
  alerts, accessibility labels, Markdown exports, and every generated prompt
  are available in Spanish.
- **Spanish ballot labels.** Strict ballot parsing accepts both
  `CLASIFICACIÓN:` and `CLASIFICACION:` while retaining the complete-ranking
  safety rules used by English and French ballots.
- **ChatGPT and Claude quick starts.** Three editable setups cover drafting and
  critique, independent comparison, and decision stress-testing without
  changing the user's question.

### Unchanged by design
- Earlier tagged release files and tags remain untouched.
- The application remains one offline HTML file with no backend, external
  dependencies, trackers, APIs, or automated answer capture.

## v2.1.0

Feature release focused on multilingual use while preserving Relay
Console's standalone, offline, single-file design.

### Added
- **French interface.** Setup, run controls, recipes, coaching, scorecards,
  completion statistics, alerts, accessibility labels, and Markdown exports can
  now be displayed in French.
- **Independent prompt language.** Interface language and generated-prompt
  language are separate choices. A French interface can still prepare English
  prompts, or the reverse, and both choices persist across reloads.
- **Localized workflows.** Every built-in recipe and turn type now generates
  native French instructions, including blind answers, debates, revisions,
  ballots, synthesis, response-format directives, and Borda tallies.
- **Embedded localization foundation.** English and French catalogs, fallback
  behavior, placeholder validation, and browser-language detection remain
  inside the standalone HTML file with no external dependency or network call.

### Fixed and hardened
- French ballot prompts request an exact `CLASSEMENT :` line while retaining
  support for English `RANKING:` input; the same strict complete-permutation
  rules still apply.
- Captured questions, answers, names, roles, and edited forwarded context remain
  verbatim when the surrounding interface, prompts, or transcript are localized.
- Older saved sessions safely default to English prompts, while v2.1 sessions
  preserve both language choices.
- Automatic recipe role suggestions continue adapting after reload instead of
  being mistaken for user-authored roles.
- Copy-only synthesis no longer displays an external-link arrow, and translated
  rich-text labels no longer render as an undefined value.
- French point labels now use the correct singular and plural forms.
- The v2 regression workflow now checks both the released v2.0 file and the
  v2.1 draft suite so backward compatibility remains covered.

### Compatibility
- v1.x and v2.0 sessions import into v2.1; missing language metadata defaults
  conservatively to English.
- v2.1 adds optional `uiLocale` and `promptLocale` metadata. Older versions may
  ignore those fields and should still be treated as a one-way compatibility
  line when moving a session back to an older release.

### Unchanged by design
- Still one HTML file, with no backend, API keys, build step, trackers, remote
  assets, or answer-capture automation.

## v2.0.0

Major-version release. Relay Console keeps the founding constraint: one
standalone HTML file, no backend, no APIs, no external dependencies, and the
user remains the wire between assistants.

### Added
- **Relay recipes.** The old hardcoded Debate and Blind modes are now built-in
  relay plans alongside Ballot panel, Draft -> Critique -> Revise, Red team vs
  Blue team + judge, and Custom plan.
- **Custom plan editor.** Compose a running order from answer, blind, revise,
  ballot, and synthesis steps, including the same model appearing more than
  once with different jobs.
- **Ballot panel.** Blind answers can be followed by anonymized peer rankings;
  confirmed rankings are tallied with a Borda scoreboard and fed into the
  synthesis prompt.
- **Visible ballot correction.** Rankings are parsed only from explicit
  `RANKING:` lines. Unparsed ballots are flagged, can be corrected with
  dropdowns, and ask before advancing.
- **Cockpit layout.** Wide screens split the run view into a sticky turn card
  beside the transcript and scoreboard; narrow screens keep the classic
  vertical flow.

### Fixed and hardened
- Ballots now count only one explicit, complete `RANKING:` line containing an
  exact permutation of the available labels. Ordinary prose, partial lists,
  duplicates, extra labels, and multiple ranking lines are rejected.
- Parsed rankings and manual ballot corrections survive reloads. Manual
  corrections can be reparsed deliberately, and a visible confirmation button
  supports an unchanged A-to-Z order.
- Changing a recorded ballot now marks every dependent synthesis answer and
  edited synthesis prompt as stale before the scoreboard changes underneath it.
- Ballot and synthesis roles are now woven into their prompts, including the
  built-in reviewer and judge roles and roles from custom plans.
- Session import now normalizes duplicate participant IDs, validates rankings
  as exact permutations, rebuilds missing parsed ballots from saved replies,
  protects first-turn work from replacement, and caps rosters at the A-Z ballot
  limit of 26 participants.
- Excluding a draft from forwarded context no longer inserts a literal `null`
  into a later revision prompt.
- Explicitly saving a rechecked answer clears its stale warning even when the
  answer text did not change; Back and Skip do not falsely clear it.
- Setup, participant, custom-step, prompt, answer, and ballot controls now have
  explicit and uniquely contextual accessible names.
- Added a zero-dependency Node regression suite and a GitHub Actions workflow
  covering recipe construction, ballots, roles, staleness, imports, presets,
  accessibility hooks, privacy boundaries, and sanitized legacy session
  fixtures. Ignored real legacy exports are also checked when present locally.

### Compatibility
- v1.8.x and v1.9.0 sessions import into v2.0.0.
- v2 sessions may contain recipe, custom-step, and ballot fields that v1.x
  versions do not understand. Treat v2 -> v1 as a one-way compatibility line.

### Unchanged by design
- Same Content-Security-Policy shape as v1.9.0.
- Same local-storage keys for continuity.
- Still one file, still zero network, still no answer-capture heuristics.

## v1.9.0

Feature release. Sessions remain interchangeable with v1.8.x: v1.8.x files
import unchanged, and v1.9.0 sessions remain readable by v1.8.x, which
ignores the new optional `synthPid` field.

### Added
- **Synthesis runner.** When a relay ends in a synthesis turn, you can pick
  at setup which chatbot receives the merge prompt; Copy & open then opens
  that tab. Optional; leaving it unset keeps the old behavior.
- **Grid view.** The transcript can switch between the classic list and a
  side-by-side grid, which is the honest way to compare a Blind round
  before synthesis. The choice is remembered.
- **The question stays visible during the run** in a collapsible card
  above the relay lane.
- **Manual theme override** (auto / dark / light), remembered between
  sessions. Auto keeps following the system, as before.
- **Relay stats** on the completion card: answers, characters, and rough
  tokens per participant plus totals.
- **Copy final answer** and **Copy transcript (.md)** buttons with
  truthful per-button status, alongside the existing downloads.
- **Turn counter** ("turn 3/9") next to the round tag, and a warning on
  the token counter when a prompt grows past roughly 24k tokens.
- **Keyboard shortcuts:** Ctrl+Shift+C copies the current prompt; Esc
  closes the add-chatbot menu. (Ctrl+Enter to save & advance is unchanged.)

### Improved
- Accessibility: the relay lane announces progress to screen readers,
  stale-context warnings are live regions, reorder buttons are labelled,
  and keyboard focus is visible on all controls.
- Small screens: tighter padding, 16px inputs (prevents mobile zoom-on-
  focus), and a narrower minimum station width in the lane.

### Unchanged by design
- One standalone HTML file, no external dependencies, no network access,
  same Content-Security-Policy, no answer-capture heuristics.

## v1.8.4

Maintenance release for project presentation and release provenance. No behavior changes from the current app state.

### Changed
- Updated public project branding to **LonelySoul87 Projects** across the app and project documents.
- Added discoverability documentation, announcement copy, and page-copy guidance.
- Added a standalone GitHub Pages landing page and linked it from the README.
- Improved README positioning for the local, offline, manual AI relay workflow.

### Release integrity
- Restored `relay-console-v1.8.3.html` to its original released contents so the v1.8.3 artifact remains immutable.
- Added `relay-console-v1.8.4.html` as the current versioned release file.
- Added `SHA256SUMS.txt` for versioned release artifact checksums.

## v1.8.3

Maintenance release. Correctness, accessibility, and identity-safe corrections. No new features.

### Fixed
- **Truthful, race-safe copy status.** "Copied" now appears only after a confirmed copy; a failure shows a persistent "select the prompt and copy it manually" message, and an asynchronous write shows "Copying..." until it settles. **Copy & open** still opens the provider on the original click, and opens it even when the copy fails. Overlapping copy attempts are tracked by an incrementing id, so a slow earlier attempt can never overwrite the status produced by a newer one.
- **Dependency-aware prompt staleness.** When an upstream answer or its forwarded context changes, a manually edited downstream prompt is flagged only if its generated prompt actually uses that content: later Debate prompts depend on earlier forwarded answers, and the synthesis prompt depends on every non-synthesis answer, while independent Blind answer prompts depend on nothing and are never flagged. Each flag offers Regenerate (rebuild from current context, discarding the edit) or Keep, reviewed (keep the edit, clear the flag). Unedited prompts keep rebuilding automatically and are never flagged.

### Accessibility
- The copy-status element is announced to assistive technology (`role="status"`, `aria-live="polite"`, `aria-atomic="true"`), and the onboarding coach marks the copy step complete only on a confirmed copy, so it never contradicts a visible failure.

### Internal
- The temporary textarea used by the synchronous copy path is now removed in a `finally` block, so it cannot leak if focus, selection, or `execCommand` throws.

### Compatibility
- v1.8.2 sessions import into v1.8.3 unchanged.
- v1.8.3 sessions remain readable by v1.8.2.
- v1.8.2 ignores the new `promptStale` field and may discard it if it re-exports the session; answers, forwarding, prompts, cursor, and completion state are unaffected.

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
- Completed a manual local-browser smoke test covering provider opening and copying, draft persistence, first-turn resume, back navigation, curated forwarding and stale-context review, synthesis, JSON save/import, Markdown export, presets, and mode switching. All checks passed.
- The GitHub Pages-served build was enabled and tested successfully.

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
- Public maintainer identity changed to **LonelySoul87 Projects / @LonelySoul87**.
- Commercial and security contact set to `lonelysoul.projects@gmail.com`.
- CLA governing law set to France.
- Privacy wording clarified: Relay Console does not upload session data, while **Copy & open** intentionally opens the configured provider website.
