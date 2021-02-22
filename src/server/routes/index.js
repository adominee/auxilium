import {Router} from 'express';
import apiUser from './user';

const router=Router();

router.use('/user',apiUser);

module.exports = router;