const router = require("express").Router();
const path = require('path');
const { sleep } = require('../../utilities/common');

router.get("/:status/:hashedId", [

    // Checking there are enough variables
    function (req, res, next) {
        console.log("OKKK");
        // Checking if params are valid
        let reqHashedId = req.params.hashedId;
        let status = req.params.status;
        console.log("Shipment status: " + status);

        if (reqHashedId == null || status == null) {
            res.status(404).send();
        } else {
            next();
        }
    },
    // Checking if the hashed match
    function (req, res, next) {
        // Hashed value passed by client (browser)
        let reqHashedId = req.params.hashedId;
        console.log("Client says: " + reqHashedId);

        // Hashed value saved in current session
        // If it is deleted, it is assigned as undefined.
        let sessionHashedId = req.session.pendingOrder.hashedId;
        console.log("Server says: " + sessionHashedId);

        console.log(req.session);

        if (reqHashedId == sessionHashedId) {
            next();
        } else {
            res.status(404).send();
        }
    },
    async function (req, res) {
        // Hashed value passed by client (browser)
        let status = req.params.status;
        if (status == "success") {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'layouts', 'success.html'));
        } else {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'layouts', 'error.html'));
        }

        // Keep the session pendingOrder for 3s
        await sleep(3000);

        // After that remove it
        console.log("Delete id!");
        delete req.session.pendingOrder;
        console.log(req.session);
    }]
);


module.exports = router;

