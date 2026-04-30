import prisma from "../../lib/prisma";
import { Estado } from "@prisma/client";

export async function listarTenantsService() {
    return prisma.tenant.findMany({
        include: { 
            plan: true,
            usuarios: {
                where: { rol: 'ADMIN' },
            }
        },
        orderBy: { createdAt: "desc" },
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

// NUEVO: Transacción segura para cambio de estado + auditoría
export async function cambiarEstadoTenantService(id: number, estado: Estado, nota: string, tenantActual: any) {
    return prisma.$transaction(async (tx) => {
        const updated = await tx.tenant.update({
            where: { id },
            data: { estado },
        });

        await tx.historialTenant.create({
            data: {
                tenantId: id,
                tipo: estado === "ACTIVO" ? "ACTIVACION" : "DESACTIVACION",
                estadoAntes: tenantActual.estado,
                estadoNuevo: estado,
                nota,
            },
        });

        return updated;
    });
}

// NUEVO: Transacción segura para cambio de plan + auditoría
export async function cambiarPlanTenantService(id: number, planId: number | null, nota: string, tenantActual: any) {
    return prisma.$transaction(async (tx) => {
        const updated = await tx.tenant.update({
            where: { id },
            data: { planId },
        });

        await tx.historialTenant.create({
            data: {
                tenantId: id,
                tipo: "CAMBIO_PLAN",
                planAntesId: tenantActual.planId,
                planNuevoId: planId,
                nota,
            },
        });

        return updated;
    });
}