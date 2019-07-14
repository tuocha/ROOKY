var firebaseConfig = {
  apiKey: "AIzaSyCcuci5f0u5UU_Ejo8LjQVGxK5cZTPScws",
  authDomain: "core-shard-245615.firebaseapp.com",
  databaseURL: "https://core-shard-245615.firebaseio.com",
  projectId: "core-shard-245615",
  storageBucket: "",
  messagingSenderId: "239144941486",
  appId: "1:239144941486:web:f89012a9b738e94c"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

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
var handleLocationError;


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
      
      inputMap.panTo(currentLocation);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {

    handleLocationError(false, infoWindow, map.getCenter());
  }

  inputMap = new google.maps.Map(
    document.getElementById('map-input'), { zoom: 13, center: currentLocation });
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
    if (name != "" && phone != "" && github != "" && devImage !="" && linkedin != "" && description != "") {
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
      map: inputMap,
      animation: google.maps.Animation.DROP,
    });

    // Generate a DOM node to display the data
    var contentString =
      '<div class="info-window">' +
      '<p class="name">' + name + '</p>' +
      '<p class="phone">' + phone + '</p>' +
      '<p class = "github">' + github + '</p>' +
      '<p class = "linkedin">' + linkedin + '</p>' +
      '<img src="' + devImage + '" width="80px" class="img-thumbnail">' +
     // '<img src="../images/marker.png"/>'+
      '<p><strong>Description: </strong><br />' + description + '</p>' +
      '<hr>' +
      '</div>';

    // Generate an info window for the pin with the object's DOM node
    var infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });

    // When the marker is clicked, open the info window
    marker.addListener('click', function () {
      infoWindow.open(inputMap, marker);
    });

    // If an infoWindow is open and you click the map, close the previously opened infoWindow
    google.maps.event.addListener(inputMap, 'click', function () {
      infoWindow.close();
    });
  });
});





var activeJobID;
var activeFireID;


$('#position-dropdown').on('change', function() {
  // prevents page from refresh when submit button is hit (might not need this with dropdown)
  event.preventDefault();

  // assigns value of the dropdown to a variable
  var userCategory = $(this).val();

  //  AJAX call to Muse API, to be used in search
  
  function ajaxMuse() {
    var category = userCategory;
    var apiKey = '23580774d9f6a1fe049b5d520991447e22cb26e44cc17bf753423acbce7dba87';
   // var location = 'San Francisco, CA';
    var location = $("#location-dropdown").val();
    var queryURL =
      'https://api-v2.themuse.com/jobs?category=' +
      category +
      '&location='+location+'&api_key=' +
      apiKey +
      '&page=1';
      
      
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
    //  console.log(response);
      // clears previous results from table, put here so less of a delay when outside of AJAX call
      $('.search-results').empty();

      for (var i = 0; i <= response.results.length; i++) {
        // create new row
        var newRow = $('<tr>');
        newRow.attr('data-jobID', response.results[i].id);

        newRow.append('<td>' + response.results[i].company.name + '</td>');
        newRow.append('<td>' + response.results[i].name + '</td>');
        newRow.append('<td>' + response.results[i].locations[0].name + '</td>');
        newRow.append("<td><button class='detail-btn add-btn add-button btn btn-info'>View Detail</button><td>");

        // append it onto the search-body tably
        $('.search-results').append(newRow);
        $('.search-results').append("<tr class='spacer'></tr>");
      }
    });
  }

  ajaxMuse();
});




//---JOB-DETAIL.HTML----

// var dataRef = 
//       new Firebase('https://core-shard-245615.firebaseio.com');

// Firebase listening for when page loads....
database.ref().on('child_added', function(snapshot) {
  // storing firebase pathway to variable
  var snap = snapshot.val();

  // AJAX call to populate job posting data from jobID saved in firebase

  // concatenate URL and activeJOB saved to localStorage
  var apiKey = '23580774d9f6a1fe049b5d520991447e22cb26e44cc17bf753423acbce7dba87';
  var queryURL = 'https://api-v2.themuse.com/jobs/' + localStorage.activeJobID + '?api_key=' + apiKey;

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {
    // populates job posting-specific information from AJAX call
    $('#company-name').text(response.company.name);
    $('#job-name').text(response.name);
    $('#job-description').html(response.contents);
   
   
  });
});

// on click of any company name, locally save the Firebase ID and jobID of that posting....

$(document).on('click', '.detail-btn', function() {
 
 // assigning API jobID and Firebase ID to variables....
  activeJobID = $(this)
    .parent()
    .parent()
    .attr('data-jobID');
   activeFireID = $(this)
    .parent()
    .parent()
    .attr('data-fireID');
  //  .... and storing those variables locally so they persist when the page changes
  localStorage.setItem('activeJobID', activeJobID);
  localStorage.setItem('activeFireID', activeFireID);

  //brings user to job-view.html page
  document.location = 'job-detail.html';
});

$(document).on('click', '#applySubmit', function() {
//   var newVar=$('#name').val();
//  console.log(newVar);
event.preventDefault();
 if(($('#name').val()!=="") && ($('#email').val()!=="") && ($('#contact').val()!=="") && ($('#attach-resume').val()!=="")){

  $('#applyNowform').css("display", "none");
  $('.msg-success').css("display", "block");
 }
});