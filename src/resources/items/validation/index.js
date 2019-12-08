import createSchemaValidator from "../../../common/validation";
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

const newItemSchema = require('./newItemSchema.json');
const changeItemSchema = require('./changeItemSchema.json');

ajv.addSchema(newItemSchema, 'new-item');
ajv.addSchema(changeItemSchema, 'change-item');

const validateSchema = createSchemaValidator(ajv);
export default validateSchema;