import {Request, Response, NextFunction} from "express";

export const errorHandler = (
    error: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error('Error', error);

    if (error.code === 'P2002') {
        // Prisma unique constraint violation
        res.status(409).json({ 
            error: 'Registro duplicado',
            details: 'Ya existe un registro con ese valor único.'
        });
        return;
    }

    if (error.code === 'P2025') {
        // Prisma record not found
        res.status(404).json({ error: 'Registro no encontrado' });
        return;
    }

    if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ error: 'Token inválido' });
        return;
    }

    res.status(error.status || 500).json({ 
        error: error.message || 'Error interno del servidor',
     });
};