ÉPICA 1: Gestión de Identidad
Feature 1.1: Autenticación
HU01 — Registro de Desarrollador
Prioridad: 🔴 Must | Hito: 1

Historia: Como desarrollador, quiero registrarme con mis datos y stack técnico para crear un perfil profesional en la red.

Escenario 1: Registro exitoso con datos completos
  Dado que un visitante está en el formulario de registro
  Cuando ingresa nombre, correo válido, contraseña segura (mínimo 8 caracteres, alfanumérica) 
    Y selecciona al menos una tecnología de su stack
    Y envía el formulario
  Entonces el sistema crea la cuenta en la base de datos
    Y cifra la contraseña con hashing seguro
    Y redirige al usuario a la pantalla de Login
    Y muestra mensaje "Cuenta creada exitosamente"

Escenario 2: Correo electrónico duplicado
  Dado que el visitante ingresa un correo ya registrado en la plataforma
  Cuando intenta enviar el formulario
  Entonces el sistema muestra error "Este correo ya está en uso"
    Y no permite crear la cuenta
    Y mantiene los demás campos diligenciados

Escenario 3: Validación de campos obligatorios vacíos
  Dado que el visitante deja campos requeridos sin completar (nombre, correo, contraseña o stack)
  Cuando intenta enviar el formulario
  Entonces el sistema resalta en rojo los campos faltantes
    Y muestra mensaje "Todos los campos marcados con * son obligatorios"
    Y no procesa el registro

Escenario 4: Contraseña débil
  Dado que el visitante ingresa una contraseña de menos de 8 caracteres o sin números
  Cuando intenta enviar el formulario
  Entonces el sistema muestra advertencia "La contraseña debe tener mínimo 8 caracteres, una letra y un número"
    Y no permite el envío

Escenario de Abuso 1: Inyección de scripts en campos de registro
  Dado que un atacante ingresa código JavaScript o SQL en los campos nombre o stack
  Cuando intenta enviar el formulario
  Entonces el sistema sanitiza las entradas
    Y almacena el texto como dato plano sin ejecutar scripts
    Y no se produce inyección en la base de datos

Escenario de Abuso 2: Registro masivo automatizado (bot)
  Dado que un atacante utiliza un script automatizado para crear cuentas en lotes
  Cuando se detectan más de 5 intentos de registro desde la misma IP en 1 minuto
  Entonces el sistema activa rate limiting
    Y solicita CAPTCHA
    Y bloquea temporalmente la IP si persiste

Escenario de Abuso 3: Enumeración de correos mediante respuesta de timing
  Dado que un atacante prueba correos para determinar cuáles existen en la plataforma
  Cuando el sistema valida la duplicidad
  Entonces responde con el mismo tiempo de procesamiento para correos existentes y no existentes
    Y no revela diferencias en el mensaje o tiempo de respuesta

Escenario de Abuso 4: Correo con formato malicioso o header injection
  Dado que un atacante ingresa un correo como "usuario@dominio.com\nBcc:spam@otro.com"
  Cuando el sistema procesa el campo correo
  Entonces valida estrictamente el formato RFC 5322
    Y rechaza el registro con error de formato inválido

Escenario de Abuso 5: Consumo masivo de espacio en campos libres
  Dado que un atacante envía un payload de texto de 10MB en el campo nombre o stack
  Cuando el sistema recibe la petición
  Entonces trunca o rechaza entradas que excedan el límite razonable (ej. 100 caracteres para nombre)
    Y retorna error 400 sin procesar el dato completo

HU02 — Login de Usuario
Prioridad: 🔴 Must | Hito: 1

Historia: Como usuario registrado, quiero iniciar sesión con mis credenciales para acceder a mi dashboard personal.

Escenario 1: Autenticación exitosa
  Dado que el usuario está en la pantalla de login
  Cuando ingresa correo y contraseña correctos
    Y pulsa "Entrar"
  Entonces el sistema valida las credenciales contra la base de datos
    Y genera una sesión activa
    Y redirige al dashboard principal con el feed de proyectos

Escenario 2: Credenciales inválidas
  Dado que el usuario ingresa correo o contraseña incorrectos
  Cuando pulsa "Entrar"
  Entonces el sistema muestra mensaje genérico "Correo o contraseña incorrectos"
    Y no especifica cuál campo falló por seguridad
    Y no genera sesión

Escenario 3: Cuenta suspendida por administrador
  Dado que un usuario con cuenta suspendida ingresa credenciales válidas
  Cuando el sistema valida su estado de cuenta
  Entonces se bloquea el acceso al dashboard
    Y muestra mensaje "Cuenta inhabilitada por violación de normas comunitarias. Contacte al administrador."

Escenario 4: Campos vacíos
  Dado que el usuario deja el correo o contraseña vacíos
  Cuando intenta pulsar "Entrar"
  Entonces el sistema deshabilita el botón de envío
    O muestra mensaje "Complete todos los campos"

Escenario de Abuso 1: Fuerza bruta sobre credenciales
  Dado que un atacante intenta múltiples combinaciones de correo/contraseña
  Cuando se detectan más de 5 intentos fallidos desde la misma IP o contra el mismo correo en 15 minutos
  Entonces el sistema bloquea temporalmente la cuenta o IP
    Y envía alerta al correo del usuario afectado

Escenario de Abuso 2: Fijación de sesión (Session Fixation)
  Dado que un atacante intenta reutilizar un ID de sesión previamente generado
  Cuando el usuario se autentica exitosamente
  Entonces el sistema regenera el ID de sesión
    Y invalida cualquier sesión anterior

Escenario de Abuso 3: Ataque de diccionario distribuido
  Dado que múltiples IPs intentan adivinar la contraseña de un mismo usuario coordinadamente
  Cuando se detecta el patrón (muchos intentos fallidos desde diferentes orígenes contra un mismo correo)
  Entonces el sistema bloquea la cuenta temporalmente
    Y requiere verificación adicional (CAPTCHA o 2FA si está disponible)

Escenario de Abuso 4: Bypass de validación por manipulación de respuesta HTTP
  Dado que un atacante intercepta y modifica la respuesta del servidor para simular un 200 OK
  Cuando el sistema recibe una petición sin sesión válida en el servidor
  Entonces valida la sesión en el lado servidor obligatoriamente
    Y redirige al login aunque el cliente haya sido manipulado

Escenario de Abuso 5: Credenciales en URLs (GET request)
  Dado que un atacante intenta enviar credenciales vía query parameters en lugar de POST body
  Cuando el sistema recibe una petición GET con credenciales en la URL
  Entonces ignora los parámetros sensibles
    Y no procesa la autenticación
    Y registra el intento como sospechoso

