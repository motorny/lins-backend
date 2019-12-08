import express from 'express';
import service from './service';
import {handleErrorAsync, throwMethodNotAllowed} from '../../common/utils'
import {checkJWTAdmin} from "../../common/auth";
import validateSchema from "./validation";

const router = express.Router();

async function handlePatchChangeUserRole(request, response) {
    const id = parseInt(request.params.id);
    const {body} = request;
    const result = await service.changeUserRole(id, body.isAdmin);
    response.send(result);
}


async function handlePostAddNewUser(request, response) {
    const {body} = request;
    const newUser = await service.addNewUser(body);
    response.status(201).send(newUser);
}


router.patch("/:id", checkJWTAdmin, validateSchema('change-role'), handleErrorAsync(handlePatchChangeUserRole));
router.all("/:id", throwMethodNotAllowed(['PATCH']));
router.post("/", validateSchema('new-user'), handleErrorAsync(handlePostAddNewUser));
router.all("/", throwMethodNotAllowed(['POST']));

module.exports = router;