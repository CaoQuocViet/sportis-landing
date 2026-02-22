/**
 * Sportis Landing Page - JavaScript
 */

// Sports data for marquee
const SPORTS = [
  { id: 'tennis', name: 'Tennis', icon: '🎾', count: 120 },
  { id: 'badminton', name: 'Badminton', icon: '🏸', count: 200 },
  { id: 'football', name: 'Football', icon: '⚽', count: 150 },
  { id: 'pickleball', name: 'Pickleball', icon: '🥒', count: 85 },
  { id: 'basketball', name: 'Basketball', icon: '🏀', count: 60 },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐', count: 45 },
  { id: 'table-tennis', name: 'Table Tennis', icon: '🏓', count: 90 },
  { id: 'golf', name: 'Golf', icon: '⛳', count: 25 },
  { id: 'swimming', name: 'Swimming', icon: '🏊', count: 40 },
  { id: 'gym', name: 'Gym', icon: '🏋️', count: 180 },
  { id: 'yoga', name: 'Yoga', icon: '🧘', count: 75 },
  { id: 'billiards', name: 'Billiards', icon: '🎱', count: 55 },
  { id: 'bowling', name: 'Bowling', icon: '🎳', count: 20 },
  { id: 'squash', name: 'Squash', icon: '🎾', count: 15 },
  { id: 'futsal', name: 'Futsal', icon: '⚽', count: 70 },
  { id: 'padel', name: 'Padel', icon: '🎾', count: 30 },
];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initMarquee();
  initThemeToggle();
  initLanguageSelector();
  initMobileMenu();
  initScrollHeader();
  initSmoothScroll();
  initGlobalMap();
  initDevNotice();
  initAnnouncementBar();
});

/**
 * Initialize sport marquee
 */
function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;

  // Duplicate sports for infinite scroll effect
  const allSports = [...SPORTS, ...SPORTS];

  track.innerHTML = allSports.map((sport, idx) => `
    <a href="/player/search?sport=${sport.id}" class="sport-chip" style="animation-delay: ${(idx % 16) * 0.2}s">
      <span class="sport-icon">${sport.icon}</span>
      <span class="sport-name">${sport.name}</span>
      <span class="sport-count">${sport.count}</span>
    </a>
  `).join('');
}

/**
 * Initialize theme toggle (light/dark mode)
 */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // Check for saved preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  }

  toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

/**
 * Initialize language selector
 */
function initLanguageSelector() {
  const selector = document.getElementById('langSelector');
  const toggle = document.getElementById('langToggle');
  const dropdown = document.getElementById('langDropdown');
  const currentLang = document.querySelector('.lang-current');

  if (!selector || !toggle || !dropdown) return;

  // Toggle dropdown
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    selector.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!selector.contains(e.target)) {
      selector.classList.remove('active');
    }
  });

  // Handle language selection
  dropdown.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.dataset.lang;

      // Update active state
      dropdown.querySelectorAll('.lang-option').forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');

      // Update current language display
      if (currentLang) {
        currentLang.textContent = lang.toUpperCase();
      }

      // Close dropdown
      selector.classList.remove('active');

      // Save preference
      localStorage.setItem('language', lang);

      // In a real app, this would trigger language change
      console.log(`Language changed to: ${lang}`);
    });
  });

  // Load saved language
  const savedLang = localStorage.getItem('language');
  if (savedLang) {
    const savedOption = dropdown.querySelector(`[data-lang="${savedLang}"]`);
    if (savedOption) {
      dropdown.querySelectorAll('.lang-option').forEach(opt => opt.classList.remove('active'));
      savedOption.classList.add('active');
      if (currentLang) {
        currentLang.textContent = savedLang.toUpperCase();
      }
    }
  }
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  // Close menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  });
}

/**
 * Hide/show header on scroll
 */
function initScrollHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    const currentScrollY = window.scrollY;

    if (currentScrollY < 100) {
      // Always show when near top
      header.classList.remove('hidden');
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down - hide
      header.classList.add('hidden');
      // Also close mobile menu
      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu) mobileMenu.classList.remove('active');
    } else {
      // Scrolling up - show
      header.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = 80; // Account for fixed header
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Initialize Global Coverage Map with Leaflet
 */
function initGlobalMap() {
  const mapContainer = document.getElementById('globalMap');
  if (!mapContainer || typeof L === 'undefined') return;

  // Initialize map centered on Southeast Asia
  const map = L.map('globalMap', {
    center: [15, 110],
    zoom: 4,
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: false
  });

  // Add tile layer (CartoDB Positron - clean style)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(map);

  // Country markers with popup info
  const countries = [
    { lat: 14.0583, lng: 108.2772, name: 'Vietnam', flag: '🇻🇳', status: 'Live', currency: 'VND', gateways: 'VNPay, Momo, ZaloPay' },
    { lat: 15.8700, lng: 100.9925, name: 'Thailand', flag: '🇹🇭', status: 'Ready', currency: 'THB', gateways: 'PromptPay, TrueMoney' },
    { lat: 36.2048, lng: 138.2529, name: 'Japan', flag: '🇯🇵', status: 'Ready', currency: 'JPY', gateways: 'Stripe JP, PayPay' },
    { lat: 35.9078, lng: 127.7669, name: 'South Korea', flag: '🇰🇷', status: 'Ready', currency: 'KRW', gateways: 'Toss, KakaoPay' },
    { lat: 1.3521, lng: 103.8198, name: 'Singapore', flag: '🇸🇬', status: 'Ready', currency: 'SGD', gateways: 'PayNow, GrabPay' },
    { lat: -0.7893, lng: 113.9213, name: 'Indonesia', flag: '🇮🇩', status: 'Ready', currency: 'IDR', gateways: 'GoPay, Dana, OVO' },
    { lat: 12.8797, lng: 121.7740, name: 'Philippines', flag: '🇵🇭', status: 'Ready', currency: 'PHP', gateways: 'GCash, Maya' }
  ];

  // Custom marker icon
  const createIcon = (flag, isLive) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-pin ${isLive ? 'live' : 'ready'}"><span>${flag}</span></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
  };

  // Add markers
  countries.forEach(country => {
    const marker = L.marker([country.lat, country.lng], {
      icon: createIcon(country.flag, country.status === 'Live')
    }).addTo(map);

    const popupContent = `
      <div class="map-popup">
        <div class="popup-header">
          <span class="popup-flag">${country.flag}</span>
          <span class="popup-name">${country.name}</span>
          <span class="popup-status ${country.status.toLowerCase()}">${country.status}</span>
        </div>
        <div class="popup-info">
          <div><strong>Currency:</strong> ${country.currency}</div>
          <div><strong>Gateways:</strong> ${country.gateways}</div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, { className: 'sportis-popup' });
  });
}

/**
 * Initialize Development Notice Modal with countdown
 */
function initDevNotice() {
  const notice = document.getElementById('devNotice');
  const closeBtn = document.getElementById('devNoticeClose');
  const countdown = document.querySelector('.dev-notice-countdown');

  if (!notice || !closeBtn) return;

  // Check if already dismissed in this session
  if (sessionStorage.getItem('devNoticeDismissed')) {
    notice.classList.add('hidden');
    return;
  }

  let seconds = 5;

  // Countdown timer
  const timer = setInterval(() => {
    seconds--;
    if (countdown) {
      countdown.textContent = `(${seconds})`;
    }
    if (seconds <= 0) {
      clearInterval(timer);
      closeNotice();
    }
  }, 1000);

  function closeNotice() {
    notice.classList.add('hidden');
    sessionStorage.setItem('devNoticeDismissed', 'true');
  }

  // Click to close immediately
  closeBtn.addEventListener('click', () => {
    clearInterval(timer);
    closeNotice();
  });

  // Click overlay to close
  notice.addEventListener('click', (e) => {
    if (e.target === notice) {
      clearInterval(timer);
      closeNotice();
    }
  });
}

/**
 * Initialize Announcement Bar close behavior
 */
function initAnnouncementBar() {
  const bar = document.getElementById('announcementBar');
  const closeBtn = document.getElementById('closeAnnouncement');
  const header = document.getElementById('header');

  if (!bar || !closeBtn || !header) return;

  closeBtn.addEventListener('click', () => {
    bar.style.display = 'none';
    header.classList.add('no-announcement');
  });
}
