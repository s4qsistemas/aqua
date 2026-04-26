import { Request, Response, NextFunction } from "express";

export function requireSuperadmin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const usuario = (req as any).user;

    if (!usuario) {
        return res.status(401).json({ message: "No autenticado" });
    }

    if (usuario.rol !== "SUPERADMIN") {
        return res.status(403).json({ message: "Acceso solo para superadmin" });
    }

    next();
}