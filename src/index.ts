import "./style.css";
import { data } from "./data";
import { renderHero } from "./sections/hero";
import { renderAbout } from "./sections/about";
import { renderTheme } from "./sections/theme";
import { renderEvents } from "./sections/events";
import { renderEventDetails } from "./sections/event-details";
import { renderSchedule } from "./sections/schedule";
import { renderGeneralRules } from "./sections/general-rules";
import { renderContacts } from "./sections/contacts";

const root = document.documentElement;
const menu = document.getElementById("nav-mobile");
const menuButton = document.getElementById("menu-toggle");

/** Fills the desktop and mobile nav from data.nav. */
function renderNav(): void {
  try {
    const desktop = document.getElementById("nav-desktop");
    const mobile = document.getElementById("nav-mobile-links");
    for (const item of data.nav) {
      const desktopLink = document.createElement("a");
      desktopLink.href = `#${item.id}`;
      desktopLink.textContent = item.label;
      desktopLink.className = "hover:text-primary";
      desktop?.append(desktopLink);

      const mobileLink = document.createElement("a");
      mobileLink.href = `#${item.id}`;
      mobileLink.textContent = item.label;
      mobileLink.className = "rounded-lg px-2 py-2 hover:bg-surface";
      mobileLink.addEventListener("click", () => setMenuOpen(false));
      mobile?.append(mobileLink);
    }
  } catch (e) {
    console.error(":::::renderNav:::::", e);
  }
}

/** Switches light/dark and remembers the choice. */
function toggleTheme(): void {
  try {
    const next = root.dataset["theme"] === "dark" ? "light" : "dark";
    root.dataset["theme"] = next;
    localStorage.setItem("theme", next);
  } catch (e) {
    console.error(":::::toggleTheme:::::", e);
  }
}

/** Opens or closes the mobile menu. */
function setMenuOpen(open: boolean): void {
  try {
    menu?.classList.toggle("hidden", !open);
    menuButton?.setAttribute("aria-expanded", String(open));
    menuButton?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  } catch (e) {
    console.error(":::::setMenuOpen:::::", e);
  }
}

/** Sets the page title, brand name and footer from data.site. */
function renderSite(): void {
  try {
    const title = `${data.site.name} ${data.site.year}`;
    document.title = title;
    const brand = document.getElementById("site-name");
    if (brand) brand.textContent = data.site.name;
    const host = document.getElementById("footer-host");
    if (host) host.textContent = `© ${title} · ${data.footer.hostedBy}`;
    const note = document.getElementById("footer-note");
    if (note) note.textContent = data.footer.disclaimer;
  } catch (e) {
    console.error(":::::renderSite:::::", e);
  }
}

renderSite();
renderNav();
renderHero();
renderAbout();
renderTheme();
renderEvents();
renderEventDetails();
renderSchedule();
renderGeneralRules();
renderContacts();
document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);
menuButton?.addEventListener("click", () => setMenuOpen(menu?.classList.contains("hidden") ?? false));
