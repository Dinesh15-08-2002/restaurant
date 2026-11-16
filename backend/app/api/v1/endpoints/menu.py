from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.menu import MenuCategory, MenuItem
from app.schemas.menu import CategoryPublic, MenuItemPublic

router = APIRouter()


@router.get("", response_model=list[CategoryPublic])
async def get_public_menu(
    veg_only: bool = Query(False, description="Filter for vegetarian items only"),
    featured_only: bool = Query(False, description="Filter for chef-recommended featured items only"),  # noqa: E501
    db: AsyncSession = Depends(get_db),
) -> list[CategoryPublic]:
    """
    Public Menu API.

    Returns active categories with available items sorted by sort_order.
    Supports filtering by vegetarian and featured items.
    """
    # Fetch active categories sorted by sort_order
    cat_stmt = (
        select(MenuCategory)
        .where(MenuCategory.is_active.is_(True))
        .order_by(MenuCategory.sort_order.asc(), MenuCategory.name.asc())
    )
    cat_result = await db.execute(cat_stmt)
    categories = cat_result.scalars().all()

    # Fetch available items matching optional filters
    item_filters = [MenuItem.is_available.is_(True)]
    if veg_only:
        item_filters.append(MenuItem.is_veg.is_(True))
    if featured_only:
        item_filters.append(MenuItem.is_featured.is_(True))

    item_stmt = (
        select(MenuItem)
        .where(*item_filters)
        .order_by(MenuItem.sort_order.asc(), MenuItem.name.asc())
    )
    item_result = await db.execute(item_stmt)
    items = item_result.scalars().all()

    # Group items by category_id
    items_by_cat: dict[int, list[MenuItemPublic]] = {}
    for item in items:
        pydantic_item = MenuItemPublic.model_validate(item)
        items_by_cat.setdefault(item.category_id, []).append(pydantic_item)

    # Build response: only include categories that have items (or include all active categories)
    response: list[CategoryPublic] = []
    for cat in categories:
        cat_items = items_by_cat.get(cat.id, [])
        cat_pydantic = CategoryPublic(
            id=cat.id,
            name=cat.name,
            slug=cat.slug,
            description=cat.description,
            sort_order=cat.sort_order,
            is_active=cat.is_active,
            items=cat_items,
        )
        response.append(cat_pydantic)

    return response


@router.get("/items/{slug}", response_model=MenuItemPublic)
async def get_menu_item_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> MenuItemPublic:
    """
    Returns single menu item detail by slug.
    Returns 404 if item does not exist or is marked unavailable.
    """
    stmt = (
        select(MenuItem)
        .join(MenuCategory)
        .where(
            MenuItem.slug == slug,
            MenuItem.is_available.is_(True),
            MenuCategory.is_active.is_(True),
        )
    )
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Menu item '{slug}' not found or currently unavailable",
        )

    return MenuItemPublic.model_validate(item)