HU03 — Recuperación Segura
Prioridad: 🟡 Should | Hito: 2

Historia: Como usuario olvidadizo, quiero usar preguntas de seguridad para resetear mi clave sin soporte técnico.

Escenario 1: Solicitud de recuperación con usuario válido
  Dado que el usuario está en la pantalla "Olvidé mi contraseña"
  Cuando ingresa su correo o nombre de usuario registrado
    Y pulsa "Continuar"
  Entonces el sistema valida que el usuario existe
    Y muestra las 2 preguntas de seguridad preconfiguradas en su registro

Escenario 2: Usuario no existe
  Dado que el usuario ingresa un correo o nombre no registrado
  Cuando pulsa "Continuar"
  Entonces el sistema muestra mensaje genérico "Si el usuario existe, recibirá instrucciones"
    Y no revela si el correo está o no en la base de datos

Escenario 3: Respuestas correctas
  Dado que el sistema muestra las preguntas de seguridad
  Cuando el usuario responde ambas preguntas correctamente
  Entonces se habilita el formulario para ingresar una nueva contraseña

Escenario 4: Respuestas incorrectas
  Dado que el usuario responde las preguntas de seguridad
  Cuando al menos una respuesta no coincide con el registro
  Entonces el sistema muestra mensaje "Respuestas incorrectas"
    Y no habilita el cambio de contraseña
    Y permite un máximo de 3 intentos antes de bloquear temporalmente

Escenario 5: Actualización de contraseña exitosa
  Dado que el usuario accedió al formulario de nueva contraseña
  Cuando ingresa una contraseña válida (mínimo 8 caracteres, alfanumérica)
    Y confirma la contraseña igual en el segundo campo
    Y pulsa "Actualizar"
  Entonces el sistema cifra la nueva clave con hash seguro
    Y actualiza el registro en la base de datos
    Y invalida la sesión anterior si existiera

Escenario 6: Redirección post-éxito
  Dado que el sistema actualizó la contraseña exitosamente
  Cuando finaliza el proceso
  Entonces redirige automáticamente a la pantalla de Login
    Y muestra mensaje de éxito "Contraseña actualizada. Inicie sesión con sus nuevas credenciales."

Escenario 7: Contraseñas no coinciden
  Dado que el usuario está en el formulario de nueva contraseña
  Cuando ingresa contraseñas diferentes en los campos "Nueva" y "Confirmar"
  Entonces el sistema muestra error "Las contraseñas no coinciden"
    Y no permite enviar el formulario

Escenario de Abuso 1: Enumeración de usuarios mediante respuestas diferenciadas
  Dado que un atacante prueba múltiples correos en "Olvidé mi contraseña"
  Cuando el sistema responde
  Entonces mantiene exactamente el mismo mensaje y tiempo de respuesta
    Y no revela existencia del usuario mediante diferencias en UI, HTTP status o tiempo

Escenario de Abuso 2: Fuerza bruta sobre preguntas de seguridad
  Dado que un atacante automatiza respuestas a las preguntas de seguridad
  Cuando se detectan más de 3 intentos fallidos consecutivos
  Entonces el sistema bloquea el proceso de recuperación para esa cuenta por 24 horas
    Y envía notificación al correo del usuario

Escenario de Abuso 3: Respuestas triviales o fáciles de adivinar
  Dado que el sistema permite configurar preguntas de seguridad
  Cuando un usuario selecciona respuestas como "rojo" o "1970"
  Entonces el sistema muestra advertencia "Elija respuestas que no sean fácilmente deducibles"
    Y sugiere usar respuestas aleatorias tratadas como contraseñas

Escenario de Abuso 4: Reutilización de token de recuperación
  Dado que un atacante intercepta o reutiliza un token de reseteo ya consumido
  Cuando intenta acceder al formulario de nueva contraseña con un token expirado
  Entonces el sistema invalida el token
    Y redirige a "Olvidé mi contraseña" para reiniciar el flujo

Escenario de Abuso 5: Manipulación de correo en el paso de actualización
  Dado que un atacante intercepta la petición de actualización y cambia el correo destino
  Cuando el sistema procesa el cambio de contraseña
  Entonces valida que el token corresponde exactamente al correo de la sesión de recuperación
    Y no permite cambiar contraseña de una cuenta diferente a la solicitada

Feature 1.2: Administración y Moderación
HU04 — Asignación de Roles
Prioridad: 🟡 Should | Hito: 2

Historia: Como administrador, quiero promover usuarios a moderadores para delegar la gestión del contenido.

Escenario 1: Promoción a moderador exitosa
  Dado que un administrador está en el panel de gestión de usuarios
  Cuando selecciona un usuario con rol "Desarrollador"
    Y cambia su rol a "Moderador"
    Y confirma la acción
  Entonces el sistema actualiza el rol en la base de datos
    Y el usuario recibe permisos de moderación inmediatos
    Y se registra la acción en el log de auditoría

Escenario 2: Solo administradores pueden asignar roles
  Dado que un usuario con rol "Moderador" o "Desarrollador" intenta acceder a la gestión de roles
  Cuando intenta modificar permisos de otro usuario
  Entonces el sistema oculta la opción o muestra mensaje "No tiene permisos para esta acción"
    Y no realiza cambios en la base de datos

Escenario 3: Revocar rol de moderador
  Dado que un administrador visualiza un moderador existente
  Cuando cambia su rol de "Moderador" a "Desarrollador"
    Y confirma la acción
  Entonces el sistema revoca los permisos administrativos
    Y el usuario pierde acceso al panel de moderación inmediatamente

Escenario de Abuso 1: Escalada de privilegios mediante manipulación de petición
  Dado que un usuario "Desarrollador" intercepta la petición HTTP de cambio de rol
  Cuando intenta modificar el parámetro para auto-asignarse rol "Administrador"
  Entonces el sistema valida en el backend que el solicitante tiene rol "Administrador"
    Y descarta la petición
    Y registra el intento en log de seguridad

Escenario de Abuso 2: Mass assignment en actualización de rol
  Dado que un atacante envía parámetros adicionales no esperados (ej. is_superadmin=true) junto al cambio de rol
  Cuando el sistema procesa la petición
  Entonces utiliza un whitelist de campos permitidos
    Y ignora parámetros no declarados explícitamente
    Y no actualiza campos sensibles no autorizados

Escenario de Abuso 3: CSRF en asignación de roles
  Dado que un administrador está autenticado y visita un sitio malicioso
  Cuando el sitio envía una petición de cambio de rol en segundo plano
  Entonces el sistema rechaza la petición por falta de token CSRF válido
    O valida el Origin/Referer de la petición

