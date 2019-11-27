import createSchemaValidator from "../../../common/validation";
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

const newItemSchema = require('./newProfileSchema.json');
const changeItemSchema = require('./changeProfileSchema.json');

ajv.addSchema(newItemSchema, 'new-profile');
ajv.addSchema(changeItemSchema, 'change-profile');

const validateSchema = createSchemaValidator(ajv);
export default validateSchema;