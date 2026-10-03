# Plataforma de Invitaciones Digitales

Plataforma web para crear, personalizar, comprar y compartir invitaciones digitales
para cualquier tipo de evento. Autoservicio en el MVP (web + imagen), con módulos
opcionales que se activan según el evento.

Consulta `DECISIONES-MVP.md` para el alcance acordado y las reglas del proyecto.

## Stack

- **Frontend:** Angular 22 (`/frontend`)
- **Backend:** NestJS + TypeScript (`/backend`)
- **Base de datos:** PostgreSQL 16 (Docker, `docker-compose.yml`)
- **Pagos (fase posterior):** Stripe · **Moneda:** MXN

## Requisitos

- Node.js 22+
- Docker Desktop (para PostgreSQL)

## Puertos del proyecto

Este proyecto usa un rango propio para no chocar con otros proyectos locales:

| Servicio | Puerto |
|---|---|
| Frontend (Angular) | 4300 |
| Backend (NestJS) | 3100 |
| PostgreSQL (host) | 5433 |

## Estructura

```
.
├── docker-compose.yml     # PostgreSQL 16
├── backend/               # API NestJS
├── frontend/              # App Angular
├── DECISIONES-MVP.md      # Alcance y reglas del proyecto
└── README.md
```

## Puesta en marcha (desarrollo)

Abre tres terminales (o usa Docker en segundo plano).

### 1. Base de datos (PostgreSQL en Docker)

```bash
docker compose up -d
```

Verifica que el contenedor está sano:

```bash
docker inspect --format '{{.State.Health.Status}}' invitaciones_postgres
# -> healthy
```

Para detenerla: `docker compose down` (los datos persisten en el volumen).

### 2. Backend (NestJS)

```bash
cd backend
cp .env.example .env     # la primera vez
npm install              # la primera vez
npm run seed             # la primera vez: carga el catálogo inicial (12 plantillas)
npm run start:dev        # modo desarrollo con recarga
```

El backend queda en `http://localhost:3100`.

> El archivo `.env` contiene credenciales locales y **no se sube a git**.
> No se guardan secretos en el frontend.

### 3. Frontend (Angular)

```bash
cd frontend
npm install              # la primera vez
npm start                # ng serve
```

El frontend queda en `http://localhost:4300`.

## API del catálogo (Etapa 1)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/templates` | Catálogo público (solo activas). Filtros: `?eventType=&style=&format=` |
| GET | `/templates/filters` | Opciones de filtro con etiquetas legibles |
| GET | `/templates/:id` | Detalle / vista de ejemplo de una plantilla |
| GET | `/templates/admin/all` | Listado para administración (activas e inactivas) |
| POST | `/templates` | Crear plantilla |
| PATCH | `/templates/:id/active` | Publicar / retirar (`{ "isActive": boolean }`) |

> Las rutas de administración aún no tienen autenticación; se protegerán en la etapa de roles.

## API de invitaciones (Etapa 2)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/invitations` | Crear borrador desde una plantilla (`{ "templateId": "...", "title?": "..." }`) |
| GET | `/invitations/:id` | Leer el borrador (incluye evento y plantilla) |
| PATCH | `/invitations/:id` | Guardar borrador: `title`, `eventData`, `customization` |

> El borrador copia el tema de la plantilla como punto de partida de la personalización.
> El contenido del evento (`Event`) se separa del diseño de la plantilla (`Template`).

## API de pago y público (Etapa 3)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/orders` | Inicia el pago de una invitación (`{ "invitationId": "..." }`). Devuelve URL de Stripe o modo simulado |
| GET | `/orders/:id` | Estado del pedido (pending/paid/...) |
| POST | `/orders/webhook` | Webhook de Stripe (confirma pago y publica) |
| GET | `/p/:token` | Datos públicos de la invitación publicada (sin ids internos) |
| GET | `/p/:token/image.svg` | Imagen SVG para compartir |
| GET | `/p/:token/image.png` | Imagen PNG para compartir (usada en Open Graph; mejor compatibilidad) |
| GET | `/p/:token/share` | HTML con metadatos Open Graph para compartir |

