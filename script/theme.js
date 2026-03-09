/**
 * Light/dark theme toggle. Uses data-theme on <html> and localStorage.
 * Run after DOM ready to bind toggle buttons and sync icon/label.
 */
(function () {
  var STORAGE_KEY = 'theme';

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function setTheme(theme) {
    theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
    updateToggleUI();
  }

  function updateToggleUI() {
    var theme = getTheme();
    var toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(function (btn) {
      var icon = btn.querySelector('.theme-toggle-icon');
      if (theme === 'dark') {
        btn.setAttribute('aria-label', 'Switch to light mode');
        btn.setAttribute('title', 'Switch to light mode');
        if (icon) {
          icon.className = 'fas fa-sun theme-toggle-icon';
        }
      } else {
        btn.setAttribute('aria-label', 'Switch to dark mode');
        btn.setAttribute('title', 'Switch to dark mode');
        if (icon) {
          icon.className = 'fas fa-moon theme-toggle-icon';
        }
      }
    });
    // Update pill wrapper label and state for neumorphic style
    var wraps = document.querySelectorAll('.theme-toggle-wrap');
    wraps.forEach(function (wrap) {
      wrap.classList.toggle('is-dark', theme === 'dark');
      var label = wrap.querySelector('.theme-toggle-label');
      if (label) {
        label.textContent = theme === 'dark' ? 'DARK' : 'LIGHT';
      }
    });
  }

  function handleToggle() {
    var next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  function init() {
    updateToggleUI();
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.removeEventListener('click', handleToggle);
      btn.addEventListener('click', handleToggle);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
