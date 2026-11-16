import asyncio
import os
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select

from app.db.session import AsyncSessionLocal, engine
from app.models.menu import MenuCategory, MenuItem, SpiceLevel

SEED_CATEGORIES = [
    {
        "name": "Starters",
        "slug": "starters",
        "description": "Crisp tandoori appetisers and royal kebabs [Placeholder description]",
        "sort_order": 1,
        "items": [
            {
                "name": "Paneer Tikka Shashlik",
                "slug": "paneer-tikka-shashlik",
                "description": "Cottage cheese cubes marinated in spiced hung yoghurt and chargrilled with bell peppers. [Placeholder description]",
                "price_paise": 34500,
                "is_veg": True,
                "spice_level": SpiceLevel.mild,
                "is_featured": True,
                "sort_order": 1,
            },
            {
                "name": "Tandoori Malai Chaap",
                "slug": "tandoori-malai-chaap",
                "description": "Soya chaap marinated in rich cream, cardamom, and roasted whole spices. [Placeholder description]",
                "price_paise": 32000,
                "is_veg": True,
                "spice_level": SpiceLevel.mild,
                "is_featured": False,
                "sort_order": 2,
            },
            {
                "name": "Galouti Kebab Lucknowi",
                "slug": "galouti-kebab-lucknowi",
                "description": "Melt-in-mouth smoked kebabs flavored with 32 traditional Awadhi potli spices. [Placeholder description]",
                "price_paise": 48000,
                "is_veg": False,
                "spice_level": SpiceLevel.medium,
                "is_featured": True,
                "sort_order": 3,
            },
        ],
    },
    {
        "name": "Curries",
        "slug": "curries",
        "description": "Slow-simmered aromatic gravies and royal shahi curries [Placeholder description]",
        "sort_order": 2,
        "items": [
            {
                "name": "Paneer Butter Masala Velvet",
                "slug": "paneer-butter-masala-velvet",
                "description": "Fresh cottage cheese in a silk tomato and cashew gravy infused with kasuri methi. [Placeholder description]",
                "price_paise": 39000,
                "is_veg": True,
                "spice_level": SpiceLevel.mild,
                "is_featured": True,
                "sort_order": 1,
            },
            {
                "name": "Dal Makhani Bukhara",
                "slug": "dal-makhani-bukhara",
                "description": "Slow-cooked black lentils simmered overnight over glowing charcoal embers with churned butter. [Placeholder description]",
                "price_paise": 36000,
                "is_veg": True,
                "spice_level": SpiceLevel.none,
                "is_featured": True,
                "sort_order": 2,
            },
            {
                "name": "Awadhi Murgh Korma",
                "slug": "awadhi-murgh-korma",
                "description": "Tender chicken simmered in an aromatic almond and saffron gravy with brown onion paste. [Placeholder description]",
                "price_paise": 46000,
                "is_veg": False,
                "spice_level": SpiceLevel.medium,
                "is_featured": False,
                "sort_order": 3,
            },
        ],
    },
    {
        "name": "Biryani",
        "slug": "biryani",
        "description": "Fragrant basmati rice preparations sealed in earthen handis [Placeholder description]",
        "sort_order": 3,
        "items": [
            {
                "name": "Awadhi Dum Murgh Biryani",
                "slug": "awadhi-dum-murgh-biryani",
                "description": "Aged long-grain basmati layered with marinated chicken, kewra water, and pure Kashmiri saffron. [Placeholder description]",
                "price_paise": 49000,
                "is_veg": False,
                "spice_level": SpiceLevel.medium,
                "is_featured": True,
                "sort_order": 1,
            },
            {
                "name": "Subz Dum Biryani Handi",
                "slug": "subz-dum-biryani-handi",
                "description": "Garden vegetables and cottage cheese sealed with whole wheat dough and slow cooked on dum. [Placeholder description]",
                "price_paise": 38000,
                "is_veg": True,
                "spice_level": SpiceLevel.mild,
                "is_featured": False,
                "sort_order": 2,
            },
            {
                "name": "Gosht Dum Biryani Royal",
                "slug": "gosht-dum-biryani-royal",
                "description": "Succulent lamb cuts layered with fragrant spices and browned onions in traditional purdah style. [Placeholder description]",
                "price_paise": 58000,
                "is_veg": False,
                "spice_level": SpiceLevel.hot,
                "is_featured": True,
                "sort_order": 3,
            },
        ],
    },
    {
        "name": "Breads",
        "slug": "breads",
        "description": "Fresh breads baked to order in the clay tandoor oven [Placeholder description]",
        "sort_order": 4,
        "items": [
            {
                "name": "Garlic Butter Naan",
                "slug": "garlic-butter-naan",
                "description": "Leavened refined flour bread topped with minced roasted garlic and fresh coriander. [Placeholder description]",
                "price_paise": 9000,
                "is_veg": True,
                "spice_level": SpiceLevel.none,
                "is_featured": False,
                "sort_order": 1,
            },
            {
                "name": "Khamiri Roti",
                "slug": "khamiri-roti",
                "description": "Traditional Mughal leavened yeast bread, soft and pillowy from the clay oven walls. [Placeholder description]",
                "price_paise": 7000,
                "is_veg": True,
                "spice_level": SpiceLevel.none,
                "is_featured": False,
                "sort_order": 2,
            },
            {
                "name": "Laccha Paratha Crispy",
                "slug": "laccha-paratha-crispy",
                "description": "Multi-layered whole wheat flatbread brushed with pure desi ghee. [Placeholder description]",
                "price_paise": 8500,
                "is_veg": True,
                "spice_level": SpiceLevel.none,
                "is_featured": False,
                "sort_order": 3,
            },
        ],
    },
    {
        "name": "Desserts",
        "slug": "desserts",
        "description": "Traditional Indian sweet endings infused with cardamom and saffron [Placeholder description]",
        "sort_order": 5,
        "items": [
            {
                "name": "Shahi Tukda Awadhi",
                "slug": "shahi-tukda-awadhi",
                "description": "Crisp ghee-fried bread steeped in cardamom syrup, topped with thick rabri and silver vark. [Placeholder description]",
                "price_paise": 22000,
                "is_veg": True,
                "spice_level": SpiceLevel.none,
                "is_featured": True,
                "sort_order": 1,
            },
            {
                "name": "Kesari Phirni in Clay Pot",
                "slug": "kesari-phirni-in-clay-pot",
                "description": "Slow-set ground rice pudding infused with saffron milk, served chilled in traditional shikoras. [Placeholder description]",
                "price_paise": 18000,
                "is_veg": True,
                "spice_level": SpiceLevel.none,
                "is_featured": False,
                "sort_order": 2,
            },
            {
                "name": "Warm Gulab Jamun Flambé",
                "slug": "warm-gulab-jamun-flambe",
                "description": "Golden khoya dumplings soaked in rose-cardamom syrup with crushed pistachios. [Placeholder description]",
                "price_paise": 16000,
                "is_veg": True,
                "spice_level": SpiceLevel.none,
                "is_featured": False,
                "sort_order": 3,
            },
        ],
    },
]


