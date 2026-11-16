
from pydantic import BaseModel, ConfigDict

from app.models.menu import SpiceLevel


class MenuItemPublic(BaseModel):
    id: int
    category_id: int
    name: str
    slug: str
    description: str
    price_paise: int
    is_veg: bool
    spice_level: SpiceLevel
    image_url: str | None = None
    is_available: bool
    is_featured: bool
    sort_order: int

    model_config = ConfigDict(from_attributes=True)


class CategoryPublic(BaseModel):
    id: int
    name: str
    slug: str
    description: str | None = None
    sort_order: int
    is_active: bool
    items: list[MenuItemPublic] = []

    model_config = ConfigDict(from_attributes=True)


class MenuResponse(BaseModel):
    categories: list[CategoryPublic]
    total_items: int

