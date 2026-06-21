import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'grownup_organics.settings')
django.setup()

from shop.models import Category, Brand, Product

def seed_db():
    print("Clearing database...")
    Category.objects.all().delete()
    Brand.objects.all().delete()
    Product.objects.all().delete()

    print("Creating categories...")
    oils_cat = Category.objects.create(
        name="Cold Pressed Oils",
        slug="cold-pressed-oils",
        image="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=200"
    )
    spices_cat = Category.objects.create(
        name="Spices",
        slug="spices",
        image="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=200"
    )
    millets_cat = Category.objects.create(
        name="Organic Millets",
        slug="millets",
        image="https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=200"
    )

    print("Creating brands...")
    brand1 = Brand.objects.create(name="GrownUp Organics 1", slug="grownup-organics-1")
    brand2 = Brand.objects.create(name="GrownUp Organics 2", slug="grownup-organics-2")
    brand3 = Brand.objects.create(name="GrownUp Organics 3", slug="grownup-organics-3")
    brand4 = Brand.objects.create(name="GrownUp Organics 4", slug="grownup-organics-4")

    print("Creating products...")

    products_data = [
        # Oils
        {
            "id": 14,
            "name": "Pure Cold Pressed Coconut Oil",
            "slug": "pure-cold-pressed-coconut-oil",
            "category": oils_cat,
            "brand": brand1,
            "price": 650.00,
            "oldPrice": None,
            "badge": None,
            "rating": 4.8,
            "reviews": 42,
            "image": "images/products/coconut_oil.svg",
            "description": "Premium cold pressed coconut oil extracted from fresh, mature coconut kernels. Rich in medium-chain triglycerides (MCTs), it maintains natural aroma and nutritional value. Perfect for cooking, baking, and hair care.",
            "specs": {
                "Volume": "1 Litre",
                "Packaging": "Glass Bottle",
                "Shelf Life": "12 Months",
                "Extraction Method": "Wood Pressed (Cold Pressed)"
            }
        },
        {
            "id": 13,
            "name": "Cold Pressed Safflower Oil (Kardi)",
            "slug": "cold-pressed-safflower-oil",
            "category": oils_cat,
            "brand": brand1,
            "price": 550.00,
            "oldPrice": 620.00,
            "badge": "Sale",
            "rating": 4.6,
            "reviews": 29,
            "image": "images/products/safflower_oil.svg",
            "description": "Naturally extracted wood-pressed safflower oil, low in saturated fats and rich in unsaturated fatty acids (linoleic acid). Has a high smoke point, making it ideal for deep frying and traditional Indian cooking.",
            "specs": {
                "Volume": "1 Litre",
                "Packaging": "Glass Bottle",
                "Shelf Life": "9 Months",
                "Extraction Method": "Wood Pressed"
            }
        },
        {
            "id": 12,
            "name": "Traditional Mustard Oil",
            "slug": "traditional-mustard-oil",
            "category": oils_cat,
            "brand": brand1,
            "price": 380.00,
            "oldPrice": None,
            "badge": None,
            "rating": 4.7,
            "reviews": 53,
            "image": "images/products/mustard_oil.svg",
            "description": "Pungent and flavorful cold pressed mustard oil made from select black mustard seeds. Extracted using traditional wooden mills to preserve its high content of monounsaturated fatty acids and signature aroma.",
            "specs": {
                "Volume": "1 Litre",
                "Packaging": "Bottle",
                "Shelf Life": "12 Months",
                "Extraction Method": "Kachi Ghani (Cold Pressed)"
            }
        },
        {
            "id": 11,
            "name": "Wood Pressed Groundnut Oil",
            "slug": "wood-pressed-groundnut-oil",
            "category": oils_cat,
            "brand": brand1,
            "price": 350.00,
            "oldPrice": None,
            "badge": None,
            "rating": 4.9,
            "reviews": 67,
            "image": "images/products/groundnut_oil.svg",
            "description": "Pure groundnut oil extracted through a wooden press without heating or chemical refining. Golden-yellow color, nutty aroma, and heart-healthy fats make it a staple for daily cooking and stir-frying.",
            "specs": {
                "Volume": "1 Litre",
                "Packaging": "Glass Bottle",
                "Shelf Life": "12 Months",
                "Extraction Method": "Wood Pressed"
            }
        },
        {
            "id": 10,
            "name": "Organic Sunflower Oil",
            "slug": "organic-sunflower-oil",
            "category": oils_cat,
            "brand": brand1,
            "price": 380.00,
            "oldPrice": 420.00,
            "badge": "Sale",
            "rating": 4.5,
            "reviews": 18,
            "image": "images/products/sunflower_oil.svg",
            "description": "Light and healthy cold-pressed sunflower oil, naturally rich in Vitamin E and antioxidants. Ideal for sautéing, baking, and dressing salad without overpowering other flavors.",
            "specs": {
                "Volume": "1 Litre",
                "Packaging": "Bottle",
                "Shelf Life": "9 Months",
                "Extraction Method": "Cold Pressed"
            }
        },
        {
            "id": 9,
            "name": "Wood Pressed Sesame (Til) Oil",
            "slug": "wood-pressed-sesame-til-oil",
            "category": oils_cat,
            "brand": brand1,
            "price": 470.00,
            "oldPrice": None,
            "badge": None,
            "rating": 4.7,
            "reviews": 31,
            "image": "images/products/sesame_oil.svg",
            "description": "Authentic sesame oil pressed from natural sesame seeds with a touch of organic jaggery in the traditional process to balance the flavor. Deep golden color, nutrient-rich, and highly aromatic.",
            "specs": {
                "Volume": "1 Litre",
                "Packaging": "Glass Bottle",
                "Shelf Life": "12 Months",
                "Extraction Method": "Wood Pressed"
            }
        },

        # Spices (Consolidating former meal-mixes and traditional-masalas here)
        {
            "id": 5,
            "name": "Organic Chili Powder (Guntur)",
            "slug": "organic-chili-powder",
            "category": spices_cat,
            "brand": brand1,
            "price": 70.00,
            "oldPrice": 350.00,
            "badge": "80% Off",
            "rating": 4.7,
            "reviews": 125,
            "image": "images/products/chili_powder.svg",
            "description": "High-grade fiery chili powder made from sun-dried Guntur red chilies. Adds a bright red color and sharp, spicy heat to curries, stews, and marinades without any artificial colors or additives.",
            "specs": {
                "Weight": "250g",
                "Packaging": "Pouch",
                "Shelf Life": "9 Months",
                "Ingredient": "100% Red Chili"
            }
        },
        {
            "id": 4,
            "name": "Pure Turmeric Powder (Haldi)",
            "slug": "pure-turmeric-powder",
            "category": spices_cat,
            "brand": brand4,
            "price": 50.00,
            "oldPrice": 250.00,
            "badge": "80% Off",
            "rating": 4.9,
            "reviews": 210,
            "image": "images/products/turmeric_powder.svg",
            "description": "Aromatic turmeric powder containing high curcumin content, sourced from hand-selected Salem turmeric roots. Known for its rich golden color, deep earthy taste, and natural immunity-boosting properties.",
            "specs": {
                "Weight": "250g",
                "Packaging": "Pouch",
                "Shelf Life": "12 Months",
                "Curcumin Content": "> 3.5%"
            }
        },
        {
            "id": 3,
            "name": "Grandma's Sambar Powder",
            "slug": "grandmas-sambar-powder",
            "category": spices_cat,
            "brand": brand3,
            "price": 170.00,
            "oldPrice": 350.00,
            "badge": "51% Off",
            "rating": 4.8,
            "reviews": 94,
            "image": "images/products/sambar_powder.svg",
            "description": "Authentic South Indian Sambar powder crafted using a traditional recipe. Blended with premium roasted coriander, cumin, fenugreek, red chilies, and asafoetida for a rich, aromatic Sambar.",
            "specs": {
                "Weight": "200g",
                "Packaging": "Pouch",
                "Shelf Life": "6 Months",
                "Recipe Origin": "South India"
            }
        },
        {
            "id": 7,
            "name": "Classic Biryani Masala Mix",
            "slug": "classic-biryani-masala-mix",
            "category": spices_cat,
            "brand": brand1,
            "price": 120.00,
            "oldPrice": 250.00,
            "badge": "52% Off",
            "rating": 4.6,
            "reviews": 48,
            "image": "images/products/biryani_masala.svg",
            "description": "An exotic blend of stone-ground whole spices that brings the royal taste of biryani to your kitchen. Perfectly balanced cardamom, cinnamon, cloves, mace, and star anise.",
            "specs": {
                "Weight": "100g",
                "Packaging": "Pouch",
                "Shelf Life": "9 Months"
            }
        },
        {
            "id": 6,
            "name": "Aromatic Chai Masala",
            "slug": "aromatic-chai-masala",
            "category": spices_cat,
            "brand": brand2,
            "price": 399.00,
            "oldPrice": 450.00,
            "badge": "11% Off",
            "rating": 4.9,
            "reviews": 82,
            "image": "images/products/chai_masala.svg",
            "description": "Transform your daily tea with our custom tea spice blend. Ground ginger, green cardamom, black pepper, cinnamon, nutmeg, and cloves combine to create a warm, soothing cup of masala chai.",
            "specs": {
                "Weight": "100g",
                "Packaging": "Tin Jar",
                "Shelf Life": "12 Months"
            }
        },
        {
            "id": 8,
            "name": "Garam Masala (Stone Ground)",
            "slug": "garam-masala-stone-ground",
            "category": spices_cat,
            "brand": brand2,
            "price": 99.00,
            "oldPrice": 150.00,
            "badge": "34% Off",
            "rating": 4.8,
            "reviews": 64,
            "image": "images/products/garam_masala.svg",
            "description": "Warm, spicy, and highly aromatic. This traditional Garam Masala is ground slowly at low temperatures to retain natural essential oils. Adds depth and aroma to any curry at the end of cooking.",
            "specs": {
                "Weight": "100g",
                "Packaging": "Pouch",
                "Shelf Life": "9 Months"
            }
        },
        {
            "id": 15,
            "name": "Salem Turmeric (Whole Roots)",
            "slug": "salem-turmeric-whole-roots",
            "category": spices_cat,
            "brand": brand4,
            "price": 60.00,
            "oldPrice": 120.00,
            "badge": "50% Off",
            "rating": 4.8,
            "reviews": 35,
            "image": "images/products/turmeric_whole.svg",
            "description": "Premium dried whole turmeric fingers sourced from Salem, Tamil Nadu. Known for their high curcumin content and medicinal properties. Excellent for home grinding or infusing.",
            "specs": {
                "Weight": "200g",
                "Packaging": "Pouch",
                "Shelf Life": "12 Months",
                "Type": "Salem Finger"
            }
        },
        {
            "id": 16,
            "name": "Whole Cumin Seeds (Jeera)",
            "slug": "whole-cumin-seeds",
            "category": spices_cat,
            "brand": brand3,
            "price": 120.00,
            "oldPrice": 180.00,
            "badge": "33% Off",
            "rating": 4.7,
            "reviews": 58,
            "image": "images/products/cumin_seeds.svg",
            "description": "Clean, bold cumin seeds with a strong, earthy aroma. Harvested from organic farms and thoroughly machine-cleaned. Releases a beautiful nutty fragrance when tempered in warm oil.",
            "specs": {
                "Weight": "200g",
                "Packaging": "Pouch",
                "Shelf Life": "12 Months"
            }
        },
        {
            "id": 17,
            "name": "Black Mustard Seeds (Rai)",
            "slug": "black-mustard-seeds",
            "category": spices_cat,
            "brand": brand1,
            "price": 40.00,
            "oldPrice": 60.00,
            "badge": "33% Off",
            "rating": 4.6,
            "reviews": 41,
            "image": "images/products/mustard_seeds.svg",
            "description": "Small, pungent black mustard seeds perfect for tempering (tadka) in South Indian dishes. Adds a nut-like flavor and popping texture to chutneys, dals, and pickles.",
            "specs": {
                "Weight": "200g",
                "Packaging": "Pouch",
                "Shelf Life": "12 Months"
            }
        },
        {
            "id": 18,
            "name": "Green Cardamom (Elaichi) - Bold",
            "slug": "green-cardamom-bold",
            "category": spices_cat,
            "brand": brand4,
            "price": 250.00,
            "oldPrice": 350.00,
            "badge": "28% Off",
            "rating": 4.9,
            "reviews": 73,
            "image": "images/products/cardamom.svg",
            "description": "Premium bold green cardamom pods harvested from the hills of Idukki, Kerala. Exceptionally aromatic, sweet, and spicy. Perfect for kheer, tea, and aromatic rice dishes.",
            "specs": {
                "Weight": "50g",
                "Packaging": "Ziploc Pouch",
                "Shelf Life": "12 Months",
                "Pod Size": "8mm Bold"
            }
        },
        {
            "id": 19,
            "name": "Organic Cloves (Laung)",
            "slug": "organic-cloves-laung",
            "category": spices_cat,
            "brand": brand3,
            "price": 150.00,
            "oldPrice": 200.00,
            "badge": "25% Off",
            "rating": 4.7,
            "reviews": 32,
            "image": "images/products/cloves.svg",
            "description": "Handpicked premium whole cloves from organic spice gardens. Intense aroma and warm, sweet-spicy flavor. A key ingredient in Garam Masala and chai spice blends.",
            "specs": {
                "Weight": "100g",
                "Packaging": "Pouch",
                "Shelf Life": "12 Months"
            }
        },

        # Millets
        {
            "id": 20,
            "name": "Organic Finger Millet (Ragi / Nachni)",
            "slug": "organic-finger-millet",
            "category": millets_cat,
            "brand": brand1,
            "price": 90.00,
            "oldPrice": 120.00,
            "badge": "25% Off",
            "rating": 4.8,
            "reviews": 44,
            "image": "images/products/ragi.svg",
            "description": "Sprouted finger millet (Ragi) grain, naturally gluten-free and packed with calcium, dietary fiber, and essential amino acids. Excellent for making nutritious baby food porridge, roti, and healthy dosa batter.",
            "specs": {
                "Weight": "500g",
                "Packaging": "Pouch",
                "Shelf Life": "9 Months"
            }
        },
        {
            "id": 21,
            "name": "Foxtail Millet Whole Grain (Kangni)",
            "slug": "foxtail-millet-whole-grain",
            "category": millets_cat,
            "brand": brand1,
            "price": 110.00,
            "oldPrice": 150.00,
            "badge": "26% Off",
            "rating": 4.6,
            "reviews": 28,
            "image": "images/products/foxtail_millet.svg",
            "description": "Unpolished whole grain foxtail millet, high in protein, iron, and dietary fiber with a low glycemic index. A perfect healthy replacement for white rice in dishes like khichdi, pulao, and upma.",
            "specs": {
                "Weight": "500g",
                "Packaging": "Pouch",
                "Shelf Life": "12 Months"
            }
        },
        {
            "id": 22,
            "name": "Pearl Millet Grain (Bajra)",
            "slug": "pearl-millet-grain",
            "category": millets_cat,
            "brand": brand1,
            "price": 80.00,
            "oldPrice": 100.00,
            "badge": "20% Off",
            "rating": 4.7,
            "reviews": 35,
            "image": "images/products/bajra.svg",
            "description": "Naturally cultivated whole pearl millet grains. Rich in iron, magnesium, and essential nutrients, ideal for making traditional warm winter bajra rotis, porridge, and healthy millet khichdi.",
            "specs": {
                "Weight": "500g",
                "Packaging": "Pouch",
                "Shelf Life": "9 Months"
            }
        },
        {
            "id": 23,
            "name": "Organic Little Millet (Kutki)",
            "slug": "organic-little-millet",
            "category": millets_cat,
            "brand": brand1,
            "price": 95.00,
            "oldPrice": 130.00,
            "badge": "26% Off",
            "rating": 4.8,
            "reviews": 22,
            "image": "images/products/little_millet.svg",
            "description": "Organic unpolished Little Millet grains. Highly nutritious, rich in antioxidants, and easy to digest. Ideal for making light and healthy millets upma, pongal, or kheer.",
            "specs": {
                "Weight": "500g",
                "Packaging": "Pouch",
                "Shelf Life": "12 Months"
            }
        },
        {
            "id": 24,
            "name": "Organic Kodo Millet (Kodra)",
            "slug": "organic-kodo-millet",
            "category": millets_cat,
            "brand": brand1,
            "price": 105.00,
            "oldPrice": 140.00,
            "badge": "25% Off",
            "rating": 4.7,
            "reviews": 29,
            "image": "images/products/kodo_millet.svg",
            "description": "Naturally grown Kodo Millet, a rich source of dietary fiber, iron, and vitamin B6. Great for blood sugar control and heart health. Cook it as a healthy pilaf or steam it like white rice.",
            "specs": {
                "Weight": "500g",
                "Packaging": "Pouch",
                "Shelf Life": "12 Months"
            }
        },
        {
            "id": 25,
            "name": "Organic Barnyard Millet (Sanwa)",
            "slug": "organic-barnyard-millet",
            "category": millets_cat,
            "brand": brand1,
            "price": 100.00,
            "oldPrice": 130.00,
            "badge": "23% Off",
            "rating": 4.6,
            "reviews": 31,
            "image": "images/products/barnyard_millet.svg",
            "description": "Pesticide-free Barnyard Millet grains. High in digestible protein and lowest in carbohydrates among millets. A popular grain for fasting (vrats) and making healthy idli/dosa batters.",
            "specs": {
                "Weight": "500g",
                "Packaging": "Pouch",
                "Shelf Life": "9 Months"
            }
        },
        {
            "id": 26,
            "name": "Organic Browntop Millet (Korale)",
            "slug": "organic-browntop-millet",
            "category": millets_cat,
            "brand": brand1,
            "price": 125.00,
            "oldPrice": 160.00,
            "badge": "21% Off",
            "rating": 4.9,
            "reviews": 17,
            "image": "images/products/browntop_millet.svg",
            "description": "Premium organic Browntop Millet. Highly rich in dietary fiber (around 12.5%), which helps in detoxifying the body. Extremely nutrient-dense, perfect for general well-being.",
            "specs": {
                "Weight": "500g",
                "Packaging": "Pouch",
                "Shelf Life": "9 Months"
            }
        },
        {
            "id": 27,
            "name": "Organic Sorghum / Great Millet (Jowar)",
            "slug": "organic-sorghum-great-millet-jowar",
            "category": millets_cat,
            "brand": brand1,
            "price": 85.00,
            "oldPrice": 110.00,
            "badge": "22% Off",
            "rating": 4.8,
            "reviews": 56,
            "image": "images/products/sorghum.svg",
            "description": "Sustainably grown whole Sorghum (Jowar) grains. Gluten-free, rich in iron, protein, and copper. Excellent for grinding into fresh Jowar flour to make soft, healthy rotis (bhakri) and porridge.",
            "specs": {
                "Weight": "500g",
                "Packaging": "Pouch",
                "Shelf Life": "12 Months"
            }
        }
    ]

    for prod_info in products_data:
        Product.objects.create(
            id=prod_info["id"],
            name=prod_info["name"],
            slug=prod_info["slug"],
            category=prod_info["category"],
            brand=prod_info["brand"],
            price=prod_info["price"],
            oldPrice=prod_info["oldPrice"],
            badge=prod_info["badge"],
            rating=prod_info["rating"],
            reviews=prod_info["reviews"],
            image=prod_info["image"],
            description=prod_info["description"],
            specs=prod_info["specs"]
        )

    print(f"Successfully seeded database with {Product.objects.count()} products, {Category.objects.count()} categories, and {Brand.objects.count()} brands.")

if __name__ == '__main__':
    import sys
    if '--force' in sys.argv or Product.objects.count() == 0:
        seed_db()
    else:
        print("Database already contains product data. Skipping seed. (Use --force to reset)")