async def seed_database() -> None:
    async with AsyncSessionLocal() as session:
        print("🌱 Seeding database...")
        categories_created = 0
        categories_updated = 0
        items_created = 0
        items_updated = 0

        for cat_data in SEED_CATEGORIES:
            # Check if category already exists by slug
            stmt = select(MenuCategory).where(MenuCategory.slug == cat_data["slug"])
            result = await session.execute(stmt)
            category = result.scalar_one_or_none()

            if not category:
                category = MenuCategory(
                    name=cat_data["name"],
                    slug=cat_data["slug"],
                    description=cat_data["description"],
                    sort_order=cat_data["sort_order"],
                    is_active=True,
                )
                session.add(category)
                await session.flush()
                categories_created += 1
            else:
                category.name = cat_data["name"]
                category.description = cat_data["description"]
                category.sort_order = cat_data["sort_order"]
                categories_updated += 1

            # Seed items for this category
            for item_data in cat_data["items"]:
                stmt = select(MenuItem).where(MenuItem.slug == item_data["slug"])
                result = await session.execute(stmt)
                item = result.scalar_one_or_none()

                if not item:
                    item = MenuItem(
                        category_id=category.id,
                        name=item_data["name"],
                        slug=item_data["slug"],
                        description=item_data["description"],
                        price_paise=item_data["price_paise"],
                        is_veg=item_data["is_veg"],
                        spice_level=item_data["spice_level"],
                        is_available=True,
                        is_featured=item_data.get("is_featured", False),
                        sort_order=item_data["sort_order"],
                    )
                    session.add(item)
                    items_created += 1
                else:
                    item.category_id = category.id
                    item.name = item_data["name"]
                    item.description = item_data["description"]
                    item.price_paise = item_data["price_paise"]
                    item.is_veg = item_data["is_veg"]
                    item.spice_level = item_data["spice_level"]
                    item.is_featured = item_data.get("is_featured", False)
                    item.sort_order = item_data["sort_order"]
                    items_updated += 1

        await session.commit()
        print(f"✅ Categories: {categories_created} created, {categories_updated} updated.")
        print(f"✅ Menu Items: {items_created} created, {items_updated} updated.")
        print("🌱 Seeding complete!")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed_database())

