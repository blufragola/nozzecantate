import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

// Add title and meta description tags for SEO
document.title = "Wedding Song Planner - Create Your Perfect Ceremony Music";

const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'Select and organize church songs for your wedding ceremony. Preview audio, view lyrics, and create a customized music plan for each moment of your special day.';
document.head.appendChild(metaDescription);

// Open Graph tags for better social sharing
const ogTitle = document.createElement('meta');
ogTitle.setAttribute('property', 'og:title');
ogTitle.content = 'Wedding Song Planner - Create Your Perfect Ceremony Music';
document.head.appendChild(ogTitle);

const ogDescription = document.createElement('meta');
ogDescription.setAttribute('property', 'og:description');
ogDescription.content = 'Select and organize church songs for your wedding ceremony. Preview audio, view lyrics, and create a customized music plan.';
document.head.appendChild(ogDescription);

const ogType = document.createElement('meta');
ogType.setAttribute('property', 'og:type');
ogType.content = 'website';
document.head.appendChild(ogType);

// Add Google Fonts link
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Raleway:wght@300;400;500;600&display=swap';
document.head.appendChild(fontLink);

root.render(<App />);
