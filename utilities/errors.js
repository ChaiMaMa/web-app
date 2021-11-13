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

class SQLError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

class ConnectionError extends SQLError {
    constructor(message) {
        super(message);
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
    SQLError,
    ConnectionError,
    OperationFailedError
};
