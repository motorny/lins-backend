import express from 'express';
import { getVersion } from './service';

const router = express.Router();

router.get('/', getVersion);

module.exports = router;