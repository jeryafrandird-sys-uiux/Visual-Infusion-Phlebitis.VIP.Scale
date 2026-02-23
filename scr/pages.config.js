/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Home from './pages/Home';
import Monitor from './pages/Monitor';
import PanduanVIPScale from './pages/PanduanVIPScale';
import RiwayatLog from './pages/RiwayatLog';
import Skor0 from './pages/Skor0';
import Skor1 from './pages/Skor1';
import Skor2 from './pages/Skor2';
import Skor3 from './pages/Skor3';
import Skor4 from './pages/Skor4';
import Skor5 from './pages/Skor5';
import DemoAplikasi from './pages/DemoAplikasi';


export const PAGES = {
    "Home": Home,
    "Monitor": Monitor,
    "PanduanVIPScale": PanduanVIPScale,
    "RiwayatLog": RiwayatLog,
    "Skor0": Skor0,
    "Skor1": Skor1,
    "Skor2": Skor2,
    "Skor3": Skor3,
    "Skor4": Skor4,
    "Skor5": Skor5,
    "DemoAplikasi": DemoAplikasi,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};
