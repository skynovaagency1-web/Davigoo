import React from "react";
import ReactDOM from "react-dom/client";
import { DriversPage, FaqPage, HowPage, RidesPage, SafetyPage } from "@/pages/site-pages";
import "./index.css";

// One entry for the menu pages; each HTML file names its page with <body data-page="…">.
const PAGES = { fonctionnement: HowPage, trajets: RidesPage, securite: SafetyPage, chauffeurs: DriversPage, faq: FaqPage } as const;
const Page = PAGES[document.body.dataset.page as keyof typeof PAGES] ?? HowPage;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
);
