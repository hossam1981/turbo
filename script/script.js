console.log('script magic is ready')
// <!-- Add Google Maps -->
// function myMap() {
//     var mapCanvas = document.getElementById("map");
//     var myCenter = new google.maps.LatLng(40.4290, -74.1651);
//     var mapOptions = {
//         center: myCenter,
//         zoom: 9
//     };
//     var map = new google.maps.Map(mapCanvas, mapOptions);

//     var marker = new google.maps.Marker({
//         position: myCenter,
//         animation: google.maps.Animation.BOUNCE
//     });
//     marker.setMap(map);
// }

// Smooth navbar state transition on scroll
const navbar = document.getElementById("myNavbar");
let navbarScrolled = false;
let navbarTicking = false;
const NAV_ENTER_SCROLL_Y = 90;
const NAV_EXIT_SCROLL_Y = 60;

function applyNavbarState() {
    if (!navbar) return;

    const y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const shouldBeScrolled = navbarScrolled ? y > NAV_EXIT_SCROLL_Y : y > NAV_ENTER_SCROLL_Y;

    if (shouldBeScrolled !== navbarScrolled) {
        navbarScrolled = shouldBeScrolled;
        navbar.classList.toggle("w3-white", shouldBeScrolled);
        navbar.classList.toggle("w3-card", shouldBeScrolled);
    }
}

function onScrollNavbar() {
    if (!navbarTicking) {
        window.requestAnimationFrame(function () {
            applyNavbarState();
            navbarTicking = false;
        });
        navbarTicking = true;
    }
}

window.addEventListener("scroll", onScrollNavbar, { passive: true });
window.addEventListener("load", applyNavbarState);

// Used to toggle the menu on small screens when clicking on the menu button

function toggleFunction() {
    var x = document.getElementById("NavSmall");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}

// Services display: 3D carousel, card grid, peek carousel (localStorage; mobile = peek only, desktop = 3d/grid)
(function initServicesView() {
    var STORAGE_KEY = 'servicesView';
    var display = document.getElementById('services-display');
    if (!display) return;

    var buttons = display.querySelectorAll('.services-view-btn');
    var mobileBreakpoint = 768;

    function isMobile() {
        return window.innerWidth <= mobileBreakpoint;
    }

    function setView(view) {
        if (view !== 'grid' && view !== 'peek') view = '3d';
        display.setAttribute('data-view', view);
        buttons.forEach(function (btn) {
            var isActive = btn.getAttribute('data-view') === view;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        try { localStorage.setItem(STORAGE_KEY, view); } catch (e) {}
    }

    function applyViewportView() {
        if (isMobile()) {
            setView('peek');
        } else {
            var current = display.getAttribute('data-view');
            if (current === 'peek') setView('3d');
        }
    }

    var saved = '';
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (isMobile()) {
        setView('peek');
    } else {
        if (saved === 'grid' || saved === 'peek') setView(saved === 'peek' ? '3d' : saved);
        else setView('3d');
    }
    applyViewportView();

    window.addEventListener('resize', function () {
        applyViewportView();
    });

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () { setView(btn.getAttribute('data-view')); });
    });
})();
