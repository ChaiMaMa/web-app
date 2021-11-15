class ValidationError extends Error {
    constructor(property) {
        super("Invalid " + property);
        this.name = this.constructor.name;
        this.property = property;
    }
}

class PropertyRequiredError extends Error {
    constructor(property) {
        super(`Missing property: ${property}!`);
        this.name = this.constructor.name;
        this.property = property;
    }
}

class UserNotFoundError extends Error {
    constructor(customerId) {
        super(`User ${customerId} not found!`);
        this.name = this.constructor.name;
        this.customerId = customerId;
    }
}

module.exports = {
    ValidationError,
    PropertyRequiredError,
    UserNotFoundError
};
