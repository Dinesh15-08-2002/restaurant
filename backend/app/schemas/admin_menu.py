
from pydantic import BaseModel, Field

from app.models.menu import SpiceLevel


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100)
    description: str | None = Field(None, max_length=500)
    sort_order: int = 0
    is_active: bool = True


class CategoryUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    slug: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = Field(None, max_length=500)
    sort_order: int | None = None
    is_active: bool | None = None


class MenuItemCreate(BaseModel):
    category_id: int
    name: str = Field(..., min_length=1, max_length=150)
    slug: str = Field(..., min_length=1, max_length=150)
    description: str = Field(..., min_length=1)
    price_paise: int = Field(..., ge=0, description="Price in paise (cannot be negative)")
    is_veg: bool = True
    spice_level: SpiceLevel = SpiceLevel.mild
    image_url: str | None = Field(None, max_length=500)
    is_available: bool = True
    is_featured: bool = False
    sort_order: int = 0


class MenuItemUpdate(BaseModel):
    category_id: int | None = None
    name: str | None = Field(None, min_length=1, max_length=150)
    slug: str | None = Field(None, min_length=1, max_length=150)
    description: str | None = None
    price_paise: int | None = Field(None, ge=0)
    is_veg: bool | None = None
    spice_level: SpiceLevel | None = None
    image_url: str | None = None
    is_available: bool | None = None
    is_featured: bool | None = None
    sort_order: int | None = None


class AvailabilityToggle(BaseModel):
    is_available: bool

