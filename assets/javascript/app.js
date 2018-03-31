$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBQKFGsfr5nvhMd7DD5UArKbrgif0rUgVo",
    authDomain: "ucftestproject.firebaseapp.com",
    databaseURL: "https://ucftestproject.firebaseio.com",
    projectId: "ucftestproject",
    storageBucket: "ucftestproject.appspot.com",
    messagingSenderId: "588487481642"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  // Submit button click
  $("#addTrain").on("click", function(event) {
    event.preventDefault();

    // Grabbed values from input form
    var trainName = $("#trainName")
      .val()
      .trim();
    var destination = $("#destination")
      .val()
      .trim();
    var firstTrainTime = $("#firstTrainTime")
      .val()
      .trim();
    var freq = $("#frequency")
      .val()
      .trim();

    // Push input to database
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: freq
    });
  });

  // Firebase watcher and initial loader
  database.ref().on(
    "child_added",
    function(childSnapshot) {
      var newTrain = childSnapshot.val().trainName;
      var newLocation = childSnapshot.val().destination;
      var newFirstTrainTime = childSnapshot.val().firstTrainTime;
      var newFreq = childSnapshot.val().frequency;

      // First time (subtract 1 yr to ensure it comes before current time)
      var startTime = moment(newFirstTrainTime, "hh:mm").subtract(1, "years");

      // Current time
      var currentTime = moment();

      // Difference between the times
      var diffTime = moment().diff(moment(startTime), "minutes");

      // Time apart (remainder)
      var remainder = diffTime % newFreq;

      // Minutes until next train
      var minAway = newFreq - remainder;

      // Next train
      var nextTrain = moment().add(minAway, "minutes");
      var nextArrival = moment(nextTrain).format("HH:mm");

      // Display in panel
      $("#train-display").append(
        " <tr><td>" +
          newTrain +
          " </td><td>" +
          newLocation +
          " </td><td>" +
          newFreq +
          " </td><td>" +
          nextArrival +
          " </td><td>" +
          minAway +
          " </td></tr>"
      );

      // Clear input fields
      $("#trainName, #destination, #firstTrainTime, #frequency").val("");
      return false;
    },
    // Handle errors
    function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    }
  );
});
