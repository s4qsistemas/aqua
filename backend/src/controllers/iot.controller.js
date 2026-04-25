// src/controllers/iot.controller.js
const prisma = require("../../prisma/client");

exports.recibirEvento = async (req, res) => {
    try {
        const { deviceId, variable, valor, unidad } = req.body;

        // 1. Buscar dispositivo
        const dispositivo = await prisma.dispositivo.findUnique({
            where: { azureDeviceId: deviceId }
        });

        if (!dispositivo) {
            return res.status(404).json({ error: "Dispositivo no encontrado" });
        }

        // 2. Guardar telemetría
        const telemetria = await prisma.telemetria.create({
            data: {
                dispositivoId: dispositivo.id,
                variable,
                valor,
                unidad
            }
        });

        // 3. Emitir realtime
        global.io.emit("telemetria:nueva", {
            dispositivoId: dispositivo.id,
            variable,
            valor,
            unidad
        });

        return res.json({ ok: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno" });
    }
};