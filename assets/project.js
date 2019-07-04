var firebaseConfig = {
  apiKey: "AIzaSyA-mHjoXIfCaikwJqc-qXW6s1CaofWjLdE",
  authDomain: "coder-fd113.firebaseapp.com",
  databaseURL: "https://coder-fd113.firebaseio.com",
  projectId: "coder-fd113",
  storageBucket: "",
  messagingSenderId: "221023332131",
  appId: "1:221023332131:web:1fa65e657809877c"
};

firebase.initializeApp(config);
database = firebase.database();

// Declare Maps/forms variables
var latInput = 0;
var longInput = 0;
var mainMap;
var inputMap;
var markerPlaced = false;
var formCompleted = false;

// Declare developer variables
var devImage;
var name;
var description;
var phone;
var email;
var github;
var linkedin;

function initMap() {
  // Default location: Philadelphia
  var currentLocation = { lat: 39.953, lng: -75.165 };

  // If the user allows current location detection...
  if (navigator.geolocation) {
    // Get current location and reassign the currentLocation var
    navigator.geolocation.getCurrentPosition(function (position) {
      currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Pan both maps to the user's location
      mainMap.panTo(currentLocation);
      inputMap.panTo(currentLocation);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {

    handleLocationError(false, infoWindow, map.getCenter());
  }

  mainMap = new google.maps.Map(
    document.getElementById('main-map'), { zoom: 13, center: currentLocation });
  inputMap = new google.maps.Map(
    document.getElementById('map-input'), { zoom: 17, center: currentLocation });

  var newMarker;

  function placeMarker(location) {

    if (newMarker) {
      // If the marker has already be placed, update the marker's position
      newMarker.setPosition(location);
    } else {
      // If the marker has not been placed, create a new marker
      newMarker = new google.maps.Marker({
        position: location,
        map: inputMap
      });
    }

    // Store the marker's coordinates
    latInput = newMarker.getPosition().lat();
    longInput = newMarker.getPosition().lng();
  }

  // Listen for clicks on the input map that will place a marker
  google.maps.event.addListener(inputMap, 'click', function (event) {
    placeMarker(event.latLng);

    // Update markerPlaced boolean to validate against on submit
    markerPlaced = true;
  });
}

function generateDeveloper() {
  // Create an object with all the relevant, formatted data
  var newDeveloper = {
    name: nameFormatted,
    phone: phoneFormatted,
    github: githubFormatted,
    linkedin: linkedinFormatted,
    devImage: devImageFormatted,
    description: descriptionFormatted,
    position: {
      lat: latInput,
      long: longInput
    }
  }

  // Push the new developer object to Firebase
  database.ref().push(newDeveloper);
}

$(document).ready(function () {

  function checkFormCompletion() {
    // Store form values
    name = $('#name-input').val().trim();
    phone = $('#phone-input').val().trim();
    github = $('#github-input').val().trim();
    linkedin = $('#linkedin-input').val().trim();
    devImage = $('#dev-image-input').val().trim();
    description = $('#description-input').val().trim();

    // If all input fields have been filled out...
    if (name != "" && phone != "" && github != "" && linkedin != "" && devImage != "" && description != "") {
      // Format the user input to prepare it for storage in Firebase
      nameFormatted = name.charAt(0).toUpperCase() + name.substr(1);
      phoneFormatted = phone.charAt(0).toUpperCase() + phone.substr(1);
      githubFormatted = github.charAt(0).toUpperCase() + github.substr(1);
      linkedinFormatted = linkedin.charAt(0).toUpperCase() + linkedin.substr(1);
      devImageFormatted = devImage.charAt(0).toUpperCase() + devImage.substr(1);
      descriptionFormatted = description.charAt(0).toUpperCase() + description.substr(1);

      // Mark the form as completed
      formCompleted = true;
    }
  }

  // Submit the form
  $("#submit-btn").on("click", function (event) {

    // if no marker was placed, prevent form submission
    if (!markerPlaced) {
      event.preventDefault();
    }

    // Check for form completion
    checkFormCompletion();

    // If an input marker has been placed AND the form is completed, add the data to firebase
    if (markerPlaced && formCompleted) {
      generateDeveloper();
    } else {
      // Display the error message if no pin was placed
      $('#error').removeClass("d-none");
    }
  });

  database.ref().on("child_added", function (snapshot) {

    // Grab all relevant data from Firebase
    var childData = snapshot.val();
    var positionLat = childData.position.lat;
    var positionLong = childData.position.long;
    var devPosition = { lat: positionLat, lng: positionLong };
    var name = childData.name;
    var phone = childData.phone;
    var github = childData.github;
    var linkedin = childData.linkedin;
    var devImage = childData.devImage;
    var description = childData.description;

    // Place a marker based on the object's position
    var marker = new google.maps.Marker({
      position: devPosition,
      map: mainMap,
      animation: google.maps.Animation.DROP,
    });

    // Generate a DOM node to display the data
    var contentString =
      '<div class="info-window">' +
      '<p class="name">' + name + '</p>' +
      '<p class="phone">' + phone + '</p>' +
      '<p class = "github">' + github + '</p>' +
      '<p class = "linkedin">' + linkedin + '</p>' +
      '<img src="' + devImage + '">' +
      '<p><strong>Description: </strong><br />' + description + '</p>' +
      '<hr>' +
      '</div>';

    // Generate an info window for the pin with the object's DOM node
    var infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });

    // When the marker is clicked, open the info window
    marker.addListener('click', function () {
      infoWindow.open(mainMap, marker);
    });

    // If an infoWindow is open and you click the map, close the previously opened infoWindow
    google.maps.event.addListener(mainMap, 'click', function () {
      infoWindow.close();
    });
  });
});


