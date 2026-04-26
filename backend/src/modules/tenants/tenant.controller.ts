import { Request, Response } from "express";
import {
    crearTenantService,
    listarTenantsService,
    obtenerTenantService,
    actualizarTenantService,
    cambiarEstadoTenantService,
} from "./tenant.service";
import prisma from "../../lib/prisma";

export async function listarTenants(req: Request, res: Response) {
    const tenants = await listarTenantsService();
    res.json(tenants);
}

export async function crearTenant(req: Request, res: Response) {
    const { nombre, planId } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const tenant = await crearTenantService(nombre, planId ? Number(planId) : undefined);
    res.status(201).json(tenant);
}


export async function obtenerTenant(req: Request, res: Response) {
    const tenant = await obtenerTenantService(Number(req.params.id));

    if (!tenant) {
        return res.status(404).json({ message: "Comunidad no encontrada" });
    }

    res.json(tenant);
}

export async function actualizarTenant(req: Request, res: Response) {
    const { nombre, planId } = req.body;

    const tenant = await actualizarTenantService(Number(req.params.id), nombre, planId);
    res.json(tenant);
}


export async function cambiarEstadoTenant(req: Request, res: Response) {
    const { estado, nota } = req.body;
    const id = Number(req.params.id);

    if (!nota) {
        return res.status(400).json({ message: "La nota es obligatoria" });
    }

    const tenant = await prisma.tenant.findUnique({ where: { id } });

    if (!tenant) {
        return res.status(404).json({ message: "Comunidad no encontrada" });
    }

    const updated = await prisma.tenant.update({
        where: { id },
        data: { estado },
    });

    await prisma.historialTenant.create({
        data: {
            tenantId: id,
            tipo: estado === "ACTIVO" ? "ACTIVACION" : "DESACTIVACION",
            estadoAntes: tenant.estado,
            estadoNuevo: estado,
            nota,
        },
    });

    res.json(updated);
}

export async function cambiarPlanTenant(req: Request, res: Response) {
    const { planId, nota } = req.body;
    const id = Number(req.params.id);

    if (!nota) {
        return res.status(400).json({ message: "La nota es obligatoria" });
    }

    const tenant = await prisma.tenant.findUnique({ where: { id } });

    if (!tenant) {
        return res.status(404).json({ message: "Comunidad no encontrada" });
    }

    const updated = await prisma.tenant.update({
        where: { id },
        data: { planId },
    });

    await prisma.historialTenant.create({
        data: {
            tenantId: id,
            tipo: "CAMBIO_PLAN",
            planAntesId: tenant.planId,
            planNuevoId: planId,
            nota,
        },
    });

    res.json(updated);
}

export async function getHistorial(req: Request, res: Response) {
    const id = Number(req.params.id);

    const data = await prisma.historialTenant.findMany({
        where: { tenantId: id },
        include: {
            planAntes: true,
            planNuevo: true,
        },
        orderBy: { createdAt: "desc" },
    });

    res.json(data);
}

export async function listarPlanes(req: Request, res: Response) {
    const planes = await prisma.plan.findMany({
        where: { estado: "ACTIVO" }
    });
    res.json(planes);
}

