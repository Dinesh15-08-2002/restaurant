from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.endpoints.admin_menu import router as admin_menu_router
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.menu import router as public_menu_router
from app.core.config import settings
from app.db.session import get_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware for Next.js frontend communication
if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Mount endpoints
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(
    public_menu_router, prefix=f"{settings.API_V1_STR}/menu", tags=["public-menu"]
)
app.include_router(
    admin_menu_router, prefix=f"{settings.API_V1_STR}/admin/menu", tags=["admin-menu"]
)


@app.get(f"{settings.API_V1_STR}/docs", include_in_schema=False)
async def redirect_api_docs() -> RedirectResponse:
    """Redirect /api/docs to /docs for developer convenience."""
    return RedirectResponse(url="/docs")


@app.get(f"{settings.API_V1_STR}/health", tags=["health"])
async def health_check(db: AsyncSession = Depends(get_db)) -> dict[str, str]:
    """Health check: verifies API and PostgreSQL connectivity."""
    try:
        result = await db.execute(text("SELECT 1"))
        db_status = "connected" if result.scalar() == 1 else "unhealthy"
    except Exception as e:
        db_status = f"disconnected ({e!s})"

    return {
        "status": "ok" if db_status == "connected" else "degraded",
        "database": db_status,
        "environment": settings.ENVIRONMENT,
    }
