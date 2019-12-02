import createSchemaValidator from "../../../common/validation";
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

const newItemSchema = require('./newStorageSchema.json');
const changeItemSchema = require('./changeStorageSchema.json');

ajv.addSchema(newItemSchema, 'new-storage');
ajv.addSchema(changeItemSchema, 'change-storage');

const validateSchema = createSchemaValidator(ajv);
export default validateSchema;