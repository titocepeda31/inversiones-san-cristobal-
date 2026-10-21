# Inversiones San Cristóbal

Portada corporativa con accesos a Bodegas y Coworking. Contacto: +56 9 9555 3544 e inversionessancristobal@gmail.com.

- `index.html`: portada adaptable, WhatsApp fijo y volver arriba.
- `bodegas.html` y `coworking.html`: información, galerías con gesto lateral y formulario.
- `contacto.php`: recibe el formulario y envía únicamente a inversionessancristobal@gmail.com mediante el transporte de correo del hosting.

## Publicación en el hosting

Copiar a la carpeta del dominio `inversionessancristobal.cl` los tres HTML, `style.css`, `app.js`, `contacto.php` y `assets/`. No publicar carpetas de pruebas ni metadatos Git. Se requiere PHP 7.4 o superior y `mail()` habilitado por el proveedor. Utilizar HTTPS.

El remitente técnico es `web@inversionessancristobal.cl` y el correo del visitante se utiliza como Reply-To. El hosting debe autorizar ese remitente y tener SPF/DKIM configurados. No utiliza la contraseña de Gmail ni almacena las consultas en el sitio.

El formulario valida campos, limita tamaño, incorpora un campo trampa y permite un envío exitoso por minuto por IP. Mantiene los datos ante un error y distingue una respuesta del servidor de un envío sin confirmar. El archivo temporal de control se guarda fuera de la carpeta pública.

## Verificación antes de entrega

1. Publicar todos los archivos en el hosting, incluido `contacto.php`.
2. Enviar una consulta desde cada formulario usando una dirección de prueba propia.
3. Confirmar recepción en Gmail, incluida la carpeta de spam, y comprobar que Responder utiliza el correo del visitante.
4. Revisar en cPanel el seguimiento del correo si no llega. Si el proveedor bloquea `mail()` o no entrega a Gmail, configurar SMTP autenticado del hosting como paso adicional; no introducir credenciales en GitHub.

La aceptación de `mail()` solo confirma que el servidor acepta el mensaje para envío; la recepción en Gmail requiere una prueba real en el hosting. GitHub Pages publica la vista estática pero no ejecuta PHP; allí el formulario indica que debe utilizarse el dominio o WhatsApp.

Superficies y disponibilidad siguen siendo referenciales. Las imágenes intervenidas mantienen su identificación como visualizaciones digitales.

## Pruebas de esta actualización

Validación ejecutada con PHP 7.4 en WebAssembly y transporte de correo simulado: método, origen, tamaño, datos inválidos, inyección de cabeceras, campo trampa, errores del transporte, destino, Reply-To y límite por IP. Pruebas del frontend con DOM simulado: contactos, enlaces WhatsApp, volver arriba, galería, doble clic, éxito y errores de HTTP, JSON, red y tiempo de espera. No se enviaron correos reales ni se completó una revisión visual en navegador.