Escenario de Abuso 4: Elevación de rol a sí mismo por administrador comprometido
  Dado que un administrador intenta modificar su propio rol para escalar privilegios
  Cuando intenta auto-asignarse permisos de super-administrador no previstos
  Entonces el sistema requiere confirmación de segundo administrador
    O bloquea la auto-modificación de roles críticos

Escenario de Abuso 5: Denegación de servicio por bloqueo de sesiones
  Dado que un administrador revoca masivamente roles a múltiples moderadores simultáneamente
  Cuando el sistema procesa las revocaciones
  Entonces mantiene la estabilidad del sistema
    Y no degrada el rendimiento de la plataforma
    Y procesa las revocaciones en lotes controlados

HU05 — Bloqueo de Perfiles
Prioridad: 🟡 Should | Hito: 2

Historia: Como administrador, quiero suspender cuentas infractoras para mantener la integridad de la comunidad.

Escenario 1: Suspensión de cuenta con reporte previo
  Dado que un administrador revisa un perfil reportado por la comunidad
  Cuando hace clic en "Suspender cuenta"
    Y confirma la acción con motivo de suspensión
  Entonces el sistema cambia el estado de la cuenta a "Suspendida"
    Y el usuario pierde acceso inmediato a todas las funcionalidades
    Y se cierran sus sesiones activas
    Y se muestra mensaje al usuario suspendido: "Cuenta inhabilitada por incumplimiento de normas"

Escenario 2: Reactivación de cuenta
  Dado que un administrador visualiza una cuenta suspendida
  Cuando hace clic en "Reactivar cuenta"
  Entonces el sistema restaura el estado a "Activa"
    Y el usuario puede volver a iniciar sesión
    Y se registra la reactivación en el log de auditoría

Escenario 3: Intento de login con cuenta suspendida
  Dado que un usuario suspendido intenta iniciar sesión
  Cuando ingresa credenciales válidas
  Entonces el sistema detecta el estado "Suspendida"
    Y muestra mensaje "Cuenta inhabilitada. Contacte al administrador."
    Y no permite acceso al sistema

Escenario de Abuso 1: Suspensión en cascada o masiva no autorizada
  Dado que un moderador comprometido intenta suspender múltiples cuentas inocentes mediante script
  Cuando se detectan más de N suspensiones en un período corto desde una misma cuenta admin
  Entonces el sistema requiere segundo factor de confirmación
    Y alerta al super-administrador

Escenario de Abuso 2: Bypass de suspensión mediante tokens antiguos
  Dado que un usuario suspendido posee un token JWT o sesión persistente anterior
  Cuando intenta usar ese token para acceder a recursos protegidos
  Entonces el sistema valida el estado de la cuenta en cada petición
    Y invalida el token si la cuenta está suspendida
    Y responde con 403 independientemente de la validez técnica del token

Escenario de Abuso 3: Auto-suspensión de cuentas administrativas
  Dado que un administrador intenta suspender su propia cuenta
  Cuando confirma la acción
  Entonces el sistema muestra advertencia "No puede suspender su propia cuenta"
    Y requiere que otro administrador realice la acción
    O solicita confirmación con password actual y motivo detallado

Escenario de Abuso 4: Enumeración de cuentas suspendidas
  Dado que un atacante prueba múltiples correos en login para identificar cuáles están suspendidas
  Cuando el sistema responde a credenciales válidas de cuenta suspendida
  Entonces muestra el mismo mensaje genérico que para credenciales inválidas
    Y no diferencia entre "suspendida" y "no existe" o "contraseña incorrecta"

Escenario de Abuso 5: Falsificación de reportes para suspensión arbitraria
  Dado que un usuario malicioso genera múltiples reportes falsos contra un usuario inocente
  Cuando el sistema recibe reportes repetidos del mismo origen
  Entonces detecta el patrón de reporte abusivo
    Y descarta reportes duplicados o en masa del mismo usuario
    Y no suspende la cuenta sin revisión humana

Feature 1.3: Analítica
HU06 — Reportes de Crecimiento
Prioridad: 🟢 Could | Hito: 3

Historia: Como administrador, quiero ver métricas de usuarios y proyectos para evaluar el éxito de la plataforma.

Escenario 1: Visualización de métricas generales
  Dado que un administrador accede al panel de analíticas
  Cuando carga la vista del dashboard
  Entonces el sistema muestra:
    | Total de usuarios registrados |
    | Usuarios activos en la última semana |
    | Total de proyectos creados |
    | Proyectos en estado "Buscando Colaboradores" |
    | Proyectos en estado "En Desarrollo" |
    | Proyectos completados |

Escenario 2: Gráfica de nuevos registros por mes
  Dado que el administrador está en el panel de analíticas
  Cuando selecciona el filtro "Últimos 6 meses"
  Entonces el sistema genera una gráfica de línea con el número de registros nuevos por mes

Escenario 3: Sin datos suficientes
  Dado que la plataforma no tiene actividad registrada en un período
  Cuando el administrador consulta ese rango de fechas
  Entonces el sistema muestra gráficas vacías con mensaje "No hay datos para este período"

Escenario de Abuso 1: Extracción masiva de datos mediante filtros amplios
  Dado que un administrador con acceso a analíticas intenta exportar datos de todos los usuarios
  Cuando solicita un reporte que podría contener PII (Personally Identifiable Information)
  Entonces el sistema anonimiza los datos agregados
    Y no permite exportar datos individuales sin autorización explícita de super-admin

Escenario de Abuso 2: Inyección SQL mediante parámetros de fecha
  Dado que un atacante modifica los parámetros de rango de fechas en la URL (ej. ' OR '1'='1)
  Cuando el sistema genera la consulta a la base de datos
  Entonces utiliza consultas parametrizadas
    Y sanitiza las entradas de fecha
    Y no ejecuta código SQL arbitrario

Escenario de Abuso 3: Denegación de servicio con rangos de fecha extremos
  Dado que un usuario solicita métricas desde 1900 hasta 2099
  Cuando el sistema procesa la consulta
  Entonces valida que el rango no exceda un máximo razonable (ej. 2 años)
    Y rechaza rangos excesivamente amplios
    Y no procesa queries que consuman recursos excesivos

Escenario de Abuso 4: Acceso no autorizado al panel de analíticas
  Dado que un usuario "Desarrollador" intenta acceder directamente vía URL a /admin/analytics
  Cuando el sistema recibe la petición
  Entonces verifica el rol en el backend
    Y responde con 404 o 403 sin revelar la existencia del recurso
    Y no retorna datos estadísticos

