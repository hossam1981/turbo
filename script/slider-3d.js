/**
 * 3D Carousel – matches "3D Carousel With Mouse & Touch Interactions" (cssscript.com).
 * drag-container: camera rotation (applyTranform on drag).
 * spin-container: holds items, has spin animation; item positions set in init().
 */
(function () {
  var radius = 380;
  var autoRotate = true;
  var rotateSpeed = -60;
  var imgWidth = 336;
  var imgHeight = 357;

  var odrag = document.getElementById('drag-container');
  var ospin = document.getElementById('spin-container');
  if (!odrag || !ospin) return;

  var aEle = [].slice.call(ospin.querySelectorAll('.slider-3d-item'));
  if (!aEle.length) return;

  ospin.style.width = imgWidth + 'px';
  ospin.style.height = imgHeight + 'px';

  function init(delayTime) {
    var n = aEle.length;
    var angleStep = 360 / n;
    for (var i = 0; i < n; i++) {
      var deg = i * angleStep;
      aEle[i].style.transform = 'rotateY(' + deg + 'deg) translateZ(' + radius + 'px)';
      aEle[i].style.transition = 'transform 1s';
      aEle[i].style.transitionDelay = delayTime ? (delayTime + 's') : (n - i) / 4 + 's';
    }
  }

  function applyTranform(obj) {
    if (tY > 180) tY = 180;
    if (tY < 0) tY = 0;
    obj.style.transform = 'rotateX(' + (-tY) + 'deg) rotateY(' + tX + 'deg)';
  }

  function playSpin(yes) {
    ospin.style.animationPlayState = yes ? 'running' : 'paused';
  }

  var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10;

  if (autoRotate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var animationName = rotateSpeed > 0 ? 'spin' : 'spinRevert';
    ospin.style.animation = animationName + ' ' + Math.abs(rotateSpeed) + 's infinite linear';
  }

  setTimeout(init, 100);

  var scene = document.querySelector('.slider-3d-scene');
  if (scene) {
    scene.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
    clearInterval(odrag.timer);
    sX = e.clientX;
    sY = e.clientY;
    function onMove(ev) {
      nX = ev.clientX;
      nY = ev.clientY;
      desX = nX - sX;
      desY = nY - sY;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      sX = nX;
      sY = nY;
    }
    function onUp() {
      odrag.timer = setInterval(function () {
        desX *= 0.95;
        desY *= 0.95;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTranform(odrag);
        playSpin(false);
        if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
          clearInterval(odrag.timer);
          playSpin(true);
        }
      }, 17);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('touchend', onUp);
    }
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('touchend', onUp, { once: true });
    });
  }
})();
