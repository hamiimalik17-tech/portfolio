// ===== Dark Mode Toggle =====
const htmlEl = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// Check saved preference first, otherwise follow system (OS) setting
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

applyTheme(initialTheme);

themeToggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
});

function applyTheme(theme){
    htmlEl.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ===== Mobile Hamburger Menu =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
});

// ===== Nav Link Click Animation =====
// On click: 1) the glass pill slides behind the clicked link
//           2) a ripple expands from the click point
const navIndicator = document.getElementById('navIndicator');
const navLinks = navMenu.querySelectorAll('a');

function moveIndicatorTo(link){
    navIndicator.style.left = link.offsetLeft + 'px';
    navIndicator.style.width = link.offsetWidth + 'px';
    navIndicator.classList.add('show');

    // reset the 'pop' class so the animation can replay
    navIndicator.classList.remove('pop');
    void navIndicator.offsetWidth; // force reflow to restart animation
    navIndicator.classList.add('pop');
}

function createRipple(e, link){
    const rect = link.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);

    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

    link.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        moveIndicatorTo(link);
        createRipple(e, link);

        // close mobile menu after a link is tapped
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Mark "Home" active by default on load (desktop only)
window.addEventListener('load', () => {
    if (window.innerWidth > 768 && navLinks.length){
        navLinks[0].classList.add('active');
        moveIndicatorTo(navLinks[0]);
    }
});

// Keep the indicator aligned with the active link on resize
window.addEventListener('resize', () => {
    const activeLink = navMenu.querySelector('a.active');
    if (activeLink && window.innerWidth > 768){
        navIndicator.style.left = activeLink.offsetLeft + 'px';
        navIndicator.style.width = activeLink.offsetWidth + 'px';
    }
});

// ===== Scroll Reveal =====
// '.reveal' elements fade+slide in as they enter the viewport
const revealEls = document.querySelectorAll('.reveal');

// Stagger delay within a group (skills/projects cards)
revealEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.1 + 's';
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target); // reveal once, then stop watching
        }
    });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));