> **Stripe:** la clave secreta vive solo en el backend (`.env`). Si `STRIPE_SECRET_KEY`
> está vacío, el sistema usa un **modo de pago simulado** para desarrollo.
> En local, los webhooks se reciben con la CLI de Stripe:
> `stripe listen --events checkout.session.completed --forward-to localhost:3100/orders/webhook`
> Tarjeta de prueba: `4242 4242 4242 4242`, fecha futura, cualquier CVC.

## Autenticación y roles (Etapa Auth)

- **Organizador** y **admin** tienen cuenta (registro/login con JWT). El **invitado NO**:
  usa su enlace tokenizado (`/r/:token`), sin cuenta.
- Las contraseñas se guardan con hash bcrypt. El JWT se firma con `JWT_SECRET` (en `.env`).
- Cada invitación tiene un **dueño** (`ownerId`): un organizador solo puede ver y editar
  **sus** invitaciones e invitados. Intentar acceder a las de otro devuelve 403.
- Las rutas de administración de plantillas requieren rol **admin**.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | Crear cuenta de organizador (devuelve token + usuario) |
| POST | `/auth/login` | Iniciar sesión (devuelve token + usuario) |
| GET | `/auth/me` | Usuario actual (requiere token) |

Rutas públicas (sin token): catálogo, detalle de plantilla, `/p/:token*`, `/rsvp/:token`,
webhook de Stripe y `/health`. El resto requiere token.

> Para crear un usuario **admin** (que gestione plantillas) no hay endpoint público; se
> asigna el rol directamente en la base de datos. (Panel de admin con gestión de roles: fase posterior.)

## API de administración de pedidos (Etapa 5)

Solo rol **admin**:

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/admin/orders` | Lista de pedidos (filtro `?status=paid|pending|refunded`) |
| GET | `/admin/orders/:id` | Detalle de un pedido |
| POST | `/admin/orders/:id/refund` | Reembolsa un pedido pagado (Stripe en test / simulado) |
| GET | `/admin/reports/sales` | Reporte: pedidos por estado, ingreso bruto y costos estimados |

> Los **costos de pasarela** del reporte son una **estimación por validar** (hipótesis:
> 3.6% + 3 MXN por transacción), no las tarifas reales de Stripe México.

### Crear un usuario admin

No hay registro público de admins. Tras registrarte como organizador, promueve tu usuario:

```bash
docker exec invitaciones_postgres psql -U invitaciones -d invitaciones \
  -c "UPDATE users SET role='admin' WHERE email='TU_CORREO';"
```

Vuelve a iniciar sesión para obtener un token con el rol actualizado.

## Diseño a medida (Fase 2C)

Servicio por encargo: el cliente solicita un diseño, el equipo (admin) envía propuestas y el
cliente aprueba o pide cambios (con un límite de revisiones). Sin archivos pesados ni cobro
específico por ahora.

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/design-requests` | cliente | Crea una solicitud |
| GET | `/design-requests` | cliente | Sus solicitudes |
| GET | `/design-requests/:id` | cliente/admin | Solicitud + hilo de mensajes |
| POST | `/design-requests/:id/messages` | cliente | Comentar; `requestChanges:true` cuenta revisión |
| POST | `/design-requests/:id/approve` | cliente | Aprueba la propuesta |
| GET | `/admin/design-requests` | admin | Bandeja (filtro `?status=`) |
| PATCH | `/admin/design-requests/:id/status` | admin | Cambia el estado |
| POST | `/admin/design-requests/:id/proposal` | admin | Envía propuesta (pasa a estado "propuesta") |
| POST | `/design-requests/:id/references` | cliente/admin | Sube imagen de referencia (multipart, campo `file`) |
| GET | `/design-requests/:id/references` | cliente/admin | Lista las imágenes de la solicitud |
| DELETE | `/design-requests/:id/references/:refId` | cliente/admin | Elimina una imagen |

