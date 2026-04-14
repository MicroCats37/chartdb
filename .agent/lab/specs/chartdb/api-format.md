# Frontend/Backend Integration Specification (ChartDB)

This spec defines the API contract between the React Frontend and the new Node.js Backend.

## 1. Global Rules
- **Base Path**: All API endpoints must be prefixed with `/api`.
- **Response Format**: All responses must use standard JSON.
- **Error Handling**: Standard error formats with appropriate HTTP status codes (400, 404, 500).

## 2. Diagram Endpoints

- `GET /api/diagrams`: Returns an array of basic diagram metadata.
- `GET /api/diagrams/:id?includeTables=true&...`: Returns full diagram payload depending on query parameters.
- `POST /api/diagrams`: Accepts full JSON of a diagram and creates it recursively in the DB.
- `PUT /api/diagrams/:id`: Updates diagram metadata.
- `DELETE /api/diagrams/:id`: Removes diagram and all cascading children.

## 3. Entity Endpoints (Granular Sync)

For optimistic updates, entities have explicit route handlers:

- **Tables**: `POST /api/tables`, `PUT /api/tables/:id`, `DELETE /api/tables/:id`
- **Relationships**: `POST /api/relationships`, `PUT /api/relationships/:id`, `DELETE /api/relationships/:id`
- **Areas/Notes**: Standard REST footprint.

## 4. Payloads
All input payloads (`POST`/`PUT`) strictly mirror the TypeScript definitions in `src/lib/domain/*`. The Prisma schema guarantees these specific field names and shapes.
