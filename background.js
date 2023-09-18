//importScripts('ExtPay.js');

var extpay = ExtPay('browsesafe'); // Careful! See note below
extpay.startBackground();

let isBlocking = false; // Initialize this to false
let isPaid = false; // Initialize this to false

function checkPaymentStatus() {
  extpay.getUser().then(user => {
    if (user.paid) {
      isPaid = true;
    } else {
      isPaid = false;
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getState") {
    sendResponse({isBlocking: isBlocking, isPaid: isPaid});
  } else if (message.action === "toggleState") {
    isBlocking = !isBlocking; // Toggle based on user input
    sendResponse({isBlocking: isBlocking});
  } else if (message.action === "goToPaymentPage") {
        extpay.openPaymentPage();
//      extpay.openLoginPage();

  } else if (message.action === "goToLoginPage") {
        extpay.openLoginPage();  // Open the login page
  }


});

chrome.tabs.onCreated.addListener((tab) => {
  if (isBlocking && isPaid) {
    chrome.tabs.remove(tab.id);
  }
});



setInterval(checkPaymentStatus, 3000);

