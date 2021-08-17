"use strict";

// Unsplash API URL.
const APIURL = "https://api.unsplash.com/photos/";
// Unsplash key.
const accessKey = "6spnP3stgRYCnqFdO_LZqsoHh2AhnH3Z0XlZkKosENE";
// Toggles the removal of previous element once the function has been called at least once.
var postLoad = false;
// An array of objects representing submitted emails and the image urls saved to them.
var savedImagesByEmail = [];
// The current image url.
var currentImageURL;
// The current image alt text.
var currentImageAlt;

// Get a random image from unsplash.
function getRandomBackground() {
  // Request a random landscape orientation image.
  axios.get(APIURL + "random/?client_id=" + accessKey + "&orientation=landscape").then(function (response) {
    // Save the images alt text.
    var imageAlt = response.data.alt_description;
    // Update the current image alt text for storage.
    currentImageAlt = imageAlt;
    // Save the direct image URL.
    var URL = response.data.urls.regular;
    // Update the current image URL variable for storage.
    currentImageURL = URL;
    // Create a node to append to.
    var item = document.createElement("div");
    // Add the image to the element.
    item.innerHTML = '<img id="firstImage" class="imageHolder" src="' + URL + ' alt="' + imageAlt + '"/>';

    // On first call simply add the element to the page.
    if (postLoad == false) {
      // Append the item to the body.
      document.body.appendChild(item);
      // Toggle first load as having been completed.
      postLoad = true;
      // On subsequent calls remove the previous item before adding the new one.
    } else {
      // Remove the previous element.
      $(".imageHolder").remove();
      // Append the item to the body.
      document.body.appendChild(item);
    }
  });
}

// Save images to the user entered email.
function saveToEmail(inputText) {
  // email REGEX.
  var mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  // Validate user input against REGEX.
  if (inputText.match(mailFormat)) {
    // Save the image URL with the email address entered.
    savedImagesByEmail.push({
      email: inputText,
      url: currentImageURL,
    });
    // Then load another image.
    getRandomBackground();
  } else {
    // If validation fails, alert the user.
    alert("Please enter a valid email address");
  }
}

$(document).ready(function () {
  // Get first image on load.
  getRandomBackground();

  // Get new image on request.
  $("#imageChange").on("click", function () {
    getRandomBackground();
  });

  // Validate email, store and display image on submit.
  $("#submitEmail").on("click", function () {
    saveToEmail($("#email").val());

    // Clear the div containing stored images.
    $("#storedImages").empty();

    // Iterate the array of images.
    $.each(savedImagesByEmail, function (key, value) {
      // If the email submitted matches any of the objects saved.
      if ($("#email").val() == value.email) {
        var storedImages = document.getElementById("storedImages");
        // Create a node to append to.
        var item = document.createElement("div");
        // Add the image to the element.
        item.innerHTML = '<img class="storedImageHolder" src="' + value.url + '" alt="Saved Image"/>';
        // Append the item to the div.
        storedImages.appendChild(item);
      }
    });
  });
});
