document.addEventListener("DOMContentLoaded", function() {
    const enableButton = document.getElementById("enableButton");
    const paymentStatus = document.getElementById("paymentStatus");
    const payButton = document.getElementById("payButton");
    const trialStatus = document.getElementById("trialStatus");
    const trialDaysLeft = document.getElementById("trialDaysLeft");
    const loginButton = document.getElementById("loginButton");
    const startTrialText = document.getElementById("startTrialText");
    const startTrialButton = document.getElementById("startTrialButton"); 
    const cancelSubscriptionButton = document.getElementById("cancelSubscriptionButton");
    const cancelSubscribedText = document.getElementById("cancelSubscribedText");
    const subscribedText= document.getElementById("subscribedText");


    let isBlocking = false;

    // Fetch initial states from background script
    chrome.runtime.sendMessage({ action: "getState" }, function(response) {
        isBlocking = response.isBlocking;
        updateUI(response); // Update UI based on fetched states
    });

    function updateUI(data) {
        const { isPaid, isTrialActive, trialDaysLeft: daysLeft } = data;

        if (isTrialActive) {
            trialStatus.textContent = "On Trial";
            trialStatus.style.display = "block";
            trialStatus.style.backgroundColor = "yellow";
            trialDaysLeft.textContent = `${daysLeft} days remaining`;
            trialDaysLeft.style.display = "block";
            paymentStatus.style.display = "none";
            payButton.style.display = "none";
            enableButton.style.display = "block";
            startTrialText.style.display = "none";
            cancelSubscriptionButton.style.display="none";
            cancelSubscribedText.style.display="none";
            loginButton.style.display = "none";
            subscribedText.style.display = "none";
            startTrialButton.style.display = "none";


            if (isBlocking) {
                enableButton.textContent = "ON";
                enableButton.style.backgroundColor = "green";
            } else {
                enableButton.textContent = "OFF";
                enableButton.style.backgroundColor = "red";
            }
        } else if (isPaid) {
            paymentStatus.textContent = "Subscription Active";
            paymentStatus.style.color = "green";
            paymentStatus.style.display = "block";
            payButton.style.display = "none";
            enableButton.style.display = "block";
            trialStatus.style.display = "none";
            trialDaysLeft.style.display = "none";
            startTrialText.style.display = "none";
            cancelSubscriptionButton.style.display="block";
            cancelSubscribedText.style.display="block";
            loginButton.style.display = "none";
            subscribedText.style.display = "none";
            startTrialButton.style.display = "none";

            if (isBlocking) {
                enableButton.textContent = "ON";
                enableButton.style.backgroundColor = "green";
            } else {
                enableButton.textContent = "OFF";
                enableButton.style.backgroundColor = "red";
            }
        } else {
            paymentStatus.textContent = "Inactive";
            paymentStatus.style.color = "red";
            paymentStatus.style.display = "block";
            payButton.style.display = "block";
            enableButton.style.display = "none";
            trialStatus.style.display = "none";
            trialDaysLeft.style.display = "none";
            startTrialText.style.display = "block";
            startTrialButton.style.display = "block";
        }
    }

    enableButton.addEventListener("click", function() {
        isBlocking = !isBlocking;
        chrome.runtime.sendMessage({ action: "toggleState" }, function(response) {
            isBlocking = response.isBlocking;
            updateUI(response);
        });
    });

    payButton.addEventListener("click", function() {
        chrome.runtime.sendMessage({ action: "goToPaymentPage" });
    });

    loginButton.addEventListener("click", function() {
        chrome.runtime.sendMessage({ action: "goToLoginPage" });
    });

    // Event listener for starting a trial
    startTrialButton.addEventListener("click", function() {
        chrome.runtime.sendMessage({ action: "goToTrialPage" });
    });
});