Escenario de Abuso 5: Scraping automatizado de datos estadísticos
  Dado que un bot intenta extraer datos del dashboard analítico
  Cuando se detectan patrones de scraping (múltiples requests sin interacción humana)
  Entonces el sistema activa rate limiting
    Y puede requerir re-autenticación
    Y registra el intento

ÉPICA 2: Ciclo de Proyectos
Feature 2.1: Portafolio
HU07 — Crear Borrador
Prioridad: 🔴 Must | Hito: 1

Historia: Como creador, quiero guardar ideas en borrador para editarlas privadamente antes de lanzarlas.

Escenario 1: Guardar borrador exitoso
  Dado que un usuario llena el formulario de nuevo proyecto (título, descripción, stack requerido)
  Cuando hace clic en "Guardar como Borrador"
  Entonces el sistema guarda el proyecto con estado "Borrador"
    Y el proyecto es visible solo para el creador en su perfil
    Y no aparece en el feed público de la plataforma
    Y muestra mensaje "Borrador guardado exitosamente"

Escenario 2: Edición de borrador existente
  Dado que el creador visualiza un borrador guardado
  Cuando modifica cualquier campo y guarda cambios
  Entonces el sistema actualiza el borrador
    Y mantiene el estado "Borrador"
    Y registra la fecha de última modificación

Escenario 3: Borrador con campos mínimos
  Dado que el usuario ingresa solo el título del proyecto
  Cuando guarda como borrador
  Entonces el sistema permite guardar con datos incompletos
    Y marca campos faltantes como "Pendiente"

Escenario de Abuso 1: Stored XSS en campos del proyecto
  Dado que un atacante ingresa `<script>alert('xss')</script>` en el título o descripción
  Cuando guarda el borrador
  Entonces el sistema escapa o sanitiza el HTML
    Y almacena el texto como contenido seguro
    Y no ejecuta scripts cuando el creador ve su borrador

Escenario de Abuso 2: Sobrecarga de borradores (quota bombing)
  Dado que un atacante automatiza la creación de miles de borradores
  Cuando se detecta que un usuario tiene más de 50 borradores
  Entonces el sistema limita la cantidad máxima de borradores por usuario
    Y retorna error "Límite de borradores alcanzado. Finalice o elimine proyectos existentes."

Escenario de Abuso 3: Inyección de contenido mediante archivos adjuntos
  Dado que el formulario permite subir imágenes o documentos al borrador
  Cuando un atacante sube un archivo con extensión peligrosa (.exe, .php, .js)
  Entonces el sistema valida el tipo MIME y la extensión
    Y rechaza archivos no permitidos
    Y escanea el contenido en busca de malware

Escenario de Abuso 4: Acceso a borradores ajenos por IDOR
  Dado que un usuario modifica el parámetro de URL para acceder al borrador de otro usuario
  Cuando el sistema recibe la petición GET /draft/12345
  Entonces valida que el proyecto pertenezca al usuario autenticado
    Y responde 404 si no es el propietario
    Y no revela la existencia del borrador ajeno

Escenario de Abuso 5: Contenido ofensivo o ilegal en borradores
  Dado que un usuario almacena contenido prohibido en un borrador privado
  Cuando el sistema procesa el guardado
  Entonces aplica filtros de contenido incluso en borradores
    Y marca contenido violatorio
    Y alerta a moderadores si se detectan patrones graves

HU08 — Publicar Proyecto
Prioridad: 🔴 Must | Hito: 1

Historia: Como creador, quiero cambiar el estado a "Buscando Colaboradores" para atraer talento técnico.

Escenario 1: Publicación exitosa desde borrador
  Dado que el creador visualiza un proyecto propio en estado "Borrador" con datos completos
  Cuando hace clic en "Publicar"
  Entonces el sistema cambia el estado a "Buscando Colaboradores"
    Y el proyecto aparece en el feed global de la plataforma
    Y es visible para todos los desarrolladores
    Y otros usuarios pueden postularse

Escenario 2: Validación de campos obligatorios para publicar
  Dado que el creador intenta publicar un borrador incompleto (sin descripción o sin stack)
  Cuando hace clic en "Publicar"
  Entonces el sistema muestra error "Complete todos los campos requeridos antes de publicar"
    Y mantiene el estado "Borrador"
    Y resalta los campos faltantes

Escenario 3: Publicación cancelada
  Dado que el creador está en la pantalla de confirmación de publicación
  Cuando hace clic en "Cancelar"
  Entonces el sistema regresa al formulario de edición
    Y mantiene el estado "Borrador" sin cambios

Escenario de Abuso 1: Clickjacking en botón de publicar
  Dado que un atacante incrusta la plataforma en un iframe malicioso con overlay transparente
  Cuando un usuario autenticado hace clic en el sitio malicioso
  Entonces el sistema envía header X-Frame-Options: DENY
    Y no permite que la página sea embebida en iframes de terceros
    Y previene clics no intencionales

Escenario de Abuso 2: Publicación de proyectos spam masivos
  Dado que un usuario intenta publicar más de 5 proyectos en una hora
  Cuando el sistema detecta el patrón
  Entonces aplica rate limiting por usuario
    Y pone los proyectores excedentes en revisión manual
    Y puede suspender temporalmente la capacidad de publicar

Escenario de Abuso 3: Manipulación de estado vía API bypass
  Dado que un atacante envía una petición directa PATCH /projects/123/status="Buscando Colaboradores" sin pasar por validaciones de frontend
  Cuando el sistema procesa la petición
  Entonces valida en el backend que todos los campos requeridos están completos
    Y que el usuario es el propietario
    Y no permite cambios de estado inválidos

Escenario de Abuso 4: Inclusión de enlaces maliciosos en la descripción
  Dado que un proyecto publicado contiene enlaces a sitios de phishing
  Cuando el sistema procesa la publicación
  Entonces escanea URLs en la descripción contra listas negras
    Y marca o rechaza proyectos con enlaces maliciosos
    Y notifica a moderadores

Escenario de Abuso 5: Suplantación de identidad en publicación
  Dado que un atacante obtiene acceso temporal a la sesión de otro usuario
  Cuando intenta publicar un proyecto a nombre de la víctima
  Entonces si es un comportamiento atípico (nueva ubicación, nuevo dispositivo)
    El sistema requiere re-autenticación o verificación por correo antes de publicar

HU09 — Finalizar Proyecto
Prioridad: 🟢 Could | Hito: 3

Historia: Como creador, quiero cerrar un proyecto exitoso para que cuente como experiencia terminada en mi perfil.

