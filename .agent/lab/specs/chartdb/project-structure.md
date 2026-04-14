# Project Structure Specification

Defines the codebase layout for the ChartDB Full-Stack transition.

## Core Structure
```text
chartDB/
 ├── src/                  <-- React App (Frontend)
 │    ├── context/
 │    │    └── storage-context/
 │    │         └── storage-provider.tsx  <-- Replaced with HTTP Fetch functions
 │    └── ...
 ├── server/               <-- Node.js + Express (Backend)
 │    ├── prisma/          <-- Schema and DB
 │    ├── src/
 │    │    ├── routes/     <-- API Controllers
 │    │    └── index.ts    <-- Express App Entry Point
 │    └── package.json     <-- Backend dependencies (if separate, but we prefer root package.json for monorepo)
 ├── package.json          <-- Root dependencies (concurrently, express, prisma)
 └── vite.config.ts        <-- Updated with proxy configuration
```

## Vite Configuration Rules
The `vite.config.ts` must use a proxy for all `/api` requests to route to the backend server (defaulting to port 3000):

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
```
