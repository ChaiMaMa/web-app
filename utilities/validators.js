function isNumeric(input) {
    let pattern = /^\d+$/;
    return pattern.test(input);
}


exports.isNumeric = isNumeric;