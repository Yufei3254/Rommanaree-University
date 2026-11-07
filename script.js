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
}

document.addEventListener('DOMContentLoaded', () => {
    loadNavigation().catch((error) => {
        console.error('Unable to load the site navigation:', error);
    });
});