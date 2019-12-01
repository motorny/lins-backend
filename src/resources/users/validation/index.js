import createSchemaValidator from "../../../common/validation";

const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

const newUserSchema = require('./newUserSchema');
const changeRoleSchema = require('./changeRoleSchema');

ajv.addSchema(newUserSchema, 'new-user');
ajv.addSchema(changeRoleSchema, 'change-role');

const validateSchema = createSchemaValidator(ajv);
export default validateSchema;