Escenario 1: Finalización exitosa
  Dado que el creador de un proyecto en estado "En Desarrollo" decide cerrarlo
  Cuando hace clic en "Marcar como Completado"
    Y confirma la acción
  Entonces el sistema cambia el estado a "Completado"
    Y el proyecto se archiva en el historial del creador
    Y se bloquean nuevas ediciones del proyecto
    Y se cierran postulaciones y debates activos
    Y aparece como "Proyecto Finalizado" en el perfil del creador y colaboradores

Escenario 2: Proyecto no puede finalizar sin estar en desarrollo
  Dado que un proyecto está en estado "Borrador" o "Buscando Colaboradores"
  Cuando el creador busca la opción de completar
  Entonces el sistema oculta o deshabilita el botón "Marcar como Completado"
    Y muestra tooltip "Solo proyectos en desarrollo pueden finalizarse"

Escenario de Abuso 1: Finalización de proyecto ajeno
  Dado que un usuario modifica la petición para finalizar un proyecto que no le pertenece
  Cuando envía PATCH /projects/456/complete
  Entonces el sistema verifica ownership en el backend
    Y responde 403 si el usuario no es el creador
    Y registra el intento de acceso no autorizado

Escenario de Abuso 2: Finalización inmediata tras inicio para farming de reputación
  Dado que un creador inicia desarrollo y finaliza el proyecto el mismo día sin actividad real
  Cuando el sistema detecta este patrón (inicio-fin en menos de 24h)
  Entonces requiere justificación o evidencia de entregables
    Y puede marcar el proyecto como "Completado no verificado"
    Y no otorga insignias o métricas de reputación hasta revisión

Escenario de Abuso 3: Finalización forzada con colaboradores activos en medio de tareas
  Dado que un creador finaliza un proyecto mientras hay debates activos importantes
  Cuando el sistema procesa la finalización
  Entonces notifica a todos los colaboradores con posibilidad de objeción dentro de 48h
    Y permite a los colaboradores reportar finalización abusiva
    Y un moderador puede revertir el estado si hay consenso del equipo en contra

Escenario de Abuso 4: Destrucción de evidencia mediante finalización
  Dado que un creador finaliza y archiva un proyecto para ocultar contenido reportado
  Cuando el sistema archiva el proyecto
  Entonces mantiene visible el contenido para moderadores
    Y preserva los logs de auditoría
    Y no elimina los datos, solo cambia el estado a lectura

Escenario de Abuso 5: Reapertura de proyecto finalizado mediante manipulación de estado
  Dado que un atacante intenta cambiar el estado de "Completado" a "En Desarrollo"
  Cuando el sistema recibe la petición de transición inválida
  Entonces valida la máquina de estados permitidas
    Y no permite transiciones no autorizadas
    Y requiere super-administrador para casos excepcionales de reapertura

Feature 2.2: Reclutamiento
HU10 — Postulación Técnica
Prioridad: 🔴 Must | Hito: 1

Historia: Como desarrollador, quiero aplicar a proyectos abiertos para colaborar en tecnologías de mi interés.

Escenario 1: Postulación exitosa
  Dado que el desarrollador visualiza un proyecto en estado "Buscando Colaboradores"
    Y el proyecto utiliza tecnologías de su stack
  Cuando hace clic en "Postularme"
    Y opcionalmente adjunta un mensaje de presentación
  Entonces el sistema registra la postulación en estado "Pendiente"
    Y el creador del proyecto recibe una notificación en su panel
    Y el postulante ve el estado "En revisión" en su lista de postulaciones

Escenario 2: Postulación duplicada
  Dado que el desarrollador ya tiene una postulación activa para ese proyecto
  Cuando intenta postularse nuevamente
  Entonces el sistema muestra mensaje "Ya te postulaste a este proyecto"
    Y no registra una nueva postulación

Escenario 3: Creador intenta postularse a su propio proyecto
  Dado que el usuario es el creador del proyecto
  Cuando visualiza su propio proyecto
  Entonces el sistema oculta el botón "Postularme"
    O lo muestra deshabilitado con mensaje "No puedes postularte a tu propio proyecto"

Escenario 4: Postulación a proyecto cerrado
  Dado que un proyecto cambió a estado "En Desarrollo" o "Completado"
  Cuando el desarrollador intenta postularse
  Entonces el sistema muestra el botón deshabilitado
    Y mensaje "Este proyecto ya no acepta postulaciones"

Escenario de Abuso 1: Spam de postulaciones masivas
  Dado que un usuario bot postula a 50 proyectos en 5 minutos
  Cuando el sistema detecta el patrón
  Entonces aplica rate limiting: máximo 10 postulaciones por día por usuario
    Y las postulaciones excedentes son rechazadas
    Y la cuenta puede ser marcada para revisión

Escenario de Abuso 2: Postulación con mensaje de phishing
  Dado que un postulante incluye en su mensaje enlaces maliciosos o datos de contacto externos para estafa
  Cuando el sistema procesa la postulación
  Entonces escanea el contenido del mensaje
    Y rechaza postulaciones con URLs en lista negra
    Y notifica al creador con el mensaje filtrado o marcado

Escenario de Abuso 3: Manipulación de estado para postular a proyecto en desarrollo
  Dado que un atacante intercepta la petición y modifica el project_id para postular a un proyecto cerrado
  Cuando el sistema recibe la postulación
  Entonces valida en el backend que el proyecto está en estado "Buscando Colaboradores"
    Y rechaza la postulación si no cumple la condición
    Y no depende únicamente de la validación del frontend

Escenario de Abuso 4: Sybil attack (múltiples cuentas para postular)
  Dado que un atacante controla 20 cuentas falsas y postula todas a un mismo proyecto
  Cuando el sistema analiza las postulaciones
  Entonces detecta patrones de comportamiento similar (mismo IP, dispositivo, mensaje copiado)
    Y agrupa cuentas sospechosas
    Y permite al creador ver una alerta de "posibles cuentas falsas"

Escenario de Abuso 5: Fuerza bruta para eliminar postulaciones de competidores
  Dado que un atacante intenta adivinar IDs de postulación para cancelarlas vía API
  Cuando el sistema recibe peticiones DELETE /applications/XXXX no autorizadas
  Entonces valida ownership de la postulación
    Y responde 404 (no 403) para no revelar existencia
    Y registra intentos de manipulación

HU11 — Gestión de Equipo
Prioridad: 🟡 Should | Hito: 2

Historia: Como creador, quiero aceptar colaboradores para conformar el equipo que desarrollará la idea.

Escenario 1: Aceptar postulante
  Dado que el creador revisa la lista de postulaciones en su proyecto "Buscando Colaboradores"
  Cuando hace clic en "Aceptar" junto a un candidato
    Y confirma la acción
  Entonces el sistema cambia el estado de la postulación a "Aceptada"
    Y el usuario se añade oficialmente a la lista de colaboradores del proyecto
    Y el aceptado recibe notificación de su incorporación al equipo
    Y el proyecto cuenta con un nuevo miembro en su equipo técnico

