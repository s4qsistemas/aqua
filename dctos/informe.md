# Informe de Factibilidad y Propuesta de Desarrollo: [Nombre del Proyecto]

## 1. Resumen del Proyecto y Visión General

**Propósito del Sistema**
El proyecto consiste en el desarrollo de una plataforma web de grado industrial orientada a la telemetría, monitoreo y control remoto de sistemas de captación y potabilización de aguas. Diseñada inicialmente con una arquitectura "Web First" y optimizada para una futura escalabilidad a aplicaciones móviles nativas (iOS y Android), la solución busca modernizar la gestión hídrica permitiendo operaciones críticas a distancia.

**Modelo de Negocio y Audiencia (SaaS)**
El sistema operará bajo un modelo de Software as a Service (SaaS) multi-tenant (multiusuario). Está dirigido específicamente a Comités de Agua Potable Rural (APR) y sociedades administradoras de recursos hídricos. La arquitectura de roles permitirá una segregación estricta, desde un nivel Super Administrador (control global de la plataforma SaaS) hasta Administradores locales (operadores del APR), garantizando que cada entidad gestione únicamente su infraestructura.

**Operación y Control de Campo**
La plataforma actuará como el centro de mando (UI/UX) para la infraestructura física de las estaciones de agua. Mediante una integración segura con PLCs locales conectados vía redes Ethernet aisladas (Firewall/Router), el sistema procesará en tiempo real:
* Lectura de telemetría (sensores de nivel, estado de bombas, caudales).
* Recepción y gestión de alertas críticas.
* Ejecución de acciones remotas (activación/detención de bombas y válvulas).
* Visualización de flujos de video (cámaras in situ) para verificación física de niveles e infraestructura.

**Infraestructura, Seguridad y Cumplimiento Normativo**
Para soportar la criticidad de la operación hídrica y garantizar la continuidad del servicio, toda la infraestructura central estará alojada en la nube (Microsoft Azure) operando bajo entornos contenedorizados de alta disponibilidad. 

Al tratarse de la gestión de un recurso vital, el sistema se enmarca de forma estricta en el cumplimiento de la **Ley 21.663 (Ley Marco sobre Ciberseguridad de Chile)**, abordando las exigencias regulatorias para Operadores de Importancia Vital. Para materializar este mandato y habilitar la expansión internacional, la arquitectura se regirá por los lineamientos del estándar **ISO 27001**, exigiendo Autenticación Multifactor (2FA/MFA) obligatoria y trazabilidad absoluta e inmutable (Audit Trails) de cada operación crítica.

---

## 2. Definición del Alcance (Fase 1: Core Web SaaS)

El alcance de esta primera fase se centra exclusivamente en el motor central web, la infraestructura de comunicación segura y el cumplimiento normativo.

### 2.1. Módulos Funcionales (In Scope)

**A. Módulo de Gestión de Identidad y Accesos (IAM)**
* **Roles multi-tenant:** * *Super_Admin (Root):* Gestión de subscripciones y capacidad de suplantación temporal (impersonation) para soporte, registrando el ID real del operador.
  * *Admin Local (APR):* Control limitado a su infraestructura física.
* **Seguridad:** Doble Autenticación (2FA) obligatoria.

**B. Módulo de Telemetría y Monitoreo (Read-Only)**
* Recepción de datos de PLCs y visualización en dashboards en tiempo real.
* Visor de cámaras IP para validación física de las estaciones.

**C. Módulo de Mando y Control Remoto (Write/Actuation)**
* Envío de comandos hacia los PLCs (Ej: Activar/Detener bombas).
* **Seguridad Operativa:** Confirmación explícita requerida para comandos de alteración física.

**D. Módulo de Auditoría y Alertas (Compliance Ley 21.663)**
* **Audit Trail Inmutable:** Registro indeleble (Quién, cuándo, IP, comando).
* Motor de alertas ante anomalías (niveles críticos, desconexión de red).

**E. Internacionalización (I18n) y Localización (L10n)**
* Soporte nativo multi-idioma. Lanzamiento con Español e **Inglés Británico (en-GB)**, adaptando automáticamente formatos de fecha, timezones y separadores de unidades de medida.

