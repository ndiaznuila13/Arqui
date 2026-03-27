import {Router} from "express";
import {
    obtenerMisNotificaciones,
    obtenerNoLeidas,
    marcarNotificacionLeida
} from '../controllers/notificacionesController';
import { verificarToken } from "../middlewares/authMiddleware";

const router = Router();

router.get('/', verificarToken, obtenerMisNotificaciones);
router.get('/no-leidas', verificarToken, obtenerNoLeidas);
router.post('/:id/leer', verificarToken, marcarNotificacionLeida);

export default router;