// src/pages/MainDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Bell,
  Settings,
  MapPin,
  Sun,
  Wind,
  Droplets,
  CloudRain,
  Stethoscope,
  IndianRupee,
  FlaskConical,
  Bot,
  ChevronRight,
  Sprout,
  User,
  Globe,
  Shield,
  HelpCircle,
  Info,
  Cloud,
  Bug,
  DollarSign,
  Lightbulb,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Weather.css";
import { useLanguage } from "../context/LanguageContext";

const ENV_KEY = import.meta.env.VITE_WEATHERAPI_KEY || "";

const dashboardTexts = {
  en: {
    brandTitle: "Agro Suvidha",
    brandSubtitle: "Farmer's Digital Companion",
    navHome: "Home",
    navCrops: "Crops",
    navWeather: "Weather",
    navSettings: "Settings",
    navLanguage: "Language",
    navAbout: "About Us",
    greeting: "Good Morning, Farmer! 🌾",
    detectingLocation: "Detecting location...",
    geoNotSupported: "Geolocation not supported in this browser.",
    permDenied: "Permission denied for location.",
    posUnavailable: "Position unavailable.",
    timeout: "Location request timed out.",
    locFailed: "Failed to get location.",
    noApiKey: "No WeatherAPI key found. Add it to your .env file.",
    fetchError: "Failed to fetch weather.",
    netError: "Network error while fetching weather.",
    locDetected: "Location detected",
    lastUpdated: "Last updated",
    noRainMsg: "No rain expected. Please water your crops today.",
    soilOk: "Soil moisture looks sufficient. Irrigation is not required today.",
    highTempLowHum:
      "High temperature and low humidity. Provide adequate irrigation.",
    lightIrr: "Light irrigation is suggested to maintain crop health.",
    monitorIrr:
      "Monitor soil moisture and irrigate if the soil starts drying.",
    irrChecking: "Checking irrigation status...",
    irrNone: "No Irrigation Needed",
    irrRecommended: "Irrigation Recommended",
    irrLight: "Light Irrigation Suggested",
    irrMonitor: "Monitor Irrigation",
    weatherAlerts: "Weather Alerts",
    weatherAlertsSub: "Get weather information",
    diseaseAlerts: "Crop Disease Alerts",
    diseaseAlertsSub: "Disease identification info",
    priceUpdates: "Market Price Updates",
    priceUpdatesSub: "Get new prices",
    adviceTips: "Advice Tips",
    adviceTipsSub: "Get farming advice",
    settingsTitle: "Settings",
    settingsSub: "Manage your preferences",
    profile: "Profile",
    profileSub: "Update your information",
    langMenu: "Language",
    langMenuSub: "Change app language",
    privacy: "Privacy",
    privacySub: "Manage your data",
    help: "Help",
    helpSub: "Get support",
    about: "About Us",
    aboutSub: "App information",
    logout: "Logout",
    logoutSub: "Sign out of your account",
    footer: "Agro Suvidha — AI-Powered Agricultural Advisory",
    pestTitle: "Pest Detection & Solution",
    pestSub: "Identify crop diseases and get treatment solutions.",
    pestCta: "Open Pest Detection",
    mandiTitle: "Mandi Prices",
    mandiSub: "Check live market prices for your crops.",
    mandiCta: "View Market Prices",
    soilTitle: "Soil Analysis",
    soilSub: "Monitor soil moisture and get irrigation advice.",
    soilCta: "Check Soil Status",
    mitraTitle: "Kisan Mitra Chatbot",
    mitraSub: "Get instant answers to your farming questions.",
    mitraCta: "Chat with Kisan Mitra",
    scanTitle: "Use me to scan",
    scanSub: "Leaves or Soil",
    appInfoTitle: "Agro Suvidha",
    appInfoSub: "AI-Powered Agricultural Advisory",
  },
  hi: {
    brandTitle: "एग्रो सुविधा",
    brandSubtitle: "किसानों का डिजिटल साथी",
    navHome: "होम",
    navCrops: "फसलें",
    navWeather: "मौसम",
    navSettings: "सेटिंग्स",
    navLanguage: "भाषा",
    navAbout: "हमारे बारे में",
    greeting: "सुप्रभात, किसान! 🌾",
    detectingLocation: "स्थान की पहचान की जा रही है...",
    geoNotSupported: "इस ब्राउज़र में लोकेशन सपोर्ट नहीं है।",
    permDenied: "लोकेशन की अनुमति अस्वीकार कर दी गई।",
    posUnavailable: "स्थान उपलब्ध नहीं है।",
    timeout: "लोकेशन अनुरोध में समय समाप्त।",
    locFailed: "लोकेशन प्राप्त करने में विफल।",
    noApiKey: "WeatherAPI की कुंजी नहीं मिली। कृपया .env में जोड़ें।",
    fetchError: "मौसम डेटा प्राप्त करने में समस्या।",
    netError: "मौसम डेटा लाते समय नेटवर्क त्रुटि।",
    locDetected: "स्थान पहचाना गया",
    lastUpdated: "अंतिम अपडेट",
    noRainMsg: "आज वर्षा की संभावना नहीं है। कृपया फसल को सिंचाई दें।",
    soilOk:
      "मिट्टी की नमी पर्याप्त लग रही है। आज सिंचाई की आवश्यकता नहीं है।",
    highTempLowHum:
      "उच्च तापमान और कम नमी। पर्याप्त सिंचाई अवश्य करें।",
    lightIrr: "फसल की सेहत के लिए हल्की सिंचाई सुझाई जाती है।",
    monitorIrr:
      "मिट्टी की नमी पर नज़र रखें और सूखने पर सिंचाई करें।",
    irrChecking: "सिंचाई स्थिति जाँची जा रही है...",
    irrNone: "सिंचाई की आवश्यकता नहीं",
    irrRecommended: "सिंचाई की सलाह दी जाती है",
    irrLight: "हल्की सिंचाई सुझाई जाती है",
    irrMonitor: "सिंचाई पर नज़र रखें",
    weatherAlerts: "मौसम अलर्ट",
    weatherAlertsSub: "मौसम की जानकारी प्राप्त करें",
    diseaseAlerts: "फसल रोग अलर्ट",
    diseaseAlertsSub: "रोग पहचान जानकारी",
    priceUpdates: "मंडी भाव अपडेट",
    priceUpdatesSub: "नए भाव प्राप्त करें",
    adviceTips: "सलाह टिप्स",
    adviceTipsSub: "खेती से जुड़ी सलाह",
    settingsTitle: "सेटिंग्स",
    settingsSub: "अपनी पसंद प्रबंधित करें",
    profile: "प्रोफ़ाइल",
    profileSub: "अपनी जानकारी अपडेट करें",
    langMenu: "भाषा",
    langMenuSub: "ऐप की भाषा बदलें",
    privacy: "गोपनीयता",
    privacySub: "अपने डाटा को प्रबंधित करें",
    help: "सहायता",
    helpSub: "मदद प्राप्त करें",
    about: "हमारे बारे में",
    aboutSub: "ऐप जानकारी",
    logout: "लॉगआउट",
    logoutSub: "अपने खाते से साइन आउट करें",
    footer: "एग्रो सुविधा — एआई आधारित कृषि सलाह",
    pestTitle: "कीट पहचान और समाधान",
    pestSub: "फसल रोग पहचानें और उपचार जानें।",
    pestCta: "कीट पहचान खोलें",
    mandiTitle: "मंडी भाव",
    mandiSub: "अपनी फसलों के लाइव मंडी भाव देखें।",
    mandiCta: "मंडी भाव देखें",
    soilTitle: "मिट्टी की नमी",
    soilSub: "मिट्टी की नमी देखें और सिंचाई सलाह पाएं।",
    soilCta: "मिट्टी की स्थिति देखें",
    mitraTitle: "किसान मित्र चैटबॉट",
    mitraSub: "खेती से जुड़े सवालों के तुरंत जवाब पाएं।",
    mitraCta: "किसान मित्र से बात करें",
    scanTitle: "स्कैन करने के लिए मुझे उपयोग करें",
    scanSub: "पत्ते या मिट्टी",
    appInfoTitle: "एग्रो सुविधा",
    appInfoSub: "एआई आधारित कृषि सलाह",
  },
  // ... other languages unchanged for brevity
};

