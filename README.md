# Turbolimo Limousine Website

Marketing site and booking flow for **Turbolimo Limousine**, a premium chauffeured transportation service throughout New Jersey and the New York metro area.

<p align="center">
  <img src="media/hero.png" alt="Turbolimo Hero" width="600" />
</p>

## Live URLs

- **Production:** https://turbolimo.net/
- **Booking anchor:** https://turbolimo.net/#book

## Highlights

- Modern landing page showcasing services, fleet, testimonials, and contact details
- Interactive booking form with Google Maps route planning, sortable stops, and distance/time estimates
- SMS consent checkbox and privacy link to satisfy A2P messaging compliance
- Dedicated `privacy.html` detailing opt-in, opt-out, data usage, and contact information
- Responsive layout optimized for desktop, tablet, and mobile devices

## Tech Stack

- HTML5, CSS3, vanilla JavaScript (ES6)
- jQuery, SortableJS
- Bootstrap 4, W3.CSS, Font Awesome, Google Fonts
- Google Maps JavaScript API (Places + Directions)
- Netlify hosting, Netlify Forms, `@netlify/plugin-lighthouse`

## Project Structure

```
├── index.html            # Main landing page with booking section
├── privacy.html          # Privacy policy / SMS compliance page
├── media/                # Images and branding assets
├── script/               # Booking form logic, sliders, utilities
├── style/                # CSS modules (booking form, hero, navbar, sliders)
└── netlify.toml          # Netlify build environment configuration
```

## Getting Started Locally

### Prerequisites

- **Node.js 18.x** (matches Netlify production runtime)
- Git

### Clone & Preview

```bash
git clone https://github.com/hossam1981/turbo.git
cd turbo

# optional: install a simple static file server
npm install --global serve

# launch local preview
serve .
# open the localhost URL printed in the console
```

> Any static server works (`python -m http.server`, `npx http-server`, VSCode Live Server, etc.).

### Environment Variables

The booking form requires a Google Maps API key (Places + Directions).

1. Create a `.env` file at the project root:

   ```bash
   echo "GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE" > .env
   ```

2. In Netlify, set the same variable under **Site settings → Build & deploy → Environment**. The key is referenced in `netlify.toml` for builds.

## Deployment Notes

Built for Netlify, but deployable to any static host.

1. Ensure the build environment uses **Node 18**. The repo includes `NODE_VERSION = "18"` inside `netlify.toml`.
2. Configure required environment variables (`GOOGLE_MAPS_API_KEY`, analytics IDs, etc.).
3. Connect the repository and trigger a deploy. If cache issues arise, select **Clear cache and deploy site**.
4. Optional: keep `@netlify/plugin-lighthouse` enabled for automated Lighthouse audits.

## Compliance & Messaging

- The booking form contains the required opt-in statement: “I agree to receive recurring text messages from Turbolimo Limousine, Inc. Msg & data rates may apply. Reply STOP to opt out, HELP for help.”
- A `Privacy Policy` link sits directly under the checkbox, pointing to `privacy.html`.
- Update both the checkbox copy and policy page whenever regulatory wording changes.

## Contributing

1. Fork the repository and create a feature branch.
2. Activate Node 18 locally (`nvm use 18`).
3. Submit a pull request with a clear summary, screenshots for UI changes, and testing notes.

## Contact

- **Website:** https://turbolimo.net/
- **Email:** admin@turbolimo.net
- **Phone:** +1 (347) 206-0083

## License

This project is proprietary to Turbolimo Limousine. Request permission before reusing code or assets.