### 2.2. Fuera de Alcance (Out of Scope - Fase 1)
* **Desarrollo Móvil Nativo:** El acceso móvil será vía navegador responsivo. Las apps en App Store/Play Store quedan postergadas para una Fase 2.
* **Facturación a Cliente Final:** El sistema es una plataforma de control operativo (B2B), no de gestión comercial hídrica residencial.
* **Automatización por IA:** El control remoto será manual; no habrá toma de decisiones autónoma basada en algoritmos en esta etapa.

---

## 3. Arquitectura del Sistema y Ciberseguridad (OT/IT)

El sistema emplea una arquitectura de microservicios desacoplados (API-First), asegurando que un fallo en la visualización web no afecte la ingesta de telemetría de los PLCs.

### 3.1. Topología de Componentes
1. **Frontend Web:** Interfaz gráfica orientada a la toma de decisiones.
2. **Backend (API):** Motor central, validación de reglas de negocio y exposición de WebSockets.
3. **IoT Edge & Database:** Punto de entrada para la telemetría y persistencia de datos.

### 3.2. Arquitectura de Ciberseguridad Industrial
Cumpliendo con la Ley 21.663 e ISO 27001 para infraestructura crítica:
* **Comunicación Unidireccional (Push):** Los firewalls en los APR bloquearán toda conexión entrante. Los PLCs/Routers establecerán túneles seguros hacia Azure para reportar estado o consultar comandos en cola.
* **Aislamiento de Red:** La base de datos operará en una red virtual privada (VNet) en Azure, accesible únicamente a través del backend actuando como proxy de seguridad.

---

## 4. Stack Tecnológico Seleccionado

La selección tecnológica prioriza el rendimiento, el tipado estricto para evitar vulnerabilidades y la escalabilidad hacia plataformas móviles futuras:

| Componente | Tecnología | Justificación Estratégica |
| :--- | :--- | :--- |
| **Frontend** | React / Tailwind CSS | Estándar robusto de UI que facilita la futura migración a React Native para apps móviles. |
| **Backend** | Node.js / Express | Alta concurrencia para procesamiento en tiempo real (WebSockets). |
| **Base de Datos** | PostgreSQL / Prisma ORM | Robustez transaccional. Prisma previene inyecciones SQL y asegura tipado estricto. |
| **Infraestructura** | Docker / Microsoft Azure | Entorno contenedorizado para alta disponibilidad y redundancia geográfica. |

---

## 5. Hoja de Ruta, Fases de Desarrollo y Entregables (Roadmap)

El proyecto se ejecutará mediante un enfoque iterativo para asegurar la integración progresiva de la ciberseguridad y las pruebas en terreno. Las estimaciones asumen la disponibilidad del hardware físico para las pruebas de integración.

### 5.1. Cronograma de la Fase Web SaaS

| Fase | Título de la Fase | Foco Principal y Entregables Clave | Esfuerzo |
| :--- | :--- | :--- | :--- |
| **Fase 1** | **Fundamentos e Infraestructura** | Despliegue en Azure (Docker). Diseño del modelo relacional en PostgreSQL. Configuración de VNet. | Semanas 1 - 4 |
| **Fase 2** | **Motor Backend y Ciberseguridad** | Desarrollo de API (Node.js). IAM (2FA, Roles, Audit Trails). Endpoints IoT. Encolamiento de comandos. | Semanas 5 - 10 |
| **Fase 3** | **Frontend Web y Panel de Control** | UI en React. Motor I18n (en-GB). Dashboards en tiempo real. Consolas de actuación con confirmación. | Semanas 11 - 16 |
| **Fase 4** | **Pruebas Integrales y Producción** | Pruebas End-to-End con hardware local. Auditoría (Ley 21.663). Despliegue en Producción. | Semanas 17 - 20 |

### 5.2. Hito Estratégico Post-Lanzamiento (Fase Móvil)
Una vez estabilizada la Fase 4, se activará el desarrollo de aplicaciones móviles nativas (iOS/Android). Al ser una arquitectura "API-First", estas aplicaciones consumirán la misma infraestructura de seguridad y datos validada, enfocándose exclusivamente en la visualización rápida de alertas y el monitoreo para operadores en terreno.