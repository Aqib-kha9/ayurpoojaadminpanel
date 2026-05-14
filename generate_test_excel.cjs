const xlsx = require('xlsx');

// Mock Category ID. In a real scenario, use an existing one from the DB.
// Since you have the platform running, we will put a placeholder, but we recommend you to copy a real Category ID from your Admin Panel Categories section.
const categoryId = "4011920f-5235-45b3-aafb-a4b074f3caa1"; 

const headers = [
  "Category ID", "Type", "SKU", "Name (EN)", "Name (HI)", "Name (TE)",
  "Brand (EN)", "Brand (HI)", "Brand (TE)", "Description (EN)", "Description (HI)", "Description (TE)",
  "Price", "MRP", "Stock", "Unit", "Status",
  "Badge (EN)", "Badge (HI)", "Badge (TE)",
  "Tags (EN)", "Tags (HI)", "Tags (TE)",
  "Rating", "Reviews Count", "Is Returnable", "Is COD Allowed", "Is Cancelable",
  "Discount Amount", "Discount Type", "Tax Amount", "Tax Type",
  "Shipping Cost", "Shipping Weight", "Shipping Length", "Shipping Width", "Shipping Height",
  "Total Allowed Quantity",
  "Manufacturer (EN)", "Manufacturer (HI)", "Manufacturer (TE)",
  "Made In (EN)", "Made In (HI)", "Made In (TE)",
  "FSSAI",
  "SEO Title (EN)", "SEO Title (HI)", "SEO Title (TE)",
  "SEO Desc (EN)", "SEO Desc (HI)", "SEO Desc (TE)",
  "SEO Index", "SEO NoIndex", "SEO NoFollow", "SEO NoArchive", "SEO NoSnippet", "SEO NoImageIndex",
  "SEO Max Snippet", "SEO Max Video Preview", "SEO Max Image Preview",
  "Dietary Preference",
  "Shelf Life (EN)", "Shelf Life (HI)", "Shelf Life (TE)",
  "Ingredients (EN)", "Ingredients (HI)", "Ingredients (TE)",
  "Allergy Info (EN)", "Allergy Info (HI)", "Allergy Info (TE)",
  "HSN Code", "Barcode",
  "Pack Type (EN)", "Pack Type (HI)", "Pack Type (TE)",
  "Pack Of",
  "Images URLs (comma separated)"
];

const row1 = [
  categoryId, "STANDARD", "SKU-TEST-001", "Premium Almonds", "प्रीमियम बादाम", "ప్రీమియం బాదం",
  "NutriBest", "न्यूट्रीबेस्ट", "న్యూట్రీబెస్ట్", "High-quality premium California almonds.", "उच्च गुणवत्ता वाले प्रीमियम कैलिफोर्निया बादाम।", "అధిక నాణ్యత గల ప్రీమియం కాలిఫోర్నియా బాదం.",
  "450", "500", "150", "500g", "ACTIVE",
  "Bestseller", "बेस्टसेलर", "బెస్ట్ సెల్లర్",
  "nuts, healthy, snack", "नट्स, स्वस्थ, नाश्ता", "గింజలు, ఆరోగ్యకరమైనవి",
  "4.8", "125", "true", "true", "true",
  "10", "Percentage", "5", "inclusive",
  "0", "0.5", "15", "10", "5",
  "5",
  "Nutri Co", "न्यूट्री कंपनी", "న్యూట్రీ కో",
  "USA", "अमेरिका", "అమెరికా",
  "FSSAI-001234",
  "Buy Premium Almonds Online", "प्रीमियम बादाम ऑनलाइन खरीदें", "ప్రీమియం బాదం ఆన్‌లైన్‌లో కొనుగోలు చేయండి",
  "Best California almonds for a healthy diet.", "स्वस्थ आहार के लिए सर्वोत्तम कैलिफ़ोर्निया बादाम।", "ఆరోగ్యకరమైన ఆహారం కోసం ఉత్తమ కాలిఫోర్నియా బాదం.",
  "true", "false", "false", "false", "false", "false",
  "-1", "-1", "large",
  "veg",
  "12 months", "12 महीने", "12 నెలలు",
  "Almonds", "बादाम", "బాదం",
  "Contains nuts", "नट्स शामिल हैं", "గింజలు ఉన్నాయి",
  "08021200", "890123456001",
  "Pouch", "पाउच", "పౌచ్",
  "1",
  "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=800"
];

const row2 = [
  categoryId, "STANDARD", "SKU-TEST-002", "Organic Green Tea", "ऑर्गेनिक ग्रीन टी", "ఆర్గానిక్ గ్రీన్ టీ",
  "NatureSip", "नेचरसिप", "నేచర్ సిప్", "Refreshing organic green tea leaves.", "ताज़ा ऑर्गेनिक ग्रीन टी की पत्तियां।", "రిఫ్రెష్ ఆర్గానిక్ గ్రీన్ టీ ఆకులు.",
  "250", "300", "200", "250g", "ACTIVE",
  "Organic", "ऑर्गेनिक", "ఆర్గానిక్",
  "tea, green tea, healthy drink", "चाय, ग्रीन टी, स्वस्थ पेय", "టీ, గ్రీన్ టీ, ఆరోగ్యకరమైన పానీయం",
  "4.5", "89", "true", "true", "true",
  "50", "Flat", "5", "inclusive",
  "0", "0.3", "12", "8", "8",
  "10",
  "Sip & Co", "सिप कंपनी", "సిప్ కో",
  "India", "भारत", "భారతదేశం",
  "FSSAI-005566",
  "Organic Green Tea 250g", "ऑर्गेनिक ग्रीन टी 250g", "ఆర్గానిక్ గ్రీన్ టీ 250g",
  "Boost your immunity with our organic green tea.", "हमारी ऑर्गेनिक ग्रीन टी से अपनी रोग प्रतिरोधक क्षमता बढ़ाएं।", "మా ఆర్గానిక్ గ్రీన్ టీతో మీ రోగనిరోధక శక్తిని పెంచుకోండి.",
  "true", "false", "false", "false", "false", "false",
  "-1", "-1", "large",
  "veg",
  "24 months", "24 महीने", "24 నెలలు",
  "Green Tea Leaves", "ग्रीन टी की पत्तियां", "గ్రీన్ టీ ఆకులు",
  "None", "कोई नहीं", "ఏమీ లేదు",
  "09021020", "890123456002",
  "Box", "डिब्बा", "పెట్టె",
  "1",
  "https://images.unsplash.com/photo-1627492276010-b53c6130ebbe?auto=format&fit=crop&q=80&w=800"
];

const data = [headers, row1, row2];

const worksheet = xlsx.utils.aoa_to_sheet(data);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, "Products");

xlsx.writeFile(workbook, "sample_products_test.xlsx");
console.log("Successfully created sample_products_test.xlsx in the current directory.");
