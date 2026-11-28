# M.R.-Gen-C Psychiatry — Responsive Website

## Run

Open `index.html` directly in Chrome or Edge, or run `npm run dev` (requires Node.js and Python). Run `npm run build` to copy only the static site files into `www/` for Tauri and Capacitor packaging; this build uses Node.js built-ins.

## Tauri desktop packaging

Run `npx tauri dev` to launch the desktop app in development. Run `npx tauri build` to create a production bundle; Tauri runs `npm run build` first and packages only `www/`. The Rust opener plugin routes Headway appointment and email links to the system's default apps without editing the site files.

## PWA and Capacitor packaging

The root `manifest.webmanifest` and icon files support browser installation. To generate native projects, install Capacitor and build the web assets:

```powershell
npm install @capacitor/core @capacitor/android @capacitor/ios
npm install --save-dev @capacitor/cli
npm run build
npx cap add android
npx cap add ios
npx cap sync
```

After site changes, run `npm run build` followed by `npx cap sync`. Android builds require Android Studio and the Android SDK. Building/signing the iOS app requires macOS and Xcode.

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
