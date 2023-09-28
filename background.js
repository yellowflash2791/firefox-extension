var extpay = ExtPay('browsesafe'); // Initialize with your extension's name
extpay.startBackground();

let isBlocking = false; // Track blocking state
let isPaid = false; // Track payment state
let isTrialActive = false; // Track trial state
let trialDaysLeft = 7; // Initialize with 7 days for the trial

function checkPaymentStatus() {
    extpay.getUser().then(user => {
        const now = new Date();
        const sevenDays = 1000 * 60 * 60 * 24 * 7;

        isPaid = user.paid;

        if (user.trialStartedAt && (now - new Date(user.trialStartedAt)) < sevenDays) {
            isTrialActive = true;
            trialDaysLeft = 7 - Math.floor((now - new Date(user.trialStartedAt)) / (1000 * 60 * 60 * 24));
        } else {
            isTrialActive = false;
            trialDaysLeft = 0;
        }
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "getState":
            sendResponse({
                isBlocking: isBlocking,
                isPaid: isPaid,
                isTrialActive: isTrialActive,
                trialDaysLeft: trialDaysLeft
            });
            break;
        case "toggleState":
            isBlocking = !isBlocking; // Toggle based on user input
            sendResponse({
                isBlocking: isBlocking,
                isPaid: isPaid,
                isTrialActive: isTrialActive,
                trialDaysLeft: trialDaysLeft
            });
            break;
        case "goToPaymentPage":
            extpay.openPaymentPage();
            break;
        case "goToLoginPage":
            extpay.openLoginPage(); // Open the login page
            break;
        case "goToTrialPage":
            extpay.openTrialPage('7-day'); // Open the 7-day trial page
            break;
        default:
            break;
    }
});

chrome.tabs.onCreated.addListener((tab) => {
    if (isBlocking && (isPaid || isTrialActive)) {
        chrome.tabs.remove(tab.id);
    }
});

setInterval(checkPaymentStatus, 3000);

