# Translation Coverage Checker

A Storyblok Space Plugin that scans your space for published stories with missing or outdated translations.

## How it works

1. **Authentication:** The app uses OAuth 2.0 via the Storyblok App Bridge. The user approves the app once per space, and the access token is stored in an encrypted server-side session cookie. No login prompt on subsequent visits, no PAT required.

2. **API calls:**
   1. Calls `GET /v1/spaces/:spaceId` to fetch the space's configured translation languages.
   2. Calls `GET /v1/spaces/:spaceId/stories?is_published=1` paginated to fetch all published stories in the default language.
   3. For each story, calls `GET /v1/spaces/:spaceId/stories/:storyId` to read the `translated_stories` array which contains per-language publish status.

3. **Gap detection:** For each story and each configured language, checks the `translated_stories` array:
   1. If the language entry is missing → marked "Never published".
   2. If the entry exists but `unpublished_changes` is true → marked "Published, has draft changes".
   3. If the entry exists and `unpublished_changes` is false → story is up to date and not shown in results.

4. **Results:** Shown in a flat list with a colour-coded badge per language — red for never published, yellow for published but has draft changes. Stories with fully up to date translations are not shown in the results list.

5. **Clickable links:** Each story name links directly to the story editor in Storyblok with the relevant language pre-selected.

## Setup

### Prerequisites

- A Storyblok account with an org-level Space Plugin registered
- `CLIENT_ID` and `CLIENT_SECRET` from your org portal app settings
- Node.js and npm installed

### Environment variables

Create a `.env` file at the root:

CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
BASE_URL=https://your-deployment-url.netlify.app

### Install dependencies

```bash
npm install
```

### Running locally with ngrok

Since `@storyblok/app-extension-auth` requires an `https` URL, you need a tunnel for local development.

1. Install ngrok and authenticate:
```bash
brew install ngrok
ngrok config add-authtoken your_token_here
```

2. Start the tunnel in one terminal:
```bash
ngrok http 3000
```

3. Copy the ngrok URL (e.g. `https://abc123.ngrok-free.dev`) and update your `.env`:

BASE_URL=https://abc123.ngrok-free.dev

4. Update your Partner Portal app settings:

Index URL:    https://abc123.ngrok-free.dev
Redirect URL: https://abc123.ngrok-free.dev/api/connect/callback

5. Start the dev server in a second terminal:
```bash
npm run dev
```

6. Open your Storyblok space and click on the installed app in the sidebar.

> If you see a browser warning from ngrok, open the ngrok URL directly in your browser first, click "Visit Site", then reload the plugin in Storyblok.

### Deploying to Netlify

1. Push to your connected GitHub repo — Netlify auto-deploys on push.

2. Add these environment variables in Netlify dashboard → Site configuration → Environment variables:

CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
BASE_URL=https://your-app.netlify.app

3. Update your Partner Portal app settings to the production URLs:

Index URL:    https://your-app.netlify.app
Redirect URL: https://your-app.netlify.app/api/connect/callback

## Troubleshooting

1. Ensure `.env` has all three variables set correctly.
2. Ensure the `BASE_URL` matches exactly what is set in the Partner Portal.
3. Ensure the redirection endpoint in the Partner Portal ends with `/api/connect/callback`.
4. Disable any ad blocker browser extensions when testing locally.
5. If using ngrok free tier, open the ngrok URL directly in your browser once per session before opening the plugin in Storyblok.