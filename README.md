# Good Days | Crows Nest & Beyond

An accessible, mobile-friendly, no-login activity directory for a retired person living around Crows Nest, Sydney.

**34 opportunities across six categories.** U3A deliberately excluded.

## Website
Once GitHub Pages is enabled:
https://erikw1024.github.io/github.io-crows-nest-activities-/

## Features
- Search the full catalogue, filter by interest, location and activity accessibility, sort results.
- See six recommended starting points and detailed organiser websites.
- Save Interested / Maybe later / Not for me, and personal notes locally in this browser.
- Use My shortlist to copy, print or export selected activities to CSV.
- Download the included printable PDF activity guide.
- No account, database, analytics or payments.

## Hosting setup
1. Open repository **Settings -> Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/(root)**, then **Save**.
4. Use the published address shown in GitHub's Pages settings. The expected address is above.

The site works as plain HTML/CSS/JavaScript with relative assets at the repository root; no build step is needed.

## Source and updating
Edit both `data.js` and `activities.json` when changing activity listings. Keep existing `id` values so browser-local shortlists are preserved. The current PDF was generated from the same 34 source entries as an accessible alternative, and can be replaced with the separately supplied original 14-page PDF by uploading it as `good-days-activity-guide.pdf`.

## Testing
The `tests/site-smoke.mjs` script checks the core browser interactions and downloadable assets. The `.github/workflows/site-check.yml` GitHub Actions workflow runs those checks on pushes to main (subject to repository Actions settings).

## Important notes
The directory was compiled in November 2026. Confirm sessions, pricing, availability, volunteer vacancies, and step-free venue access with organisers. Drawing/guitar activity should follow treating-team advice during shoulder recovery. Browser-saved selections and notes do not sync across devices and may be lost if browser storage is cleared.
