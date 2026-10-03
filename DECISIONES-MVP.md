# Decisiones del MVP — Plataforma de Invitaciones Digitales

> Documento de referencia del proyecto. Fija el alcance acordado antes de escribir código.
> Los precios son **hipótesis a validar**. No se usan recursos con licencia de pago en el MVP.

## Alcance acordado

| Tema | Decisión |
|---|---|
| **Modalidad** | Autoservicio primero. Diseño a medida en Fase 2. |
| **Formatos del MVP** | Invitación web interactiva (enlace propio) + imagen para compartir. |
| **Formatos posteriores** | PDF imprimible (Fase 2), video/animación (Fase 3). |
| **Plantillas** | Una plantilla por tipo de evento. Diseñadas en el proyecto (no compradas). |
| **País / moneda** | México / Pesos mexicanos (MXN). |
| **Pasarela de pagos** | Stripe (vía webhooks; sin secretos en el frontend). |
| **Cliente objetivo inicial** | Eventos sociales (boda, aniversario/boda de oro, XV, cumpleaños, fiesta infantil, bautizo, 1ª comunión, graduación, baby shower, despedida) + "Evento personalizado". |

## Regla de licencias (uso comercial sin costo)

No se cuenta con derechos comerciales de tipografías, imágenes ni música. Por tanto, en el MVP:

- **Tipografías:** solo Google Fonts (licencia SIL Open Font, uso comercial permitido).
- **Imágenes/gráficos:** patrones, formas y gradientes generados por código (SVG/CSS). Las fotos las aporta el cliente.
- **Música:** fuera del MVP como pista precargada. Si se activa, la aporta el cliente (archivo o enlace propio).
- Cualquier recurso externo debe registrar su licencia de uso comercial antes de usarse.

## Flujo objetivo del MVP

```
Explorar catálogo → filtrar (evento, estilo, formato) → ver ejemplo →
elegir paquete → personalizar → previsualizar (sin pagar) → pagar (Stripe/MXN) →
publicar invitación web + generar imagen → compartir → gestionar RSVP
```

Un invitado abre su enlace privado, confirma asistencia (sin crear cuenta) y no puede
confirmar más lugares de los autorizados. El organizador consulta estados y conteos.

## Fuera del MVP (no se muestran botones ni servicios que no funcionen)

- Diseño a medida por encargo (Fase 2).
- PDF imprimible (Fase 2).
- Video/animación (Fase 3).
- Boletos QR gratuitos (Fase 2) y venta de entradas de pago (Fase 3).
- Dominio personalizado, suscripción profesional, panel de clientes multi-evento.

## Stack técnico

- **Frontend:** Angular (SPA) + SSR solo para la página pública de la invitación (Open Graph).
- **Backend:** NestJS (TypeScript).
- **Base de datos:** PostgreSQL (relacional + campos JSON para personalización/módulos).
- **Almacenamiento:** Object storage + CDN para multimedia e imágenes generadas.
- **Pagos:** Stripe (webhooks).
- **Correo:** servicio transaccional (WhatsApp/SMS solo si se valida el costo).

## Plan por etapas (entregas pequeñas y verificables)

- **Etapa 0 — Base:** ✅ repos Angular + NestJS, PostgreSQL en Docker, /health, pruebas.
- **Etapa 1 — Catálogo y plantillas:** ✅ entidad Template (evento/formato/estilo), API de
  catálogo con filtros, seed de 12 plantillas (incl. boda de oro), catálogo con filtros en
  el frontend, vista de ejemplo y panel básico de administración de plantillas.
- **Etapa 2 — Personalización y vista previa:** ✅ entidades Event (contenido) e Invitation
  (plantilla + evento + personalización), API de borrador (crear/leer/guardar), editor
  autoservicio con formulario de datos y diseño, y vista previa en vivo móvil/escritorio.
- **Etapa 3 — Pago y entrega:** ✅ Stripe Checkout (MXN) + webhook, modo simulado de respaldo,
  publicar al pagar con enlace propio por token, imagen SVG para compartir, metadatos Open Graph,
  página pública del invitado, política de vigencia (180 días) y reembolso.
