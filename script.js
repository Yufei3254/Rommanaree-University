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
    initializeUniversityColorCopy();
    initializeSiteFooter();
    initializePageJumpControls();
});

function initializeSiteFooter() {
    const existingFooter = document.querySelector('body > footer');
    if (existingFooter) existingFooter.remove();

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
        <div class="site-footer__inner">
            <h2 class="site-footer__heading">ติดต่อเรา</h2>
            <ul class="site-footer__contacts" aria-label="ช่องทางติดต่อ">
                <li class="site-footer__contact">
                    <svg class="site-footer__icon" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" fill="currentColor"></circle>
                        <path d="M13.3 20v-6h2l.3-2.2h-2.3v-1.4c0-.7.2-1 1-1h1.3V7.4c-.2 0-.9-.1-1.7-.1-1.8 0-3 1.1-3 3.1v1.4h-2v2.2h2v6z" fill="#73df6e"></path>
                    </svg>
                    <span class="site-footer__text">
                        <span class="site-footer__platform">Facebook</span>
                        <span class="site-footer__name">Rommanaree University</span>
                    </span>
                </li>
                <li class="site-footer__contact">
                    <svg class="site-footer__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect>
                        <circle cx="12" cy="12" r="4"></circle>
                        <circle cx="17.7" cy="6.5" r="1" fill="currentColor" stroke="none"></circle>
                    </svg>
                    <span class="site-footer__text">
                        <span class="site-footer__platform">Instagram</span>
                        <span class="site-footer__name">rommanaree.arttag.official_</span>
                    </span>
                </li>
                <li class="site-footer__contact">
                    <svg class="site-footer__icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M19.4 5.5a18 18 0 0 0-4.4-1.4l-.6 1.2a16 16 0 0 0-4.8 0L9 4.1a18 18 0 0 0-4.4 1.4C1.8 9.7 1 13.7 1.4 17.7a18 18 0 0 0 5.4 2.7l1.2-2a11 11 0 0 1-1.9-.9l.5-.4a13 13 0 0 0 11.1 0l.5.4a11 11 0 0 1-1.9.9l1.2 2a18 18 0 0 0 5.4-2.7c.5-4.7-.8-8.6-3.5-12.2ZM8.8 14.7c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.4 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"></path>
                    </svg>
                    <span class="site-footer__text">
                        <span class="site-footer__platform">Discord</span>
                        <span class="site-footer__name">Rommanaree University</span>
                    </span>
                </li>
            </ul>
            <a class="site-footer__apply" href="application.html">สมัครเข้าศึกษา</a>
        </div>
    `;
    document.body.append(footer);
}

function initializePageJumpControls() {
    const controls = document.createElement('div');
    controls.className = 'page-jump-controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'เลื่อนหน้าอย่างรวดเร็ว');
    controls.setAttribute('aria-hidden', 'true');
    controls.innerHTML = `
        <button class="page-jump-button" type="button" aria-label="กลับไปด้านบน" title="กลับไปด้านบน">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"></path></svg>
        </button>
    `;
    document.body.append(controls);

    const button = controls.querySelector('button');
    const scrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    let scrollAction = 'up';
    let previousScrollY = window.scrollY;
    let programmaticScroll = false;
    let programmaticScrollTimer;

    function setScrollAction(action) {
        scrollAction = action;
        const goingUp = action === 'up';
        button.setAttribute('aria-label', goingUp ? 'กลับไปด้านบน' : 'เลื่อนไปท้ายหน้า');
        button.title = goingUp ? 'กลับไปด้านบน' : 'ไปท้ายหน้า';
        button.innerHTML = goingUp
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"></path></svg>'
            : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14m-6-6 6 6 6-6"></path></svg>';
    }

    button.addEventListener('click', () => {
        programmaticScroll = true;
        window.clearTimeout(programmaticScrollTimer);
        programmaticScrollTimer = window.setTimeout(() => {
            programmaticScroll = false;
        }, 2500);

        const pageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        window.scrollTo({
            top: scrollAction === 'up' ? 0 : pageHeight,
            behavior: scrollBehavior
        });
    });

    const updateVisibility = () => {
        const currentScrollY = window.scrollY;
        if (!programmaticScroll && currentScrollY !== previousScrollY) {
            setScrollAction(currentScrollY > previousScrollY ? 'up' : 'down');
        }
        previousScrollY = currentScrollY;

        const isVisible = window.scrollY > 120;
        controls.classList.toggle('is-visible', isVisible);
        controls.setAttribute('aria-hidden', String(!isVisible));
    };

    window.addEventListener('scroll', () => {
        if (programmaticScroll) {
            window.clearTimeout(programmaticScrollTimer);
            programmaticScrollTimer = window.setTimeout(() => {
                programmaticScroll = false;
            }, 250);
        }
        updateVisibility();
    }, { passive: true });
    window.addEventListener('resize', updateVisibility);
    updateVisibility();
}

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

function initializeUniversityColorCopy() {
    const copyButton = document.getElementById('universityColorCopy');
    const toast = document.getElementById('colorCopyToast');
    if (!copyButton || !toast) return;

    let toastTimer;
    function showToast(message) {
        window.clearTimeout(toastTimer);
        toast.textContent = message;
        toast.hidden = false;
        toastTimer = window.setTimeout(() => {
            toast.hidden = true;
        }, 2400);
    }

    copyButton.addEventListener('click', async () => {
        const color = copyButton.dataset.copy;
        if (!color) {
            console.error('The university color button is missing its copy value.');
            showToast('ไม่พบโค้ดสีสำหรับคัดลอก');
            return;
        }

        if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
            console.error('Clipboard API is unavailable in this browser context.');
            showToast(`คัดลอกไม่สำเร็จ กรุณาคัดลอก ${color}`);
            return;
        }

        try {
            await navigator.clipboard.writeText(color);
            showToast(`คัดลอกโค้ดสี ${color} แล้ว`);
        } catch (error) {
            console.error('Unable to copy the university color:', error);
            showToast(`คัดลอกไม่สำเร็จ กรุณาคัดลอก ${color}`);
        }
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

    const revealTargets = [...document.querySelectorAll('section, figure.university-image, .about-history__quote')];
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
