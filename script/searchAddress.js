// var searchAddress1 = 'search_address1';
// var searchAddress2 = 'search_address2';

// $(document).ready(function () {
//     var autocomplete1;
//     var autocomplete2;
//     autocomplete1 = new google.maps.places.Autocomplete((document.getElementById(searchAddress1)), {
//         types: ['geocode'],
//         componentRestrictions: {
//             country: "USA"
//         }
//     });
//     autocomplete2 = new google.maps.places.Autocomplete((document.getElementById(searchAddress2)), {
//         types: ['geocode'],
//         componentRestrictions: {
//             country: "USA"
//         }
//     });

//     google.maps.event.addListener(autocomplete1, 'place_changed', function () {
//         var near_place = autocomplete.getPlace();
//         document.getElementById('loc_lat').value = near_place.geometry.location.lat();
//         document.getElementById('loc_long').value = near_place.geometry.location.lng();

//         document.getElementById('latitude_view').innerHTML = near_place.geometry.location.lat();
//         document.getElementById('longitude_view').innerHTML = near_place.geometry.location.lng();
//     });
//     google.maps.event.addListener(autocomplete2, 'place_changed', function () {
//         var near_place = autocomplete.getPlace();
//         document.getElementById('loc_lat').value = near_place.geometry.location.lat();
//         document.getElementById('loc_long').value = near_place.geometry.location.lng();

//         document.getElementById('latitude_view').innerHTML = near_place.geometry.location.lat();
//         document.getElementById('longitude_view').innerHTML = near_place.geometry.location.lng();
//     });

// });

// $(document).on('change', '#' + searchAddress1, function () {
//     document.getElementById('latitude_input').value = '';
//     document.getElementById('longitude_input').value = '';

//     document.getElementById('latitude_view').innerHTML = '';
//     document.getElementById('longitude_view').innerHTML = '';
// });
// $(document).on('change', '#' + searchAddress2, function () {
//     document.getElementById('latitude_input').value = '';
//     document.getElementById('longitude_input').value = '';

//     document.getElementById('latitude_view').innerHTML = '';
//     document.getElementById('longitude_view').innerHTML = '';
// });