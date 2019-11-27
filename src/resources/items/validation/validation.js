const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

// Fetch the JSON content, pretending it was downloaded from a URL
const itemsSchema = require('./itemSchema.json');
ajv.addSchema(itemsSchema, 'new-item');

function errorResponse(schemaErrors) {
    let errors = schemaErrors.map((error) => {
        return {
            path: error.dataPath,
            message: error.message
        };
    });
    return {
        message: 'Failed',
        errors: errors
    };
}

export default function validateSchema(schemaName) {
    return (req, res, next) => {
        let isValid = ajv.validate(schemaName, req.body);
        if (!isValid) {
            res.status(400).json(errorResponse(ajv.errors))
        } else {
            next();
        }
    }
}