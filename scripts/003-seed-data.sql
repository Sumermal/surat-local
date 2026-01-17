-- Seed Areas (Surat localities)
INSERT INTO areas (name, name_hi, slug, description, description_hi) VALUES
  ('Dindoli', 'डिंडोली', 'dindoli', 'A rapidly developing residential area in South Surat with modern amenities', 'दक्षिण सूरत में आधुनिक सुविधाओं के साथ तेजी से विकसित होता आवासीय क्षेत्र'),
  ('Adajan', 'अडाजन', 'adajan', 'One of the most upscale and well-planned areas of Surat with excellent infrastructure', 'उत्कृष्ट बुनियादी ढांचे के साथ सूरत के सबसे समृद्ध और सुनियोजित क्षेत्रों में से एक'),
  ('Varachha', 'वराछा', 'varachha', 'A bustling commercial and residential hub known for its diamond industry', 'हीरा उद्योग के लिए प्रसिद्ध एक व्यस्त वाणिज्यिक और आवासीय केंद्र'),
  ('Katargam', 'कटारगाम', 'katargam', 'A thriving industrial and residential area in central Surat', 'मध्य सूरत में एक समृद्ध औद्योगिक और आवासीय क्षेत्र'),
  ('Udhna', 'उधना', 'udhna', 'Major industrial zone and railway junction with diverse commercial activities', 'विविध वाणिज्यिक गतिविधियों के साथ प्रमुख औद्योगिक क्षेत्र और रेलवे जंक्शन'),
  ('Limbayat', 'लिंबायत', 'limbayat', 'A growing residential area with good connectivity to major parts of the city', 'शहर के प्रमुख हिस्सों से अच्छी कनेक्टिविटी के साथ एक बढ़ता आवासीय क्षेत्र'),
  ('Vesu', 'वेसु', 'vesu', 'Premium residential locality known for its waterfront and modern apartments', 'वाटरफ्रंट और आधुनिक अपार्टमेंट के लिए प्रसिद्ध प्रीमियम आवासीय इलाका'),
  ('Piplod', 'पीपलोद', 'piplod', 'Elite neighborhood with upscale residences and proximity to VIP Road', 'वीआईपी रोड के निकट उच्च श्रेणी के आवासों के साथ एलीट पड़ोस'),
  ('City Light', 'सिटी लाइट', 'city-light', 'Vibrant area with shopping complexes, eateries, and entertainment options', 'शॉपिंग कॉम्प्लेक्स, भोजनालयों और मनोरंजन विकल्पों के साथ जीवंत क्षेत्र'),
  ('Athwa', 'अठवा', 'athwa', 'Heritage area with a blend of old charm and modern development', 'पुराने आकर्षण और आधुनिक विकास के मिश्रण के साथ विरासत क्षेत्र')
ON CONFLICT (slug) DO NOTHING;

-- Seed Categories
INSERT INTO categories (name, name_hi, slug, description, description_hi, icon, color) VALUES
  ('Emergency Services', 'आपातकालीन सेवाएं', 'emergency', 'Police, Fire, Ambulance and other emergency contacts', 'पुलिस, अग्निशमन, एम्बुलेंस और अन्य आपातकालीन संपर्क', 'siren', 'red'),
  ('Hospitals & Clinics', 'अस्पताल और क्लिनिक', 'hospitals', 'Healthcare facilities including hospitals, clinics, and diagnostic centers', 'अस्पतालों, क्लीनिकों और नैदानिक केंद्रों सहित स्वास्थ्य सुविधाएं', 'hospital', 'blue'),
  ('Government Offices', 'सरकारी कार्यालय', 'government', 'Municipal, state, and central government offices', 'नगरपालिका, राज्य और केंद्र सरकार के कार्यालय', 'landmark', 'gray'),
  ('Education', 'शिक्षा', 'education', 'Schools, colleges, coaching centers, and libraries', 'स्कूल, कॉलेज, कोचिंग सेंटर और पुस्तकालय', 'graduation-cap', 'green'),
  ('Transport', 'परिवहन', 'transport', 'Bus stations, railway stations, auto stands, and travel agencies', 'बस स्टेशन, रेलवे स्टेशन, ऑटो स्टैंड और ट्रैवल एजेंसियां', 'bus', 'orange'),
  ('Banking & Finance', 'बैंकिंग और वित्त', 'banking', 'Banks, ATMs, and financial services', 'बैंक, एटीएम और वित्तीय सेवाएं', 'building-2', 'emerald'),
  ('Restaurants & Food', 'रेस्टोरेंट और भोजन', 'restaurants', 'Restaurants, cafes, street food, and catering services', 'रेस्टोरेंट, कैफे, स्ट्रीट फूड और कैटरिंग सेवाएं', 'utensils', 'amber'),
  ('Shopping', 'खरीदारी', 'shopping', 'Malls, markets, and retail stores', 'मॉल, बाजार और खुदरा दुकानें', 'shopping-bag', 'pink'),
  ('Home Services', 'घरेलू सेवाएं', 'home-services', 'Plumbers, electricians, carpenters, and other home service providers', 'प्लंबर, इलेक्ट्रीशियन, बढ़ई और अन्य घरेलू सेवा प्रदाता', 'wrench', 'cyan'),
  ('Entertainment', 'मनोरंजन', 'entertainment', 'Cinemas, parks, sports facilities, and recreation centers', 'सिनेमा, पार्क, खेल सुविधाएं और मनोरंजन केंद्र', 'clapperboard', 'indigo')
