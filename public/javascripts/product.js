
var amount = 0;

function addCart() {
    console.log("Adding to cart...");
    alert("Adding to cart...");


    let success = true;

    if (success) {
        document.body.innerHTML += `
        <div id = 'dialog' data-reflow-type="toast" class="ref-notification success no-description" style="transform: translateY(-20px);">
            <div class="ref-notification-content">
                <div class="ref-notification-title">Product added to cart</div>
                <div class="ref-notification-description"></div>
                <div class="ref-close-button" onclick='closeDialog();'>×</div>
                <a class="ref-button" href='/showcart'>See Cart</a>
            </div>
        </div>
        `;
    }

}

function closeDialog() {
    document.getElementById('dialog').remove();
}

function increase() {
    var inputEle = document.getElementById('quantity');
    inputEle.value = Number(inputEle.value) + 1;
}

function decrease() {
    var inputEle = document.getElementById('quantity');
    if (inputEle.value > 0) {
        inputEle.value = Number(inputEle.value) - 1;
    }
}

function switchMainImage(id) {

    // Cast id to number
    id = Number(id);

    // Deactivate all other images
    for (let ele of document.getElementsByClassName('ref-image')) {
        ele.classList.remove('active');
    }

    // Activate the image based on id
    document.getElementById(`image_${id}`).classList.add('active');
    document.getElementById(`thumb_${id}`).classList.add('active');
}


