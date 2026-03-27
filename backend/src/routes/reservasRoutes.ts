import { Router } from "express";
import {
    crearReserva,
    cancelarReserva,
    listarMisReservas
} from '../controllers/reservasController';
import { verificarToken } from "../middlewares/authMiddleware";
import { validate } from "../validators/validate";
import { crearReservaSchema } from "../validators/schemas";

const router = Router();

router.get('/mis-reservas', verificarToken, listarMisReservas);
router.post('/', verificarToken, validate(crearReservaSchema), crearReserva);
router.post('/:id/cancelar', verificarToken, cancelarReserva);

export default router;