function HomeIcon() {
  return <Sun />;
}

export default function Home() {
  const { language } = useLanguage();
  const text = dashboardTexts[language] || dashboardTexts.en;

  const [weather, setWeather] = useState(null);
  const [coords, setCoords] = useState(null);
  const [locationMsg, setLocationMsg] = useState(text.detectingLocation);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const effectiveKey = ENV_KEY;

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationMsg(text.geoNotSupported);
      return;
    }

    setLoadingLocation(true);
    setLocationMsg(text.detectingLocation);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (err) => {
        setLoadingLocation(false);
        if (err.code === 1) setLocationMsg(text.permDenied);
        else if (err.code === 2) setLocationMsg(text.posUnavailable);
        else if (err.code === 3) setLocationMsg(text.timeout);
        else setLocationMsg(text.locFailed);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [text]);

  const fetchWeather = useCallback(async () => {
    if (!effectiveKey) {
      setErrorMsg(text.noApiKey);
      return;
    }
    if (!coords) return;

    try {
      setLoadingWeather(true);
      setErrorMsg(null);

      const q = `${coords.lat},${coords.lon}`;
      const url = `https://api.weatherapi.com/v1/current.json?key=${encodeURIComponent(
        effectiveKey
      )}&q=${encodeURIComponent(q)}&aqi=yes`;

      const res = await fetch(url);
      const json = await res.json();

      if (json?.error) {
        setErrorMsg(json.error.message || text.fetchError);
        setWeather(null);
      } else {
        setWeather(json);
        const locText = json.location
          ? `${text.locDetected}: ${json.location.name}${json.location.region ? ", " + json.location.region : ""
          }`
          : `${text.locDetected}.`;
        setLocationMsg(locText);
      }
    } catch {
      setErrorMsg(text.netError);
    } finally {
      setLoadingWeather(false);
    }
  }, [coords, effectiveKey, text]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    if (coords) fetchWeather();
  }, [coords, fetchWeather]);

  useEffect(() => {
    if (!coords || !effectiveKey) return;
    const id = setInterval(fetchWeather, 1800000);
    return () => clearInterval(id);
  }, [coords, effectiveKey, fetchWeather]);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sheetOpen);
  }, [sheetOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isLoading = loadingLocation || loadingWeather;

  const tempC = weather?.current?.temp_c ?? null;
  const conditionText = weather?.current?.condition?.text || "--";
  const windKph = weather?.current?.wind_kph ?? null;
  const windDir = weather?.current?.wind_dir ?? "--";
  const windDegree = weather?.current?.wind_degree ?? null;
  const humidity = weather?.current?.humidity ?? null;
  const clouds = weather?.current?.cloud ?? null;
  const lastUpdated = weather?.current?.last_updated ?? "--";

  const aqi = weather?.current?.air_quality?.["pm2_5"] ?? null;

  const aqiCategory = () => {
    if (aqi === null) return "--";
    if (aqi <= 30) return "Excellent";
    if (aqi <= 60) return "Good";
    if (aqi <= 90) return "Moderate";
    if (aqi <= 120) return "Poor";
    if (aqi <= 250) return "Very Poor";
    return "Hazardous";
  };

  const irrigationRecommendation = () => {
    if (!weather?.current) return text.noRainMsg;
    const hum = Number(humidity ?? 0);
    const temp = Number(tempC ?? 0);
    const cloud = Number(clouds ?? 0);

    if (hum > 70 || cloud > 60) return text.soilOk;
    if (temp > 32 && hum < 50) return text.highTempLowHum;
    if (cloud < 30 && temp > 28) return text.lightIrr;
    return text.monitorIrr;
  };

  const irrigationTitle = () => {
    if (!weather?.current) return text.irrChecking;
    const hum = Number(humidity ?? 0);
    const temp = Number(tempC ?? 0);
    const cloud = Number(clouds ?? 0);

    if (hum > 70 || cloud > 60) return text.irrNone;
    if (temp > 32 && hum < 50) return text.irrRecommended;
    if (cloud < 30 && temp > 28) return text.irrLight;
    return text.irrMonitor;
  };

  const weatherBgClass = () => {
    const t = (conditionText || "").toLowerCase();
    if (t.includes("rain") || t.includes("shower")) return "weather-rainy";
    if (t.includes("cloud") || t.includes("overcast")) return "weather-cloudy";
    if (t.includes("storm") || t.includes("thunder")) return "weather-storm";
    if (t.includes("snow")) return "weather-snow";
    return "weather-sunny";
  };

  const WeatherIcon = () => {
    const t = conditionText.toLowerCase();
    if (t.includes("rain")) return <CloudRain />;
    if (t.includes("cloud")) return <Cloud />;
    if (t.includes("storm")) return <CloudRain />;
    if (t.includes("snow")) return <Cloud />;
    return <Sun />;
  };

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path ? "active-nav-btn" : "";

  return (
    <>
      <div
        id="overlay"
        className={sheetOpen ? "active" : ""}
        onClick={() => setSheetOpen(false)}
      ></div>

      <div className="dashboard">
        {/* TOP BAR WITH BRAND + PILL NAV */}
        <div className="topbar">
          <div className="brand">
            {/* removed left logo: nothing to the left */}
            <div className="brand-text">
              <div className="brand-title">{text.brandTitle}</div>
              <div className="brand-subtitle">{text.brandSubtitle}</div>
            </div>
          </div>

          <div className="nav-pill">
            <button
              className={isActive("/dashboard")}
              onClick={() => navigate("/dashboard")}
            >
              <HomeIcon />
              <span className="nav-label">{text.navHome}</span>
            </button>
            <button
              className={isActive("/manager")}
              onClick={() => navigate("/manager")}
            >
              <Sprout />
              <span className="nav-label">{text.navCrops}</span>
            </button>
            <button
              className={isActive("/weather")}
              onClick={() => navigate("/weather")}
            >
              <Sun />
              <span className="nav-label">{text.navWeather}</span>
            </button>
            <button
              className={isActive("/settings")}
              onClick={() => setSheetOpen(true)}
            >
              <Settings />
              <span className="nav-label">{text.navSettings}</span>
            </button>
            <button
              className={isActive("/language")}
              onClick={() => navigate("/language")}
            >
              <Globe />
              <span className="nav-label">{text.navLanguage}</span>
            </button>
            <button
              className={isActive("/about")}
              onClick={() => navigate("/about")}
            >
              <Info />
              <span className="nav-label">{text.navAbout}</span>
            </button>
          </div>
        </div>

        {/* EVERYTHING BELOW IS INSIDE page-inner */}
        <div className="page-inner">
          {/* GREETING BAR */}
          <section className="greeting-card">
            <div className="section-inner">
              <h1>{text.greeting}</h1>
              <p className="greeting-date">{today}</p>
            </div>
          </section>

          {/* WEATHER CARD */}
          <section className="weather-shell">
            <div className="section-inner">
              {errorMsg && <div className="error-box">{errorMsg}</div>}

              <div className={`weather-card-new ${weatherBgClass()}`}>
                <div className="weather-left">
                  <div className="weather-icon-big">
                    <WeatherIcon />
                  </div>
                  <div className="weather-main-info">
                    <div className="temp-row">
                      <span className="temperature-big">
                        {tempC !== null ? `${Math.round(tempC)}°C` : "--°C"}
                      </span>
                    </div>

                    {/* weather condition right under temperature */}
                    <p className="weather-desc-main">
                      {weather?.current?.condition?.text || "Fetching weather..."}
                    </p>

                    {/* location moved below the weather condition */}
                    <p className="location-inside">
                      <MapPin style={{ width: 14, height: 14, marginRight: 6, verticalAlign: "middle" }} />
                      <span>
                        {locationMsg}
                        {isLoading ? " (Loading...)" : ""}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="weather-right">
                  <div>
                    <Wind /> {windKph !== null ? `${windKph} km/h` : "--"}
                  </div>
                  <div>
                    <Wind /> Direction: {windDir}{" "}
                    {windDegree !== null ? `(${windDegree}°)` : ""}
                  </div>
                  <div>
                    <Droplets />{" "}
                    {humidity !== null ? `${humidity}% humidity` : "--"}
                  </div>
                  <div>
                    <CloudRain />{" "}
                    {clouds !== null ? `${clouds}% cloudiness` : "--"}
                  </div>
                  <div>
                    <Sun /> AQI:{" "}
                    {aqi !== null ? `${Math.round(aqi)} (${aqiCategory()})` : "--"}
                  </div>
                </div>
              </div>

              <div className="last-updated-row">
                {text.lastUpdated}: {lastUpdated}
              </div>
            </div>
          </section>

          {/* IRRIGATION BANNER */}
          <section className="irrigation-banner">
            <div className="section-inner irrigation-inner">
              <div className="drop-icon">💧</div>
              <div>
                <h4>{irrigationTitle()}</h4>
                <p>{irrigationRecommendation()}</p>
              </div>
            </div>
          </section>

          {/* Feature cards (texts swapped to text.*) */}
          <main className="features-grid">
            <div className="section-inner features-grid-inner">
              {/* Pest Detection */}
              <div
                className="feature-card"
                onClick={() => navigate("/Solution")}
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1728297753604-d2e129bdb226?...')",
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate("/Solution")}
              >
                <div className="feature-content">
                  <h2>{text.pestTitle}</h2>
                  <p>{text.pestSub}</p>
                  <span className="feature-link">
                    {text.pestCta} <ChevronRight />
                  </span>
                </div>
              </div>

              {/* Mandi Prices */}
              <div
                className="feature-card"
                onClick={() => navigate("/mandi")}
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1637426992376-b8af65fb90d7?...')",
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate("/mandi")}
              >
                <div className="feature-content">
                  <h2>{text.mandiTitle}</h2>
                  <p>{text.mandiSub}</p>
                  <span className="feature-link">
                    {text.mandiCta} <ChevronRight />
                  </span>
                </div>
              </div>

              {/* Soil Moisture */}
              <div
                className="feature-card"
                onClick={() => navigate("/soil")}
                style={{
                  backgroundImage:
                    "url('https://wallpapercave.com/wp/wp1950223.jpg')",
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate("/soil")}
              >
                <div className="feature-content">
                  <h2>{text.soilTitle}</h2>
                  <p>{text.soilSub}</p>
                  <span className="feature-link">
                    {text.soilCta} <ChevronRight />
                  </span>
                </div>
              </div>

              {/* Kisan Mitra */}
              <div
                className="feature-card"
                onClick={() => navigate("/assistant")}
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1595956481935-a9e254951d49?...')",
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate("/assistant")}
              >
                <div className="feature-content">
                  <h2>{text.mitraTitle}</h2>
                  <p>{text.mitraSub}</p>
                  <span className="feature-link">
                    {text.mitraCta} <ChevronRight />
                  </span>
                </div>
              </div>
            </div>
          </main>

          {/* Floating scan action */}
          <button
            type="button"
            className="scan-wrapper"
            onClick={() => navigate("/scan")}
            aria-label="Open scanner"
          >
            <div
              style={{
                position: "relative",
                width: 120,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* OUTER RING — with soft yellow glow */}
              <div
                className="scan-main-circle"
                style={{
                  width: 120,
                  height: 120,
                  background: "#ffffff",
                  borderRadius: "50%",
                  boxShadow:
                    "0 0 22px rgba(255, 215, 0, 0.35), 0 18px 35px rgba(0,0,0,0.12)", // <-- yellow glow added
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* INNER WHITE DISK */}
                <div
                  style={{
                    width: 78,
                    height: 78,
                    borderRadius: "50%",
                    background: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 16px rgba(2,6,23,0.12)",
                  }}
                >
                  {/* GREEN CAMERA ICON */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* SMALL GREEN PILL — one line */}
            <div
              className="scan-main-pill"
              style={{
                marginTop: 8,
                padding: "8px 18px",
                borderRadius: "999px",
                background: "#16a34a",
                boxShadow: "0 12px 26px rgba(21,128,61,0.38)",
                textAlign: "center",
                minWidth: "210px",
                maxWidth: "240px",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                Use me to scan leaves or soil
              </span>
            </div>
          </button>



          {/* SIDEBAR SHEET */}
          <div className={`sheet ${sheetOpen ? "open" : ""}`}>
            <div className="sheet-header">
              <h2>{text.settingsTitle}</h2>
              <p>{text.settingsSub}</p>
            </div>

            <div className="profile-card">
              <div className="profile-avatar">R</div>
              <div className="profile-info">
                <h3>Ram Kumar</h3>
                <p>
                  <MapPin style={{ width: 12, height: 12 }} /> Siliguri, West
                  Bengal
                </p>
                <p>{text.profile}</p>
              </div>
              <ChevronRight className="chevron" />
            </div>

            <div className="menu">
              <button onClick={() => navigate("/profile")}>
                <div className="menu-icon">
                  <User />
                </div>
                <div className="menu-text">
                  <h4>{text.profile}</h4>
                  <p>{text.profileSub}</p>
                </div>
                <ChevronRight className="chevron" />
              </button>

              <button>
                <div className="menu-icon">
                  <Globe />
                </div>
                <div className="menu-text">
                  <h4>{text.langMenu}</h4>
                  <p>{text.langMenuSub}</p>
                </div>
                <ChevronRight className="chevron" />
              </button>

              <button>
                <div className="menu-icon">
                  <Shield />
                </div>
                <div className="menu-text">
                  <h4>{text.privacy}</h4>
                  <p>{text.privacySub}</p>
                </div>
                <ChevronRight className="chevron" />
              </button>

              <button>
                <div className="menu-icon">
                  <HelpCircle />
                </div>
                <div className="menu-text">
                  <h4>{text.help}</h4>
                  <p>{text.helpSub}</p>
                </div>
                <ChevronRight className="chevron" />
              </button>

              <button onClick={() => navigate("/about")}>
                <div className="menu-icon">
                  <Info />
                </div>
                <div className="menu-text">
                  <h4>{text.about}</h4>
                  <p>{text.aboutSub}</p>
                </div>
                <ChevronRight className="chevron" />
              </button>

              <button onClick={handleLogout}>
                <div className="menu-icon">
                  <LogOut />
                </div>
                <div className="menu-text">
                  <h4>{text.logout}</h4>
                  <p>{text.logoutSub}</p>
                </div>
                <ChevronRight className="chevron" />
              </button>
            </div>

            <div className="separator"></div>

            <div className="notification-section">
              <div className="notification-item">
                <div
                  className="notification-icon"
                  style={{ background: "#dbeafe" }}
                >
                  <Cloud style={{ color: "#2563eb" }} />
                </div>
                <div className="notification-text">
                  <p>{text.weatherAlerts}</p>
                  <span>{text.weatherAlertsSub}</span>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div
                  className="notification-icon"
                  style={{ background: "#fee2e2" }}
                >
                  <Bug style={{ color: "#dc2626" }} />
                </div>
                <div className="notification-text">
                  <p>{text.diseaseAlerts}</p>
                  <span>{text.diseaseAlertsSub}</span>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div
                  className="notification-icon"
                  style={{ background: "#dcfce7" }}
                >
                  <DollarSign style={{ color: "#16a34a" }} />
                </div>
                <div className="notification-text">
                  <p>{text.priceUpdates}</p>
                  <span>{text.priceUpdatesSub}</span>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div
                  className="notification-icon"
                  style={{ background: "#fef9c3" }}
                >
                  <Lightbulb style={{ color: "#ca8a04" }} />
                </div>
                <div className="notification-text">
                  <p>{text.adviceTips}</p>
                  <span>{text.adviceTipsSub}</span>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="app-info">
              <div style={{ fontSize: 22 }}>🌾</div>
              <h4>{text.appInfoTitle}</h4>
              <p>Version 1.0.0</p>
              <p>{text.appInfoSub}</p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="footer">{text.footer}</footer>
      </div>
    </>
  );
}
