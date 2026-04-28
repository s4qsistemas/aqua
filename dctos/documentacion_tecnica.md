# Documentación Técnica: Sistema de Gestión de Comunidades (Aqua)

Este documento detalla la arquitectura, funcionalidades y flujos técnicos del proyecto **Aqua**, un sistema SaaS para la gestión de comunidades (tenants), planes de suscripción y auditoría.

---

## 1. Arquitectura General

El proyecto sigue una arquitectura desacoplada **Full-Stack**:

- **Backend**: Node.js con Express, escrito en TypeScript. Utiliza **Prisma ORM** para la interacción con una base de datos **PostgreSQL**.
- **Frontend**: React 18 con Vite, utilizando **Tailwind CSS** para el diseño premium y **Google Material Symbols** para la iconografía.

---

## 2. Modelo de Datos (Prisma Schema)

El núcleo del sistema reside en tres entidades principales relacionadas en `schema.prisma`:

### `Tenant` (Comunidad)
Representa a cada cliente del sistema.
- `id`: Identificador único.
- `nombre`: Nombre de la comunidad.
- `estado`: Enum (`ACTIVO`, `INACTIVO`).
- `planId`: Relación con el plan actual.

### `Plan` (Suscripción)
Define los niveles de servicio disponibles.
- `id`: Identificador único.
- `nombre`: Nombre del plan (Básico, Profesional, etc.).
- `precio`: Costo mensual.

### `HistorialTenant` (Auditoría)
Registra cada acción crítica realizada sobre un tenant para auditoría total.
- `tipo`: Enum (`ACTIVACION`, `DESACTIVACION`, `CAMBIO_PLAN`).
- `nota`: Justificación obligatoria del cambio.
- `planAntesId` / `planNuevoId`: Snapshots de los IDs de los planes para rastrear la evolución comercial.

---

## 3. Seguridad y Autenticación

El acceso está protegido mediante **JWT (JSON Web Tokens)** y una jerarquía de middlewares que garantizan que solo el personal autorizado realice cambios.

### Middleware: `verifyToken.ts`
Extrae el token del header `Authorization: Bearer <token>`, lo valida contra la clave secreta e inyecta los datos del usuario en el objeto de la petición.

```typescript
// Fragmento de auth.middleware.ts
const token = authHeader.split(" ")[1];
const decoded = jwt.verify(token, JWT_SECRET);
(req as any).user = decoded;
```

### Middleware: `requireSuperadmin.ts`
Verifica que el usuario inyectado por el middleware anterior tenga explícitamente el rol `SUPERADMIN`. Si un administrador de una comunidad intenta acceder, el sistema lo bloquea automáticamente.

---

## 4. Módulo de Tenants (Backend)

Ubicado en `src/modules/tenants/`, este módulo maneja toda la lógica de negocio de las comunidades.

### Funciones Principales (`tenant.controller.ts`):

1. **`listarTenants`**: Retorna todas las comunidades. Realiza un `join` automático con la tabla de planes para mostrar el nombre del plan en lugar de solo el ID.
2. **`crearTenant`**: Registra una nueva comunidad. Ahora permite asignar el plan inicial desde el momento cero.
3. **`cambiarEstadoTenant`**: Alterna entre `ACTIVO` e `INACTIVO`. Es un proceso sensible que **obliga** a registrar una nota en el historial.
4. **`cambiarPlanTenant`**: Actualiza el plan y registra automáticamente qué plan tenía antes y cuál tiene ahora.

```typescript
// Ejemplo de registro de auditoría al cambiar plan
await prisma.historialTenant.create({
    data: {
        tenantId: id,
        tipo: \"CAMBIO_PLAN\",
        planAntesId: tenant.planId,
        planNuevoId: planId,
        nota: notaRecibida,
    },
});
```

---

## 5. Dashboard Administrativo (Frontend)

El dashboard (`DashboardPage.tsx`) es una interfaz reactiva diseñada para la máxima eficiencia.

### Gestión de Estado y Token
El dashboard espera a que el `AuthContext` recupere el token del `localStorage` antes de disparar las peticiones iniciales, evitando errores de \"No autorizado\" en el primer renderizado.

### Manejo de Sesión Expirada (Auto-Logout)
Implementa un patrón de seguridad donde cada respuesta de la API es analizada. Si el backend retorna un código `401` o `403`, el frontend destruye la sesión local y redirige al login de inmediato.

```tsx
if (res.status === 401 || res.status === 403) {
  logout(); // Limpia localStorage y redirige
  return;
}
```

### Componentes de Interfaz
- **TenantFormModal**: Formulario único para creación y edición, sincronizado con la lista de planes reales de la DB.
- **TenantHistoryModal**: Consulta dinámicamente el historial de una comunidad específica al hacer clic, mostrando quién hizo qué y por qué.

---

## 6. Flujo de Información: Ejemplo de Creación

1. **UI**: El usuario completa el nombre y elige un plan en el modal.
2. **Fetch**: El frontend envía un `POST` con el payload `{ nombre, planId }` y el token JWT.
3. **Middleware**: El backend verifica que el token sea válido y el usuario sea Superadmin.
4. **Service**: Prisma inserta el registro en la tabla `Tenant`.
5. **Update**: El frontend recibe la confirmación, cierra el modal y re-ejecuta `fetchTenants()` para mostrar la nueva comunidad al instante.

---

## 7. Estética y Diseño
- **Premium UI**: Uso de gradientes HSL, sombras suaves (`shadow-xl`) y bordes redondeados (`rounded-[2rem]`).
- **Iconografía Moderna**: Implementación total de **Google Material Symbols (Outlined)**, reemplazando emojis y diseños básicos por una línea visual profesional.
- **Responsive**: Layout adaptativo para tablets y escritorio con una arquitectura de columnas limpia.