Escenario 2: Rechazar postulante
  Dado que el creador revisa la lista de postulaciones
  Cuando hace clic en "Rechazar" junto a un candidato
  Entonces el sistema cambia el estado de la postulación a "Rechazada"
    Y el postulante recibe notificación de que no fue seleccionado
    Y puede postularse a otros proyectos normalmente

Escenario 3: Visualización de perfil del postulante
  Dado que el creador revisa las postulaciones
  Cuando hace clic en el nombre de un postulante
  Entonces el sistema muestra el perfil técnico del desarrollador (stack, experiencia, proyectos previos)
    Y permite al creador evaluar su afinidad técnica antes de aceptar

Escenario de Abuso 1: Aceptar postulante sin ser el creador
  Dado que un colaborador ya aceptado intenta aceptar a otros postulantes
  Cuando el sistema recibe la petición de cambio de estado
  Entonces verifica que el usuario autenticado es el creador del proyecto
    Y rechaza la acción con 403
    Y no permite que colaboradores gestionen el equipo sin permisos explícitos

Escenario de Abuso 2: Mass assignment al aceptar (modificación de campos no autorizados)
  Dado que un atacante intercepta la petición de aceptación y agrega campos como "role=owner"
  Cuando el sistema procesa la actualización
  Entonces ignora campos no permitidos en el whitelist
    Y solo actualiza el estado de la postulación
    Y no eleva privilegios del postulante

Escenario de Abuso 3: Discriminación sistemática mediante rechazo masivo automatizado
  Dado que un script rechaza automáticamente a todos los postulantes con ciertas características
  Cuando el sistema detecta rechazos masivos en tiempo muy corto
  Entonces muestra advertencia al creador
    Y puede requerir justificación para rechazos
    Y alerta a moderadores si detecta patrones discriminatorios

Escenario de Abuso 4: Exfiltración de datos de postulantes
  Dado que un creador malicioso utiliza la función "ver perfil" para scrapear datos de todos los postulantes
  Cuando se detectan múltiples accesos a perfiles en sequencia rápida
  Entonces rate-limita la visualización de perfiles
    Y no expone datos de contacto privados (email, teléfono) en la vista de postulación

Escenario de Abuso 5: Aceptación de postulante a proyecto ya en desarrollo
  Dado que un atacante retiene una petición HTTP de aceptación y la ejecuta después de que el proyecto cambió a "En Desarrollo"
  Cuando el sistema procesa la petición tardía
  Entonces valida el estado actual del proyecto
    Y rechaza la aceptación si el proyecto ya no acepta colaboradores
    Y no modifica el estado del proyecto

HU12 — Iniciar Desarrollo
Prioridad: 🟡 Should | Hito: 2

Historia: Como creador, quiero pasar el proyecto a "En Desarrollo" para cerrar el reclutamiento y empezar a trabajar.

Escenario 1: Iniciar desarrollo con equipo formado
  Dado que el proyecto tiene al menos un colaborador aceptado
    Y está en estado "Buscando Colaboradores"
  Cuando el creador hace clic en "Iniciar Desarrollo"
    Y confirma la transición
  Entonces el sistema cambia el estado a "En Desarrollo"
    Y quita el proyecto del feed público de búsqueda
    Y cierra automáticamente todas las postulaciones pendientes (marcándolas como "Cerradas")
    Y habilita la sección de debates técnicos exclusiva para el equipo

Escenario 2: No permite iniciar sin colaboradores
  Dado que el proyecto no tiene ningún colaborador aceptado
  Cuando el creador intenta hacer clic en "Iniciar Desarrollo"
  Entonces el sistema muestra mensaje "Debes aceptar al menos un colaborador para iniciar el desarrollo"
    Y deshabilita la acción hasta que se cumpla la condición

Escenario 3: Notificación al equipo
  Dado que el proyecto pasa a estado "En Desarrollo"
  Cuando el sistema completa la transición
  Entonces envía notificación a todos los colaboradores aceptados
    Y mensaje: "El proyecto [Nombre] ha iniciado su fase de desarrollo. ¡Bienvenido al equipo!"

Escenario de Abuso 1: Bypass de la validación de mínimo de colaboradores
  Dado que un atacante modifica la petición frontend para enviar "startDevelopment" sin validar colaboradores
  Cuando el backend procesa la transición
  Entonces verifica explícitamente que existe al menos una postulación con estado "Aceptada"
    Y rechaza la transición si no se cumple
    Y no confía en validaciones exclusivas del cliente

Escenario de Abuso 2: DoS en postulaciones pendientes al cerrarlas
  Dado que un proyecto tiene 1000 postulaciones pendientes (spam previo)
  Cuando inicia desarrollo y el sistema intenta cerrarlas todas
  Entonces procesa el cierre en lotes (batch)
    Y no bloquea la petición principal
    Y notifica progresivamente sin degradar el rendimiento

Escenario de Abuso 3: Inicio de desarrollo en proyecto ajeno
  Dado que un colaborador intenta iniciar desarrollo de un proyecto donde no es creador
  Cuando el sistema recibe la petición
  Entonces verifica ownership estricto en el backend
    Y responde 403
    Y no permite que colaboradores modifiquen el estado del proyecto

Escenario de Abuso 4: Race condition: múltiples estados simultáneos
  Dado que el creador envía dos peticiones paralelas de "Iniciar Desarrollo"
  Cuando el sistema procesa concurrentemente
  Entonces utiliza bloqueo optimista (optimistic locking) o transacciones atómicas
    Y solo permite una transición exitosa
    Y la segunda petición recibe error de estado ya modificado

Escenario de Abuso 5: Notificación spam al iniciar desarrollo
  Dado que un creador inicia y cancela desarrollo repetidamente para generar notificaciones
  Cuando el sistema detecta múltiples transiciones en corto tiempo
  Entonces limita las notificaciones a una por cambio de estado real
    Y no re-notifica si el estado no cambió efectivamente
    Y puede suspender la capacidad de transicionar estados temporalmente

ÉPICA 3: Interacción y Colaboración Técnica
Feature 3.1: Debates Técnicos
HU13 — Crear Hilo Técnico
Prioridad: 🟡 Should | Hito: 2

Historia: Como desarrollador, quiero abrir debates en proyectos para proponer mejoras arquitectónicas.

