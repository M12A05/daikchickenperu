# Stack Tecnológico y Arquitectura de Software: Dais Chicken

Este documento detalla la arquitectura tecnológica elegida para el desarrollo de la plataforma de e-commerce de **Dais Chicken**. Siguiendo los mismos estándares de calidad y rendimiento implementados en proyectos anteriores (como FAMAX CONCRETO PERU), el sistema prescinde de gestores de contenido genéricos (como WordPress) para apostar por un desarrollo de **código propio, moderno y escalable**.

La plataforma está diseñada específicamente para optimizar la velocidad de carga, maximizar el SEO y gestionar un flujo de compra cerrado mediante redirección a WhatsApp, todo bajo un estricto marco de seguridad.

---

## 1. Frontend (Interfaz y Experiencia de Usuario)

La capa de presentación está diseñada para ser ultrarrápida, garantizando que los usuarios móviles en cualquier distrito de Lima puedan ver el catálogo de productos (pollos, combos, etc.) de manera instantánea.

*   **Framework Principal:** **Next.js (React)**. Permite la generación de sitios estáticos (SSG) y renderizado del lado del servidor (SSR). Esto significa que el catálogo de productos se pre-carga en el servidor, ofreciendo tiempos de respuesta de milisegundos y una indexación perfecta para Google (SEO).
*   **Estilos y UI:** **Tailwind CSS**. Un framework de utilidades CSS que permite construir componentes visuales consistentes (como tarjetas destacadas, botones de call-to-action y modales) manteniendo el peso del archivo CSS al mínimo.
*   **Gestión de Estado:** **Zustand** o **React Context API**. Se utilizará para manejar la "bolsa de compras" de manera local en el navegador del usuario, recordando qué productos ha agregado sin necesidad de consultas constantes a la base de datos.

## 2. Backend y Base de Datos (Gestión de Catálogo)

Aunque el pago no se procesa en la web, se necesita una estructura para que los administradores de Dais Chicken puedan actualizar precios, ocultar productos agotados o lanzar promociones (como el "Mega Banquete Daischicken") sin tocar el código fuente.

*   **Lógica de Servidor:** **Next.js API Routes (Serverless Functions)**. Pequeñas funciones en el servidor que se ejecutan solo cuando se les llama, eliminando la necesidad de mantener un servidor tradicional encendido 24/7.
*   **Base de Datos:** **Supabase (PostgreSQL)**. Una alternativa moderna a Firebase que ofrece bases de datos relacionales ultrarrápidas. Aquí se almacenará:
    *   Tabla de Productos (Nombre, descripción, precio, imagen).
    *   Tabla de Categorías.
    *   Configuraciones generales (Número de WhatsApp actual, horario de atención).

## 3. Motor de Checkout (Flujo hacia WhatsApp)

La conversión final se realiza a través de un motor de enlace dinámico, evitando los costos y la fricción de pasarelas de pago automatizadas.

*   **Generador de Pedidos:** Al hacer clic en "Pedir" en el carrito, el sistema consolida el estado del `carrito`, los `datos del cliente` (nombre, dirección) y las `notas adicionales`.
*   **Codificación URL:** El sistema transforma esta información en un formato legible y seguro utilizando `encodeURIComponent()` en JavaScript, generando un enlace directo a la API de WhatsApp (`https://wa.me/`).
*   **Ejemplo de Salida:** *"Hola Dais Chicken 🍗, mi pedido es: 1 Mega Banquete Daischicken, 1 Porción de Tequeños. Total: S/ 81.90. Mi dirección es: Av. Brasil 123. Pagaré con Yape."*

## 4. Infraestructura y Despliegue

La plataforma residirá en servicios en la nube de alta disponibilidad, garantizando que nunca se caiga incluso si hay picos de tráfico en fechas clave (como el Día del Pollo a la Brasa o feriados).

*   **Hosting y CI/CD:** **Vercel**. Entorno de ejecución óptimo para Next.js. Permite despliegues automáticos (Continuous Deployment) directamente desde el repositorio de código, facilitando actualizaciones ágiles.
*   **Gestión de Redes:** **Cloudflare**. Actuará como gestor de DNS y Red de Entrega de Contenidos (CDN). Almacenará copias en caché de las imágenes (fotos de los pollos) y archivos estáticos en servidores cercanos a los usuarios en Perú, reduciendo la latencia al mínimo.

---

## 5. Capa de Seguridad (Security Stack)

Para garantizar la integridad de la plataforma, proteger los datos del negocio y evitar ataques malintencionados (como intentos de saturar el botón de WhatsApp o tumbar la web), se implementarán las siguientes medidas de seguridad en todas las capas:

### 5.1 Seguridad de Red e Infraestructura
*   **Cloudflare WAF (Web Application Firewall):** Filtrado estricto de tráfico para bloquear bots maliciosos, ataques de fuerza bruta o intentos de inyección SQL antes de que siquiera lleguen al servidor de la aplicación.
*   **Protección Anti-DDoS:** Mitigación automática de ataques de denegación de servicio, asegurando que la web siga en pie bajo ataques de tráfico artificial.
*   **SSL/TLS Forzado:** Toda la comunicación entre el navegador del cliente y el servidor estará cifrada de extremo a extremo mediante certificados SSL gestionados automáticamente por Vercel y Cloudflare (HTTPS estricto).

### 5.2 Seguridad a Nivel de Aplicación (Next.js)
*   **Validación y Sanitización de Inputs:** Aunque los datos se envían a WhatsApp, cualquier formulario interno (por ejemplo, si el cliente ingresa su dirección en la web antes de ser redirigido) será sanitizado utilizando librerías como `Zod` para evitar ataques XSS (Cross-Site Scripting) o inyecciones de código.
*   **Rate Limiting (Limitación de Tasa):** En las API Routes que consultan el catálogo de Supabase, se configurarán límites de peticiones por IP para evitar que un atacante haga scraping (robo de datos del catálogo) o sobrecargue la base de datos de forma intencional.
*   **Gestión Segura de Variables de Entorno:** Ninguna credencial de acceso a la base de datos (Supabase Keys) ni el número real de WhatsApp del negocio estará expuesto en el código frontend. Todo residirá de manera segura en el servidor mediante el gestor de secretos (Environment Variables) de Vercel.

### 5.3 Seguridad de Operaciones (Opcional a Futuro)
*   **Validación de Número Bot:** En el futuro, se puede integrar una verificación por reCAPTCHA v3 (invisible) en el momento del "Checkout" para asegurar que solo humanos generen la redirección a WhatsApp, evitando spam al teléfono del negocio.
