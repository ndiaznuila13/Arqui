import {Router} from "express";
import {
    obtenerDisponibilidad,
    crearDisponibilidad
} from '../controllers/disponibilidadController';
import { verificarRol, verificarToken } from "../middlewares/authMiddleware";
import { validate } from "../validators/validate";
import { crearDisponibilidadSchema } from "../validators/schemas";

const router = Router();

router.get("/:tutor/:tutorId", verificarToken, obtenerDisponibilidad);
router.post(
    "/",
    verificarToken,
    verificarRol('tutor'),
    validate(crearDisponibilidadSchema),
    crearDisponibilidad
);

export default router;