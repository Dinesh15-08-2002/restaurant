# Indian Restaurant Website

A modern full-stack web application for an Indian restaurant, designed for online discovery, menu browsing, table reservations, and customer engagement.

## Architecture & Tech Stack

- **Frontend (`/frontend`)**: [Next.js](https://nextjs.org/) (App Router, TypeScript, Tailwind CSS)
- **Backend (`/backend`)**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.13+, Pydantic Settings, Uvicorn)
- **Database**: PostgreSQL (planned for subsequent phases)
- **Documentation (`/docs`)**: Architecture records, technical specifications, and phase progress notes

## Repository Structure

```text
restaurant/
├── frontend/          # Next.js frontend application
├── backend/           # FastAPI backend application
├── docs/              # Requirements, specifications, and architecture decisions
├── README.md          # Project overview and setup guides
└── .gitignore         # Monorepo gitignore covering Node, Python, and env files
```

## Project Phases

- [x] **Phase 1: Foundation** (Repo structure, backend skeleton, frontend skeleton, docs)
- [ ] **Phase 2: Database & Core Models** (PostgreSQL, Alembic migrations, SQLAlchemy models)
- [ ] **Phase 3: Backend APIs** (Menu, Reservations, Contact)
- [ ] **Phase 4: Frontend UI & Integration** (Responsive pages, API clients, state management)
- [ ] **Phase 5: Testing, Hardening & Deployment**

