let map;
let autocompleteInputs = []; // Array to store Google Places autocomplete objects
let waypointCounter = 1; // Counter to keep track of waypoints
let waypoints = []; // Array to track waypoints

// Initializes the Google Map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 8
    });

    // Add the first two waypoints
    addWaypoint();
    addWaypoint();
}



// Function to initialize Google Places Autocomplete
function initializeAutocomplete(id) {
    var inputElement = document.getElementById(id);
    var autocomplete = new google.maps.places.Autocomplete(inputElement);
    autocomplete.addListener('place_changed', function () {
        calculateRoute(); // Recalculate route when a place is changed
    });
    autocompleteInputs.push({ id: id, autocomplete: autocomplete });
}


// Function to dynamically add a new waypoint
// Function to dynamically add a new waypoint
function addWaypoint() {
    var waypointId = 'waypoint' + waypointCounter;
    var waypointContainer = document.createElement('div');
    waypointContainer.className = 'input-container handle';
    waypointContainer.id = 'container' + waypointId;

    // HTML for the waypoint input and the remove button 
    waypointContainer.innerHTML = `
<div class="search-input">
<i class="fas fa-map-marker-alt"></i>
<input type="text" id="${waypointId}" class="waypoint" name="${waypointId}" placeholder="Enter address">
<i class="fas fa-sort" style="left:90%"></i>
${waypointCounter >= 3 ? `<a onclick="removeWaypoint('${waypointId}')" class="remove-waypoint"><i class="fas fa-times"></i></a>` : ''}
</div>
`;
    document.getElementById('sortContainer').appendChild(waypointContainer);
    initializeAutocomplete(waypointId);

    // Add event listener for onchange
    var inputElement = document.getElementById(waypointId);
    inputElement.addEventListener('change', function () {
        checkSearch(waypointId);
    });

    waypointCounter++;
}




// Function to remove a waypoint
function removeWaypoint(waypointId) {
    var waypointContainer = document.getElementById('container' + waypointId);
    if (waypointContainer) {
        waypointContainer.remove();
        autocompleteInputs = autocompleteInputs.filter(item => item.id !== waypointId);
        calculateRoute(); // Recalculate route after removal
        // Update the waypoint IDs to reflect the current state of the DOM
        updateWaypointIDs();
        calculateRoute(); // other calculate route after removal
    }
}



// Function to calculate and display the route on the map
function calculateRoute() {

    var waypoints = Array.from(document.querySelectorAll('#sortContainer .waypoint')).map(input => {
        var autocompleteObject = autocompleteInputs.find(item => item.id === input.id);
        var place = autocompleteObject ? autocompleteObject.autocomplete.getPlace() : null;
        return place && place.geometry ? { location: place.geometry.location } : null;
    }).filter(Boolean);// Filter out any null entries

    // Log each waypoint's location
    waypoints.forEach(wp => {
        console.dir("Latitude:", wp.location.lat(), "Longitude:", wp.location.lng()); // Check the console for the output
    });

    if (waypoints.length < 2) { return; }  // Not enough waypoints to calculate a route

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer({ map: map, });

    var request = {
        origin: waypoints[0].location,
        destination: waypoints[waypoints.length - 1].location,
        waypoints: waypoints.slice(1, -1),
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);

            let totalDistance = 0;
            let totalTime = 0; // Initialize total time

            const route = response.routes[0];
            for (let i = 0; i < route.legs.length; i++) {
                totalDistance += route.legs[i].distance.value; // distance in meters
                totalTime += route.legs[i].duration.value; // duration in seconds
            }
            totalDistance = totalDistance / 1609.34; // Convert meters to miles
            totalTime = totalTime / 60; // Convert seconds to minutes

            // Update the total distance and time input fields
            document.getElementById('total-distance').value = totalDistance.toFixed(2) + ' miles';
            document.getElementById('total-time').value = totalTime.toFixed(2) + ' minutes'; // Ensure you have an input field for total time
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
    console.log("calculating route");
}



// insure every time i sort, the waypoint id gets updated also based on the its order
// i'll use it later to do more dynamic functions

