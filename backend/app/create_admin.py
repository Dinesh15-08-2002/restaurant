import asyncio
import os
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import AsyncSessionLocal, engine
from app.models.admin import AdminUser


async def create_initial_admin() -> None:
    async with AsyncSessionLocal() as session:
        email = settings.FIRST_SUPERUSER_EMAIL.lower().strip()
        print(f"🔐 Checking administrator account: {email}")

        stmt = select(AdminUser).where(AdminUser.email == email)
        result = await session.execute(stmt)
        admin = result.scalar_one_or_none()

        if not admin:
            admin = AdminUser(
                email=email,
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                is_active=True,
            )
            session.add(admin)
            await session.commit()
            print(f"✅ Initial administrator created successfully for: {email}")
        else:
            print(f"[i] Administrator {email} already exists. Ensuring active status.")
            admin.is_active = True
            await session.commit()

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(create_initial_admin())

