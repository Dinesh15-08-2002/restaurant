# Phase 1: Foundation Architecture & Decisions

## Overview
Phase 1 establishes the structural and architectural foundation for the full-stack Indian restaurant application.

## Repository Structure
```text
restaurant/
├── frontend/          # Next.js App Router, TypeScript, Tailwind CSS
├── backend/           # FastAPI application with Pydantic settings & CORS
├── docs/              # Architecture and design system specifications
├── README.md          # Project overview
└── .gitignore         # Monorepo-level gitignore
```

## Decisions & Rationale

### 1. Monorepo Organization
- **Separation of Concerns**: `frontend` and `backend` reside in the same repository to streamline co-development, deployment scripts, and version tracking while preserving distinct dependency trees.
- **Root Git Configuration**: A unified root `.gitignore` guarantees that sensitive environment configurations (`.env*`), Node artifacts (`node_modules/`, `.next/`), and Python artifacts (`.venv/`, `__pycache__/`) are never leaked, regardless of subfolder nesting.

### 2. Backend Stack (FastAPI + Pydantic Settings)
- **FastAPI**: Selected for asynchronous performance, native OpenAPI documentation generation, and type validation.
- **Pydantic Settings**: Centralizes configuration loaded from environment variables (`.env`) with automatic type casting and computed properties (e.g. parsing `ALLOWED_ORIGINS` into a list for CORS middleware).
- **Virtual Environment (`.venv`)**: Isolated within `backend/` to prevent contamination of global Python packages.
- **Health Check Endpoint (`GET /api/health`)**: Provides an immediate ping target for infrastructure monitoring, Docker health checks, and frontend connectivity verification.

### 3. Frontend Stack (Next.js App Router + TypeScript + Tailwind CSS)
- **App Router without `src/`**: Files are placed directly under `app/`, keeping the directory hierarchy clean and shallow as requested.
- **TypeScript**: Ensures type safety across components, design tokens, and API schemas.
- **Tailwind CSS**: Provides utility-first styling driven by design tokens defined via CSS custom properties.

### 4. Git & Branching Strategy
- Initialized on `main` branch with conventional commit semantics (`feat: ...`).
- Remote configuration instructions prepared for GitHub connection without automated pushing.
