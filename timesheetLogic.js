/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyCftcgF53R2_c-oDgH33pupeSV3gBJ4c48",
  authDomain: "chris-train-schedule.firebaseapp.com",
  databaseURL: "https://chris-train-schedule.firebaseio.com",
  projectId: "chris-train-schedule",
  storageBucket: "chris-train-schedule.appspot.com",
  messagingSenderId: "803443267804"
  };

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trnName = $("#train-name-input").val().trim();
  var trnDestination = $("#destination-input").val().trim();
  var trnStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
  var trnFreq = $("#freq-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrn = {
    name: trnName,
    destination: trnDestination,
    start: trnStart,
    frequency: trnFreq
  };

  // Uploads employee data to the database
  database.ref().push(newTrn);

  // Logs everything to console
  console.log(newTrn.name);
  console.log(newTrn.destination);
  console.log(newTrn.start);
  console.log(newTrn.frequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#freq-input").val("");

});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trnName = childSnapshot.val().name;
  var trnDestination = childSnapshot.val().destination;
  var trnStart = childSnapshot.val().start;
  var trnFreq = childSnapshot.val().frequency;

  // Train Info
  console.log(trnName);
  console.log(trnDestination);
  console.log(trnStart);
  console.log(trnFreq);

//   // Prettify the employee start
//   var trnStartPretty = moment(trnStart).format("HH:mm");
//
//   // Calculate the months worked using hardcore math
//   // To calculate the months worked
//   var trnFreq = moment().diff(moment.unix(trnStart, "X"), "months");
//   console.log(trnMonths);
//
// // ----

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(trnStart, "hh:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trnFreq;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = trnFreq - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));


  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trnName + "</td><td>" + trnDestination + "</td><td>" +
  trnFreq + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});
