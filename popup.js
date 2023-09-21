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


  const subscribedText = document.getElementById("subscribedText"); // Get reference to the "Subscribed?" text


  function updateUI() {
    if (isPaid) {
       paymentStatus.textContent = "Active";
       payButton.style.display = "none";
       loginButton.style.display = "none";
       enableButton.style.display = "block";
       subscribedText.style.display = "none"; 
       paymentStatus.classList.remove('inactive-status');
       paymentStatus.classList.add('active-status');
       if (isBlocking) {
         enableButton.textContent = "ON";
         enableButton.style.backgroundColor = "green";
       } else {
         enableButton.textContent = "OFF";
          enableButton.style.backgroundColor = "red";
       }

    } else {
      paymentStatus.textContent = "Inactive";
      payButton.style.display = "block";
      loginButton.style.display = "block";
      enableButton.style.display = "none";
      subscribedText.style.display = "block"; // Show the "Subscribed?" text if user is not paid
      paymentStatus.classList.add('inactive-status');
      paymentStatus.classList.remove('active-status'); 
    }
  }

  enableButton.addEventListener("click", function() {
    isBlocking = !isBlocking; 
    chrome.runtime.sendMessage({action: "toggleState"}, function(response) {
      isBlocking = response.isBlocking; 
      updateUI();
    });
  });

  payButton.addEventListener("click", function() {
    chrome.runtime.sendMessage({action: "goToPaymentPage"});
  });

  loginButton.addEventListener("click", function() {
     chrome.runtime.sendMessage({action: "goToLoginPage"});
  });


});

