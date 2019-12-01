import createSchemaValidator from "../../../common/validation";

const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

const newUserSchema = require('./newTagSchema');

ajv.addSchema(newUserSchema, 'new-tag');

const validateSchema = createSchemaValidator(ajv);
export default validateSchema;
