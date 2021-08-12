// Toggles the removal of previous element once the function has been called at least once.
var postLoad = false;
// Indicate origin of function call.
var originIsSubmit = false;
// An array of objects representing submitted emails and the image urls saved to them.
var savedImagesByEmail = [];
// The current image url.
var currentImageURL;

// Get a random image from unsplash and add it to the document as a full screen background.
function getRandomBackground(originIsSubmit) {
  if (originIsSubmit == true) {
    // Provide user feedback that the function is in progress.
    document.getElementById("submitEmail").innerHTML = "...SAVING";
  } else {
    // Provide user feedback that the function is in progress.
    document.getElementById("imageChange").innerHTML = "...LOADING";
  }

  // Request the image
  fetch("https://source.unsplash.com/1920x1080/?random").then((response) => {
    // Create a div to hold the image.
    let item = document.createElement("div");
    item.classList.add("item");
    // Add the image to the div.
    item.innerHTML = `<img id="firstImage" class="imageHolder" src="${response.url}" alt="Random Image"/>`;
    currentImageURL = response.url;

    // On first call simply add the element to the page.
    if (postLoad == false) {
      document.body.appendChild(item);
      // Toggle first load as having been completed.
      postLoad = true;
      // On subsequent calls remove the previous item before adding the new one.
    } else {
      $(".imageHolder").remove();
      document.body.appendChild(item);
    }

    if (originIsSubmit == true) {
      // Reset the submit buttons text.
      document.getElementById("submitEmail").innerHTML = "SUBMIT";
    } else {
      // Reset the image request buttons text.
      document.getElementById("imageChange").innerHTML = "GET NEW IMAGE";
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
    savedImagesByEmail.push({ email: inputText, url: currentImageURL });
    // Indicate the origin of the function call.
    originIsSubmit = true;
    // Then load another image.
    getRandomBackground(originIsSubmit);
  } else {
    // If validation fails, alert the user.
    alert("Please enter a valid email address");
  }
}

$(document).ready(function () {
  // Get first image on load.
  getRandomBackground(originIsSubmit);

  // Get new image on request.
  $("#imageChange").on("click", function () {
    // Indicate the origin of the function call.
    originIsSubmit = false;
    getRandomBackground(originIsSubmit);
  });

  // Validate email and store image under it on submit.
  $("#submitEmail").on("click", function () {
    saveToEmail($("#email").val());
  });
});
