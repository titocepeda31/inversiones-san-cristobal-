# Operación — Inversiones San Cristóbal

Esta ficha es pública. Registrar únicamente direcciones y procedimientos.
Las contraseñas, códigos de recuperación y claves se guardan en un gestor de contraseñas; nunca se escriben aquí.

## Direcciones

| Recurso | Dirección o referencia |
| --- | --- |
| Sitio del cliente | https://inversionessancristobal.cl/ |
| Repositorio | https://github.com/titocepeda31/inversiones-san-cristobal- |
| Rama de publicación | main |
| Vista en GitHub Pages | https://titocepeda31.github.io/inversiones-san-cristobal-/ |
| Hosting | BenzaHosting |
| cPanel | Registrar la URL exacta en la ficha privada del gestor de contraseñas |
| Administración del dominio .cl | https://www.nic.cl/ |
| Correo de consultas | inversionessancristobal@gmail.com |
| WhatsApp comercial | https://wa.me/56995553544 |

## Registro privado de accesos

Crear una ficha en el gestor de contraseñas para cada servicio: hosting/cPanel, NIC Chile, GitHub y correo.
Guardar allí la URL exacta de acceso, usuario, contraseña y códigos de recuperación, si corresponde.
Usar contraseñas diferentes para cada servicio y mantener acceso a la recuperación de la cuenta.

## Actualizar la web desde GitHub

1. Guardar los cambios en la rama main de este repositorio.
2. En cPanel, abrir Git Version Control, administrar el repositorio y entrar a Pull or Deploy.
3. Pulsar Update from Remote y esperar a que termine.
4. Pulsar Deploy HEAD Commit y comprobar el resultado.
5. Revisar el dominio, los enlaces y, si cambió el formulario, la recepción del correo.

El repositorio y la carpeta pública del dominio son ubicaciones diferentes.
La configuración .cpanel.yml copia los HTML, CSS, JavaScript, contacto.php y assets a la carpeta existente inversionessancristobal.cl de la cuenta.
Confirmar en cPanel → Dominios que esa carpeta coincide con la raíz del documento antes de desplegar si cambia la configuración del hosting.

GitHub Pages muestra la web estática; el envío del formulario requiere el hosting con PHP y su transporte de correo.
Las consultas de WhatsApp identifican Bodegas o Coworking según la página.

## Respaldo de otro sitio WordPress

El dominio WordPress todavía está pendiente de identificar. No restaurar ni sobrescribir archivos hasta confirmar su carpeta y base de datos.

Un respaldo recuperable debe incluir:
- Los archivos del sitio, incluidos wp-content/uploads, temas, plugins, wp-config.php y archivos ocultos como .htaccess.
- Una exportación de su base de datos MySQL/MariaDB de la misma fecha. Las páginas de Elementor y muchas configuraciones están en la base de datos.

Desde cPanel se puede utilizar Backup Wizard para descargar los componentes necesarios o generar una copia completa de la cuenta, según las opciones del proveedor.
Una copia completa de la cuenta puede incluir otros sitios y correos; su restauración completa normalmente requiere al proveedor o acceso WHM.

Para respaldar solo el WordPress de forma manual:
1. Confirmar su raíz del documento en cPanel → Dominios.
2. Comprimir los archivos de esa carpeta, incluidos los ocultos, y descargar la copia.
3. Consultar localmente el valor DB_NAME de wp-config.php para identificar la base correcta; no compartir ese archivo por chat ni subirlo al repositorio.
4. Exportar esa base desde phpMyAdmin y descargar el SQL.
5. Guardar archivos y SQL juntos, con dominio y fecha, en almacenamiento privado fuera del hosting.
6. Verificar el contenido del respaldo y probar su restauración en un entorno separado antes de depender de él.

Los respaldos contienen credenciales y datos del sitio: protegerlos y retirarlos de cualquier carpeta pública tras descargarlos.
Git sirve para versionar código propio, temas hijo y plugins propios. No sustituye el respaldo de la base de datos ni de las imágenes.

## Documentación oficial

- https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-set-up-deployment/
- https://docs.cpanel.net/cpanel/files/backup-wizard/
- https://developer.wordpress.org/advanced-administration/security/backup/