ON CONFLICT (slug) DO NOTHING;

-- Seed sample listings
-- Get area and category IDs for reference
WITH area_ids AS (
  SELECT id, slug FROM areas
),
category_ids AS (
  SELECT id, slug FROM categories
)
INSERT INTO listings (area_id, category_id, name, name_hi, slug, description, description_hi, address, address_hi, phone, opening_hours, is_verified, is_featured, status)
SELECT 
  a.id,
  c.id,
  l.name,
  l.name_hi,
  l.slug,
  l.description,
  l.description_hi,
  l.address,
  l.address_hi,
  l.phone,
  l.opening_hours,
  l.is_verified,
  l.is_featured,
  'active'
FROM (VALUES
  -- Dindoli Hospitals
  ('dindoli', 'hospitals', 'Dindoli Civil Hospital', 'डिंडोली सिविल अस्पताल', 'dindoli-civil-hospital', 
   'Government hospital providing comprehensive healthcare services to Dindoli residents', 
   'डिंडोली निवासियों को व्यापक स्वास्थ्य सेवाएं प्रदान करने वाला सरकारी अस्पताल',
   'Near Dindoli BRTS Station, Dindoli, Surat - 394210', 
   'डिंडोली बीआरटीएस स्टेशन के पास, डिंडोली, सूरत - 394210',
   '0261-2555555', '24 Hours', true, true),
  ('dindoli', 'hospitals', 'Shree Krishna Hospital', 'श्री कृष्णा अस्पताल', 'shree-krishna-hospital',
   'Multi-specialty private hospital with modern facilities and experienced doctors',
   'आधुनिक सुविधाओं और अनुभवी डॉक्टरों के साथ मल्टी-स्पेशियलिटी प्राइवेट अस्पताल',
   'VIP Road, Dindoli, Surat - 394210',
   'वीआईपी रोड, डिंडोली, सूरत - 394210',
   '0261-2556666', '24 Hours', true, false),
  
  -- Adajan Hospitals
  ('adajan', 'hospitals', 'KIMS Hospital', 'किम्स अस्पताल', 'kims-hospital-adajan',
   'Leading multi-specialty hospital with state-of-the-art medical equipment',
   'अत्याधुनिक चिकित्सा उपकरणों के साथ अग्रणी मल्टी-स्पेशियलिटी अस्पताल',
   'Adajan Patiya, Adajan, Surat - 395009',
   'अडाजन पटिया, अडाजन, सूरत - 395009',
   '0261-2789999', '24 Hours', true, true),
  
  -- Emergency Services
  ('varachha', 'emergency', 'Varachha Police Station', 'वराछा पुलिस स्टेशन', 'varachha-police-station',
   'Main police station serving Varachha area with 24/7 emergency response',
   'वराछा क्षेत्र की सेवा करने वाला मुख्य पुलिस स्टेशन जिसमें 24/7 आपातकालीन प्रतिक्रिया है',
   'Main Road, Varachha, Surat - 395006',
   'मुख्य सड़क, वराछा, सूरत - 395006',
   '100', '24 Hours', true, false),
  ('adajan', 'emergency', 'Fire Station Adajan', 'अग्निशमन केंद्र अडाजन', 'fire-station-adajan',
   'Fire and rescue services for Adajan and surrounding areas',
   'अडाजन और आसपास के क्षेत्रों के लिए अग्निशमन और बचाव सेवाएं',
   'Near Adajan BRTS, Adajan, Surat - 395009',
   'अडाजन बीआरटीएस के पास, अडाजन, सूरत - 395009',
   '101', '24 Hours', true, false),
  
  -- Government Offices
  ('athwa', 'government', 'Surat Municipal Corporation', 'सूरत नगर निगम', 'smc-main-office',
   'Main administrative office of Surat Municipal Corporation',
   'सूरत नगर निगम का मुख्य प्रशासनिक कार्यालय',
   'Muglisara, Athwa, Surat - 395003',
   'मुगलीसरा, अठवा, सूरत - 395003',
   '0261-2423351', 'Mon-Sat: 10:30 AM - 6:10 PM', true, true),
  ('udhna', 'government', 'RTO Udhna', 'आरटीओ उधना', 'rto-udhna',
   'Regional Transport Office for vehicle registration and licensing',
   'वाहन पंजीकरण और लाइसेंसिंग के लिए क्षेत्रीय परिवहन कार्यालय',
   'Udhna Darwaja, Udhna, Surat - 394210',
   'उधना दरवाजा, उधना, सूरत - 394210',
   '0261-2277333', 'Mon-Sat: 10:00 AM - 5:00 PM', true, false),
  
  -- Education
  ('vesu', 'education', 'Sardar Vallabhbhai National Institute of Technology', 'एसवीएनआईटी सूरत', 'svnit-surat',
   'Premier engineering institution of national importance',
   'राष्ट्रीय महत्व की प्रमुख इंजीनियरिंग संस्था',
   'Ichchhanath, Vesu, Surat - 395007',
   'इच्छानाथ, वेसु, सूरत - 395007',
   '0261-2201000', 'Mon-Sat: 9:00 AM - 5:00 PM', true, true),
  ('piplod', 'education', 'Delhi Public School Surat', 'दिल्ली पब्लिक स्कूल सूरत', 'dps-surat',
   'CBSE affiliated school providing quality education from pre-primary to senior secondary',
   'प्री-प्राइमरी से सीनियर सेकेंडरी तक गुणवत्तापूर्ण शिक्षा प्रदान करने वाला सीबीएसई संबद्ध स्कूल',
   'VIP Road, Piplod, Surat - 395007',
   'वीआईपी रोड, पीपलोद, सूरत - 395007',
   '0261-2255000', 'Mon-Sat: 8:00 AM - 3:00 PM', true, false),
  
  -- Transport
  ('udhna', 'transport', 'Surat Railway Station', 'सूरत रेलवे स्टेशन', 'surat-railway-station',
   'Main railway station of Surat connecting to major cities across India',
   'भारत भर के प्रमुख शहरों से जुड़ने वाला सूरत का मुख्य रेलवे स्टेशन',
   'Station Road, Udhna, Surat - 395003',
   'स्टेशन रोड, उधना, सूरत - 395003',
   '139', '24 Hours', true, true),
  ('katargam', 'transport', 'Katargam BRTS Station', 'कटारगाम बीआरटीएस स्टेशन', 'katargam-brts',
   'Bus Rapid Transit System station with connections across the city',
   'शहर भर में कनेक्शन के साथ बस रैपिड ट्रांजिट सिस्टम स्टेशन',
   'Ring Road, Katargam, Surat - 395004',
   'रिंग रोड, कटारगाम, सूरत - 395004',
   '0261-2345678', '6:00 AM - 10:00 PM', true, false),
  
  -- Restaurants
  ('city-light', 'restaurants', 'Havmor Restaurant', 'हवमोर रेस्टोरेंट', 'havmor-city-light',
   'Popular family restaurant known for ice creams and Gujarati thali',
   'आइसक्रीम और गुजराती थाली के लिए प्रसिद्ध लोकप्रिय फैमिली रेस्टोरेंट',
   'City Light Road, Surat - 395007',
   'सिटी लाइट रोड, सूरत - 395007',
   '0261-2788888', '11:00 AM - 11:00 PM', true, true),
  ('varachha', 'restaurants', 'Honest Restaurant', 'ऑनेस्ट रेस्टोरेंट', 'honest-varachha',
   'Famous vegetarian restaurant chain serving authentic Gujarati and North Indian cuisine',
   'प्रामाणिक गुजराती और उत्तर भारतीय व्यंजन परोसने वाली प्रसिद्ध शाकाहारी रेस्टोरेंट श्रृंखला',
   'Varachha Main Road, Surat - 395006',
   'वराछा मुख्य सड़क, सूरत - 395006',
   '0261-2555888', '10:00 AM - 10:30 PM', true, false),
  
  -- Shopping
  ('adajan', 'shopping', 'VR Surat Mall', 'वीआर सूरत मॉल', 'vr-surat-mall',
   'Premium shopping destination with international and national brands',
   'अंतरराष्ट्रीय और राष्ट्रीय ब्रांडों के साथ प्रीमियम शॉपिंग डेस्टिनेशन',
   'Dumas Road, Adajan, Surat - 395009',
   'डुमस रोड, अडाजन, सूरत - 395009',
   '0261-2999999', '10:00 AM - 10:00 PM', true, true),
  ('limbayat', 'shopping', 'Sahara Darwaja Market', 'सहारा दरवाजा मार्केट', 'sahara-darwaja-market',
   'Traditional market known for textiles, sarees, and ethnic wear',
   'कपड़ा, साड़ी और एथनिक वियर के लिए प्रसिद्ध पारंपरिक बाजार',
   'Sahara Darwaja, Limbayat, Surat - 395001',
   'सहारा दरवाजा, लिंबायत, सूरत - 395001',
   'N/A', '10:00 AM - 9:00 PM', true, false),
  
  -- Banking
  ('piplod', 'banking', 'State Bank of India - Piplod', 'भारतीय स्टेट बैंक - पीपलोद', 'sbi-piplod',
   'Full-service SBI branch with ATM, locker, and all banking services',
   'एटीएम, लॉकर और सभी बैंकिंग सेवाओं के साथ पूर्ण-सेवा एसबीआई शाखा',
   'VIP Road, Piplod, Surat - 395007',
   'वीआईपी रोड, पीपलोद, सूरत - 395007',
   '0261-2258000', 'Mon-Sat: 10:00 AM - 4:00 PM', true, false),
  
  -- Home Services
  ('dindoli', 'home-services', 'Quick Fix Plumbing Services', 'क्विक फिक्स प्लंबिंग सर्विसेज', 'quick-fix-plumbing-dindoli',
   'Professional plumbing services for residential and commercial properties',
   'आवासीय और वाणिज्यिक संपत्तियों के लिए पेशेवर प्लंबिंग सेवाएं',
   'Dindoli, Surat - 394210',
   'डिंडोली, सूरत - 394210',
   '9876543210', '8:00 AM - 8:00 PM', false, false),
  
  -- Entertainment
  ('vesu', 'entertainment', 'Rahul Raj Mall Cinemas', 'राहुल राज मॉल सिनेमाज', 'rahul-raj-cinemas',
   'Multiplex cinema with latest Bollywood and Hollywood releases',
   'नवीनतम बॉलीवुड और हॉलीवुड रिलीज के साथ मल्टीप्लेक्स सिनेमा',
   'Vesu Cross Road, Vesu, Surat - 395007',
   'वेसु क्रॉस रोड, वेसु, सूरत - 395007',
   '0261-2788000', '9:00 AM - 12:00 AM', true, true)
) AS l(area_slug, category_slug, name, name_hi, slug, description, description_hi, address, address_hi, phone, opening_hours, is_verified, is_featured)
JOIN area_ids a ON a.slug = l.area_slug
JOIN category_ids c ON c.slug = l.category_slug
ON CONFLICT DO NOTHING;
