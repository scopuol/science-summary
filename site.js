const searchInput = document.getElementById('searchInput');
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const cards = Array.from(document.querySelectorAll('.summary-card'));
const emptyState = document.getElementById('emptyState');
const langToggle = document.getElementById('langToggle');

const translations = {
  en: {
    navHome: 'Home',
    navCollection: 'Summary collection',
    homeTitle: 'Science Summary Landing Page',
    heroIntro: '<strong>Welcome to the Science Summary Library!</strong> Discover scientific research made accessible to everyone. Here you’ll find clear, easy-to-read summaries of studies from different research groups. Explore topics that interest you, or click “Browse all summaries” to dive into the full collection.',
    browseBtn: 'Browse all summaries',
    previewTitle: 'A preview of available content',
    previewSubtitle: 'A rotating selection of summaries',
    collectionTitle: 'Summary collection',
    collectionSubtitle: 'Browse all available summaries.',
    searchPlaceholder: 'Search summaries, titles, or keywords',
    emptyState: 'No summaries match that search yet.',
    footerTitle: 'How to reach us:',
    readSummary: 'Read summary',
    sourceArticle: 'Source article'
  },
  de: {
    navHome: 'Startseite',
    navCollection: 'Sammlung von Zusammenfassungen',
    homeTitle: 'Science Summary Landing Page',
    heroIntro: '<strong>Willkommen in der Science Summary Library!</strong> Entdecken Sie wissenschaftliche Forschung, die für alle zugänglich gemacht wurde. Hier finden Sie klare, leicht verständliche Zusammenfassungen von Studien aus verschiedenen Forschungsgruppen. Entdecken Sie Themen, die Sie interessieren, oder klicken Sie auf „Alle Zusammenfassungen anzeigen“, um die gesamte Sammlung zu durchsuchen.',
    browseBtn: 'Alle Zusammenfassungen anzeigen',
    previewTitle: 'Eine Vorschau auf verfügbare Inhalte',
    previewSubtitle: 'Eine wechselnde Auswahl von Zusammenfassungen',
    collectionTitle: 'Sammlung von Zusammenfassungen',
    collectionSubtitle: 'Durchsuchen Sie alle verfügbaren Zusammenfassungen.',
    searchPlaceholder: 'Zusammenfassungen, Titel oder Stichwörter suchen',
    emptyState: 'Keine Zusammenfassungen passen zu dieser Suche.',
    footerTitle: 'So erreichen Sie uns:',
    readSummary: 'Zusammenfassung lesen',
    sourceArticle: 'Quellartikel'
  }
};

let activeFilter = 'All';

function applyFilters() {
  const query = (searchInput?.value || '').trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const matchesFilter = activeFilter === 'All' || card.dataset.category === activeFilter;
    const haystack = (card.dataset.search || '').toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    const show = matchesFilter && matchesSearch;
    card.style.display = show ? '' : 'none';
    if (show) visible += 1;
  });
  if (emptyState) emptyState.style.display = visible ? 'none' : 'block';
}

function setText(id, value, useHTML = false) {
  const el = document.getElementById(id);
  if (!el || value == null) return;
  if (useHTML) el.innerHTML = value;
  else el.textContent = value;
}

function applyLanguage(lang) {
  const t = translations[lang] || translations.en;
  window.currentLang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem('siteLanguage', lang);

  setText('navHome', t.navHome);
  setText('navCollection', t.navCollection);
  setText('homeTitle', t.homeTitle);
  setText('heroIntro', t.heroIntro, true);
  setText('browseBtn', t.browseBtn);
  setText('previewTitle', t.previewTitle);
  setText('previewSubtitle', t.previewSubtitle);
  setText('collectionTitle', t.collectionTitle);
  setText('collectionSubtitle', t.collectionSubtitle);
  setText('footerTitle', t.footerTitle);
  if (searchInput) searchInput.placeholder = t.searchPlaceholder;
  if (emptyState) emptyState.textContent = t.emptyState;

  document.querySelectorAll('.summary-card .card-actions .button.primary').forEach(btn => {
    btn.textContent = t.readSummary;
  });
  document.querySelectorAll('.summary-card .card-actions .button.secondary').forEach(btn => {
    btn.textContent = t.sourceArticle;
  });

  if (langToggle) {
    langToggle.textContent = lang === 'en' ? 'DE' : 'EN';
    langToggle.setAttribute('aria-label', lang === 'en' ? 'Switch to German' : 'Zu Englisch wechseln');
  }
}

window.applyLanguage = applyLanguage;

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter || 'All';
    applyFilters();
  });
});
if (searchInput) searchInput.addEventListener('input', applyFilters);
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const nextLang = (window.currentLang || localStorage.getItem('siteLanguage') || 'en') === 'en' ? 'de' : 'en';
    applyLanguage(nextLang);
  });
}
applyFilters();
applyLanguage(localStorage.getItem('siteLanguage') || 'en');
