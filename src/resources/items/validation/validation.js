import createSchemaValidator from "../../../common/validation";
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

// Fetch the JSON content, pretending it was downloaded from a URL
const itemsSchema = require('./itemSchema.json');
ajv.addSchema(itemsSchema, 'new-item');

const validateSchema = createSchemaValidator(ajv);
export default validateSchema;