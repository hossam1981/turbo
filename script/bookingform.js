// Global declaration of the map object
let map;
// Array to store autocomplete objects for each input
const autocompleteInputs = [];

// Function to initialize the map with Google Maps API
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 8
    });

    // Initialize autocomplete for the first two waypoints
    initializeAutocomplete('waypoint1');
    initializeAutocomplete('waypoint2');
}

// Function to initialize autocomplete functionality for a given input field
function initializeAutocomplete(id) {
    const inputElement = document.getElementById(id);
    const autocomplete = new google.maps.places.Autocomplete(inputElement);
    autocomplete.addListener('place_changed', calculateRoute);
    // Store the autocomplete object for later use
    autocompleteInputs.push({ id, autocomplete });
}

// Counter to keep track of how many waypoints have been added
let waypointCounter = 3;

// Function to dynamically add new waypoint inputs
function addWaypoint() {
    const waypointId = `waypoint${waypointCounter}`;
    const waypointInput = document.createElement('div');
    waypointInput.innerHTML = `
            <div class="input-container handle">
                <i class="fas fa-list-ul"></i>
                <input type="text" id="${waypointId}" onchange="checkSearch('waypoint${waypointCounter}')"  name="address ${waypointCounter}" class="waypoint" placeholder="Add, sort address">
            </div>
        `;
    document.getElementById('sortContainer').appendChild(waypointInput);

    // Initialize autocomplete for the new waypoint
    initializeAutocomplete(waypointId);
    waypointCounter++;

    // Refresh the sortable container
    $('#sortContainer').sortable('refresh');
}

function createInputTag(waypointId) {
    if (!document.getElementById(`${waypointId}-flight-container`)) {
        let flightContainer = document.createElement("div");
        flightContainer.setAttribute("class", "waypoint-container flightinput");

        let icon = document.createElement("i");
        icon.setAttribute("class", "fas fa-plane");

        let newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("id", `${waypointId}-flight`);
        newInput.setAttribute("name", `${waypointId}-FlightNumber`);
        newInput.setAttribute("placeholder", "Enter Flight Number");
        newInput.setAttribute("class", "waypoint");

        flightContainer.appendChild(icon);
        flightContainer.appendChild(newInput);

        let waypointContainer = document.getElementById(waypointId).parentNode;
        waypointContainer.parentNode.insertBefore(flightContainer, waypointContainer.nextSibling);
    }
}

function checkSearch(waypointId) {
    let searchInput = document.getElementById(waypointId).value.trim().toLowerCase();
    let specificWords = ["airport", "ewr", "jfk", "lga", "e.w.r.", "(ewr)", "laguardia", "e.w.r. (ewr)"];
    let wordPattern = new RegExp("\\b(" + specificWords.join("|") + ")\\b", "i");

    // Check if the search contains specific words as whole words
    if (wordPattern.test(searchInput) && !document.getElementById(`${waypointId}-flight`)) {
        createInputTag(waypointId); // Create the input tag if specific words are found and it doesn't already exist
    }
}

// jQuery ready function to make waypoints sortable
$(document).ready(() => {
    $('#sortContainer').sortable({
        handle: '.handle',
        cursor: 'move',
        axis: 'y',
        opacity: 0.6,
        update: calculateRoute
    });
});

// Function to calculate the route between waypoints
// Function to calculate the route between waypoints
// Function to calculate the route between waypoints
const calculateRoute = () => {
    // Extract waypoints from the input fields
    const waypoints = $('#sortContainer .waypoint').map(function () {
        const autocompleteObject = autocompleteInputs.find(item => item.id === this.id);
        if (autocompleteObject && autocompleteObject.autocomplete) {
            const place = autocompleteObject.autocomplete.getPlace();
            return place && place.geometry ? { location: place.geometry.location } : null;
        }
        return null;
    }).get().filter(Boolean);

    // If there are less than 2 waypoints, no route calculation is needed
    if (waypoints.length < 2) { return; }

    // Directions service and renderer for displaying the route
    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer({ map });

    // Request object for the directions service
    const request = {
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
};

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