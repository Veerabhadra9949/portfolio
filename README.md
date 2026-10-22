# Veerabhadra — Creative Developer

A responsive portfolio with an interactive CSS 3D hero, project detail views, motion-aware scroll reveals, and a Node.js contact API with SMTP delivery.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm

## Run locally

```bash
npm install
npm run dev
```

Vite serves the website at `http://localhost:5173`; its `/api` requests are proxied to the Express API at `http://localhost:3001`. The health endpoint is `http://localhost:3001/api/health`.

## Configure contact delivery

Copy `.env.example` to `.env` and set SMTP credentials and the inbox that should receive portfolio inquiries:

```env
PORT=3001
SMTP_URL=smtps://username:password@smtp.example.com:465
CONTACT_TO=you@example.com
CONTACT_FROM=Portfolio <portfolio@example.com>
```

Keep `.env` out of version control. The contact API validates and limits submissions; it returns a clear error if SMTP is not configured or delivery fails. Replace `hello@example.com` in `src/App.tsx` with your real public email address for the direct-email fallback.

## Customize the portfolio

- Edit project details and image URLs in `src/data.ts`.
- Update the introduction, about copy, and social links in `src/App.tsx`.
- Adjust colors, responsive breakpoints, and the 3D composition in `src/styles.css`.
- Update page title and social preview metadata in `index.html`.

The project cards currently contain concept/sample projects. Replace those descriptions and links with work you can publicly represent before publishing.

## Build and run in production

```bash
npm run build
npm start
```

The Node server hosts the built `dist` frontend and the `/api` contact endpoints on the same port. Configure the SMTP environment variables in your hosting provider, and deploy to a Node-compatible host. A static-only host cannot run the contact API.

`npm run preview` is available for a local frontend-only preview; contact API requests need the Node server.
