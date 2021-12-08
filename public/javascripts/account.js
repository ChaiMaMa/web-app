// Global information (intial information)
var firstName = document.getElementById("firstName").getAttribute("value");
var lastName = document.getElementById("lastName").getAttribute("value");
var phoneNum = document.getElementById("phoneNum").getAttribute("value");
var email = document.getElementById("email").getAttribute("value");
var address = document.getElementById("address").getAttribute("value");
var city = document.getElementById("city").getAttribute("value");
var state = document.getElementById("state").getAttribute("value");
var postalCode = document.getElementById("postalCode").getAttribute("value");


/**
 * 
 * @param {HTMLElement} list_item The currently selected tab on the sidebar
 * @param {string} new_content_id The id of content view corresponding to the selected tab
 */
function switchView(list_item, new_content_id) {
    // Only switch if the current tab is not active
    if (!list_item.classList.contains("active")) {

        // Deactivate the previously active tab
        // There should only be 1 active tab
        let activeTabs = document.getElementsByClassName("list-group-item tab active");
        activeTabs[0].classList.remove("active");

        // Activate the current tab
        list_item.classList.add("active")

        // Switch the content view
        let content_views = document.getElementsByClassName("content-view");
        for (let content_view of content_views) {
            if (content_view.id == new_content_id) {
                content_view.removeAttribute("hidden");
            } else {
                content_view.setAttribute("hidden", "");
            }
        }
    }
}

/**
 * Disable all input fields
 */
function disableInput() {
    let inputs = document.getElementsByTagName('input');
    for (let inputEle of inputs) {
        inputEle.setAttribute("disabled", "");
    }

    // Hide the buttons
    for (let btn of document.getElementsByClassName("btn")) {
        btn.setAttribute("hidden", "");
    }
}

/**
 * Duplicate utitility function for closing dialog from product.js
 */
function closeDialog() {
    document.getElementById('dialog').remove();
}

/**
 * Enable all input fields
 */
function enableInput() {
    let inputs = document.getElementsByTagName('input');
    for (let inputEle of inputs) {
        inputEle.removeAttribute("disabled");
    }

    // Unhide the buttons
    for (let btn of document.getElementsByClassName("btn")) {
        btn.removeAttribute("hidden");
    }
}

/**
 * Fallback to current information (before updating/editing)
 */
function fallback() {
    document.getElementById("firstName").value = firstName;
    document.getElementById("lastName").value = lastName;
    document.getElementById("phoneNum").value = phoneNum;
    document.getElementById("email").value = email;
    document.getElementById("address").value = address;
    document.getElementById("city").value = city;
    document.getElementById("state").value = state;
    document.getElementById("postalCode").value = postalCode;
}

/**
 * Cancel all updates and restore current information
 */
function cancelUpdate() {

    // Reset to current information (before editting)
    fallback();

    // Disable all inputs and hide buttons
    disableInput();
}

/**
 * If update succeeded, commit those changes but setting values of input elements
 */
function commitUpdate(currentInfo) {
    document.getElementById("firstName").value = currentInfo.firstName;
    document.getElementById("lastName").value = currentInfo.lastName;
    document.getElementById("phoneNum").value = currentInfo.phoneNum;
    document.getElementById("email").value = currentInfo.email;
    document.getElementById("address").value = currentInfo.address;
    document.getElementById("city").value = currentInfo.city;
    document.getElementById("state").value = currentInfo.state;
    document.getElementById("postalCode").value = currentInfo.postalCode;
}


/**
 * Submit new changes to account settings
 */
function submitUpdate() {
    console.log("Updating...");

    // Lock all inputs again and hide buttons
    disableInput();

    // Get current values
    // Create an object to pass to callback later
    let currentInfo = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        phoneNum: document.getElementById("phoneNum").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        postalCode: document.getElementById("postalCode").value
    };
    console.log(currentInfo);

    // Create an ajax object
    let xhttp = new XMLHttpRequest();

    // Set callback
    xhttp.onload = function () {
        if (xhttp.status == 200) {
            // Add a dialog for notifications
            document.body.innerHTML +=
                `
            <div id = 'dialog' data-reflow-type="toast" class="ref-notification success no-description" style="transform: translateY(-20px);">
                    <div class="ref-notification-content">
                        <div class="ref-notification-title">Update succeeded!</div>
                        <div class="ref-notification-description"></div>
                        <div class="ref-close-button" onclick='closeDialog();'>×</div>
                        <a class="ref-button" href='/showcart'>See Cart</a>
                    </div>
                </div>
            `;
            // Commit updates
            commitUpdate(currentInfo);
        } else {
            // Fall back on failure
            fallback();

            // Add a dialog for notifications
            document.body.innerHTML +=
                `
                <div id = 'dialog' data-reflow-type="toast" class="ref-notification error no-description" style="transform: translateY(-20px);">
                <div class="ref-notification-content">
                    <div class="ref-notification-title">Update failed!</div>
                    <div class="ref-notification-description"></div>
                    <div class="ref-close-button" onclick='closeDialog();'>×</div>
                </div>
            </div>
            `;
        }
    };

    // Build a body
    let body = "firstName=" + currentInfo.firstName
        + "&lastName=" + currentInfo.lastName
        + "&phoneNum=" + currentInfo.phoneNum
        + "&email=" + currentInfo.email
        + "&address=" + currentInfo.address
        + "&state=" + currentInfo.state
        + "&city=" + currentInfo.city
        + "&postalCode=" + currentInfo.postalCode;


    xhttp.open("POST", "/account/update", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(body);
}

// Initializing code
disableInput();