- Las imágenes de referencia (máx. 6 por solicitud, 5 MB, solo jpg/png/webp/gif) se guardan en
  `backend/uploads/` en desarrollo y se sirven en `/uploads/...`. **En producción** deben ir a
  un object storage/CDN (S3 o similar); el modelo guarda el nombre de archivo para facilitar ese cambio.

- Estados: nueva → en_proceso → propuesta → aprobada / rechazada / ajuste_solicitado.
- Revisiones: el cliente puede pedir cambios hasta `revisionLimit` (por defecto 2); superado,
  se rechaza.
- Un cliente solo ve sus solicitudes; la bandeja es solo para admin.

### Cobro del diseño (Fase 3E)

- El admin envía la propuesta **con un precio** (`priceCents`). La solicitud pasa a `propuesta`.
- El cliente **paga para aprobar**: `POST /orders/design` (`{ "designRequestId": "..." }`) abre
  Stripe Checkout. Al confirmarse el pago (webhook), la solicitud queda `aprobada` y `paid`.
- **Ajustes tras el pago tienen costo adicional**: el cliente usa
  `POST /design-requests/:id/request-adjustment`, la solicitud pasa a `ajuste_solicitado` y el
  admin envía una nueva propuesta con su precio (nuevo ciclo de pago). El cliente ve el aviso
  del costo antes de solicitarlo.
- El pedido (`Order`) distingue el tipo con `kind` (`invitation_publish` o `design_service`).

## Boletos QR (Fase 2B)

Pases de acceso gratuitos con validación por enlace (sin cámara, por ahora). Nuevo rol
**personal de acceso** (`staff`) asignable por evento.

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| PATCH | `/invitations/:id/tickets` | dueño | Activa/desactiva boletos (`{ "enabled": true }`) |
| POST | `/invitations/:id/staff` | dueño | Asigna personal de acceso por correo (`{ "email": "..." }`) |
| GET | `/pass/:accessToken` | público | Pase del invitado con QR (data URL). Solo si confirmó y hay boletos |
| GET | `/tickets/:ticketToken` | dueño/staff | Estado del pase (valid / already_used / not_confirmed) |
| POST | `/tickets/:ticketToken/checkin` | dueño/staff | Registra entrada (idempotente; previene reutilización) |

- El QR codifica el enlace `/validar/:ticketToken`. El personal lo abre, lo **escanea con la
  cámara** desde `/validar`, o pega el código, y registra la entrada.
- El escáner de cámara (`@zxing/browser`) requiere `localhost` o HTTPS para acceder a la
  cámara; si no hay cámara o se deniega el permiso, queda la entrada manual por código.
- Solo el **dueño del evento** o un **staff asignado** pueden validar (otros: 403).
- El rol staff se asigna automáticamente al invitar a un organizador como personal de acceso.

## PDF imprimible (Fase 2A)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/invitations/:id/pdf?size=A5\|A6\|LETTER` | PDF imprimible (solo el dueño). Tamaño opcional, default A5 |

- El PDF incluye título, nombres, fecha, lugar y mensaje, con fondo a color y bandas
  decorativas tomados de la plantilla. Tamaños disponibles: A5, A6 y carta (el diseño se
  escala proporcionalmente). Se genera con pdfkit (fuentes integradas, sin licencias de pago).
- En el frontend, el botón **PDF** en `/mis-invitaciones` lo descarga (la petición lleva el
  token; se recibe como blob y se descarga en el navegador).

## API de invitados y RSVP (Etapa 4)

Gestión por el organizador (anidada bajo la invitación):

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/invitations/:id/guests` | Alta de invitado (`name`, `allowedSeats`, `contact?`) |
| GET | `/invitations/:id/guests` | Lista de invitados con estados |
| GET | `/invitations/:id/guests/summary` | Conteos (confirmados/pendientes/lugares) |
| GET | `/invitations/:id/guests/export` | Exportar invitados a CSV |
| POST | `/invitations/:id/guests/import` | Importar invitados desde CSV (`{ "csv": "..." }`) |
| DELETE | `/invitations/:id/guests/:guestId` | Eliminar invitado |

Confirmación del invitado por enlace privado (sin cuenta):

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/rsvp/:token` | Datos del invitado + invitación (no expone a otros invitados) |
| POST | `/rsvp/:token` | Confirmar/declinar (`status`, `seats`). Rechaza más lugares de los autorizados |

