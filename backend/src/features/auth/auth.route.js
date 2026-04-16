import {Router} from 'express'
import { register } from "./auth.controller.js";

const router=Router();

router.post('/auth/user',register)

export default router


