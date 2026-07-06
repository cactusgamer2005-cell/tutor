/* ==========================================================================
   Daria English — скрипты лендинга
   1. Год в футере
   2. Шапка при скролле
   3. Мобильное меню
   4. Появление блоков при скролле (reveal)
   5. Линия таймлайна
   6. Аккордеон FAQ
   7. Слайдер отзывов
   8. Лёгкий параллакс фоновых пятен в hero
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Год в футере ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 2. Шапка при скролле ---------- */
  const header = document.getElementById("site-header");
  const onScrollHeader = () => {
    if (window.scrollY > 12) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- 3. Мобильное меню ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    });
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 4. Появление блоков при скролле ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- 5. Линия таймлайна ---------- */
  const timeline = document.querySelector(".timeline");
  if (timeline && "IntersectionObserver" in window) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timeline.classList.add("in-view");
            timelineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    timelineObserver.observe(timeline);
  }

  /* ---------- 6. Аккордеон FAQ ---------- */
  const accordionItems = document.querySelectorAll(".accordion-item");
  accordionItems.forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    trigger.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      accordionItems.forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- 7. Слайдер отзывов ---------- */
  const track = document.getElementById("testimonials-track");
  const prevBtn = document.getElementById("t-prev");
  const nextBtn = document.getElementById("t-next");
  const dotsWrap = document.getElementById("t-dots");

  if (track && dotsWrap) {
    const cards = Array.from(track.children);
    cards.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Перейти к отзыву ${i + 1}`);
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", () => scrollToCard(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function scrollToCard(index) {
      const card = cards[index];
      if (!card) return;
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
    }

    function getCurrentIndex() {
      const trackLeft = track.scrollLeft;
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - track.offsetLeft - trackLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      return closest;
    }

    function updateDots() {
      const current = getCurrentIndex();
      dots.forEach((d, i) => d.classList.toggle("is-active", i === current));
    }

    let scrollTimeout;
    track.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateDots, 100);
    }, { passive: true });

    prevBtn.addEventListener("click", () => {
      const current = getCurrentIndex();
      scrollToCard(Math.max(0, current - 1));
    });
    nextBtn.addEventListener("click", () => {
      const current = getCurrentIndex();
      scrollToCard(Math.min(cards.length - 1, current + 1));
    });
  }

  /* ---------- 8. Лёгкий параллакс фоновых пятен в hero ---------- */
  if (!reduceMotion) {
    const blobs = document.querySelectorAll(".hero-blob");
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        blobs.forEach((blob, i) => {
          const speed = i === 0 ? 0.06 : 0.09;
          blob.style.transform = `translateY(${y * speed}px)`;
        });
        ticking = false;
      });
    }, { passive: true });
  }
});
