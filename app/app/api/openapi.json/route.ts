import { NextResponse } from "next/server";

const openapi = {
  openapi: "3.0.0",
  info: {
    title: "Private Office API",
    version: "1.0.0",
    description: "API para Private Office - Dashboard de gestión empresarial",
  },
  servers: [{ url: "http://localhost:3000", description: "Local development" }],
  paths: {
    "/api/v1/entities": {
      get: {
        tags: ["Entities"],
        summary: "List all accessible entities",
        responses: { "200": { description: "List of entities" } },
      },
      post: {
        tags: ["Entities"],
        summary: "Create new entity",
        responses: { "201": { description: "Entity created" } },
      },
    },
    "/api/v1/entities/{id}": {
      get: {
        tags: ["Entities"],
        summary: "Get entity details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Entity details" } },
      },
      patch: {
        tags: ["Entities"],
        summary: "Update entity",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Entity updated" } },
      },
    },
    "/api/v1/projects": {
      get: {
        tags: ["Projects"],
        summary: "List projects",
        responses: { "200": { description: "List of projects" } },
      },
      post: {
        tags: ["Projects"],
        summary: "Create project",
        responses: { "201": { description: "Project created" } },
      },
    },
    "/api/v1/projects/{id}": {
      get: {
        tags: ["Projects"],
        summary: "Get project with tasks",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Project details" } },
      },
      patch: {
        tags: ["Projects"],
        summary: "Update project",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Project updated" } },
      },
      delete: {
        tags: ["Projects"],
        summary: "Delete project (cascades to tasks)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Project deleted" } },
      },
    },
    "/api/v1/tasks": {
      post: {
        tags: ["Tasks"],
        summary: "Create task",
        responses: { "201": { description: "Task created" } },
      },
    },
    "/api/v1/tasks/{id}": {
      patch: {
        tags: ["Tasks"],
        summary: "Update task status",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Task updated" } },
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete task",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Task deleted" } },
      },
    },
    "/api/v1/documents": {
      get: {
        tags: ["Documents"],
        summary: "List documents (paginated)",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
        ],
        responses: { "200": { description: "List of documents" } },
      },
    },
    "/api/v1/documents/{id}": {
      delete: {
        tags: ["Documents"],
        summary: "Delete document",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Document deleted" } },
      },
    },
    "/api/v1/parties": {
      get: {
        tags: ["Parties"],
        summary: "List parties/contacts",
        responses: { "200": { description: "List of parties" } },
      },
      post: {
        tags: ["Parties"],
        summary: "Create party",
        responses: { "201": { description: "Party created" } },
      },
    },
    "/api/v1/parties/{id}": {
      get: {
        tags: ["Parties"],
        summary: "Get party details",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Party details" } },
      },
      patch: {
        tags: ["Parties"],
        summary: "Update party",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Party updated" } },
      },
    },
    "/api/v1/intelligence": {
      get: {
        tags: ["Intelligence"],
        summary: "List AI-generated reports",
        responses: { "200": { description: "List of reports" } },
      },
      post: {
        tags: ["Intelligence"],
        summary: "Generate new report (Claude AI)",
        responses: { "201": { description: "Report generated" } },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(openapi);
}
