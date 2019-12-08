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

export default function createSchemaValidator(ajv) {
    function validateSchema(schemaName)
    {
        return (req, res, next) => {
            let isValid = ajv.validate(schemaName, req.body);
            if (!isValid) {
                res.status(400).json(errorResponse(ajv.errors))
            } else {
                next();
            }
        }
    }
    return validateSchema
}