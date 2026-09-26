export interface ClientMediaItem {
  id: string;
  clientId: number;
  title: string;
  filename: string;
  fileSizeMb: number;
  durationStr: string;
  category: string;
  mediaType?: 'video' | 'photo';
  description: string;
  captions: {
    general: string;
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
    twitter?: string;
    youtubeTitle: string;
    hashtags: string;
  };
}

export const CLIENT_MEDIA_LIBRARY: Record<number, ClientMediaItem[]> = {
  // 1: Keshav Hospital
  1: [
    {
      id: 'kh-photo-1',
      clientId: 1,
      title: '24x7 Emergency Blood Bank Facility Poster',
      filename: 'blood-bank-facility-poster.jpg',
      fileSizeMb: 3.4,
      durationStr: 'Photo (1080x1080)',
      category: 'Blood Bank',
      mediaType: 'photo',
      description: 'High-resolution official campaign graphic showcasing 24x7 blood bank services and emergency helpline.',
      captions: {
        general: '🚨 आपातकाल में सुरक्षित रक्त की उपलब्धता जीवन बचाती है! Keshav Hospital Kharkhoda में 24 घंटे ब्लड बैंक सेवा और आधुनिक कंपोनेंट सेपरेटर उपलब्ध है।',
        instagram: '🚨 24x7 सुरक्षित रक्त सेवा - Keshav Hospital Kharkhoda! किसी भी आपातकाल में हमारे समर्पित ब्लड बैंक पर भरोसा करें। 🩸🏥 #BloodBank #EmergencyCare #KeshavHospital #Kharkhoda',
        facebook: 'Keshav Hospital Kharkhoda में अत्याधुनिक 24x7 ब्लड बैंक सुविधा उपलब्ध है। सभी रक्त समूह हमेशा उपलब्ध रहते हैं। आपातकालीन संपर्क: +91 98765 43210',
        youtube: '24x7 Blood Bank & Emergency Services Poster | Keshav Hospital Kharkhoda\n\nOfficial Healthcare Facility Update.',
        linkedin: 'Keshav Hospital is committed to delivering life-saving clinical support with round-the-clock licensed blood bank operations.',
        twitter: '🚨 Keshav Hospital Kharkhoda में 24x7 सुरक्षित और आधुनिक ब्लड बैंक सेवा उपलब्ध है। आपातकालीन हेल्पलाइन: +91 98765 43210 🩸 #KeshavHospital #BloodBank',
        youtubeTitle: '24x7 Blood Bank & Trauma Center | Keshav Hospital',
        hashtags: '#BloodBank #KeshavHospital #Kharkhoda #Healthcare #EmergencyCare'
      }
    },
    {
      id: 'kh-1',
      clientId: 1,
      title: '24x7 Blood Bank & Emergency Services',
      filename: 'blood-bank.mp4',
      fileSizeMb: 85.0,
      durationStr: '2:15',
      category: 'Blood Bank',
      mediaType: 'video',
      description: 'Tour of modern blood bank equipment, safety protocols, and 24x7 emergency blood units.',
      captions: {
        general: 'खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में सुरक्षित, आधुनिक और 24x7 ब्लड बैंक सेवा उपलब्ध है। आपातकालीन स्थिति में तुरंत रक्त उपलब्धता सुनिश्चित की जाती है।',
        instagram: 'खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में सुरक्षित, आधुनिक और 24x7 ब्लड बैंक सेवा उपलब्ध है। 🩸\n\nआपातकालीन सहायता: +91 98765 43210\n#BloodBank #KeshavHospital #Kharkhoda #Healthcare #EmergencyCare',
        facebook: 'खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में सुरक्षित, आधुनिक और 24x7 ब्लड बैंक सेवा उपलब्ध है। सभी रक्त समूह 24 घंटे उपलब्ध रहते हैं। संपर्क करें: +91 98765 43210',
        youtube: 'खरखौदा में ब्लड बैंक की सुविधा | Keshav Hospital Kharkhoda 24x7 Blood Bank Facility\n\nEmergency helpline: +91 98765 43210\nWebsite: www.keshavhospital.com\nAddress: Kharkhoda, Sonipat, Haryana',
        linkedin: 'Keshav Hospital is proud to announce expanded 24x7 advanced blood banking facilities in Kharkhoda, ensuring rapid response emergency care and life-saving critical support.',
        twitter: 'खरखौदा में ब्लड बैंक की सुविधा अब और भी बेहतर! Keshav Hospital में 24x7 सुरक्षित ब्लड बैंक सेवा उपलब्ध है। 🏥✨ #BloodBank #KeshavHospital',
        youtubeTitle: 'खरखौदा में ब्लड बैंक की सुविधा | Keshav Hospital Kharkhoda',
        hashtags: '#BloodBank #KeshavHospital #HealthCare #EmergencyCare #Kharkhoda'
      }
    },
    {
      id: 'kh-2',
      clientId: 1,
      title: 'Advanced ICU & Critical Care Unit',
      filename: 'icu-critical-care.mp4',
      fileSizeMb: 64.5,
      durationStr: '1:45',
      category: 'Critical Care',
      mediaType: 'video',
      description: 'High-tech ventilators, multi-para monitors, and round-the-clock intensivist support.',
      captions: {
        general: 'Keshav Hospital का आधुनिक ICU यूनिट - 24 घंटे वरिष्ठ डॉक्टरों और अनुभवी नर्सिंग स्टाफ की देखरेख में गंभीर मरीजों को सर्वोत्तम चिकित्सा सेवा प्रदान करता है।',
        instagram: 'Keshav Hospital का आधुनिक ICU यूनिट - 24 घंटे विशेषज्ञ डॉक्टरों की देखरेख। हर सेकंड कीमती है, और हम हैं तैयार। 🏥\n\n#ICU #CriticalCare #KeshavHospital #PatientCare',
        facebook: 'Keshav Hospital का अत्याधुनिक ICU - अत्याधुनिक वेंटिलेटर, कार्डियक मॉनिटर और 24x7 इंटेंसिविस्ट सुविधा। आपातकालीन नंबर: +91 98765 43210',
        youtube: 'Keshav Hospital Modern ICU & Trauma Care Facilities | Kharkhoda Multi-Speciality\n\n24x7 Intensive Care with Advanced Ventilators and Specialist Doctors.',
        linkedin: 'State-of-the-art Intensive Care Unit (ICU) at Keshav Hospital Kharkhoda, equipped with high-precision life support systems and 24x7 intensivists.',
        twitter: 'Keshav Hospital का आधुनिक ICU यूनिट - 24 घंटे विशेषज्ञ डॉक्टरों की देखरेख। आपातकालीन नंबर: +91 98765 43210 🏥 #ICU #KeshavHospital',
        youtubeTitle: 'Modern ICU Facilities Tour | Keshav Hospital Kharkhoda',
        hashtags: '#ICU #CriticalCare #EmergencyMedicine #KeshavHospital #Healthcare'
      }
    },
    {
      id: 'kh-3',
      clientId: 1,
      title: 'Rapid Ambulance & Trauma Response',
      filename: 'ambulance-dispatch.mp4',
      fileSizeMb: 42.0,
      durationStr: '1:10',
      category: 'Emergency',
      mediaType: 'video',
      description: 'Oxygen-equipped rapid ambulances ready to dispatch across Kharkhoda and Sonipat.',
      captions: {
        general: 'आपातकाल में सबसे तेज़ रिस्पांस! Keshav Hospital की 24x7 एम्बुलेंस सेवा ऑक्सीजन और लाइफ सपोर्ट से सुसज्जित है।',
        instagram: 'आपातकाल में सबसे तेज़ रिस्पांस! 🚑 Keshav Hospital की 24x7 एम्बुलेंस सेवा हमेशा तैयार। डायल करें: 108 / +91 98765 43210 #Ambulance #Emergency #KeshavHospital',
        facebook: 'आपातकाल में समय पर सहायता जीवन बचाती है। Keshav Hospital की जीपीएस-इनेबल्ड आधुनिक एम्बुलेंस सेवा 24x7 उपलब्ध।',
        youtube: '24x7 Emergency Ambulance Service | Keshav Hospital Kharkhoda\n\nInstant emergency dispatch with oxygen & ALS facilities.',
        linkedin: 'Fast-response ALS ambulance network initiated by Keshav Hospital to serve critical care transit across the region.',
        twitter: 'आपातकाल में सबसे तेज़ रिस्पांस! 🚑 Keshav Hospital 24x7 एम्बुलेंस सेवा हमेशा तैयार। डायल करें: +91 98765 43210 #Ambulance #KeshavHospital',
        youtubeTitle: '24x7 Emergency Ambulance Services | Keshav Hospital',
        hashtags: '#Ambulance #EmergencyResponse #KeshavHospital #FirstAid #LifeSaving'
      }
    }
  ],

  // 2: Roshni Dental
  2: [
    {
      id: 'rd-photo-1',
      clientId: 2,
      title: 'Digital Smile Makeover & Invisible Aligners Showcase',
      filename: 'smile-makeover-showcase.png',
      fileSizeMb: 2.8,
      durationStr: 'Photo (1080x1350)',
      category: 'Cosmetic',
      mediaType: 'photo',
      description: 'High-definition clinic graphic showcasing digital smile transformations and clear aligner treatment packages.',
      captions: {
        general: '✨ अपनी मुस्कान को दें एक नया आत्मविश्वास! Roshni Dental Clinic में डिजिटल स्माइल डिजाइनिंग और इनविजिबल एलाइनर्स पर विशेष परामर्श उपलब्ध।',
        instagram: 'अपनी मुस्कान को दें एक नया आत्मविश्वास! ✨ Roshni Dental डिजिटल स्माइल मेकओवर। बिना तारों के सीधे और चमकदार दांत। 🦷 #SmileDesign #ClearAligners #RoshniDental',
        facebook: 'Roshni Dental Clinic: पाएं बिल्कुल प्राकृतिक और आकर्षक मुस्कान। 3D इंट्राओरल स्कैनिंग और कस्टम एलाइनर्स की सुविधा। संपर्क: +91 98123 45678',
        youtube: 'Digital Smile Makeover Poster & Patient Results | Roshni Dental Clinic',
        linkedin: 'Transforming clinical aesthetic dentistry with 3D digital smile simulation at Roshni Dental Clinic.',
        twitter: '✨ Roshni Dental Clinic में डिजिटल स्माइल मेकओवर और पेनलेस डेंटल केयर! आज ही परामर्श बुक करें: +91 98123 45678 🦷 #RoshniDental #SmileDesign',
        youtubeTitle: 'Digital Smile Makeover Showcase | Roshni Dental',
        hashtags: '#SmileDesign #ClearAligners #RoshniDental #Dentistry #SmileTransformation'
      }
    },
    {
      id: 'rd-1',
      clientId: 2,
      title: 'Painless Dental Implants & Smile Restoration',
      filename: 'dental-implants.mp4',
      fileSizeMb: 52.8,
      durationStr: '1:30',
      category: 'Implants',
      mediaType: 'video',
      description: 'Computer-guided digital dental implants with lifetime warranty and painless recovery.',
      captions: {
        general: 'खोए हुए दांतों की जगह पाएं बिल्कुल प्राकृतिक और मजबूत नए दांत! Roshni Dental में डिजिटल पेनलेस डेंटल इंप्लांट की आधुनिक सुविधा।',
        instagram: 'खोए हुए दांतों की जगह पाएं बिल्कुल प्राकृतिक नए दांत! 🦷 Roshni Dental के डिजिटल पेनलेस इंप्लांट्स। अपनी मुस्कान वापस पाएं! #DentalImplants #RoshniDental #SmileDesign',
        facebook: 'Roshni Dental Clinic में कंप्यूटर गाइडेड डेंटल इंप्लांट्स से पाएं स्थायी और प्राकृतिक दांत। परामर्श के लिए आज ही बुक करें: +91 98123 45678',
        youtube: 'Painless Dental Implants in 1 Visit | Roshni Dental Clinic Orthodontics Center\n\nAdvanced Digital Implantology by expert dentists.',
        linkedin: 'Transforming smiles with painless, digitally-guided dental implants at Roshni Dental Clinic & Orthodontics.',
        twitter: 'खोए हुए दांतों की जगह पाएं मजबूत नए दांत! Roshni Dental डिजिटल पेनलेस इंप्लांट्स। कॉल करें: +91 98123 45678 🦷 #RoshniDental',
        youtubeTitle: 'Digital Painless Dental Implants Explained | Roshni Dental',
        hashtags: '#DentalImplants #RoshniDental #Dentistry #SmileMakeover #OralHealth'
      }
    },
    {
      id: 'rd-2',
      clientId: 2,
      title: 'Laser Teeth Whitening in 30 Minutes',
      filename: 'laser-teeth-whitening.mp4',
      fileSizeMb: 36.4,
      durationStr: '0:58',
      category: 'Cosmetic',
      mediaType: 'video',
      description: 'Instant teeth shade brightening with safe cold-laser dental technology.',
      captions: {
        general: 'सिर्फ 30 मिनट में चमकदार सफेद मुस्कान! Roshni Dental में लेज़र टीथ व्हाइटनिंग उपचार से पीलेपन से पाएं हमेशा के लिए छुटकारा।',
        instagram: 'सिर्फ 30 मिनट में चमकदार सफेद मुस्कान! ✨ Roshni Dental लेज़र टीथ व्हाइटनिंग। #TeethWhitening #LaserDentistry #RoshniDental #WhiteTeeth',
        facebook: 'पीलेपन से परेशान हैं? Roshni Dental पर लेज़र टीथ व्हाइटनिंग तकनीक से पाएं 4-8 शेड तक सफेद और चमकदार दांत। कॉल करें: +91 98123 45678',
        youtube: 'Instant Laser Teeth Whitening Treatment | Roshni Dental Clinic\n\nSafe, painless 30-minute procedure for glowing pearly whites.',
        linkedin: 'Cosmetic dentistry milestone: Roshni Dental expands advanced laser whitening solutions with zero enamel erosion.',
        twitter: 'सिर्फ 30 मिनट में चमकदार सफेद मुस्कान! Roshni Dental लेज़र टीथ व्हाइटनिंग। कॉल: +91 98123 45678 ✨ #TeethWhitening #RoshniDental',
        youtubeTitle: 'Instant Laser Teeth Whitening | Roshni Dental Clinic',
        hashtags: '#TeethWhitening #CosmeticDentistry #RoshniDental #DentalCare #BrilliantSmile'
      }
    }
  ],

  // 3: Noble Hospital
  3: [
    {
      id: 'nh-photo-1',
      clientId: 3,
      title: 'Comprehensive Preventive Health & Cardiac Checkup',
      filename: 'health-checkup-package.jpg',
      fileSizeMb: 3.1,
      durationStr: 'Photo (1080x1080)',
      category: 'Health Packages',
      mediaType: 'photo',
      description: 'Complete full body checkup, ECG, Echo, Lipid profile, and specialist doctor consultation package.',
      captions: {
        general: '🏥 बीमारी से पहले बचाव ही सर्वोत्तम इलाज है! Noble Hospital का प्रिवेंटिव हेल्थ पैकेज - 65+ महत्वपूर्ण जांचें और विशेषज्ञ डॉक्टरों का परामर्श।',
        instagram: 'बीमारी से पहले बचाव ही सर्वोत्तम इलाज है! ❤️ Noble Hospital संपूर्ण हेल्थ पैकेज। 65+ जरूरी टेस्ट और डॉक्टर परामर्श। #HealthCheckup #NobleHospital #Cardiology',
        facebook: 'Noble Hospital प्रिवेंटिव हेल्थ चेकअप: अपने और परिवार के स्वास्थ्य की समय पर जांच करवाएं। विशेष छूट के साथ अपॉइंटमेंट बुक करें: +91 97654 32109',
        youtube: 'Full Body Preventive Health Checkup Campaign | Noble Hospital Diagnostics',
        linkedin: 'Noble Hospital launches comprehensive executive preventive wellness screening packages for early diagnosis.',
        twitter: '🏥 Noble Hospital में संपूर्ण हेल्थ और कार्डियक चेकअप पैकेज उपलब्ध। स्वस्थ जीवन की ओर पहला कदम। हेल्पलाइन: +91 97654 32109 #NobleHospital #HealthCare',
        youtubeTitle: 'Preventive Health Checkup Package | Noble Hospital',
        hashtags: '#HealthCheckup #PreventiveCare #NobleHospital #Diagnostics #Healthcare'
      }
    },
    {
      id: 'nh-1',
      clientId: 3,
      title: 'Advanced Cardiac Diagnostics & Angiography',
      filename: 'cardiac-care.mp4',
      fileSizeMb: 70.0,
      durationStr: '2:05',
      category: 'Cardiology',
      mediaType: 'video',
      description: 'Digital Flat-Panel Cath Lab, 2D Echo, TMT, and 24x7 Interventional Cardiologists.',
      captions: {
        general: 'स्वस्थ दिल, खुशहाल जीवन! Noble Hospital में अत्याधुनिक डिजिटल कैथ लैब और विशेषज्ञ हृदय रोग विशेषज्ञों द्वारा संपूर्ण कार्डियोलॉजी सेवा उपलब्ध।',
        instagram: 'स्वस्थ दिल, खुशहाल जीवन! ❤️ Noble Hospital में अत्याधुनिक कार्डियक केयर और 24x7 इमरजेंसी कैथ लैब। #Cardiology #HeartCare #NobleHospital #Healthcare',
        facebook: 'Noble Hospital की उन्नत कार्डियक केयर यूनिट - ईसीजी, इको, टीएमटी और आपातकालीन एंजियोप्लास्टी की सुविधा 24 घंटे उपलब्ध। हेल्पलाइन: +91 97654 32109',
        youtube: 'Complete Cardiac Health & Cath Lab Tour | Noble Hospital Diagnostics\n\nExpert Cardiologists delivering preventive and emergency cardiac care.',
        linkedin: 'Noble Hospital strengthens regional emergency cardiology infrastructure with modern flat-panel Cath Lab systems.',
        twitter: 'स्वस्थ दिल, खुशहाल जीवन! ❤️ Noble Hospital में अत्याधुनिक कार्डियक केयर और 24x7 इमरजेंसी कैथ लैब। हेल्पलाइन: +91 97654 32109 #HeartCare',
        youtubeTitle: 'Comprehensive Cardiac Care & Cath Lab | Noble Hospital',
        hashtags: '#Cardiology #HeartHealth #NobleHospital #CathLab #DoctorConsultation'
      }
    }
  ],

  // 4: Dermatrixx
  4: [
    {
      id: 'dm-photo-1',
      clientId: 4,
      title: 'Hydra-Facial Glow & Skin Rejuvenation Offer',
      filename: 'hydra-glow-offer.png',
      fileSizeMb: 2.6,
      durationStr: 'Photo (1080x1350)',
      category: 'Aesthetics',
      mediaType: 'photo',
      description: 'Clinic promotional banner for medical-grade Hydra-Facial, deep exfoliation, and instant hydration.',
      captions: {
        general: '✨ तुरंत पाएं ग्लोइंग और हाइड्रेटेड त्वचा! Dermatrixx Skin Clinic में मेडिकल-ग्रेड हाइड्रा-फेशियल पर विशेष फेस्टिवल ऑफर।',
        instagram: 'तुरंत पाएं ग्लोइंग और हाइड्रेटेड त्वचा! ✨ Dermatrixx हाइड्रा-फेशियल। डीप क्लींजिंग और नेचुरल ग्लो। #HydraFacial #Dermatrixx #GlowSkin #Skincare',
        facebook: 'Dermatrixx Skin Clinic में करवाएं सर्टिफाइड हाइड्रा-फेशियल और पाएं तुरंत निखार। स्लॉट बुक करें: +91 99887 76655',
        youtube: 'Medical Hydra-Facial Glow Treatment Banner | Dermatrixx Clinic',
        linkedin: 'Dermatrixx Aesthetic Clinic introduces advanced non-invasive hydra-dermabrasion skincare treatments.',
        twitter: '✨ Dermatrixx Skin Clinic में मेडिकल हाइड्रा-फेशियल से पाएं बेदाग और ग्लोइंग स्किन! बुक करें: +91 99887 76655 #Dermatrixx #Skincare',
        youtubeTitle: 'Hydra-Facial Glow Campaign | Dermatrixx Aesthetic Clinic',
        hashtags: '#HydraFacial #Dermatrixx #SkinCare #FlawlessGlow #Aesthetics'
      }
    },
    {
      id: 'dm-1',
      clientId: 4,
      title: 'Laser Skin Resurfacing & Anti-Aging Glow',
      filename: 'laser-skin-glow.mp4',
      fileSizeMb: 58.6,
      durationStr: '1:12',
      category: 'Dermatology',
      mediaType: 'video',
      description: 'US-FDA approved fractional laser for acne scars, pigmentation, and glowing youthful skin.',
      captions: {
        general: 'पाएं बेदाग, चमकदार और जवां त्वचा! Dermatrixx Skin Clinic में यूएस-एफडीए प्रमाणित लेज़र स्किन रीसर्फेसिंग से मुहांसों के दाग और पिगमेंटेशन से मुक्ति।',
        instagram: 'पाएं बेदाग और चमकदार त्वचा! ✨ Dermatrixx यूएस-एफडीए लेज़र ट्रीटमेंट। विशेषज्ञ डर्मेटोलॉजिस्ट की देखरेख। #Skincare #Dermatrixx #GlowSkin #LaserFacial',
        facebook: 'चेहरे के दाग-धब्बे और मुहांसों से हैं परेशान? Dermatrixx Skin Clinic में एडवांस्ड लेज़र स्किन ट्रीटमेंट से पाएं चमकदार निखार। संपर्क करें: +91 99887 76655',
        youtube: 'Advanced Fractional Laser Skin Glow Treatment | Dermatrixx Aesthetic Clinic\n\nSafe and effective laser rejuvenation by certified dermatologists.',
        linkedin: 'Clinical aesthetic dermatology: Dermatrixx showcases non-invasive laser resurfacing protocols for hyperpigmentation.',
        twitter: 'पाएं बेदाग और चमकदार त्वचा! ✨ Dermatrixx यूएस-एफडीए लेज़र स्किन ट्रीटमेंट। कॉल करें: +91 99887 76655 #Dermatrixx #Skincare',
        youtubeTitle: 'Laser Skin Glow & Scar Removal | Dermatrixx Clinic',
        hashtags: '#Skincare #LaserTreatment #Dermatrixx #AestheticDermatology #FlawlessSkin'
      }
    }
  ]
};
