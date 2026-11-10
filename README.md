# Richard Álvarez

Personal portfolio at [richardalvarez.info](https://richardalvarez.info).

## Run the site

Use Node.js 20.9 or later.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Update the projects

Edit the project list in `src/app/page.tsx`. Keep the name, destination, description, and publication status together.

The portfolio includes Jonah White, Joaquín Morales, and AirLogic. AirLogic links to its public page with a "Coming soon" label.

Place preview images in `public/projects/`. Native disclosures keep previews optional and work without JavaScript.

The email address and PDF paths remain in `src/app/page.tsx`. Replace the files in `public/` to update either PDF.

## Check the site

Install Chromium once.

```sh
npx playwright install chromium
```

Run the full check.

```sh
npm run check
```

The check runs ESLint, TypeScript, a production build, and browser tests against the production server on port 3101.

Vercel uses `npm ci` from `vercel.json` to install the versions in `package-lock.json`.

Browser tests cover project links, native previews, keyboard access, clipboard feedback, paper motion, reduced motion, stationary text, and document downloads. They check accessibility and overflow at 320, 390, 768, and 1440 pixels.

Set `PORTFOLIO_BROWSER_PATH` to use an existing Chromium executable. Set `PORTFOLIO_TEST_URL` to test an existing server.

Open the screenshots and traces in `test-results/` if a browser check fails.
