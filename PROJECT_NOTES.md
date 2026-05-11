# Hamsoo UI V2 Notes

## Project Context

- This repository contains Hamsoo UI prototypes and front-end mockups for process identity, KPI catalog, worklist, bulk import, and automatic KPI value retrieval flows.
- Most screens are static HTML prototypes using Tailwind Browser, Vazirmatn, Lucide icons, and the shared Hamsoo shell/sidebar/header scripts.
- The current automatic KPI value retrieval prototype lives under `auto-get-map/`.

## User Preferences

- Do not create feature branches for this project unless the user explicitly asks for one.
- Do not open or manage pull requests unless the user explicitly asks for PR work.
- Never commit or push changes until the user explicitly reviews/approves that action in the current task.
- When the user explicitly approves publishing, confirm the target branch and scope before running `git commit` or `git push`.
- Keep UI changes consistent with the existing Hamsoo prototype style and Persian RTL layout.
- Preserve unrelated local changes and only touch files needed for the requested task.

## Working Assumptions

- The local preview server is commonly expected at `http://127.0.0.1:5500/`.
- Prefer small, focused commits with clear messages.
- For prototype behavior, lightweight inline JavaScript is acceptable when it matches the surrounding files.

## Backlog Notes

- Add a separate "گزارش اعتبارسنجی SIPOC" view for data-quality findings that should not clutter the value-chain map. It should report SIPOC suppliers/customers/inputs/outputs that are connected to "سایر" instead of a modeled process, show which value chains are affected, and suggest mapping those organizational units, external actors, or free-text endpoints to modeled processes where appropriate.
- طرح آینده: برای "گزارش اعتبارسنجی SIPOC" یک صفحه جدا بسازیم که مواردی مثل تامین‌کننده/مشتری/ورودی/خروجی از نوع "سایر" را جدا از نقشه زنجیره ارزش نشان دهد، اثر آن‌ها روی زنجیره‌های استخراج‌شده را مشخص کند، و پیشنهاد بدهد کدام نقاط بهتر است به فرایندهای مدل‌شده وصل شوند.
