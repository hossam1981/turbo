/**
 * Peek carousel: active slide from scroll, scale effect, auto-advance (slide left, infinite loop).
 * User can still scroll/drag manually.
 */
(function () {
  var carousel = document.getElementById('peek-carousel');
  if (!carousel) return;

  var slides = carousel.querySelectorAll('.peek-slide');
  if (!slides.length) return;

  var AUTO_INTERVAL_MS = 3000;
  var PAUSE_AFTER_INTERACTION_MS = 8000;
  var autoTimer = null;
  var pauseAfterInteraction = null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setActiveIndex(index) {
    index = Math.max(0, Math.min(index, slides.length - 1));
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === index);
    });
  }

  function updateActiveFromScroll() {
    var scrollLeft = carousel.scrollLeft;
    var containerCenter = scrollLeft + carousel.clientWidth / 2;
    var bestIndex = 0;
    var bestDist = Infinity;
    slides.forEach(function (slide, i) {
      var slideLeft = slide.offsetLeft;
      var slideCenter = slideLeft + slide.offsetWidth / 2;
      var dist = Math.abs(containerCenter - slideCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    });
    setActiveIndex(bestIndex);
  }

  function scrollToSlideIndex(index) {
    var slide = slides[index];
    if (!slide) return;
    var targetLeft = slide.offsetLeft - (carousel.clientWidth / 2) + (slide.offsetWidth / 2);
    targetLeft = Math.max(0, Math.min(targetLeft, carousel.scrollWidth - carousel.clientWidth));
    carousel.scrollTo({ left: targetLeft, behavior: 'smooth' });
  }

  function getCurrentIndex() {
    var scrollLeft = carousel.scrollLeft;
    var containerCenter = scrollLeft + carousel.clientWidth / 2;
    var bestIndex = 0;
    var bestDist = Infinity;
    slides.forEach(function (slide, i) {
      var slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      var dist = Math.abs(containerCenter - slideCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    });
    return bestIndex;
  }

  function goToNext() {
    var current = getCurrentIndex();
    if (current >= slides.length - 1) {
      scrollToSlideIndex(0);
    } else {
      scrollToSlideIndex(current + 1);
    }
  }

  function startAutoAdvance() {
    if (reduceMotion || autoTimer) return;
    autoTimer = setInterval(goToNext, AUTO_INTERVAL_MS);
  }

  function stopAutoAdvance() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function onUserInteraction() {
    stopAutoAdvance();
    if (pauseAfterInteraction) clearTimeout(pauseAfterInteraction);
    pauseAfterInteraction = setTimeout(startAutoAdvance, PAUSE_AFTER_INTERACTION_MS);
  }

  carousel.addEventListener('scroll', updateActiveFromScroll);
  if ('onscrollend' in carousel) {
    carousel.addEventListener('scrollend', updateActiveFromScroll);
  }

  carousel.addEventListener('pointerdown', onUserInteraction);
  carousel.addEventListener('touchstart', onUserInteraction);
  carousel.addEventListener('wheel', onUserInteraction, { passive: true });

  setActiveIndex(0);
  updateActiveFromScroll();
  if (!reduceMotion) startAutoAdvance();
})();
