# Hamsoo UI V2 Notes

## Project Context

- This repository contains Hamsoo UI prototypes and front-end mockups for process identity, KPI catalog, worklist, bulk import, and automatic KPI value retrieval flows.
- Most screens are static HTML prototypes using Tailwind Browser, Vazirmatn, Lucide icons, and the shared Hamsoo shell/sidebar/header scripts.
- The current automatic KPI value retrieval prototype lives under `auto-get-map/`.

## User Preferences

- Do not create feature branches for this project unless the user explicitly asks for one.
- Do not open or manage pull requests unless the user explicitly asks for PR work.
- When the user says to publish or send changes up, commit directly on `main` and push `main` to `origin`.
- Keep UI changes consistent with the existing Hamsoo prototype style and Persian RTL layout.
- Preserve unrelated local changes and only touch files needed for the requested task.

## Working Assumptions

- The local preview server is commonly expected at `http://127.0.0.1:5500/`.
- Prefer small, focused commits with clear messages.
- For prototype behavior, lightweight inline JavaScript is acceptable when it matches the surrounding files.
