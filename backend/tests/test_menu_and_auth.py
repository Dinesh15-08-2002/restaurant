import uuid

import pytest
from httpx import AsyncClient

from app.core.config import settings


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    """Test health check returns status ok and database connected."""
    response = await client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"


@pytest.mark.asyncio
async def test_public_menu_listing(client: AsyncClient):
    """Test GET /api/menu returns active categories with available items."""
    response = await client.get("/api/menu")
    assert response.status_code == 200
    categories = response.json()
    assert isinstance(categories, list)
    assert len(categories) >= 5

    # Check first category has items
    first_cat = categories[0]
    assert "name" in first_cat
    assert "slug" in first_cat
    assert "items" in first_cat
    assert len(first_cat["items"]) > 0

    first_item = first_cat["items"][0]
    assert "price_paise" in first_item
    assert "is_veg" in first_item
    assert "spice_level" in first_item


@pytest.mark.asyncio
async def test_public_menu_veg_filter(client: AsyncClient):
    """Test GET /api/menu?veg_only=true returns only vegetarian items."""
    response = await client.get("/api/menu?veg_only=true")
    assert response.status_code == 200
    categories = response.json()
    for cat in categories:
        for item in cat["items"]:
            assert item["is_veg"] is True


@pytest.mark.asyncio
async def test_public_menu_item_detail_success(client: AsyncClient):
    """Test GET /api/menu/items/{slug} returns the item."""
    response = await client.get("/api/menu/items/paneer-tikka-shashlik")
    assert response.status_code == 200
    item = response.json()
    assert item["slug"] == "paneer-tikka-shashlik"
    assert item["is_veg"] is True
    assert item["price_paise"] == 34500


@pytest.mark.asyncio
async def test_public_menu_item_detail_404(client: AsyncClient):
    """Test GET /api/menu/items/{slug} returns 404 for nonexistent item."""
    response = await client.get("/api/menu/items/nonexistent-mystery-dish-xyz")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_auth_login_success(client: AsyncClient):
    """Test POST /api/auth/login returns JWT access token for valid admin credentials."""
    response = await client.post(
        "/api/auth/login",
        json={
            "email": settings.FIRST_SUPERUSER_EMAIL,
            "password": settings.FIRST_SUPERUSER_PASSWORD,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_auth_login_invalid_credentials(client: AsyncClient):
    """Test POST /api/auth/login returns 401 for incorrect password."""
    response = await client.post(
        "/api/auth/login",
        json={
            "email": settings.FIRST_SUPERUSER_EMAIL,
            "password": "WrongPassword!999",
        },
    )
    assert response.status_code == 401
    assert "incorrect" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_protected_route_without_token_returns_401(client: AsyncClient):
    """Test admin endpoint without token returns 401 Unauthorized."""
    response = await client.get("/api/admin/menu/categories")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_admin_item_crud_and_availability_toggle(
    client: AsyncClient,
    admin_auth_headers: dict,
):
    """
    Test full admin lifecycle:
    1. Create category
    2. Create item
    3. Verify item appears in public menu
    4. Toggle availability to False
    5. Verify item is hidden from public menu
    6. Verify detail route returns 404 when unavailable
    7. Clean up (delete item and category)
    """
    uid = uuid.uuid4().hex[:6]
    cat_slug = f"test-cat-{uid}"
    item_slug = f"test-item-{uid}"

    # 1. Create Category
    cat_payload = {
        "name": f"Test Category {uid}",
        "slug": cat_slug,
        "description": "Test category for verification [Placeholder]",
        "sort_order": 99,
        "is_active": True,
    }
    cat_res = await client.post(
        "/api/admin/menu/categories",
        json=cat_payload,
        headers=admin_auth_headers,
    )
    assert cat_res.status_code == 201
    category = cat_res.json()
    cat_id = category["id"]

    # 2. Create Item under this Category
    item_payload = {
        "category_id": cat_id,
        "name": f"Tasting Kebab {uid}",
        "slug": item_slug,
        "description": "Test item description [Placeholder]",
        "price_paise": 29900,
        "is_veg": True,
        "spice_level": "mild",
        "is_available": True,
        "is_featured": True,
        "sort_order": 1,
    }
    item_res = await client.post(
        "/api/admin/menu/items",
        json=item_payload,
        headers=admin_auth_headers,
    )
    assert item_res.status_code == 201
    created_item = item_res.json()
    item_id = created_item["id"]

    # 3. Confirm item is visible on public menu
    pub_res = await client.get("/api/menu")
    assert pub_res.status_code == 200
    pub_categories = pub_res.json()
    found_in_pub = any(
        any(i["id"] == item_id for i in c["items"])
        for c in pub_categories
    )
    assert found_in_pub is True

    # 4. Toggle availability off (is_available = False)
    patch_res = await client.patch(
        f"/api/admin/menu/items/{item_id}/availability",
        json={"is_available": False},
        headers=admin_auth_headers,
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["is_available"] is False

    # 5. Confirm item is now hidden from public menu
    pub_res_after = await client.get("/api/menu")
    pub_categories_after = pub_res_after.json()
    found_after_toggle = any(
        any(i["id"] == item_id for i in c["items"])
        for c in pub_categories_after
    )
    assert found_after_toggle is False

    # 6. Item detail returns 404 when unavailable
    detail_res = await client.get(f"/api/menu/items/{item_slug}")
    assert detail_res.status_code == 404

    # 7. Delete Item and Category
    del_item_res = await client.delete(
        f"/api/admin/menu/items/{item_id}",
        headers=admin_auth_headers,
    )
    assert del_item_res.status_code == 204

    del_cat_res = await client.delete(
        f"/api/admin/menu/categories/{cat_id}",
        headers=admin_auth_headers,
    )
    assert del_cat_res.status_code == 204
