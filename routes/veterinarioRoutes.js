import express from "express";
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";


const router = express.Router();

//No se requiere cuenta para ver estar rutas (PUBLICAS)
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);

// router.get('/olvide-password/:token', comprobarToken);
// router.post('/olvide-password/:token', nuevoPassword);

//Otra forma de escribir las 2 funciones que apuntan a una misma url
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

//Rutas que si es necesario tener cuenta(PRIVADAS)
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth,  actualizarPerfil);
router.put('/actualizar-password', checkAuth,  actualizarPassword);



export default router;