Escenario 1: Crear hilo en proyecto en desarrollo
  Dado que un colaborador (o creador) está en la sección de discusión de un proyecto "En Desarrollo"
  Cuando escribe un título y contenido del tema
    Y selecciona categoría (Arquitectura, Stack, Funcionalidad, Bug)
    Y publica el hilo
  Entonces el sistema guarda el hilo en la base de datos
    Y lo muestra en la lista de debates del proyecto
    Y todos los colaboradores del proyecto reciben notificación del nuevo debate

Escenario 2: Crear hilo sin permisos
  Dado que un usuario que NO es colaborador del proyecto intenta crear un hilo
  Cuando accede a la sección de debates
  Entonces el sistema muestra los debates en modo lectura
    Y oculta el botón "Nuevo Debate" o muestra "Solo colaboradores pueden participar"

Escenario 3: Campos obligatorios
  Dado que el usuario deja el título o contenido vacío
  Cuando intenta publicar
  Entonces el sistema muestra error "Complete todos los campos"
    Y no crea el hilo

Escenario de Abuso 1: Stored XSS en título o contenido del hilo
  Dado que un atacante incluye scripts maliciosos en el contenido del debate
  Cuando publica el hilo
  Entonces el sistema sanitiza el HTML permitiendo solo etiquetas seguras (si aplica markdown/HTML)
    O convierte todo a texto plano escapado
    Y no ejecuta scripts en navegadores de otros colaboradores

Escenario de Abuso 2: Spam de debates (DoS en notificaciones)
  Dado que un colaborador crea 50 hilos en 10 minutos
  Cuando el sistema procesa las notificaciones
  Entonces limita la creación a 5 hilos por hora por usuario
    Y agrupa notificaciones en un solo email resumen (digest)
    Y no envía 50 emails individuales que saturarían la bandeja del equipo

Escenario de Abuso 3: Falsificación de autoría en debates
  Dado que un atacante modifica el parámetro author_id en la petición de creación
  Cuando el sistema recibe la petición
  Entonces ignora cualquier author_id proporcionado por el cliente
    Y asigna como autor el usuario autenticado en la sesión/token
    Y registra discrepancias como intentos de spoofing

Escenario de Abuso 4: Inyección de código en campos de categoría
  Dado que un atacante envía una categoría inexistente o maliciosa (ej. SQL injection en el campo categoría)
  Cuando el sistema valida la entrada
  Entonces verifica contra un enum o lista blanca de categorías permitidas
    Y rechaza valores no esperados
    Y no genera errores de base de datos que revelen información

Escenario de Abuso 5: Exfiltración de datos mediante debates privados
  Dado que un colaborador con acceso a debates intenta publicar datos sensibles del proyecto (claves API, contraseñas)
  Cuando el sistema detecta patrones de secretos (regex para API keys, passwords)
  Entonces advierte al usuario "Parece que estás publicando información sensible"
    Y permite al creador del proyecto revisar y eliminar dicho contenido
    Y registra el incidente para auditoría

HU14 — Responder Comentarios
Prioridad: 🟡 Should | Hito: 2

Historia: Como colaborador, quiero responder a hilos existentes para resolver dudas técnicas del equipo.

Escenario 1: Respuesta exitosa
  Dado que un colaborador lee un hilo de discusión
  Cuando escribe su respuesta en el campo de comentarios
    Y envía su respuesta
  Entonces el sistema guarda el comentario
    Y lo visualiza al final del hilo en orden cronológico
    Y muestra nombre del autor, fecha y hora de publicación

Escenario 2: Respuesta vacía
  Dado que el usuario intenta enviar una respuesta sin contenido
  Cuando pulsa "Enviar"
  Entonces el sistema muestra error "El comentario no puede estar vacío"
    Y no publica la respuesta

Escenario 3: Notificación de respuesta
  Dado que un usuario recibe una respuesta en su hilo
  Cuando otro colaborador comenta
  Entonces el sistema notifica al creador del hilo
    Y opcionalmente notifica a todos los que participaron en la conversación

Escenario de Abuso 1: Flooding de respuestas
  Dado que un colaborador envía 100 respuestas en un minuto a un mismo hilo
  Cuando el sistema detecta el patrón
  Entonces aplica rate limiting por usuario e hilo
    Y rechaza respuestas excedentes con mensaje "Demasiados mensajes. Espere un momento."
    Y puede silenciar al usuario temporalmente en ese hilo

Escenario de Abuso 2: Mention spam o notificación masiva
  Dado que un atacante incluye @username de todos los usuarios de la plataforma en su comentario
  Cuando el sistema procesa las menciones
  Entonces limita las notificaciones a menciones válidas dentro del proyecto
    Y no envía notificaciones a usuarios no relacionados
    Y trunca o rechaza comentarios con más de 10 menciones

Escenario de Abuso 3: Respuesta con contenido ofensivo o discriminador
  Dado que un colaborador publica un comentario con lenguaje violento u odio
  Cuando el sistema procesa el comentario
  Entonces aplica filtros automáticos de contenido tóxico
    Y puede poner el comentario en revisión automática antes de publicar
    Y alerta a moderadores si supera umbrales de severidad

Escenario de Abuso 4: Edición de comentario ajeno
  Dado que un usuario modifica el parámetro comment_id para editar un comentario que no escribió
  Cuando el sistema recibe la petición PUT/PATCH
  Entonces verifica que el autor del comentario coincide con el usuario autenticado
    Y responde 403 si no coincide
    Y registra el intento

Escenario de Abuso 5: Enlaces maliciosos en respuestas
  Dado que un comentario contiene enlaces a ejecutables o sitios de phishing
  Cuando el sistema guarda la respuesta
  Entonces escanea y marca los enlaces
    Y puede requerir click-through warning antes de redirigir
    Y notifica a moderadores si la URL está en lista negra

Feature 3.2: Discovery (Exploración)
HU15 — Filtros por Stack
Prioridad: 🔴 Must | Hito: 1

Historia: Como desarrollador, quiero filtrar proyectos por lenguaje (ej. Python) para encontrar vacantes rápidamente.

Escenario 1: Filtrado por una tecnología
  Dado que un usuario está en el feed de proyectos
  Cuando selecciona "Python" en el filtro de tecnologías
    Y aplica el filtro
  Entonces el sistema actualiza la vista mostrando solo proyectos que requieran Python en su stack
    Y muestra contador "X proyectos encontrados"

Escenario 2: Filtrado combinado
  Dado que el usuario selecciona múltiples filtros (Python Y React)
  Cuando aplica los filtros
  Entonces el sistema muestra proyectos que contengan AMBAS tecnologías
    O (según configuración) proyectos que contengan AL MENOS UNA de las seleccionadas

