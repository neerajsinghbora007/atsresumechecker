/* ============================================================
   ATS Resume Checker — Shared Components Loader
   File: /components/components.js
   
   HOW IT WORKS:
   - Loads /components/nav.html into <div id="nav-placeholder">
   - Loads /components/footer.html into <div id="footer-placeholder">
   - Auto-highlights the active nav link based on current URL
   - Handles mobile menu toggle
   - Injects Google Analytics GA4 on every page automatically
   
   TO UPDATE NAV OR FOOTER:
   Just edit /components/nav.html or /components/footer.html
   ALL pages update automatically. No other files need touching.
   
   TO UPDATE ANALYTICS:
   Just change the GA_ID below. All pages update automatically.
   ============================================================ */

(function() {

  /* ── GOOGLE ANALYTICS GA4 ── */
  var GA_ID = 'G-EDJQKR0X9G';
  if (!document.querySelector('script[src*="googletagmanager"]')) {
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(gaScript);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  /* ── LOAD COMPONENT ── */
  function loadComponent(placeholderId, url, callback) {
    const el = document.getElementById(placeholderId);
    if (!el) return;
    fetch(url)
      .then(function(r) { return r.text(); })
      .then(function(html) {
        el.outerHTML = html;
        if (callback) callback();
      })
      .catch(function(e) { console.warn('Component load failed:', url, e); });
  }

  /* ── ACTIVE NAV LINK ── */
  function setActiveLink() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a, .mobile-menu a');
    links.forEach(function(a) {
      a.classList.remove('active');
      const href = a.getAttribute('href');
      if (!href) return;
      // Exact match or starts-with for section paths
      if (
        (path === '/' && href === '/') ||
        (path === href) ||
        (path !== '/' && href !== '/' && path.startsWith(href) && href !== '/#services' && href !== '/#testimonials' && href !== '/#tools')
      ) {
        a.classList.add('active');
      }
    });
  }

  /* ── MOBILE MENU TOGGLE ── */
  window.toggleMenu = function() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('open');
  };

  /* ── CLOSE MENU ON OUTSIDE CLICK ── */
  document.addEventListener('click', function(e) {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    if (menu && hamburger && !menu.contains(e.target) && !hamburger.contains(e.target)) {
      menu.classList.remove('open');
    }
  });

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function() {
    loadComponent('nav-placeholder', '/components/nav.html', function() {
      setActiveLink();
      // Re-bind mobile toggle after nav loads
      const hamburger = document.querySelector('.hamburger');
      if (hamburger) {
        hamburger.onclick = window.toggleMenu;
      }
    });
    loadComponent('footer-placeholder', '/components/footer.html');
  });

})();
