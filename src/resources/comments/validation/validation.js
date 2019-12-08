import createSchemaValidator from "../../../common/validation";
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

const newCommentSchema = require('./newCommentSchema.json');
const changeCommentSchema = require('./changeCommentSchema.json');

ajv.addSchema(newCommentSchema, 'new-comment');
ajv.addSchema(changeCommentSchema, 'change-comment');

const validateSchema = createSchemaValidator(ajv);
export default validateSchema;