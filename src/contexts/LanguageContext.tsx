import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'gu' | 'kn' | 'ml' | 'mr' | 'pa';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    backToHome: "Back to Home",
    eServicePortal: "E-Service Portal",
    browseServices: "Browse Available Services",
    login: "Login",
    registerToApply: "Register to Apply",
    
    // Page Title
    gramPanchayatServices: "Gram Panchayat Services",
    serviceDescription: "Explore our comprehensive digital services. Register and login to submit applications and track your progress online.",
    
    // Search and Filter
    searchPlaceholder: "Search services by name or description...",
    allCategories: "All Categories",
    servicesAvailable: "services available",
    freeProcessing: "Free Processing",
    
    // Service Details
    timeRequired: "Time Required:",
    fees: "Fees:",
    free: "Free",
    requiredDocuments: "Required Documents:",
    more: "more",
    govOffice: "Government Office",
    applyNow: "Apply Now",
    
    // Categories
    certificates: "Certificates",
    licenses: "Licenses", 
    permits: "Permits",
    payments: "Payments",
    utilities: "Utilities",
    
    // No Results
    noServicesFound: "No Services Found",
    adjustCriteria: "Please adjust your search criteria or browse all categories.",
    clearFilters: "Clear Filters",
    
    // Bottom Section
    readyToStart: "Ready to Get Started?",
    createAccountDesc: "Create an account to submit applications, track progress, and access all Gram Panchayat services online.",
    createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account? Sign in",
    
    // Language Selector
    selectLanguage: "Select Language",
    changeLanguage: "Change Language"
  },
  hi: {
    // Header
    backToHome: "मुखपृष्ठ पर वापस जाएं",
    eServicePortal: "ई-सेवा पोर्टल",
    browseServices: "उपलब्ध सेवाएं ब्राउज़ करें",
    login: "लॉगिन करें",
    registerToApply: "आवेदन के लिए पंजीकरण करें",
    
    // Page Title
    gramPanchayatServices: "ग्राम पंचायत सेवाएं",
    serviceDescription: "हमारी व्यापक डिजिटल सेवाओं का अन्वेषण करें। आवेदन जमा करने और अपनी प्रगति को ऑनलाइन ट्रैक करने के लिए पंजीकरण करें और लॉगिन करें।",
    
    // Search and Filter
    searchPlaceholder: "सेवाओं को नाम या विवरण से खोजें...",
    allCategories: "सभी श्रेणियां",
    servicesAvailable: "सेवाएं उपलब्ध",
    freeProcessing: "निःशुल्क प्रसंस्करण",
    
    // Service Details
    timeRequired: "समय अवधि:",
    fees: "शुल्क:",
    free: "निःशुल्क",
    requiredDocuments: "आवश्यक दस्तावेज़:",
    more: "और",
    govOffice: "ग्राम पंचायत कार्यालय",
    applyNow: "आवेदन करें",
    
    // Categories
    certificates: "प्रमाण पत्र",
    licenses: "लाइसेंस",
    permits: "अनुमति",
    payments: "भुगतान",
    utilities: "उपयोगिता",
    
    // No Results
    noServicesFound: "कोई सेवा नहीं मिली",
    adjustCriteria: "कृपया अपने खोज मानदंड को समायोजित करें या सभी श्रेणियों को ब्राउज़ करें।",
    clearFilters: "फिल्टर साफ़ करें",
    
    // Bottom Section
    readyToStart: "शुरू करने के लिए तैयार हैं?",
    createAccountDesc: "आवेदन जमा करने, प्रगति को ट्रैक करने और सभी ग्राम पंचायत सेवाओं तक ऑनलाइन पहुंच के लिए एक खाता बनाएं।",
    createAccount: "खाता बनाएं",
    alreadyHaveAccount: "पहले से खाता है? साइन इन करें",
    
    // Language Selector
    selectLanguage: "भाषा चुनें",
    changeLanguage: "भाषा बदलें"
  },
  bn: {
    // Header
    backToHome: "হোমে ফিরে যান",
    eServicePortal: "ই-সেবা পোর্টাল",
    browseServices: "উপলব্ধ সেবা ব্রাউজ করুন",
    login: "লগইন",
    registerToApply: "আবেদনের জন্য নিবন্ধন করুন",
    
    // Page Title
    gramPanchayatServices: "গ্রাম পঞ্চায়েত সেবা",
    serviceDescription: "আমাদের ব্যাপক ডিজিটাল সেবাসমূহ অন্বেষণ করুন। আবেদন জমা দিতে এবং অনলাইনে আপনার অগ্রগতি ট্র্যাক করতে নিবন্ধন করুন এবং লগইন করুন।",
    
    // Search and Filter
    searchPlaceholder: "নাম বা বিবরণ দিয়ে সেবা খুঁজুন...",
    allCategories: "সব বিভাগ",
    servicesAvailable: "সেবা উপলব্ধ",
    freeProcessing: "বিনামূল্যে প্রক্রিয়াকরণ",
    
    // Service Details
    timeRequired: "প্রয়োজনীয় সময়:",
    fees: "ফি:",
    free: "বিনামূল্যে",
    requiredDocuments: "প্রয়োজনীয় কাগজপত্র:",
    more: "আরো",
    govOffice: "সরকারি অফিস",
    applyNow: "এখনই আবেদন করুন",
    
    // Categories
    certificates: "সার্টিফিকেট",
    licenses: "লাইসেন্স",
    permits: "অনুমতি",
    payments: "পেমেন্ট",
    utilities: "ইউটিলিটি",
    
    // No Results
    noServicesFound: "কোন সেবা পাওয়া যায়নি",
    adjustCriteria: "অনুগ্রহ করে আপনার অনুসন্ধানের মানদণ্ড সামঞ্জস্য করুন বা সব বিভাগ ব্রাউজ করুন।",
    clearFilters: "ফিল্টার সাফ করুন",
    
    // Bottom Section
    readyToStart: "শুরু করতে প্রস্তুত?",
    createAccountDesc: "আবেদন জমা দিতে, অগ্রগতি ট্র্যাক করতে এবং সব গ্রাম পঞ্চায়েত সেবা অনলাইনে অ্যাক্সেস করতে একটি অ্যাকাউন্ট তৈরি করুন।",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন",
    
    // Language Selector
    selectLanguage: "ভাষা নির্বাচন করুন",
    changeLanguage: "ভাষা পরিবর্তন করুন"
  },
  ta: {
    // Header
    backToHome: "முகப்புக்கு திரும்பு",
    eServicePortal: "இ-சேவை போர்டல்",
    browseServices: "கிடைக்கும் சேவைகளை உலாவுக",
    login: "உள்நுழைய",
    registerToApply: "விண்ணப்பிக்க பதிவு செய்யுங்கள்",
    
    // Page Title
    gramPanchayatServices: "கிராம பஞ்சாயத்து சேவைகள்",
    serviceDescription: "எங்கள் விரிவான டிஜிட்டல் சேவைகளை ஆராயுங்கள். விண்ணப்பங்களை சமர்ப்பிக்க மற்றும் உங்கள் முன்னேற்றத்தை ஆன்லைனில் கண்காணிக்க பதிவு செய்து உள்நுழையுங்கள்.",
    
    // Search and Filter
    searchPlaceholder: "பெயர் அல்லது விவரத்தால் சேவைகளை தேடுங்கள்...",
    allCategories: "அனைத்து வகைகள்",
    servicesAvailable: "சேவைகள் கிடைக்கின்றன",
    freeProcessing: "இலவச செயலாக்கம்",
    
    // Service Details
    timeRequired: "தேவையான நேரம்:",
    fees: "கட்டணம்:",
    free: "இலவசம்",
    requiredDocuments: "தேவையான ஆவணங்கள்:",
    more: "மேலும்",
    govOffice: "அரசு அலுவலகம்",
    applyNow: "இப்போது விண்ணப்பிக்கவும்",
    
    // Categories
    certificates: "சான்றிதழ்கள்",
    licenses: "உரிமங்கள்",
    permits: "அனுமதிகள்",
    payments: "கட்டணங்கள்",
    utilities: "பயன்பாடுகள்",
    
    // No Results
    noServicesFound: "சேவைகள் எதுவும் கிடைக்கவில்லை",
    adjustCriteria: "தயவுசெய்து உங்கள் தேடல் அளவுகோல்களை சரிசெய்யவும் அல்லது அனைத்து வகைகளையும் உலாவவும்.",
    clearFilters: "வடிகட்டிகளை அழி",
    
    // Bottom Section
    readyToStart: "தொடங்க தயாரா?",
    createAccountDesc: "விண்ணப்பங்களை சமர்ப்பிக்க, முன்னேற்றத்தை கண்காணிக்க மற்றும் அனைத்து கிராம பஞ்சாயத்து சேவைகளை ஆன்லைனில் அணுக ஒரு கணக்கை உருவாக்கவும்.",
    createAccount: "கணக்கை உருவாக்கவும்",
    alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்",
    
    // Language Selector
    selectLanguage: "மொழியை தேர்ந்தெடுக்கவும்",
    changeLanguage: "மொழியை மாற்றவும்"
  },
  te: {
    // Header
    backToHome: "హోమ్‌కు తిరిగి వెళ్లండి",
    eServicePortal: "ఇ-సేవా పోర్టల్",
    browseServices: "అందుబాటులో ఉన్న సేవలను బ్రౌజ్ చేయండి",
    login: "లాగిన్",
    registerToApply: "దరఖాస్తు కోసం రిజిస్టర్ చేయండి",
    
    // Page Title
    gramPanchayatServices: "గ్రామ పంచాయతీ సేవలు",
    serviceDescription: "మా విస్తృత డిజిటల్ సేవలను అన్వేషించండి. దరఖాస్తులను సమర్పించడానికి మరియు మీ పురోగతిని ఆన్‌లైన్‌లో ట్రాక్ చేయడానికి రిజిస్టర్ చేసుకోండి మరియు లాగిన్ చేయండి.",
    
    // Search and Filter
    searchPlaceholder: "పేరు లేదా వివరణ ద్వారా సేవలను వెతకండి...",
    allCategories: "అన్ని వర్గాలు",
    servicesAvailable: "సేవలు అందుబాటులో ఉన్నాయి",
    freeProcessing: "ఉచిత ప్రాసెసింగ్",
    
    // Service Details
    timeRequired: "అవసరమైన సమయం:",
    fees: "రుసుము:",
    free: "ఉచితం",
    requiredDocuments: "అవసరమైన పత్రాలు:",
    more: "మరిన్ని",
    govOffice: "ప్రభుత్వ కార్యాలయం",
    applyNow: "ఇప్పుడే దరఖాస్తు చేయండి",
    
    // Categories
    certificates: "సర్టిఫికేట్లు",
    licenses: "లైసెన్సులు",
    permits: "అనుమతులు",
    payments: "చెల్లింపులు",
    utilities: "యుటిలిటీలు",
    
    // No Results
    noServicesFound: "సేవలు ఏవీ కనుగొనబడలేదు",
    adjustCriteria: "దయచేసి మీ శోధన ప్రమాణాలను సరిచేయండి లేదా అన్ని వర్గాలను బ్రౌజ్ చేయండి.",
    clearFilters: "ఫిల్టర్లను క్లియర్ చేయండి",
    
    // Bottom Section
    readyToStart: "ప్రారంభించడానికి సిద్ధంగా ఉన్నారా?",
    createAccountDesc: "దరఖాస్తులను సమర్పించడానికి, పురోగతిని ట్రాక్ చేయడానికి మరియు అన్ని గ్రామ పంచాయతీ సేవలను ఆన్‌లైన్‌లో యాక్సెస్ చేయడానికి ఖాతాను సృష్టించండి.",
    createAccount: "ఖాతాను సృష్టించండి",
    alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి",
    
    // Language Selector
    selectLanguage: "భాషను ఎంచుకోండి",
    changeLanguage: "భాషను మార్చండి"
  },
  gu: {
    // Header
    backToHome: "હોમ પર પાછા જાઓ",
    eServicePortal: "ઈ-સેવા પોર્ટલ",
    browseServices: "ઉપલબ્ધ સેવાઓ બ્રાઉઝ કરો",
    login: "લોગિન",
    registerToApply: "અરજી કરવા માટે નોંધણી કરો",
    
    // Page Title
    gramPanchayatServices: "ગ્રામ પંચાયત સેવાઓ",
    serviceDescription: "અમારી વ્યાપક ડિજિટલ સેવાઓની શોધ કરો. અરજીઓ સબમિટ કરવા અને તમારી પ્રગતિને ઓનલાઈન ટ્રેક કરવા માટે નોંધણી કરો અને લોગિન કરો.",
    
    // Search and Filter
    searchPlaceholder: "નામ અથવા વર્ણન દ્વારા સેવાઓ શોધો...",
    allCategories: "બધી શ્રેણીઓ",
    servicesAvailable: "સેવાઓ ઉપલબ્ધ",
    freeProcessing: "મફત પ્રોસેસિંગ",
    
    // Service Details
    timeRequired: "જરૂરી સમય:",
    fees: "ફીસ:",
    free: "મફત",
    requiredDocuments: "જરૂરી દસ્તાવેજો:",
    more: "વધુ",
    govOffice: "સરકારી કચેરી",
    applyNow: "હવે અરજી કરો",
    
    // Categories
    certificates: "પ્રમાણપત્રો",
    licenses: "લાઈસન્સ",
    permits: "પરમિટ",
    payments: "ચુકવણીઓ",
    utilities: "ઉપયોગિતાઓ",
    
    // No Results
    noServicesFound: "કોઈ સેવાઓ મળી નથી",
    adjustCriteria: "કૃપા કરીને તમારા શોધ માપદંડોને સમાયોજિત કરો અથવા બધી શ્રેણીઓ બ્રાઉઝ કરો.",
    clearFilters: "ફિલ્ટર ક્લિયર કરો",
    
    // Bottom Section
    readyToStart: "શરૂ કરવા માટે તૈયાર છો?",
    createAccountDesc: "અરજીઓ સબમિટ કરવા, પ્રગતિ ટ્રેક કરવા અને બધી ગ્રામ પંચાયત સેવાઓને ઓનલાઈન એક્સેસ કરવા માટે એક એકાઉન્ટ બનાવો.",
    createAccount: "એકાઉન્ટ બનાવો",
    alreadyHaveAccount: "પહેલેથી એકાઉન્ટ છે? સાઈન ઈન કરો",
    
    // Language Selector
    selectLanguage: "ભાષા પસંદ કરો",
    changeLanguage: "ભાષા બદલો"
  },
  kn: {
    // Header
    backToHome: "ಮನೆಗೆ ಹಿಂತಿರುಗಿ",
    eServicePortal: "ಇ-ಸೇವಾ ಪೋರ್ಟಲ್",
    browseServices: "ಲಭ್ಯವಿರುವ ಸೇವೆಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ",
    login: "ಲಾಗಿನ್",
    registerToApply: "ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ನೋಂದಣಿ ಮಾಡಿ",
    
    // Page Title
    gramPanchayatServices: "ಗ್ರಾಮ ಪಂಚಾಯತಿ ಸೇವೆಗಳು",
    serviceDescription: "ನಮ್ಮ ವ್ಯಾಪಕ ಡಿಜಿಟಲ್ ಸೇವೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ. ಅರ್ಜಿಗಳನ್ನು ಸಲ್ಲಿಸಲು ಮತ್ತು ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ನೋಂದಣಿ ಮಾಡಿ ಮತ್ತು ಲಾಗಿನ್ ಮಾಡಿ.",
    
    // Search and Filter
    searchPlaceholder: "ಹೆಸರು ಅಥವಾ ವಿವರಣೆಯಿಂದ ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ...",
    allCategories: "ಎಲ್ಲಾ ವರ್ಗಗಳು",
    servicesAvailable: "ಸೇವೆಗಳು ಲಭ್ಯವಿದೆ",
    freeProcessing: "ಉಚಿತ ಪ್ರಕ್ರಿಯೆ",
    
    // Service Details
    timeRequired: "ಅಗತ್ಯವಿರುವ ಸಮಯ:",
    fees: "ಶುಲ್ಕ:",
    free: "ಉಚಿತ",
    requiredDocuments: "ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು:",
    more: "ಹೆಚ್ಚು",
    govOffice: "ಸರ್ಕಾರಿ ಕಚೇರಿ",
    applyNow: "ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    
    // Categories
    certificates: "ಪ್ರಮಾಣಪತ್ರಗಳು",
    licenses: "ಪರವಾನಗಿಗಳು",
    permits: "ಅನುಮತಿಗಳು",
    payments: "ಪಾವತಿಗಳು",
    utilities: "ಉಪಯೋಗಿತೆಗಳು",
    
    // No Results
    noServicesFound: "ಯಾವ ಸೇವೆಗಳೂ ಸಿಗಲಿಲ್ಲ",
    adjustCriteria: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹುಡುಕಾಟ ಮಾನದಂಡಗಳನ್ನು ಸರಿಹೊಂದಿಸಿ ಅಥವಾ ಎಲ್ಲಾ ವರ್ಗಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ.",
    clearFilters: "ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ",
    
    // Bottom Section
    readyToStart: "ಪ್ರಾರಂಭಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
    createAccountDesc: "ಅರ್ಜಿಗಳನ್ನು ಸಲ್ಲಿಸಲು, ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಮತ್ತು ಎಲ್ಲಾ ಗ್ರಾಮ ಪಂಚಾಯತಿ ಸೇವೆಗಳನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಪ್ರವೇಶಿಸಲು ಖಾತೆಯನ್ನು ರಚಿಸಿ.",
    createAccount: "ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    alreadyHaveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಸೈನ್ ಇನ್ ಮಾಡಿ",
    
    // Language Selector
    selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    changeLanguage: "ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ"
  },
  ml: {
    // Header
    backToHome: "ഹോമിലേക്ക് മടങ്ങുക",
    eServicePortal: "ഇ-സേവന പോർട്ടൽ",
    browseServices: "ലഭ്യമായ സേവനങ്ങൾ ബ്രൗസ് ചെയ്യുക",
    login: "ലോഗിൻ",
    registerToApply: "അപേക്ഷിക്കാൻ രജിസ്റ്റർ ചെയ്യുക",
    
    // Page Title
    gramPanchayatServices: "ഗ്രാമ പഞ്ചായത്ത് സേവനങ്ങൾ",
    serviceDescription: "ഞങ്ങളുടെ വിപുലമായ ഡിജിറ്റൽ സേവനങ്ങൾ പര്യവേക്ഷണം ചെയ്യുക. അപേക്ഷകൾ സമർപ്പിക്കാനും നിങ്ങളുടെ പുരോഗതി ഓൺലൈനിൽ ട്രാക്ക് ചെയ്യാനും രജിസ്റ്റർ ചെയ്ത് ലോഗിൻ ചെയ്യുക.",
    
    // Search and Filter
    searchPlaceholder: "പേര് അല്ലെങ്കിൽ വിവരണം ഉപയോഗിച്ച് സേവനങ്ങൾ തിരയുക...",
    allCategories: "എല്ലാ വിഭാഗങ്ങളും",
    servicesAvailable: "സേവനങ്ങൾ ലഭ്യമാണ്",
    freeProcessing: "സൗജന്യ പ്രോസസ്സിംഗ്",
    
    // Service Details
    timeRequired: "ആവശ്യമായ സമയം:",
    fees: "ഫീസ്:",
    free: "സൗജന്യം",
    requiredDocuments: "ആവശ്യമായ രേഖകൾ:",
    more: "കൂടുതൽ",
    govOffice: "സർക്കാർ ഓഫീസ്",
    applyNow: "ഇപ്പോൾ അപേക്ഷിക്കുക",
    
    // Categories
    certificates: "സർട്ടിഫിക്കറ്റുകൾ",
    licenses: "ലൈസൻസുകൾ",
    permits: "അനുമതികൾ",
    payments: "പേയ്‌മെന്റുകൾ",
    utilities: "യൂട്ടിലിറ്റികൾ",
    
    // No Results
    noServicesFound: "സേവനങ്ങളൊന്നും കണ്ടെത്തിയില്ല",
    adjustCriteria: "ദയവായി നിങ്ങളുടെ തിരയൽ മാനദണ്ഡങ്ങൾ ക്രമീകരിക്കുക അല്ലെങ്കിൽ എല്ലാ വിഭാഗങ്ങളും ബ്രൗസ് ചെയ്യുക.",
    clearFilters: "ഫിൽട്ടറുകൾ മായ്ക്കുക",
    
    // Bottom Section
    readyToStart: "ആരംഭിക്കാൻ തയ്യാറാണോ?",
    createAccountDesc: "അപേക്ഷകൾ സമർപ്പിക്കാനും പുരോഗതി ട്രാക്ക് ചെയ്യാനും എല്ലാ ഗ്രാമ പഞ്ചായത്ത് സേവനങ്ങളും ഓൺലൈനിൽ ആക്സസ് ചെയ്യാനും ഒരു അക്കൗണ്ട് സൃഷ്ടിക്കുക.",
    createAccount: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    alreadyHaveAccount: "ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ? സൈൻ ഇൻ ചെയ്യുക",
    
    // Language Selector
    selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    changeLanguage: "ഭാഷ മാറ്റുക"
  },
  mr: {
    // Header
    backToHome: "होमवर परत जा",
    eServicePortal: "ई-सेवा पोर्टल",
    browseServices: "उपलब्ध सेवा ब्राउझ करा",
    login: "लॉगिन",
    registerToApply: "अर्ज करण्यासाठी नोंदणी करा",
    
    // Page Title
    gramPanchayatServices: "ग्राम पंचायत सेवा",
    serviceDescription: "आमच्या सर्वसमावेशक डिजिटल सेवांचा शोध घ्या. अर्ज सादर करण्यासाठी आणि तुमची प्रगती ऑनलाइन ट्रॅक करण्यासाठी नोंदणी करा आणि लॉगिन करा.",
    
    // Search and Filter
    searchPlaceholder: "नाव किंवा वर्णनानुसार सेवा शोधा...",
    allCategories: "सर्व श्रेणी",
    servicesAvailable: "सेवा उपलब्ध",
    freeProcessing: "मोफत प्रक्रिया",
    
    // Service Details
    timeRequired: "आवश्यक वेळ:",
    fees: "फी:",
    free: "मोफत",
    requiredDocuments: "आवश्यक कागदपत्रे:",
    more: "आणखी",
    govOffice: "सरकारी कार्यालय",
    applyNow: "आता अर्ज करा",
    
    // Categories
    certificates: "प्रमाणपत्रे",
    licenses: "परवाने",
    permits: "परमिट",
    payments: "पेमेंट",
    utilities: "युटिलिटी",
    
    // No Results
    noServicesFound: "कोणत्याही सेवा आढळल्या नाहीत",
    adjustCriteria: "कृपया तुमचे शोध निकष समायोजित करा किंवा सर्व श्रेणी ब्राउझ करा.",
    clearFilters: "फिल्टर साफ करा",
    
    // Bottom Section
    readyToStart: "सुरुवात करण्यास तयार आहात?",
    createAccountDesc: "अर्ज सादर करण्यासाठी, प्रगती ट्रॅक करण्यासाठी आणि सर्व ग्राम पंचायत सेवांना ऑनलाइन प्रवेश मिळवण्यासाठी खाते तयार करा.",
    createAccount: "खाते तयार करा",
    alreadyHaveAccount: "आधीपासूनच खाते आहे? साइन इन करा",
    
    // Language Selector
    selectLanguage: "भाषा निवडा",
    changeLanguage: "भाषा बदला"
  },
  pa: {
    // Header
    backToHome: "ਘਰ ਵਾਪਸ ਜਾਓ",
    eServicePortal: "ਈ-ਸੇਵਾ ਪੋਰਟਲ",
    browseServices: "ਉਪਲਬਧ ਸੇਵਾਵਾਂ ਬ੍ਰਾਊਜ਼ ਕਰੋ",
    login: "ਲਾਗਇਨ",
    registerToApply: "ਅਰਜ਼ੀ ਦੇਣ ਲਈ ਰਜਿਸਟਰ ਕਰੋ",
    
    // Page Title
    gramPanchayatServices: "ਗ੍ਰਾਮ ਪੰਚਾਇਤ ਸੇਵਾਵਾਂ",
    serviceDescription: "ਸਾਡੀਆਂ ਵਿਆਪਕ ਡਿਜੀਟਲ ਸੇਵਾਵਾਂ ਦੀ ਖੋਜ ਕਰੋ। ਅਰਜ਼ੀਆਂ ਜਮ੍ਹਾਂ ਕਰਨ ਅਤੇ ਤੁਹਾਡੀ ਪ੍ਰਗਤੀ ਨੂੰ ਔਨਲਾਈਨ ਟਰੈਕ ਕਰਨ ਲਈ ਰਜਿਸਟਰ ਕਰੋ ਅਤੇ ਲਾਗਇਨ ਕਰੋ।",
    
    // Search and Filter
    searchPlaceholder: "ਨਾਮ ਜਾਂ ਵਰਣਨ ਦੁਆਰਾ ਸੇਵਾਵਾਂ ਖੋਜੋ...",
    allCategories: "ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ",
    servicesAvailable: "ਸੇਵਾਵਾਂ ਉਪਲਬਧ",
    freeProcessing: "ਮੁਫਤ ਪ੍ਰਕਿਰਿਆ",
    
    // Service Details
    timeRequired: "ਲੋੜੀਂਦਾ ਸਮਾਂ:",
    fees: "ਫੀਸ:",
    free: "ਮੁਫਤ",
    requiredDocuments: "ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼:",
    more: "ਹੋਰ",
    govOffice: "ਸਰਕਾਰੀ ਦਫਤਰ",
    applyNow: "ਹੁਣੇ ਅਰਜ਼ੀ ਦਿਓ",
    
    // Categories
    certificates: "ਸਰਟੀਫਿਕੇਟ",
    licenses: "ਲਾਇਸੈਂਸ",
    permits: "ਪਰਮਿਟ",
    payments: "ਭੁਗਤਾਨ",
    utilities: "ਉਪਯੋਗਿਤਾਵਾਂ",
    
    // No Results
    noServicesFound: "ਕੋਈ ਸੇਵਾਵਾਂ ਨਹੀਂ ਮਿਲੀਆਂ",
    adjustCriteria: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਖੋਜ ਮਾਪਦੰਡਾਂ ਨੂੰ ਸਮਾਯੋਜਿਤ ਕਰੋ ਜਾਂ ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ ਬ੍ਰਾਊਜ਼ ਕਰੋ।",
    clearFilters: "ਫਿਲਟਰ ਸਾਫ਼ ਕਰੋ",
    
    // Bottom Section
    readyToStart: "ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਤਿਆਰ ਹੋ?",
    createAccountDesc: "ਅਰਜ਼ੀਆਂ ਜਮ੍ਹਾਂ ਕਰਨ, ਪ੍ਰਗਤੀ ਟਰੈਕ ਕਰਨ ਅਤੇ ਸਾਰੀਆਂ ਗ੍ਰਾਮ ਪੰਚਾਇਤ ਸੇਵਾਵਾਂ ਤੱਕ ਔਨਲਾਈਨ ਪਹੁੰਚ ਕਰਨ ਲਈ ਇੱਕ ਖਾਤਾ ਬਣਾਓ।",
    createAccount: "ਖਾਤਾ ਬਣਾਓ",
    alreadyHaveAccount: "ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ? ਸਾਈਨ ਇਨ ਕਰੋ",
    
    // Language Selector
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    changeLanguage: "ਭਾਸ਼ਾ ਬਦਲੋ"
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Always English, ignore user choice
  const currentLanguage: Language = 'en';

  // setLanguage does nothing
  const setLanguage = (_language: Language) => {};

  // Always return English key
  const t = (key: string): string => {
    return translations['en'][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const languageOptions = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
];
