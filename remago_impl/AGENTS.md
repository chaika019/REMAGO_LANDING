# Repository Guidelines

## Project Structure & Module Organization

This is the REMAGO informational website, built with React 19, TypeScript, Vite, React Router, and Leaflet. It currently requires no backend.

- `src/main.tsx` initializes the app; `src/App.tsx` defines routes.
- `src/pages/` contains route screens such as `HomePage.tsx` and `AdvertisingPage.tsx`.
- `src/components/` holds shared UI, including `SiteLayout`, `Button`, and `Icon`.
- `src/data/site.ts` stores shared site data; `src/styles/global.css` contains styling.
- `public/assets/` contains images, logos, SVGs, and design references, served under `/assets/`.
- `scripts/geocode-ad-locations.mjs` generates advertising-location coordinates.
- `README.md` documents setup; `REFERENCE_AUDIT.md` records design references and implementation decisions.

## Build, Test, and Development Commands

Use Node.js 22.12 or newer.

- `npm install`: install dependencies.
- `npm run dev`: start Vite, normally at `http://localhost:5173`.
- `npm run typecheck`: check TypeScript using project builds.
- `npm run build`: check TypeScript and generate production output in `dist/`.
- `npm run preview`: serve the production build locally after building.
- `node scripts/geocode-ad-locations.mjs`: query Nominatim and print coordinates for review; requires network access.

## Coding Style & Naming Conventions

Follow existing TypeScript conventions: two-space indentation, single-quoted strings, and omitted semicolons. Use functional React components, explicit prop types, PascalCase component filenames, and camelCase variables and functions. TypeScript strict mode is enabled. Reuse shared components and CSS variables; follow existing CSS names such as `site-header__inner` and `button--primary`. No ESLint or Prettier configuration is present.

## Testing Guidelines

No automated test framework, test script, or coverage threshold is configured. Run `npm run typecheck` and `npm run build` before submitting changes. Manually verify affected routes, responsive layouts, navigation, and relevant interactions, including Leaflet maps and RTV card hover/tap behavior. Compare visual changes with reference assets and record validation in the pull request.

## Commit & Pull Request Guidelines

This checkout has no Git metadata, so historical commit conventions cannot be verified. Use concise, imperative commit subjects, such as `Fix advertising map marker alignment`. Keep changes focused. Pull requests should describe the change, link related issues when available, list validation performed, and include desktop/mobile screenshots for visual changes.

## Configuration & Content

Keep credentials out of source code; `.env` is ignored. Preserve Russian-language content and existing asset paths. Video sources remain intentionally disconnected; consult the README before changing RTV placeholders.
