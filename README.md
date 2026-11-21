# M.R.-Gen-C Psychiatry — corrected website package

Open `index.html` in your browser. All website assets are included in this folder.

- `index.html` — the connected website and shared header/footer/navigation
- `pages/conditions.html` — isolated interactive Conditions explorer
- `pages/self-check.html` — isolated interactive Self Check, notes, and branded PDF exporter
- `styles/` — page-specific stylesheets extracted from the supplied site
- `scripts/` — original JavaScript features, with the targeted Self Check fixes
- `assets/` — extracted images used by the pages

The standalone companion HTML contains the same website with inline styles, scripts, and images.

Changes: reset now clears personal notes and results; 150-word truncation preserves line breaks; mobile tap targets and H1 responsiveness improved; color/focus styles standardized; Self Check CSS root tokens consolidated. The appointment email uses a non-clinical template and does not automatically include private Self Check answers.

The original visual CSS overrides not proven redundant are retained to avoid redesigning the approved site. Conditions, PDF export, booking and navigation code are otherwise preserved.

For best results with an `iframe` and local files, use a basic static HTTP server (for example `python -m http.server 8000`) if your browser restricts local file access. No build step is required.

## Blue-accent brand refresh
This version replaces the oversized lime accents with ocean-blue and mist-blue accents and uses inline SVG line icons in mobile navigation. Existing routes, screen content, scripts, embedded images, and functionality are preserved.
