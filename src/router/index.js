import {Router} from "express"
import * as authController from './../controllers/auth.controller'

export const Route = Router()
// rutas AUTH
Route.post('/auth/login', authController.login);
