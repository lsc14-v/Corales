const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const year = document.querySelector("#year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

const onScroll = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toggle?.addEventListener("click", () => {
  const open = nav?.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(Boolean(open)));
  toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Abrir menú");
  });
});

const sections = ["concepto", "investigacion", "proceso", "video"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const setActiveNav = () => {
  const offset = window.scrollY + header.offsetHeight + 40;
  let current = sections[0]?.id;

  sections.forEach((section) => {
    if (section.offsetTop <= offset) {
      current = section.id;
    }
  });

  nav?.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href")?.slice(1);
    link.classList.toggle("is-active", href === current);
  });
};

window.addEventListener("scroll", setActiveNav, { passive: true });
setActiveNav();

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const track = gallery.querySelector(".gallery__track");
  const slides = [...gallery.querySelectorAll(".gallery__slide")];
  const dots = [...gallery.querySelectorAll(".gallery__dots button")];
  const prev = gallery.querySelector(".gallery__nav--prev");
  const next = gallery.querySelector(".gallery__nav--next");
  let index = 0;

  const goTo = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  };

  prev?.addEventListener("click", () => goTo(index - 1));
  next?.addEventListener("click", () => goTo(index + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

  let startX = 0;
  track?.addEventListener(
    "touchstart",
    (event) => {
      startX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  track?.addEventListener(
    "touchend",
    (event) => {
      const delta = event.changedTouches[0].clientX - startX;
      if (Math.abs(delta) < 40) return;
      goTo(delta < 0 ? index + 1 : index - 1);
    },
    { passive: true }
  );
});
