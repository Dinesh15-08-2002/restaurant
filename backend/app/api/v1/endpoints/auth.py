from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, verify_password
from app.db.session import get_db
from app.models.admin import AdminUser
from app.schemas.auth import LoginRequest, Token

router = APIRouter()


@router.post("/login", response_model=Token)
async def login_for_access_token(
    credentials: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> Token:
    """
    Authenticate administrator with email and password.
    Returns a signed JWT access token.
    """
    stmt = select(AdminUser).where(AdminUser.email == credentials.email.lower().strip())
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator account is inactive",
        )

    access_token = create_access_token(subject=user.email)
    return Token(access_token=access_token, token_type="bearer")

