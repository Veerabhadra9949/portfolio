# Next-Generation Developer Portfolio

A responsive React + TypeScript + Vite portfolio starter with a futuristic dark theme, project filters/search, project detail modal, static portfolio assistant, contact-to-email fallback, theme switcher, and mobile navigation.

## Requirements

- Node.js 20.19+ or 22.12+ recommended
- npm

## Run locally

1. Extract the ZIP.
2. Open the extracted folder in VS Code or a terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Customize your information

Edit `src/data.ts`:

- Replace `YOUR NAME`, `your.email@example.com`, and the sample GitHub/LinkedIn links.
- Update the education and about text.
- Update project descriptions, status, technology tags, repository links, and demo links.
- Delete any project template that does not represent your actual work.

The StudySphere card is intentionally marked as a sample/in-progress template. Only claim completed features that you have actually built.

## Resume

The hero's **Print / Save CV** button opens the browser print dialog. Choose **Save as PDF** to create a PDF. For a recruiter-ready CV, update your real profile details and add a dedicated resume page or PDF before publishing.

## Contact form

The contact form validates required fields and opens the visitor's default email application with a prefilled message. It does not send or store messages on its own. Replace the sample email in `src/data.ts`. To send messages directly from the website, connect a trusted email provider through a server-side endpoint and protect it with validation and rate limiting.

## AI assistant

The included assistant is a static FAQ demo; it does not call an AI model. To enable a live model, create a server-side API endpoint and keep secrets in server environment variables. Never place private API keys in browser code or commit real secrets.

## Build and preview

```bash
npm run build
npm run preview
```

The production build is created in `dist/`.

## Deploy to Vercel

1. Push the project to a GitHub repository.
2. Import that repository in Vercel.
3. Use build command `npm run build`.
4. Use output directory `dist`.
5. Deploy. Add a custom domain in Vercel project settings if desired.

Netlify can also deploy the project with build command `npm run build` and publish directory `dist`.

## Before publishing checklist

- [ ] Replace all personal placeholders.
- [ ] Verify every GitHub, LinkedIn, and demo URL.
- [ ] Add your actual profile photo and resume if wanted.
- [ ] Remove untrue achievements or unfinished projects.
- [ ] Test mobile navigation, project filters, modal, theme switch, and contact email fallback.
- [ ] Run `npm run build`.
- [ ] If enabling a real AI API, keep its key on the server.
- [ ] Check keyboard navigation and reduced-motion settings.
