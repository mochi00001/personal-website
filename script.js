/* ============================================================
   Luis Madriz — portfolio
   ============================================================ */
(function () {
    'use strict';

    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Theme ---------- */
    const themeToggle = document.getElementById('theme-toggle');
    const storedTheme = safeGet('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(storedTheme || (systemDark ? 'dark' : 'light'));

    themeToggle?.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        safeSet('theme', next);
    });

    function setTheme(theme) {
        root.dataset.theme = theme;
        themeToggle?.setAttribute('aria-pressed', String(theme === 'light'));
    }

    /* ---------- Language ---------- */
    const langToggle = document.getElementById('lang-toggle');
    const langLabel = langToggle?.querySelector('.lang-current');
    const META = {
        es: {
            title: 'Luis Madriz — Administración de Tecnologías de Información',
            desc: 'Luis Steven Madriz Campos — estudiante avanzado de Administración de Tecnologías de Información (TEC). El puente entre las necesidades del negocio y las soluciones tecnológicas.'
        },
        en: {
            title: 'Luis Madriz — Information Technology Management',
            desc: 'Luis Steven Madriz Campos — senior student of Information Technology Management (TEC). The bridge between business needs and technology solutions.'
        }
    };
    const storedLang = safeGet('lang');
    const browserLang = (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
    setLang(storedLang || browserLang);

    langToggle?.addEventListener('click', () => {
        const next = root.dataset.lang === 'es' ? 'en' : 'es';
        setLang(next);
        safeSet('lang', next);
    });

    function setLang(lang) {
        root.dataset.lang = lang;
        root.setAttribute('lang', lang);
        if (langLabel) langLabel.textContent = lang === 'es' ? 'EN' : 'ES';
        langToggle?.setAttribute('aria-label',
            lang === 'es' ? 'Switch to English' : 'Cambiar a español');
        const m = META[lang];
        if (m) {
            document.title = m.title;
            document.querySelector('meta[name="description"]')?.setAttribute('content', m.desc);
        }
    }

    /* ---------- Navbar scroll state ---------- */
    const navbar = document.querySelector('.navbar');
    const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- Mobile menu ---------- */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    menuToggle?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });

    navLinks?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuToggle?.setAttribute('aria-expanded', 'false');
        });
    });

    /* ---------- Active nav link ---------- */
    const sections = document.querySelectorAll('main section[id]');
    const navItems = new Map();
    document.querySelectorAll('.nav-links a').forEach((a) => {
        navItems.set(a.getAttribute('href').slice(1), a);
    });

    if ('IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    navItems.forEach((el) => el.classList.remove('active'));
                    navItems.get(entry.target.id)?.classList.add('active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach((s) => spy.observe(s));
    }

    /* ---------- Scroll reveal ---------- */
    const revealables = document.querySelectorAll(
        '.section-header, .about-text, .about-info, .timeline-item, .skill-category, .project-card, .edu-col, .contact-item'
    );

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealables.forEach((el) => el.classList.add('is-visible'));
    } else {
        revealables.forEach((el) => el.classList.add('reveal'));

        const reveal = (el) => el.classList.add('is-visible');
        const inView = (el) => {
            const r = el.getBoundingClientRect();
            return r.top < (window.innerHeight || 0) * 0.92 && r.bottom > 0;
        };

        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    reveal(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

        revealables.forEach((el) => revealObserver.observe(el));

        // Fallbacks: reveal anything on/near screen even if the observer is slow to fire,
        // and guarantee everything is shown after load so content is never stuck hidden.
        const sweep = () => revealables.forEach((el) => { if (inView(el)) reveal(el); });
        requestAnimationFrame(sweep);
        window.addEventListener('load', sweep);
        window.addEventListener('scroll', sweep, { passive: true });
        setTimeout(() => revealables.forEach(reveal), 2500);
    }

    /* ---------- Footer year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* ---------- Safe storage helpers ---------- */
    function safeGet(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    }
    function safeSet(key, value) {
        try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
    }
})();
