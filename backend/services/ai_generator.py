import os
import json
import random
import requests
from config import Config

class AIGenerator:
    """
    Smart Content & Caption Generator tailored for healthcare, business, and social media.
    Supports platform-specific formatting and character limits.
    Connects to real AI API (OpenAI / Open API Key) when configured, with high-quality fallback.
    """
    
    TEMPLATES = {
        "healthcare": {
            "hooks": [
                "स्वास्थ्य ही असली धन है! 🏥✨",
                "क्या आप जानते हैं समय पर जांच से बड़ी बीमारियों से बचा जा सकता है?",
                "आपकी और आपके परिवार की सेहत हमारी पहली प्राथमिकता!",
                "आधुनिक चिकित्सा तकनीक अब आपके शहर में उपलब्ध!"
            ],
            "ctas": [
                "आज ही परामर्श के लिए संपर्क करें या अपॉइंटमेंट बुक करें।",
                "अधिक जानकारी के लिए 24x7 हेल्पलाइन पर कॉल करें।",
                "अपनी सेहत को नजरअंदाज न करें, आज ही विजिट करें।"
            ],
            "tags": ["#HealthCare", "#MedicalCare", "#DoctorConsultation", "#HealthTips", "#Wellness", "#HospitalCare"]
        },
        "dental": {
            "hooks": [
                "एक खूबसूरत मुस्कान आपका आत्मविश्वास बढ़ाती है! 🦷✨",
                "दांतों के दर्द से तुरंत राहत पाएं आधुनिक तकनीकों से।",
                "क्या आपके दांतों में पीलापन या सेंसिटिविटी है?",
            ],
            "ctas": [
                "फ्री डेंटल चेकअप के लिए आज ही स्लॉट बुक करें।",
                "अपने दांतों की प्राकृतिक चमक वापस पाने के लिए संपर्क करें।"
            ],
            "tags": ["#DentalCare", "#SmileMakeover", "#Dentist", "#TeethWhitening", "#OralHealth"]
        },
        "general": {
            "hooks": [
                "नई शुरुआत, बेहतरीन परिणाम! 🚀",
                "गुणवत्ता और विश्वास का नया अनुभव।",
                "हम लेकर आए हैं आपके लिए सबसे बेहतरीन सेवाएं!"
            ],
            "ctas": [
                "अधिक जानकारी के लिए कमेंट करें या सीधे डीएम करें!",
                "हमारी वेबसाइट पर विजिट करें और विशेष ऑफर का लाभ उठाएं।"
            ],
            "tags": ["#Innovation", "#QualityService", "#DigitalFirst", "#CustomerSuccess"]
        }
    }

    @classmethod
    def generate(cls, topic, client_name="Our Organization", business_type="General", language="hi_en"):
        api_key = Config.OPENAI_API_KEY
        if api_key and api_key.strip():
            try:
                prompt = (
                    f"Create engaging, high-converting social media captions in natural Hindi/Hinglish/English for:\n"
                    f"Client: {client_name}\n"
                    f"Business Type: {business_type}\n"
                    f"Topic/Highlight: {topic}\n\n"
                    f"Respond ONLY with a valid JSON object matching these exact keys:\n"
                    f'{{\n'
                    f'  "caption_general": "Universal caption suitable for all platforms",\n'
                    f'  "caption_instagram": "Engaging, emoji-rich reel/post caption with hashtags",\n'
                    f'  "caption_facebook": "Community-oriented detailed post with call to action",\n'
                    f'  "caption_youtube": "Detailed YouTube video description with timestamps",\n'
                    f'  "caption_linkedin": "Professional, executive tone post",\n'
                    f'  "youtube_title": "Catchy YouTube video title under 90 characters",\n'
                    f'  "hashtags": "#Tag1 #Tag2 #Tag3 #Tag4 #Tag5"\n'
                    f'}}'
                )

                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key.strip()}"
                }
                payload = {
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": "You are a professional social media marketing copywriter. Return ONLY valid JSON."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7
                }
                res = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=6)
                if res.status_code == 200:
                    raw_content = res.json()["choices"][0]["message"]["content"].strip()
                    if raw_content.startswith("```"):
                        raw_content = raw_content.split("```")[1]
                        if raw_content.startswith("json"):
                            raw_content = raw_content[4:].strip()
                    parsed = json.loads(raw_content)
                    tags = parsed.get("hashtags", "").split()
                    parsed["hashtags_list"] = tags
                    return parsed
            except Exception as e:
                print(f"[AIGenerator] API call error or fallback to templates: {e}")

        # Fallback to smart template generator
        # Determine category
        b_lower = business_type.lower()
        if "dental" in b_lower:
            cat = "dental"
        elif any(k in b_lower for k in ["hospital", "health", "clinic", "medical", "doctor"]):
            cat = "healthcare"
        else:
            cat = "general"

        tmpl = cls.TEMPLATES[cat]
        hook = random.choice(tmpl["hooks"])
        cta = random.choice(tmpl["ctas"])
        
        topic_clean = topic.strip() if topic else "आधुनिक सेवाएं और विशेषज्ञ परामर्श"

        # General Caption
        caption_general = f"{topic_clean} अब {client_name} में उपलब्ध!\n\n{hook}\n\nहम प्रदान करते हैं उच्च गुणवत्ता, समर्पित देखभाल और आधुनिक सुविधाएं।\n\n👉 {cta}"

        # Instagram Caption (visual, emoji-rich, hashtag-optimized)
        caption_instagram = f"✨ {topic_clean} ✨\n\n{hook}\n\n{client_name} में हम आपके अनुभव को सुरक्षित और उत्कृष्ट बनाने के लिए प्रतिबद्ध हैं। 💯\n\n📌 सेव करें यह रील और अपने दोस्तों के साथ शेयर करें!\n📞 {cta}\n\n{' '.join(tmpl['tags'])} #{client_name.replace(' ', '')}"

        # Facebook Caption (community-focused, detailed)
        caption_facebook = f"प्रिय नागरिकों,\n\n{topic_clean} के संदर्भ में {client_name} की विशेष पहल।\n\n{hook}\nहमारे विशेषज्ञ आपको सही मार्गदर्शन और त्वरित सेवाएं प्रदान करने के लिए 24x7 तत्पर हैं।\n\n{cta}\n\n📍 पता: मुख्य केंद्र, शहर\n📞 संपर्क: +91 98765 43210"

        # YouTube Title & Description
        youtube_title = f"{topic_clean} | {client_name} Complete Guide & Services"
        caption_youtube = f"Welcome to the official video presentation by {client_name}.\n\nIn this video:\n- {topic_clean} overview\n- Modern facilities and safety measures\n- Expert consultation details\n\n{hook}\n{cta}\n\nSubscribe to our channel for more regular updates!\n\nTimestamps:\n0:00 - Introduction\n0:30 - Key Highlights\n1:15 - How to Access Services\n\n{' '.join(tmpl['tags'])}"

        # LinkedIn Caption (professional, executive summary)
        caption_linkedin = f"{client_name} continues to expand accessible and state-of-the-art services with the introduction of {topic_clean}.\n\n{hook}\n\nOur commitment to operational excellence, clinical safety, and patient-first innovation drives our daily mission.\n\nKey Highlights:\n• Advanced Infrastructure & 24x7 Readiness\n• Certified Specialists\n• Seamless Patient Care Coordination\n\n{cta}\n\n{' '.join(tmpl['tags'])} #Leadership #HealthcareExcellence"

        # Hashtags string
        hashtags_list = tmpl["tags"] + [f"#{client_name.replace(' ', '')}"]
        hashtags_str = " ".join(hashtags_list)

        return {
            "caption_general": caption_general,
            "caption_instagram": caption_instagram,
            "caption_facebook": caption_facebook,
            "caption_youtube": caption_youtube,
            "caption_linkedin": caption_linkedin,
            "youtube_title": youtube_title,
            "hashtags": hashtags_str,
            "hashtags_list": hashtags_list
        }
