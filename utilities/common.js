
/**
 * Delay an operation asynchronously for a specific time.
 * Similar to Future.delayed() in Dart.
 * @param {number} delay Number of ms in delay
 * @returns {Promise}
 */
function sleep(delay) {
    return new Promise((resolve, _) => setTimeout(resolve, delay));
}


module.exports = {
    sleep
};