- **Etapa 4 — RSVP y compartir:** ✅ entidades Guest/GuestGroup (datos privados), API del
  organizador (alta, estados, resumen, import/export CSV), enlace privado del invitado por
  token para confirmar sin cuenta, control de que no se confirmen más lugares de los
  autorizados, y panel de confirmaciones. Cierra el flujo núcleo del MVP.
- **Etapa Auth — Autenticación y roles:** ✅ usuarios organizador/admin con registro y login
  JWT (bcrypt), guards global de JWT y de roles, invitaciones ligadas a su dueño (ownerId) con
  verificación de propiedad (403), rutas admin protegidas por rol, login/guard/interceptor en
  el frontend. El invitado sigue sin cuenta.
- **Etapa 5 — Admin de pedidos y reportes:** ✅ API admin (solo rol admin) para listar pedidos
  con filtro por estado, detalle, reembolso vía Stripe (test), y reporte de ventas con costos
  estimados por validar; panel admin de pedidos y reporte en el frontend.

## Fase 2 (dividida en sub-etapas)

- **Fase 2A — PDF imprimible:** ✅ generación de PDF (tarjeta A5 con pdfkit, colores de la
  plantilla), endpoint `GET /invitations/:id/pdf` protegido por propiedad, descarga desde
  "mis invitaciones".
- **Fase 2B — Boletos QR:** ✅ pases de acceso gratuitos con QR único por invitado confirmado,
  rol personal de acceso (staff) asignable por evento, validación por enlace que registra
  entrada y previene reutilización (sin cámara por ahora).
- **Fase 2C — Diseño a medida:** ✅ solicitudes de diseño por encargo con hilo de mensajes,
  propuestas del equipo (admin), aprobación del cliente y límite de revisiones (2 por defecto).
  Estados nueva→en_proceso→propuesta→aprobada/rechazada. Sin archivos pesados ni cobro (fase
  posterior). Con esto el modelo pasa a híbrido (autoservicio + servicio a medida).

## Fase 3 (mejoras, dividida en sub-etapas)

- **Fase 3A — Escaneo de QR con cámara:** ✅ lector de cámara (@zxing/browser) en `/validar`
  que extrae el token del QR y valida; entrada manual como respaldo. Requiere localhost/HTTPS.
- **Fase 3B — Imagen de compartir en PNG:** ✅ endpoint `/p/:token/image.png` que rasteriza
  el SVG a PNG 1200x630 con sharp; og:image usa el PNG. El SVG sigue disponible.
- **Fase 3C — PDF con más tamaños y fondos:** ✅ PDF parametrizado por tamaño (A5/A6/carta,
  `?size=`), diseño escalado proporcionalmente, fondo a color + bandas decorativas de la
  plantilla; selector de tamaño en el frontend.
- **Fase 3D — Carga de imágenes de referencia:** ✅ subida de imágenes (Multer, disco local
  en dev, servidas en /uploads) en solicitudes de diseño; máx. 6, 5 MB, solo imágenes; dueño o
  admin; miniaturas en cliente y bandeja admin. Prod: object storage (pendiente de despliegue).
- **Fase 3E — Cobro del diseño a medida:** ✅ el admin pone precio en la propuesta; el cliente
  paga con Stripe para aprobar (webhook marca aprobada+pagada); los ajustes posteriores tienen
  costo adicional (estado ajuste_solicitado → nueva propuesta con precio → nuevo pago), con
  aviso claro al cliente. Order generalizado con `kind` (invitación o diseño).

## Pendientes por confirmar (no bloquean el inicio de la Etapa 0)

- Política comercial exacta: vigencia del enlace, reglas de reembolso, precios por paquete (hipótesis a validar).
- Correo: proveedor transaccional a usar.
- Catálogo de estilos y número de plantillas para el lanzamiento.
- Datos personales: requisitos legales en México (aviso de privacidad).