## Política de publicación (Etapa 3)

- **Precio:** `PUBLISH_PRICE_CENTS` en el `.env` (hipótesis a validar, en centavos de MXN).
- **Vigencia del enlace:** `PUBLISH_VALIDITY_DAYS` días (por defecto 180). Pasada la fecha,
  la invitación pública se marca como expirada.
- **Reembolsos:** una invitación ya publicada entrega el producto (enlace + imagen), por lo
  que no es reembolsable; antes de publicar no hay cobro. (Flujo de reembolso automático: fase posterior.)

## Rutas del frontend

- `/` — inicio
- `/login` · `/registro` — autenticación del organizador
- `/mis-invitaciones` — invitaciones del organizador (requiere sesión)
- `/catalogo` — catálogo con filtros por evento, estilo y formato
- `/plantilla/:id` — vista de ejemplo de una plantilla (botón "Personalizar")
- `/editor/:id` — editor autoservicio con vista previa en vivo (móvil/escritorio) y botón "Publicar"
- `/pago/exito` — pantalla de éxito con enlace, compartir e imagen
- `/i/:token` — página pública de la invitación (vista del invitado)
- `/r/:token` — confirmación de asistencia del invitado (enlace privado)
- `/invitacion/:id/invitados` — panel de invitados del organizador (alta, estados, CSV)
- `/admin/plantillas` — panel de administración de plantillas (admin)
- `/admin/pedidos` — panel de pedidos, reembolsos y reporte de ventas (admin)

## Verificable de la Etapa 0

Con los tres servicios arriba:

1. **Base de datos:** el contenedor `invitaciones_postgres` reporta `healthy`.
2. **Backend:** `curl http://localhost:3100/health` devuelve
   `{"status":"ok","database":"up",...}`.
3. **Frontend:** abrir `http://localhost:4300` muestra la página de inicio con la
   insignia **"Servidor conectado"** (el frontend consume `/health` del backend).

## Verificable de la Etapa 1

Con el catálogo sembrado (`npm run seed`) y los servicios arriba:

1. **Catálogo:** `http://localhost:4300/catalogo` muestra 12 plantillas (una por evento).
2. **Filtros:** elegir "Boda de oro" deja solo esa plantilla; "Infantil" deja dos.
3. **Vista de ejemplo:** abrir una plantilla muestra una previsualización con sus colores
   y tipografías.
4. **Admin:** `http://localhost:4300/admin/plantillas` permite crear una plantilla y
   publicarla/retirarla; una plantilla retirada deja de aparecer en el catálogo público.

## Verificable de la Etapa 2

Con los servicios arriba:

1. **Personalizar:** en `/plantilla/:id`, el botón "Personalizar esta invitación" crea un
   borrador y abre el editor.
2. **Editor:** cambiar nombres, fecha, mensaje y colores se refleja **en vivo** en la
   vista previa.
3. **Móvil/escritorio:** el conmutador cambia el ancho de la previsualización.
4. **Persistencia:** los cambios se guardan automáticamente; recargar el editor mantiene
   lo editado.

## Verificable de la Etapa 3

Con los servicios arriba (y la CLI de Stripe escuchando):

1. **Publicar:** en el editor, "Publicar y compartir" lleva a Stripe Checkout.
2. **Pago:** con la tarjeta `4242 4242 4242 4242` el pago se completa y el webhook publica
   la invitación.
3. **Éxito:** la pantalla muestra el enlace público, botón de WhatsApp y la imagen de vista
   previa.
4. **Invitado:** abrir `/i/:token` muestra la invitación publicada con sus datos y diseño.
5. **Compartir:** `/p/:token/share` expone los metadatos Open Graph (título, imagen) para la
   vista previa en redes.

