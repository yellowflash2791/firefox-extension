document.addEventListener("DOMContentLoaded", function() {
  const enableButton = document.getElementById("enableButton");
  const paymentStatus = document.getElementById("paymentStatus");
  const payButton = document.getElementById("payButton");
  const loginButton = document.getElementById("loginButton");


  let isBlocking = false;  // Initialize state
  let isPaid = false;  // Initialize payment state

  // Fetch initial states from background script
  chrome.runtime.sendMessage({action: "getState"}, function(response) {
    isBlocking = response.isBlocking;
    isPaid = response.isPaid;
    updateUI();  // Update UI based on fetched states
  });

  // Function to update the UI based on current states
  function updateUI() {
    if (isBlocking) {
      enableButton.textContent = "ON";
      enableButton.style.backgroundColor = "green";
    } else {
      enableButton.textContent = "OFF";
      enableButton.style.backgroundColor = "red";
    }

    if (isPaid) {
      paymentStatus.textContent = "Subscription Active";
      payButton.style.display = "none";
      loginButton.style.display = "none";	
    } else {
      paymentStatus.textContent = "Subscription Inactive";
      payButton.style.display = "block";
      loginButton.style.display = "block";
    }
  }

  // Toggle the enableButton state and send a message to the background script
  enableButton.addEventListener("click", function() {
    isBlocking = !isBlocking; // Toggle state
    chrome.runtime.sendMessage({action: "toggleState"}, function(response) {
      isBlocking = response.isBlocking; // Update with the actual state from the background script
      updateUI();
    });
  });

  // Handle payButton clicks and send a message to the background script
  payButton.addEventListener("click", function() {
    chrome.runtime.sendMessage({action: "goToPaymentPage"});
  });

  loginButton.addEventListener("click", function() {
     chrome.runtime.sendMessage({action: "goToLoginPage"});
  });


});