function updateWaypointIDs() {
    var waypointElements = document.querySelectorAll('#sortContainer .input-container');

    // Update the global waypointCounter to reflect the total number of waypoints
    waypointCounter = waypointElements.length;

    // Iterate over each waypoint container
    waypointElements.forEach((element, index) => {
        var oldId = element.id.replace('container', '');
        var newId = 'waypoint' + (index + 1);

        // Update the container ID
        element.id = 'container' + newId;

        // Update the input field ID and name
        var input = element.querySelector('.waypoint');
        input.id = newId;
        input.name = `Address ${newId}`; // Update the name attribute to match the new ID

        // Update the remove button's onclick attribute
        var removeBtn = element.querySelector('.remove-waypoint');
        if (removeBtn) {
            removeBtn.setAttribute('onclick', `removeWaypoint('${newId}')`);
        }

        // Update the autocompleteInputs array with the new ID
        var autocompleteEntry = autocompleteInputs.find(item => item.id === oldId);
        if (autocompleteEntry) {
            autocompleteEntry.id = newId;
        }
    });

    // Recalculate the route with updated waypoint IDs
    calculateRoute();
}





// Function to initialize SortableJS
function initializeSortable() {
    if (!('ontouchstart' in window) || window.innerWidth > 600) {
        // Non-touch device or wider screens
        new Sortable(document.getElementById('sortContainer'), {
            handle: '.handle',
            animation: 150,
            onEnd: function () {
                calculateRoute();
                updateWaypointIDs();
                console.log("Sorting ended");
            }
        });
    } else {
        // Touch device detected
        document.body.classList.add('touch-device');
    }
}

initializeSortable();
window.addEventListener('resize', initializeSortable);



// adding flight input after search for specific character 

function createInputTag(waypointId) {
    // Check if flight input already exists
    if (!document.getElementById(`${waypointId}-flight-container`)) {
        let flightContainer = document.createElement("div");
        flightContainer.setAttribute("id", `${waypointId}-flight-container`);
        flightContainer.setAttribute("class", "flight-input-container");

        let icon = document.createElement("i");
        icon.setAttribute("class", "fas fa-plane");

        let newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("id", `${waypointId}-flight`);
        newInput.setAttribute("name", `${waypointId}-FlightNumber`);
        newInput.setAttribute("placeholder", "Enter Flight Number");
        newInput.setAttribute("class", "flight-input");

        flightContainer.appendChild(icon);
        flightContainer.appendChild(newInput);

        // Get the waypoint container and append the flight container inside it
        let waypointContainer = document.getElementById('container' + waypointId);
        waypointContainer.appendChild(flightContainer);
    }
}

function checkSearch(waypointId) {
    let searchInput = document.getElementById(waypointId).value.toLowerCase();
    let specificWords = ["airport", "ewr", "jfk", "lga", "E.W.R.", "(EWR)", "LaGuardia", "E.W.R. (EWR)"];

    // Check if the search contains specific words
    if (specificWords.some(word => searchInput.includes(word)) && !document.getElementById(`${waypointId}-flight`)) {
        createInputTag(waypointId); // Create the input tag if specific words are found and it doesn't already exist
    }
}

function incrementCount(id) {
    let input = document.getElementById(id);
    let currentValue = parseInt(input.value, 10);
    input.value = currentValue + 1;
}

function decrementCount(id) {
    let input = document.getElementById(id);
    let currentValue = parseInt(input.value, 10);
    if (currentValue > 0) { // For passenger count, you might want to check if currentValue > 1 instead
        input.value = currentValue - 1;
    }
}

function toggleChildSeatCounter() {
    var checkBox = document.getElementById("child-seat-checkbox");
    var counter = document.getElementById("child-seat-counter");
    if (checkBox.checked === true) {
        counter.style.display = "flex";
    } else {
        counter.style.display = "none";
    }
}
function changeChildSeatCount(change) {
    var countInput = document.getElementById("child-seat-count");
    var currentCount = parseInt(countInput.value);
    var newCount = currentCount + change;

    if (newCount >= 1 && newCount <= 2) { countInput.value = newCount; }
}

function toggleHourCounter() {
    var serviceType = document.getElementById('serviceType').value;
    var carOption = document.getElementById('car-option').value;
    var hourCounter = document.getElementById('hour-counter');

    if (serviceType === 'Hourly' || carOption === 'Stretch') {
        hourCounter.style.display = 'flex'; // Show the hour counter
    } else {
        hourCounter.style.display = 'none'; // Hide the hour counter
    }
}

// Prevent Form Submission on Enter
function preventEnterSubmit(event) {
    if (event.which === 13) { // 13 is the keycode for Enter
        event.preventDefault(); // Prevents the default action (form submission)
    }
}