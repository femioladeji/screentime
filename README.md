# Screentime Chrome Extension

Screentime is a Chrome extension that helps you reduce time on distracting websites.
It tracks time spent per site, lets you define daily limits, supports day/time block windows,
and automatically closes tabs when a rule is violated.

## What the extension does

- Tracks active-tab usage time by site.
- Shows activity insights in a dashboard (bar chart and recent day selection).
- Lets you enable or disable control per site.
- Lets you configure per-site daily limits (in minutes).
- Lets you add optional day-specific blocked time windows.
- Automatically closes tabs when:
  - the daily limit is exceeded, or
  - the current time falls inside a blocked window.
- Sends notifications when a site is blocked/closed.
- Supports optional password protection for the Manage Time screen.

## Screens in the popup

- `Overview`: activity summary and chart.
- `Manage Time`: list of configured sites, enable/disable controls, add/edit timers.
- `Settings`: set or change password used to unlock Manage Time.

## Permissions used

The extension requests:

- `storage`: stores site rules, timer data, and password hash.
- `tabs`: checks the current tab and closes blocked tabs.
- `notifications`: notifies when a limit or blocked window is hit.

## How enforcement works

- A background service worker monitors tab updates, tab activation, and window focus changes.
- Time is accumulated only while a tracked tab is active and the browser window is focused.
- Rules are evaluated against current usage and current local time.
- Tab-closing uses retry handling for transient Chrome tab-edit errors.

## Password behavior

- Passwords are hashed using SHA-256 before storage.
- The hash is stored in extension storage; plaintext is not stored.
- Manage Time access is session-unlocked after successful password entry.
- Password recovery is not implemented; if forgotten, users may need to reinstall.

## Data and migration

- Current data is stored in `chrome.storage.sync`.
- On first run, the extension attempts to migrate old data from `chrome.storage.local`.
- Timer data is normalized to the current weekday-based bucket format.

## Development

### Requirements

- Node.js 18+ (Node 20+ recommended)
- npm

### Install

```sh
npm install
```

### Run dev server

```sh
npm run dev
```

### Build extension

```sh
npm run build
```

This builds to `dist/`, copies `manifest.json`, and copies icon assets into `dist/images`.

### Load in Chrome

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select the `dist/` folder.

### Useful scripts

- `npm run type-check`: Vue/TypeScript checks.
- `npm run lint`: ESLint auto-fix pass.
- `npm run preview`: preview production build.

## Project structure

- `src/views`: popup pages (`Overview`, `Manage Time`, `Settings`, etc.).
- `src/components`: reusable UI components (rows, chart, collapsibles, time blocks).
- `src/Lib/background.ts`: background enforcement logic.
- `src/Lib/Storage.ts`: storage reads/writes and initialization.
- `src/Lib/Migration.ts`: migration and timer data normalization.
- `manifest.json`: extension metadata and permissions.

## Tech stack

- Vue 3 + Vue Router
- TypeScript
- Vite
- Chart.js (`vue-chartjs`)

## Current version

`6.0.0`
