# M.R.-Gen-C Psychiatry — Responsive Website

## Run

Open `index.html` directly in Chrome or Edge, or run `npm run dev` (requires Python and Node.js) and open http://127.0.0.1:4175. This package requires no npm dependencies or build process.

## What is included

All seven hash-routed pages, How Care Works, and the redesigned Contact page. The Conditions explorer and Self Check load on demand from standalone files in `embeds/`; official branding and artwork are served as optimized files from `assets/`.

## Contact form behavior

This is a static HTML site with no message-receiving backend. The form validates entered fields and opens the visitor's configured email application with a draft; the visitor must press Send in that application. If no mail application opens, use the **Copy inquiry instead** fallback. Do not submit medical or other sensitive information via general email.

## Appointments

Booking links go to https://care.headway.co/providers/micah-craig in a separate tab. No payment is collected by this site.

## Important

Review clinical descriptions and contact availability with the practice before public launch. Browser testing results are documented separately; no website is deployed by this ZIP.


## Image delivery and SEO

Photographic assets and logos are external WebP files in `assets/`; decorative SVG artwork is also externalized. Image elements include intrinsic dimensions, and below-the-fold images load lazily. Open Graph and Twitter preview metadata plus MedicalBusiness/MedicalOrganization JSON-LD are included. Set the deployed website domain in the social image and schema URLs before publishing; the archive did not include a public site URL or a verified street address/service area.
