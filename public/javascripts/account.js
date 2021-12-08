// Global information
var firstName = document.getElementById("firstName").getAttribute("value");

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
 * Cancel all updates and restore current information
 */
function cancelUpdate() {

    // Disable all inputs and hide buttons
    disableInput();
}
/**
 * Submit new changes to account settings
 */
function submitUpdate() {
    console.log("Updating...");

    // Lock all inputs again and hide buttons
    disableInput();
}




// Initializing code
disableInput();