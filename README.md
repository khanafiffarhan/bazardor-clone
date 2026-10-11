# বাজার দর | BazarDor

A responsive Bengali-first market-price discovery website built with the Next.js App Router, TypeScript, and Tailwind CSS v4. The catalogue, category navigation, category filters, and product details use the supplied public BazarDor GET APIs instead of hardcoded product/category lists.

## Technologies

- Next.js App Router (React 19)
- TypeScript
- Tailwind CSS v4 + custom responsive UI styles
- Better Auth (email/password, Google, GitHub configuration)
- React Hot Toast
- Public BazarDor JSON API

## BazarDor API endpoints used

The API functions in `src/lib/bazardor-api.ts` call these exact endpoints:

| Purpose | GET endpoint | Used in |
| --- | --- | --- |
| All categories | `https://api.api-store.workers.dev/api/bazardor/categories` | Header navigation, category chips |
| Single category | `https://api.abcz.workers.dev/api/bazardor/categories/chal` (slug is dynamic) | Category detail page |
| All products | `https://api.abcz.workers.dev/api/bazardor/products` | Home product catalogue and ticker |
| Products by category | `https://api.api-store.workers.dev/api/bazardor/products?category=chal` (slug is dynamic) | `/category/[slug]` |
| Single product | `https://api.api-store.workers.dev/api/bazardor/products/1` (ID is dynamic) | `/product/[id]` |

If a primary request fails, the helper retries the corresponding endpoint against the alternative API host. API responses are normalized to support common response wrappers (`data`, `results`, `products`, `categories`, etc.). Server-rendered catalogue data is revalidated every five minutes.

## Features

1. Responsive Bengali market-price landing page.
2. Category links generated from the API response.
3. Product cards populated from the all-products endpoint.
4. Product-price ticker generated from API data (not a hardcoded price list).
5. Category detail pages with API category and filtered-product requests.
6. Product detail pages fetching one product by ID.
7. Price-change sections when the API includes change values.
8. Bengali numeral formatting and inferred product emoji for records without images.
9. Empty and not-found states for unavailable product/category data.
10. Signup/signin screens and Better Auth foundation.

## Run locally

Use Node.js 20.9 or later.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Configure the environment variables in `.env.local` to enable database-backed Better Auth and social sign-in. Public product APIs do not require these authentication secrets.

## Routes

- `/` — home page and API-driven catalogue
- `/signup` — registration
- `/signin` — login
- `/category/chal` — category detail (slug can vary)
- `/product/1` — product detail (ID can vary)

## Notes

The API host may be temporarily unavailable or may change its JSON field names. The UI handles common response wrappers and shows an empty state rather than fabricating product records. Validate the live API response and run `npm run build` before deploying. Keep credentials in environment variables; never commit `.env.local`.
