// ===== Dark Mode Toggle =====
const htmlEl = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// Pehle check karo user ne pehle se koi preference save ki hai ya nahi,
// warna system (OS) ki dark/light setting follow karo
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
// Click hote hi: 1) blurry glass pill us link ke peeche animate ho ke aati hai
//                2) ek ripple effect click point se expand hota hai
const navIndicator = document.getElementById('navIndicator');
const navLinks = navMenu.querySelectorAll('a');

function moveIndicatorTo(link){
    navIndicator.style.left = link.offsetLeft + 'px';
    navIndicator.style.width = link.offsetWidth + 'px';
    navIndicator.classList.add('show');

    // 'pop' animation dobara chalane ke liye class ko reset karte hain
    navIndicator.classList.remove('pop');
    void navIndicator.offsetWidth; // reflow force karo taake animation restart ho
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

        // Mobile par menu band ho jaye
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Page load hote hi "Home" ko default active mark kar dete hain (agar desktop hai)
window.addEventListener('load', () => {
    if (window.innerWidth > 768 && navLinks.length){
        navLinks[0].classList.add('active');
        moveIndicatorTo(navLinks[0]);
    }
});

// Window resize hone par indicator ki position update karo (active link ke sath)
window.addEventListener('resize', () => {
    const activeLink = navMenu.querySelector('a.active');
    if (activeLink && window.innerWidth > 768){
        navIndicator.style.left = activeLink.offsetLeft + 'px';
        navIndicator.style.width = activeLink.offsetWidth + 'px';
    }
});

// ===== Scroll Reveal =====
// '.reveal' wale elements screen par aate hi fade+slide in honge
const revealEls = document.querySelectorAll('.reveal');

// Ek group (skills/projects cards) mein stagger delay dene ke liye index track karte hain
revealEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.1 + 's';
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target); // ek dafa reveal ho gaya, bas
        }
    });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));