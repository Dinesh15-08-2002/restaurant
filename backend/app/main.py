from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get(f"{settings.API_V1_STR}/docs", include_in_schema=False)
async def redirect_api_docs() -> RedirectResponse:
    """Redirect /api/docs to /docs for developer convenience."""
    return RedirectResponse(url="/docs")


@app.get(f"{settings.API_V1_STR}/health", tags=["health"])
async def health_check() -> dict[str, str]:
    """Health check endpoint to verify backend service availability."""
    return {"status": "ok"}
