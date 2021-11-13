class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class PropertyRequiredError extends ValidationError {
    constructor(property) {
        super(`Missing property: ${property}`);
        this.property = property;
    }
}

class OperationFailedError extends SQLError {
    constructor(message) {
        super(message);
    }
}

module.exports = {
    ValidationError,
    PropertyRequiredError,
    OperationFailedError
};
