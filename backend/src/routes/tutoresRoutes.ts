import {Router} from "express";
import {
    listarTutores,
    crearPerfilTutor,
    obtenerTutor,
} from '../controllers/tutoresController';
import { verificarRol, verificarToken } from "../middlewares/authMiddleware";
import { validate } from "../validators/validate";
import { crearTutorSchema } from "../validators/schemas";

const router = Router();

router.get('/', verificarToken, listarTutores);
router.get('/:id', verificarToken, obtenerTutor);
router.post(
    '/',
    verificarToken,
    verificarRol('tutor'),
    validate(crearTutorSchema),
    crearPerfilTutor
);

export default router;