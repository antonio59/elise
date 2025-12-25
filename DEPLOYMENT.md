# Deployment Guide - Elise

This guide covers the staging and production environments for Elise using Convex and Netlify.

## Environment Overview

| Environment | Git Branch   | Convex URL                              | Purpose          |
| ----------- | ------------ | --------------------------------------- | ---------------- |
| Staging     | `main`       | https://rare-blackbird-695.convex.cloud | Test before prod |
| Production  | `production` | https://agile-shrimp-456.convex.cloud   | Live site        |

## Netlify Configuration

Both Netlify sites are already set up. You just need to add the deploy keys.

### Staging Site (main branch)

Add these environment variables in Netlify:

| Key                      | Value                                      |
| ------------------------ | ------------------------------------------ |
| `CONVEX_DEPLOY_KEY`      | Get from Convex Dashboard (rare-blackbird) |
| `NEXT_PUBLIC_CONVEX_URL` | `https://rare-blackbird-695.convex.cloud`  |

### Production Site (production branch)

Add these environment variables in Netlify:

| Key                      | Value                                    |
| ------------------------ | ---------------------------------------- |
| `CONVEX_DEPLOY_KEY`      | Get from Convex Dashboard (agile-shrimp) |
| `NEXT_PUBLIC_CONVEX_URL` | `https://agile-shrimp-456.convex.cloud`  |

## Getting Deploy Keys

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Select the project (rare-blackbird-695 or agile-shrimp-456)
3. Go to **Settings** > **Deploy Keys**
4. Click **Generate Deploy Key**
5. Copy the key and add it to Netlify

## Workflow

### Local Development

```bash
bun run dev
```

This starts Next.js and syncs with your local Convex dev environment.

### Deploy to Staging

```bash
git checkout main
git add .
git commit -m "your changes"
git push origin main
```

Netlify auto-deploys to staging with the rare-blackbird Convex backend.

### Deploy to Production

```bash
git checkout production
git merge main
git push origin production
```

Netlify auto-deploys to production with the agile-shrimp Convex backend.

## Pre-Deploy Checklist

Before merging to production:

```bash
bun run precheck  # runs typecheck + lint + build
```

- [ ] All checks pass
- [ ] Test features on staging site
- [ ] Check Convex dashboard for errors
- [ ] Verify authentication works
- [ ] Test file uploads

## Manual Convex Deploys

If you need to push schema/function changes without a full deploy:

```bash
# Staging
CONVEX_DEPLOY_KEY=your-staging-key bunx convex deploy --prod

# Production
CONVEX_DEPLOY_KEY=your-prod-key bunx convex deploy --prod
```

## Troubleshooting

### Build Fails

1. Check Netlify build logs
2. Verify `CONVEX_DEPLOY_KEY` is set correctly
3. Run `bun run build` locally to debug

### Convex Connection Issues

- Verify `NEXT_PUBLIC_CONVEX_URL` matches the correct environment
- Check Convex dashboard for the project status

### Environment Variables Not Working

- Netlify env vars are case-sensitive
- Redeploy after adding new variables
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
