# Relay Console

A single HTML file that helps you pass one question between several AI chatbots by hand, copy a prompt out, paste the answer back, and watch the conversation build, then merge it into one answer.

No API keys. No backend. No build step. You open the file and it runs. Relay Console never uploads your questions, answers, or session data; you are the wire between the models.

## What it is

You subscribe to a few chatbots already (Claude, ChatGPT, Gemini, Perplexity, whatever). Their consumer plans don't expose an API, so you can't wire them together programmatically without paying again per token. Relay Console takes the other path: it keeps you in the loop and handles everything around the copy-paste. It builds each turn's prompt, bundling what's been said so far and telling the next model whose turn it is and to engage with it, tracks the whole transcript, and gives you one button that copies the prompt and opens the right chatbot.

## What it is not

- It does not call any AI API, and it cannot. That is the point.
- It does not automate the paste into your chat tabs. You do that step.
- It does not run a server or store anything off your machine.

If you want hands-off automation, this is the wrong tool. If you want to orchestrate models you already pay for without setting up APIs, paying separate API usage fees, or entrusting the relay itself to another service, this is built for exactly that.

## Quick start

1. Download the HTML file from the latest [release](../../releases).
2. Open it in any modern browser. That's it; there is nothing to install.
3. Write a question, pick which chatbots you're using, and start the relay.

Optionally, keep it as a bookmark or a local file for offline use.

## Privacy and offline

Relay Console runs entirely in your browser. It loads no remote fonts, scripts, or trackers, and its Content-Security-Policy blocks remote subresources and programmatic network connections. The app never uploads your questions, answers, or session data. When you explicitly click **Copy & open**, the browser opens the provider homepage you configured; anything you then paste into that provider is handled under its own terms.

Autosave uses your browser's local storage, so your session survives a refresh when you run the saved file. Inside a sandboxed preview that storage may be blocked, so the **Save file** button is always there for a hard backup.

## Features

- **Quick-add chatbots.** Pick from a built-in list (Claude, ChatGPT, Gemini, Perplexity, Copilot, Grok, DeepSeek, Mistral, Meta AI, Qwen, Kimi, Poe) with the homepage prefilled, or add a custom one.
- **Two modes.** Debate, where each model sees the conversation and responds to it, or Blind, where each answers cold and a final pass synthesizes them.
- **Roles and reordering.** Give a model a job (skeptic, evidence checker, implementer) and set the running order.
- **Curated context.** Each answer keeps its captured original; you can trim or drop what gets forwarded to later models without altering the record.
- **Editable prompts** that persist per turn, with a live token estimate.
- **Presets.** Save a roster plus settings under a name and reload it in one click.
- **Collision-proof framing.** Quoted answers are fenced with a per-session token so pasted text can't break the prompt structure.
- **Response-format control.** Markdown, plain prose, or a verbatim code block (the reliable way to move a table between models).
- **Light and dark themes** that follow your system.
- **Markdown and JSON export/import**, plus first-run guidance for newcomers.

## The chatbot list, and how it stays current

The built-in suggestions are a short, static array near the top of the source (`PROVIDERS`). Each entry is just a brand name, a stable homepage, and a color. They are editable suggestions, never authoritative config, so the worst case for a stale entry is a redirect you fix once in a text box.

To keep it from becoming a maintenance trap, the list follows four rules. If you open a pull request to add or change a provider, please keep to them:

1. Store brands, not model names or versions (those change monthly).
2. Use stable homepages (`https://claude.ai`), not deep paths (`/new`, `/app`).
3. Treat every value as an editable suggestion.
4. No logos, tiers, pricing, or "best for" blurbs.

## How this was built

Every version of this tool was critiqued by running the question through the tool itself: the same four models, in a relay, arguing about what to build or fix next. The release history is a record of that, including the round that caught the tool quietly phoning home to a font CDN, which is why it no longer does.

## Versioning

Each release is a self-contained file named by version (for example `relay-console-v1.8.2.html`). There is no upgrade step; download the new file. Saved sessions and presets from older versions import into newer ones.

## Contributing

Issues and pull requests welcome, especially provider-list updates that follow the four rules above. Because the whole thing is one file with no build, a change is just an edit to that file.

Contributions require agreement to the [Contributor License Agreement](CLA.md), which lets the maintainer include your work in both the GPL and commercial editions while you keep ownership of it. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Security

Please report suspected security or privacy issues privately to [lonelysoul.projects@gmail.com](mailto:lonelysoul.projects@gmail.com) rather than opening a public issue. See [SECURITY.md](SECURITY.md).

## Commercial licensing

Organizations that need terms outside GPL-3.0-only can request a separate commercial license. See [COMMERCIAL-LICENSING.md](COMMERCIAL-LICENSING.md).

## License

Relay Console is dual-licensed.

- The public version is released under the **GNU General Public License version 3** (GPL-3.0-only). You may use, study, share, and modify it under those terms; see the [LICENSE](LICENSE) file. In short, if you distribute a modified version, you distribute it under the GPLv3 too.
- A separate **commercial license** is available from the copyright holder for anyone who wants to use Relay Console without the GPL's copyleft obligations (for example, inside a closed-source product). For terms, contact [lonelysoul.projects@gmail.com](mailto:lonelysoul.projects@gmail.com).

Copyright (C) 2026 Lonely Soul. "GPLv3 or commercial" means you choose: comply with the GPLv3, or obtain a commercial license. The maintainer holds copyright in the original code; contributors keep ownership of their own contributions but grant the maintainer the broad relicensing rights set out in the [CLA](CLA.md), which is what lets the project be offered under both licenses.
