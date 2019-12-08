import createSchemaValidator from "../../../common/validation";
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

const acquireTokenSchema = require('./acquireTokenSchema.json');

ajv.addSchema(acquireTokenSchema, 'acquire-token');

const validateSchema = createSchemaValidator(ajv);
export default validateSchema;