Escenario 3: Sin resultados
  Dado que el usuario aplica filtros muy específicos
  Cuando no hay proyectos que coincidan
  Entonces el sistema muestra mensaje "No se encontraron proyectos con estos filtros"
    Y sugiere "Prueba con otras tecnologías o limpia los filtros"

Escenario 4: Paginación de resultados
  Dado que hay más de 10 proyectos que coinciden con el filtro
  Cuando el usuario aplica el filtro
  Entonces el sistema muestra los primeros 10 resultados
    Y muestra controles de paginación (Siguiente, Anterior, número de página)
    Y el usuario puede navegar entre páginas manteniendo el filtro activo

Escenario 5: Limpiar filtros
  Dado que el usuario tiene filtros activos
  Cuando hace clic en "Limpiar filtros"
  Entonces el sistema restablece el feed mostrando todos los proyectos públicos
    Y desmarca las opciones seleccionadas

Escenario de Abuso 1: Inyección SQL en parámetros de filtro
  Dado que un atacante modifica el parámetro de filtro a ' UNION SELECT * FROM users --
  Cuando el sistema construye la consulta
  Entonces utiliza consultas parametrizadas o ORM seguro
    Y no concatena directamente el input del usuario en SQL
    Y la inyección es neutralizada

Escenario de Abuso 2: Denegación de servicio con filtros computacionalmente caros
  Dado que un atacante solicita proyectos con 20 tecnologías combinadas en una query compleja
  Cuando el sistema procesa el filtro
  Entonces limita la cantidad de filtros simultáneos (ej. máximo 5 tecnologías)
    Y establece timeouts en las consultas
    Y no permite queries que escaneen toda la tabla sin índices

Escenario de Abuso 3: Scraping masivo del feed mediante paginación
  Dado que un bot solicita secuencialmente todas las páginas (page=1, page=2... page=9999)
  Cuando el sistema detecta el patrón de scraping
  Entonces activa rate limiting en el endpoint de feed
    Y puede requerir autenticación para paginación profunda
    Y sirve datos truncados o caché a requests sospechosos

Escenario de Abuso 4: Filtros para descubrir proyectos borradores de otros usuarios
  Dado que un atacante manipula parámetros para incluir estado="Borrador" en los filtros
  Cuando el sistema procesa la consulta
  Entonces filtra explícitamente solo proyectos con estado "Buscando Colaboradores" o "En Desarrollo" para usuarios no autenticados o no propietarios
    Y nunca expone borradores ajenos en resultados de búsqueda

Escenario de Abuso 5: Enumeración de tecnologías internas mediante filtros
  Dado que un atacante usa el filtro para mapear qué tecnologías existen en la base de datos
  Cuando envía tecnologías inexistentes vs existentes
  Entonces el tiempo de respuesta y el mensaje de error son idénticos en ambos casos
    Y no permite inferir la estructura interna de datos mediante respuestas diferenciadas

Feature 3.3: Networking
HU16 — Chat Privado
Prioridad: 🟢 Could | Hito: 3

Historia: Como desarrollador, quiero enviar mensajes directos para conversar con socios sin que otros vean.

Escenario 1: Enviar mensaje desde perfil
  Dado que un usuario visita el perfil de otro desarrollador
  Cuando hace clic en "Enviar mensaje"
  Entonces el sistema abre un modal o ventana de chat privado
    Y permite redactar un mensaje

Escenario 2: Entrega a bandeja de entrada
  Dado que el usuario envía un mensaje privado
  Cuando confirma el envío
  Entonces el sistema guarda el mensaje en la base de datos
    Y lo agrega a la bandeja de entrada del receptor
    Y muestra estado "Enviado" al remitente

Escenario 3: Historial de conversación
  Dado que dos usuarios han intercambiado mensajes previamente
  Cuando uno de ellos abre el chat
  Entonces el sistema carga el historial cronológico de mensajes previos
    Y muestra fecha y hora de cada mensaje
    Y diferencia visualmente mensajes enviados vs recibidos

Escenario 4: Notificación de nuevo mensaje
  Dado que un usuario recibe un mensaje privado
  Cuando el emisor confirma el envío
  Entonces el receptor recibe una notificación en su interfaz
    Y contador de mensajes no leídos en su bandeja de entrada

Escenario 5: Mensaje vacío no permitido
  Dado que el usuario intenta enviar un mensaje vacío o solo espacios
  Cuando pulsa "Enviar"
  Entonces el sistema deshabilita el botón
    O muestra error "Escribe un mensaje antes de enviar"

Escenario de Abuso 1: Spam masivo de mensajes privados
  Dado que un atacante envía 500 mensajes a múltiples usuarios en poco tiempo
  Cuando el sistema detecta el patrón
  Entonces limita a 20 mensajes por hora para cuentas nuevas
    Y 100 mensajes por hora para cuentas establecidas
    Y marca la cuenta para revisión si excede los límites

Escenario de Abuso 2: XSS mediante mensajes privados
  Dado que un atacante envía `<img src=x onerror=alert('hacked')>` en un chat
  Cuando el receptor abre el mensaje
  Entonces el sistema escapa todo el contenido del mensaje
    Y no renderiza HTML ni JavaScript
    O utiliza un parser de markdown estricto que solo permite formato seguro

Escenario de Abuso 3: Phishing a través de chat
  Dado que un usuario envía mensajes pidiendo credenciales o datos bancarios
  Cuando el sistema analiza el contenido
  Entonces detecta patrones de phishing (palabras clave: "contraseña", "tarjeta", "login aquí")
    Y muestra advertencia al receptor: "Este mensaje puede ser peligroso"
    Y permite reportar al remitente

Escenario de Abuso 4: Acceso a historial de conversaciones ajenas
  Dado que un usuario modifica el conversation_id en la URL o petición
  Cuando solicita cargar el historial
  Entonces el sistema verifica que el usuario autenticado es participante de esa conversación
    Y responde 403 si no pertenece
    Y no permite leer chats de terceros

Escenario de Abuso 5: Impersonación mediante manipulación de remitente
  Dado que un atacante intercepta la petición y cambia el sender_id
  Cuando el sistema procesa el envío
  Entonces ignora cualquier sender_id enviado por el cliente
    Y utiliza el ID del usuario autenticado en la sesión/token
    Y registra intentos de suplantación

Escenario de Abuso 6: Grooming o acoso mediante chat privado
  Dado que un usuario recibe múltiples mensajes no deseados de otro usuario
  Cuando el receptor reporta el comportamiento
  Entonces el sistema permite bloquear al remitente
    Y cesa todas las notificaciones del bloqueado
    Y notifica a moderadores si hay múltiples bloqueos contra el mismo usuario