## Verificable de la Etapa 4

Con una invitación creada y los servicios arriba:

1. **Invitados:** en `/invitacion/:id/invitados` el organizador agrega invitados con lugares
   autorizados y ve el resumen de confirmaciones.
2. **Enlace privado:** cada invitado tiene un enlace copiable (`/r/:token`), sin cuenta.
3. **Confirmar:** el invitado confirma asistencia eligiendo cuántos van, hasta su límite.
4. **Control de lugares:** intentar confirmar más lugares de los autorizados se rechaza.
5. **Estados:** el panel del organizador refleja confirmados/pendientes/no asisten y los
   lugares confirmados.
6. **CSV:** se pueden importar y exportar invitados.

## Verificable de la Etapa Auth

1. **Registro/login:** en `/registro` o `/login` el organizador entra y llega a
   `/mis-invitaciones`.
2. **Protección:** entrar a `/editor/:id` o al panel de invitados sin sesión redirige a login.
3. **Propiedad:** un organizador no puede ver ni editar invitaciones de otro (403 en la API).
4. **Rol admin:** un organizador no puede acceder a la administración de plantillas (403).
5. **Invitado:** sigue sin cuenta; su enlace `/r/:token` funciona igual.

## Verificable de la Etapa 5

1. **Admin:** con un usuario admin, `/admin/pedidos` muestra los pedidos y el reporte de ventas.
2. **Filtros:** se puede filtrar por estado (pagados, pendientes, reembolsados).
3. **Reembolso:** reembolsar un pedido pagado lo marca como reembolsado (en Stripe test, devuelve el cargo).
4. **Reporte:** muestra ingreso bruto, comisión estimada y neto estimado (etiquetados como hipótesis).
5. **Rol:** un organizador no puede acceder a `/admin/*` (403).

## Verificable de la Fase 2A (PDF)

1. **Descarga:** en `/mis-invitaciones`, el botón **PDF** descarga un archivo PDF válido.
2. **Contenido:** el PDF muestra título, nombres, fecha, lugar y mensaje con los colores de la
   plantilla.
3. **Propiedad:** `GET /invitations/:id/pdf` de otro organizador devuelve 403; sin token, 401.

## Verificable de la Fase 2B (Boletos QR)

1. **Activar:** en el panel de invitados, el toggle activa los boletos del evento.
2. **Pase:** un invitado confirmado ve su pase con QR en su página RSVP; uno no confirmado no
   tiene pase.
3. **Validar:** en `/validar`, el dueño o un staff asignado consulta el pase y registra la
   entrada; la primera vez es "válido" y la segunda "ya ingresó".
4. **Autorización:** un usuario no dueño y no asignado no puede validar (403).
5. **Personal de acceso:** el dueño asigna staff por correo; ese usuario pasa a rol staff.

## Verificable de la Fase 2C (Diseño a medida)

1. **Solicitar:** en `/solicitudes/nueva` el cliente crea una solicitud y la ve en `/solicitudes`.
2. **Bandeja admin:** en `/admin/solicitudes` el admin ve la solicitud y envía una propuesta.
3. **Propuesta y aprobación:** el cliente ve la propuesta en el hilo y puede aprobarla.
4. **Revisiones:** pedir cambios consume una revisión; superado el límite (2), se rechaza.
5. **Propiedad y rol:** un cliente no ve solicitudes ajenas (403); un no-admin no entra a la
   bandeja (403).

## Pruebas

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Estado del MVP

El flujo núcleo del MVP está completo (Etapas 0–4): crear evento → personalizar invitación →
agregar ubicación → publicar (pago) → compartir → confirmar asistencia → consultar invitados.

## Próxima etapa

El MVP (Etapas 0–5 + autenticación) está completo. Lo siguiente natural es el **despliegue**
a un dominio público (que además permite validar la vista previa Open Graph al compartir).
Después, Fase 2: diseño a medida, boletos QR y PDF imprimible. Ver plan en `DECISIONES-MVP.md`.
