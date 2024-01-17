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

// Change style of navbar on scroll
window.onscroll = function () {
    myFunction()
};

function myFunction() {
    var navbar = document.getElementById("myNavbar");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        navbar.className = "w3-bar" + " w3-card" + " w3-animate-top" + " w3-white";
    } else {
        navbar.className = navbar.className.replace(" w3-card w3-animate-top w3-white", "");
    }
}

// Used to toggle the menu on small screens when clicking on the menu button

function toggleFunction() {
    var x = document.getElementById("NavSmall");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}
