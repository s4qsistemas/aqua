import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_123";

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Faltan credenciales" });
            return;
        }

        const usuario = await prisma.usuario.findUnique({
            where: { email },
            include: { tenant: true }
        });

        if (!usuario) {
            res.status(401).json({ error: "Credenciales inválidas" });
            return;
        }

        if (usuario.estado !== "ACTIVO") {
            res.status(403).json({ error: "Usuario inactivo" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, usuario.passwordHash);

        if (!isPasswordValid) {
            res.status(401).json({ error: "Credenciales inválidas" });
            return;
        }

        // Generar JWT
        const token = jwt.sign(
            { 
                id: usuario.id, 
                rol: usuario.rol,
                tenantId: usuario.tenantId
            },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Devolver token y datos del usuario (sin passwordHash)
        const { passwordHash, ...userWithoutPassword } = usuario;

        res.status(200).json({
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        // El userId vendrá del middleware de autenticación
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ error: "No autenticado" });
            return;
        }

        const usuario = await prisma.usuario.findUnique({
            where: { id: userId },
            include: { tenant: true }
        });

        if (!usuario) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }

        const { passwordHash, ...userWithoutPassword } = usuario;
        res.status(200).json(userWithoutPassword);

    } catch (error) {
        console.error("Error en getMe:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
