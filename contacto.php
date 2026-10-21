<?php
// Requires PHP 7.4+ and the hosting provider's local mail transport.
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, bool $ok, string $message): void
{
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Utilice el formulario de contacto para enviar su consulta.');
}

// Cross-site submissions are not accepted. The GitHub Pages copy is a preview.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = ['https://inversionessancristobal.cl', 'https://www.inversionessancristobal.cl'];
if ($origin !== '' && !in_array($origin, $allowedOrigins, true)) {
    respond(403, false, 'Envíe su consulta desde inversionessancristobal.cl.');
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 65536) {
    respond(413, false, 'La consulta es demasiado extensa. Reduzca el mensaje.');
}
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/x-www-form-urlencoded') !== 0) {
    respond(415, false, 'El formato de la consulta no es válido.');
}

function field(string $key, int $max, bool $required = false, bool $multiline = false): string
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value) || !preg_match('//u', $value)) {
        respond(422, false, 'Revise los datos del formulario.');
    }
    $value = trim($value);
    if (($required && $value === '') || strlen($value) > $max * 4
        || preg_match_all('/./us', $value) > $max
        || (!$multiline && preg_match('/[\r\n\x00]/', $value))
        || ($multiline && strpos($value, "\0") !== false)) {
        respond(422, false, 'Revise los campos y la longitud de su consulta.');
    }
    return $value;
}

if (field('sitio_web', 200) !== '') {
    respond(422, false, 'No se pudo procesar la consulta. Contáctenos por WhatsApp.');
}
$name = field('nombre', 120, true);
$company = field('empresa', 160);
$email = field('correo', 254, true);
$phone = field('telefono', 40);
$message = field('mensaje', 5000, true, true);
$space = field('espacio', 20, true);
$interest = field('interes', 80, true);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'Ingrese un correo electrónico válido.');
}
$interests = [
    'Bodegas' => ['Arriendo', 'Compra', 'Coordinar una visita', 'Otra consulta'],
    'Coworking' => ['Información del coworking', 'Coordinar una visita', 'Propuesta de uso', 'Otra consulta'],
];
if (!isset($interests[$space]) || !in_array($interest, $interests[$space], true)) {
    respond(422, false, 'Seleccione una opción de consulta válida.');
}

// One successful send per IP per minute, with bounded state outside the web root.
// Do not trust user-supplied forwarding headers for this limit.
$key = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
$file = sys_get_temp_dir() . '/san-cristobal-' . substr(hash('sha256', __DIR__), 0, 16) . '.rate';
$lock = @fopen($file, 'c+');
if (!$lock || !flock($lock, LOCK_EX)) {
    respond(503, false, 'El envío no está disponible. Escríbanos por WhatsApp o correo.');
}
$state = json_decode(stream_get_contents($lock, 1048576), true);
if (!is_array($state)) {
    $state = [];
}
$now = time();
foreach ($state as $ip => $sentAt) {
    if (!is_int($sentAt) || $sentAt <= $now - 60) {
        unset($state[$ip]);
    }
}
if (isset($state[$key])) {
    header('Retry-After: 60');
    respond(429, false, 'Ya recibimos una consulta reciente desde su conexión. Espere un minuto antes de enviar otra.');
}
if (count($state) >= 5000) {
    respond(503, false, 'El envío está ocupado. Escríbanos por WhatsApp o correo.');
}

$recipient = 'inversionessancristobal@gmail.com';
$subject = 'Consulta web - ' . $space;
$body = "Nueva consulta desde Inversiones San Cristóbal\n\n"
    . "Espacio: $space\nInterés: $interest\nNombre: $name\n"
    . 'Empresa: ' . ($company ?: 'No indicada') . "\nCorreo: $email\n"
    . 'Teléfono: ' . ($phone ?: 'No indicado') . "\n\nMensaje:\n$message\n";
$headers = [
    'From' => 'Inversiones San Cristobal <web@inversionessancristobal.cl>',
    'Reply-To' => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => 'base64',
];
$sent = false;
try {
    $sent = function_exists('mail') && @mail($recipient, $subject,
        chunk_split(base64_encode($body), 76, "\r\n"), $headers);
} catch (Throwable $error) {
    // Do not expose hosting configuration or submitted personal data.
    $sent = false;
}
if (!$sent) {
    flock($lock, LOCK_UN);
    fclose($lock);
    respond(503, false, 'No se pudo enviar su consulta. Sus datos siguen en el formulario. Escríbanos por WhatsApp o correo.');
}
$state[$key] = $now;
rewind($lock);
ftruncate($lock, 0);
fwrite($lock, json_encode($state));
fflush($lock);
flock($lock, LOCK_UN);
fclose($lock);
// mail() acknowledges acceptance by the server, not final inbox delivery.
respond(200, true, 'Su consulta fue aceptada para envío. Gracias por contactarnos.');
