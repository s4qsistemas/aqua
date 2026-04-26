import prisma from "../../lib/prisma";
import { Estado } from "@prisma/client";

export async function listarTenantsService() {
    return prisma.tenant.findMany({
        include: {
            plan: true
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}


export async function crearTenantService(nombre: string, planId?: number) {
    return prisma.tenant.create({
        data: {
            nombre,
            estado: Estado.ACTIVO,
            planId: planId ? Number(planId) : undefined,
        },
    });
}


export async function obtenerTenantService(id: number) {
    return prisma.tenant.findUnique({
        where: { id },
    });
}

export async function actualizarTenantService(id: number, nombre: string, planId?: number) {
    return prisma.tenant.update({
        where: { id },
        data: {
            nombre,
            planId: planId ? Number(planId) : undefined,
        },
    });
}


export async function cambiarEstadoTenantService(id: number, estado: Estado) {
    return prisma.tenant.update({
        where: { id },
        data: {
            estado,
        },
    });
}