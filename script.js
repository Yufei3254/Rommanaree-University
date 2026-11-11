async function loadNavigation() {
    const placeholders = document.querySelectorAll('#navbar-placeholder');
    const currentHeaders = document.querySelectorAll('.site-header');
    if (placeholders.length === 0 && currentHeaders.length === 0) return;

    const response = await fetch('navbar.html');
    if (!response.ok) {
        throw new Error(`Could not load navbar.html (${response.status})`);
    }

    const template = document.createElement('template');
    template.innerHTML = await response.text();
    const navigation = template.content.querySelector('.site-header');
    if (!navigation) {
        throw new Error('navbar.html does not contain a .site-header element');
    }

    placeholders.forEach((placeholder) => {
        placeholder.replaceWith(navigation.cloneNode(true));
    });

    currentHeaders.forEach((header) => {
        header.replaceWith(navigation.cloneNode(true));
    });

    const detailsElements = document.querySelectorAll('details');
    detailsElements.forEach((details) => {
        details.addEventListener('toggle', () => {
            if (details.open) {
                detailsElements.forEach((otherDetails) => {
                    if (otherDetails !== details) {
                        otherDetails.removeAttribute('open');
                    }
                });
            }
        });
    });

    document.querySelectorAll('.menu-toggle').forEach((menuToggle) => {
        const mobileMenu = document.getElementById(menuToggle.getAttribute('aria-controls'));
        if (!mobileMenu) return;

        const closeMobileMenu = () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'เปิดเมนู');
            mobileMenu.hidden = true;
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'เปิดเมนู' : 'ปิดเมนู');
            mobileMenu.hidden = isOpen;
        });

        mobileMenu.addEventListener('click', (event) => {
            if (event.target instanceof Element && event.target.closest('a')) {
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !mobileMenu.hidden) {
                closeMobileMenu();
                menuToggle.focus();
            }
        });
    });

    initializeAnnouncementNotification();
}

document.addEventListener('DOMContentLoaded', () => {
    loadNavigation().catch((error) => {
        console.error('Unable to load the site navigation:', error);
    });
    initializeScrollReveal();
    initializeHeroCarousel();
    initializeInteractiveHighlights();
});

function initializeAnnouncementNotification() {
    const bell = document.getElementById('announcementBell');
    const dot = document.getElementById('announcementBellDot');
    const notice = document.getElementById('announcementNotice');
    if (!bell || !dot || !notice) return;

    function closeNotice() {
        notice.hidden = true;
        bell.setAttribute('aria-expanded', 'false');
    }

    bell.addEventListener('click', () => {
        const opening = notice.hidden;
        notice.hidden = !opening;
        bell.setAttribute('aria-expanded', String(opening));
        if (opening) dot.hidden = true;
    });

    document.addEventListener('click', (event) => {
        if (event.target instanceof Node
            && !bell.contains(event.target)
            && !notice.contains(event.target)) {
            closeNotice();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !notice.hidden) {
            closeNotice();
            bell.focus();
        }
    });
}

function initializeInteractiveHighlights() {
    document.querySelectorAll('.interactive-highlight').forEach((highlight) => {
        highlight.addEventListener('click', () => {
            const isHighlighted = highlight.getAttribute('aria-pressed') === 'true';
            highlight.setAttribute('aria-pressed', String(!isHighlighted));
        });
    });
}

function initializeHeroCarousel() {
    const carousel = document.getElementById('heroCarousel');
    const track = document.getElementById('heroTrack');
    const previous = carousel?.querySelector('.hero-prev');
    const next = carousel?.querySelector('.hero-next');
    const slides = track ? [...track.children] : [];

    if (!carousel || !track || !previous || !next || slides.length < 2) return;

    let activeIndex = 0;
    let timer;
    let controlsTimer;

    function showSlide(index) {
        activeIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${activeIndex * 100}%)`;
    }

    function revealControls() {
        carousel.classList.add('controls-visible');
        window.clearTimeout(controlsTimer);
        controlsTimer = window.setTimeout(() => {
            carousel.classList.remove('controls-visible');
        }, 2500);
    }

    function stopAutoplay() {
        window.clearInterval(timer);
    }

    function startAutoplay() {
        stopAutoplay();
        if (!document.hidden) {
            timer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
        }
    }

    previous.addEventListener('click', () => {
        showSlide(activeIndex - 1);
        startAutoplay();
    });
    next.addEventListener('click', () => {
        showSlide(activeIndex + 1);
        startAutoplay();
    });
    carousel.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'mouse') revealControls();
    });
    document.addEventListener('visibilitychange', startAutoplay);

    startAutoplay();
}

function initializeScrollReveal() {
    if (!('IntersectionObserver' in window)
        || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const revealTargets = [...document.querySelectorAll('section, figure.university-image')];
    document.querySelectorAll('main').forEach((main) => {
        if (!main.querySelector('section')) {
            revealTargets.push(main);
        }
    });

    if (revealTargets.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle('is-scroll-visible', entry.isIntersecting);
        });
    }, { threshold: 0 });

    revealTargets.forEach((target) => {
        target.classList.add('scroll-reveal');
        observer.observe(target);
    });
}

const track = document.getElementById("track");
const prev = document.getElementById("prevBtn");
const next = document.getElementById("nextBtn");
const count = document.getElementById("slideCount");
const progress = document.getElementById("progressBar");
const carouselViewport = document.getElementById("carouselViewport");

if (track && prev && next && count && progress && carouselViewport) {
  const cards = [...track.children];
  let index = 0;
  let scrollFrame = 0;

  function getMetrics() {
    if (cards.length === 0) return { stride: 0, maxIndex: 0, visible: 0 };

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const stride = cardWidth + gap;
    const maxIndex = stride > 0
      ? Math.max(0, Math.round((carouselViewport.scrollWidth - carouselViewport.clientWidth) / stride))
      : 0;

    return {
      stride,
      visible: Math.max(1, cards.length - maxIndex),
      maxIndex
    };
  }

  function updateSlider() {
    const { maxIndex, visible } = getMetrics();
    index = Math.min(Math.max(index, 0), maxIndex);

    const firstVisible = Math.min(index + 1, cards.length);
    const lastVisible = Math.min(index + visible, cards.length);
    count.textContent = `${String(firstVisible).padStart(2, "0")} — ${String(lastVisible).padStart(2, "0")}`;
    progress.style.width = `${cards.length ? (lastVisible / cards.length) * 100 : 0}%`;
    prev.disabled = index === 0;
    next.disabled = index === maxIndex;
  }

  function goTo(nextIndex) {
    const { stride, maxIndex } = getMetrics();
    index = Math.min(Math.max(nextIndex, 0), maxIndex);
    carouselViewport.scrollTo({
      left: index * stride,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
    updateSlider();
  }

  prev.addEventListener("click", () => goTo(index - 1));
  next.addEventListener("click", () => goTo(index + 1));

  carouselViewport.addEventListener("scroll", () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const { stride, maxIndex } = getMetrics();
      if (stride > 0) index = Math.min(Math.round(carouselViewport.scrollLeft / stride), maxIndex);
      updateSlider();
    });
  }, { passive: true });

  carouselViewport.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
  });

  window.addEventListener("resize", () => goTo(index));
  updateSlider();
}
