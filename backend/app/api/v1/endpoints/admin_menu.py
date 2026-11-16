
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_admin
from app.db.session import get_db
from app.models.menu import MenuCategory, MenuItem
from app.schemas.admin_menu import (
    AvailabilityToggle,
    CategoryCreate,
    CategoryUpdate,
    MenuItemCreate,
    MenuItemUpdate,
)
from app.schemas.menu import CategoryPublic, MenuItemPublic

router = APIRouter(dependencies=[Depends(get_current_admin)])


# ==========================================
# CATEGORY CRUD
# ==========================================

@router.get("/categories", response_model=list[CategoryPublic])
async def list_admin_categories(
    db: AsyncSession = Depends(get_db),
) -> list[CategoryPublic]:
    """List all categories (including inactive) with their items for management."""
    stmt = (
        select(MenuCategory)
        .options(selectinload(MenuCategory.items))
        .order_by(MenuCategory.sort_order.asc(), MenuCategory.id.asc())
    )
    result = await db.execute(stmt)
    categories = result.scalars().all()

    response: list[CategoryPublic] = []
    for cat in categories:
        cat_pydantic = CategoryPublic(
            id=cat.id,
            name=cat.name,
            slug=cat.slug,
            description=cat.description,
            sort_order=cat.sort_order,
            is_active=cat.is_active,
            items=[MenuItemPublic.model_validate(i) for i in cat.items],
        )
        response.append(cat_pydantic)

    return response


@router.post("/categories", response_model=CategoryPublic, status_code=status.HTTP_201_CREATED)
async def create_category(
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
) -> CategoryPublic:
    """Create a new menu category. Validates unique slug."""
    existing = await db.execute(select(MenuCategory).where(MenuCategory.slug == payload.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with slug '{payload.slug}' already exists",
        )

    category = MenuCategory(
        name=payload.name,
        slug=payload.slug,
        description=payload.description,
        sort_order=payload.sort_order,
        is_active=payload.is_active,
    )
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return CategoryPublic(
        id=category.id,
        name=category.name,
        slug=category.slug,
        description=category.description,
        sort_order=category.sort_order,
        is_active=category.is_active,
        items=[],
    )


@router.put("/categories/{category_id}", response_model=CategoryPublic)
async def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
) -> CategoryPublic:
    """Update an existing category. Validates slug uniqueness if changed."""
    stmt = (
        select(MenuCategory)
        .options(selectinload(MenuCategory.items))
        .where(MenuCategory.id == category_id)
    )
    result = await db.execute(stmt)
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    if payload.slug and payload.slug != category.slug:
        existing = await db.execute(
            select(MenuCategory).where(
                MenuCategory.slug == payload.slug,
                MenuCategory.id != category_id,
            )
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with slug '{payload.slug}' already exists",
            )
        category.slug = payload.slug

    if payload.name is not None:
        category.name = payload.name
    if payload.description is not None:
        category.description = payload.description
    if payload.sort_order is not None:
        category.sort_order = payload.sort_order
    if payload.is_active is not None:
        category.is_active = payload.is_active

    await db.commit()
    await db.refresh(category)
    return CategoryPublic(
        id=category.id,
        name=category.name,
        slug=category.slug,
        description=category.description,
        sort_order=category.sort_order,
        is_active=category.is_active,
        items=[MenuItemPublic.model_validate(i) for i in category.items],
    )


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a category and cascade-delete its items."""
    stmt = select(MenuCategory).where(MenuCategory.id == category_id)
    result = await db.execute(stmt)
    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    await db.delete(category)
    await db.commit()


# ==========================================
# ITEM CRUD
# ==========================================

@router.get("/items", response_model=list[MenuItemPublic])
async def list_admin_items(
    db: AsyncSession = Depends(get_db),
) -> list[MenuItemPublic]:
    """List all items across all categories for admin overview."""
    stmt = select(MenuItem).order_by(MenuItem.sort_order.asc(), MenuItem.id.asc())
    result = await db.execute(stmt)
    items = result.scalars().all()
    return [MenuItemPublic.model_validate(item) for item in items]


@router.post("/items", response_model=MenuItemPublic, status_code=status.HTTP_201_CREATED)
async def create_menu_item(
    payload: MenuItemCreate,
    db: AsyncSession = Depends(get_db),
) -> MenuItemPublic:
    """Create a new menu item. Validates category existence and slug uniqueness."""
    cat_stmt = select(MenuCategory).where(MenuCategory.id == payload.category_id)
    cat_result = await db.execute(cat_stmt)
    if not cat_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with ID {payload.category_id} does not exist",
        )

    existing = await db.execute(select(MenuItem).where(MenuItem.slug == payload.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Menu item with slug '{payload.slug}' already exists",
        )

    item = MenuItem(
        category_id=payload.category_id,
        name=payload.name,
        slug=payload.slug,
        description=payload.description,
        price_paise=payload.price_paise,
        is_veg=payload.is_veg,
        spice_level=payload.spice_level,
        image_url=payload.image_url,
        is_available=payload.is_available,
        is_featured=payload.is_featured,
        sort_order=payload.sort_order,
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return MenuItemPublic.model_validate(item)


@router.put("/items/{item_id}", response_model=MenuItemPublic)
async def update_menu_item(
    item_id: int,
    payload: MenuItemUpdate,
    db: AsyncSession = Depends(get_db),
) -> MenuItemPublic:
    """Update an existing menu item. Validates slug uniqueness if changed."""
    stmt = select(MenuItem).where(MenuItem.id == item_id)
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found",
        )

    if payload.slug and payload.slug != item.slug:
        existing = await db.execute(
            select(MenuItem).where(MenuItem.slug == payload.slug, MenuItem.id != item_id)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Menu item with slug '{payload.slug}' already exists",
            )
        item.slug = payload.slug

    if payload.category_id is not None:
        cat_stmt = select(MenuCategory).where(MenuCategory.id == payload.category_id)
        cat_result = await db.execute(cat_stmt)
        if not cat_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with ID {payload.category_id} does not exist",
            )
        item.category_id = payload.category_id

    if payload.name is not None:
        item.name = payload.name
    if payload.description is not None:
        item.description = payload.description
    if payload.price_paise is not None:
        item.price_paise = payload.price_paise
    if payload.is_veg is not None:
        item.is_veg = payload.is_veg
    if payload.spice_level is not None:
        item.spice_level = payload.spice_level
    if payload.image_url is not None:
        item.image_url = payload.image_url
    if payload.is_available is not None:
        item.is_available = payload.is_available
    if payload.is_featured is not None:
        item.is_featured = payload.is_featured
    if payload.sort_order is not None:
        item.sort_order = payload.sort_order

    await db.commit()
    await db.refresh(item)
    return MenuItemPublic.model_validate(item)


@router.patch("/items/{item_id}/availability", response_model=MenuItemPublic)
async def toggle_item_availability(
    item_id: int,
    payload: AvailabilityToggle,
    db: AsyncSession = Depends(get_db),
) -> MenuItemPublic:
    """Quick toggle for menu item availability."""
    stmt = select(MenuItem).where(MenuItem.id == item_id)
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found",
        )

    item.is_available = payload.is_available
    await db.commit()
    await db.refresh(item)
    return MenuItemPublic.model_validate(item)


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_menu_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a menu item."""
    stmt = select(MenuItem).where(MenuItem.id == item_id)
    result = await db.execute(stmt)
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found",
        )

    await db.delete(item)
    await db.commit()
