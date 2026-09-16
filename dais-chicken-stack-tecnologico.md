# Stack Tecnológico y Arquitectura de Software: Dais Chicken

Este documento detalla la arquitectura tecnológica elegida para el desarrollo de la plataforma de e-commerce de **Dais Chicken**. Siguiendo los mismos estándares de calidad y rendimiento implementados en proyectos anteriores (como FAMAX CONCRETO PERU), el sistema prescinde de gestores de contenido genéricos (como WordPress) para apostar por un desarrollo de **código propio, moderno y escalable**.

La plataforma está diseñada específicamente para optimizar la velocidad de carga, maximizar el SEO y gestionar un flujo de compra cerrado mediante redirección a WhatsApp, todo bajo un estricto marco de seguridad.

> **Estado de seguridad actual:** el frontend aplica headers de seguridad, una CSP con nonce, validación de entradas y un carrito que persiste únicamente IDs y cantidades. El servidor valida los productos y precios antes de preparar un pedido, y registra reclamos en Supabase mediante una API protegida. Los pedidos todavía no se almacenan ni procesan como pagos; esas capacidades requieren una evolución adicional.

---

## 1. Frontend (Interfaz y Experiencia de Usuario)

La capa de presentación está diseñada para ser ultrarrápida, garantizando que los usuarios móviles en cualquier distrito de Lima puedan ver el catálogo de productos (pollos, combos, etc.) de manera instantánea.

*   **Framework Principal:** **Next.js (React)**. Permite la generación de sitios estáticos (SSG) y renderizado del lado del servidor (SSR). Esto significa que el catálogo de productos se pre-carga en el servidor, ofreciendo tiempos de respuesta de milisegundos y una indexación perfecta para Google (SEO).
*   **Estilos y UI:** **Tailwind CSS**. Un framework de utilidades CSS que permite construir componentes visuales consistentes (como tarjetas destacadas, botones de call-to-action y modales) manteniendo el peso del archivo CSS al mínimo.
*   **Gestión de Estado:** **Zustand**. Maneja localmente la bolsa de compras, persistiendo únicamente identificadores y cantidades.

## 2. Backend y Base de Datos (Gestión de Catálogo)

Aunque no existe una pasarela de pagos, se necesita una estructura para que los administradores de Dais Chicken puedan actualizar precios, ocultar productos agotados o lanzar promociones sin tocar el código fuente.

*   **Lógica de Servidor:** **Next.js App Router** para entregar el catálogo público desde el servidor, validar líneas y precios del pedido, y registrar reclamos. El pedido se confirma manualmente por WhatsApp; no se simula un pago ni se almacena una orden automáticamente.
*   **Base de Datos:** **Supabase (PostgreSQL)** con migraciones, seed y RLS versionados. Aquí se almacenará:
    *   Tabla de Productos (Nombre, descripción, precio, imagen).
    *   Tabla de Categorías.
    *   Configuraciones generales (Número de WhatsApp actual, horario de atención).

## 3. Motor de Checkout (Flujo hacia WhatsApp)

La conversión final se realiza a través de un motor de enlace dinámico, evitando los costos y la fricción de pasarelas de pago automatizadas.

*   **Generador de Pedidos:** Al hacer clic en el carrito, el sistema consolida productos, cantidades y datos que el cliente decide compartir.
*   **Transferencia a WhatsApp:** El sitio abre `https://wa.me/` sin datos en la URL y copia localmente el mensaje para que el usuario decida pegarlo y enviarlo. Así se evita exponer información personal en query strings.
*   **Confirmación:** El total mostrado es referencial. Cobertura, delivery, disponibilidad, pago y total final se confirman por WhatsApp.

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
*   **Content Security Policy:** Se genera un nonce por solicitud mediante `proxy.ts`; los scripts inline controlados, incluido JSON-LD, se ejecutan únicamente con ese nonce.
*   **Validación y Sanitización de Inputs:** Los formularios limitan longitud, eliminan caracteres de control y validan DNI/RUC antes de preparar el mensaje. El mensaje se copia localmente y WhatsApp se abre sin datos en la URL.
*   **Integridad del carrito:** El navegador persiste únicamente IDs y cantidades. El nombre, precio e imagen se reconstruyen desde el catálogo local y las cantidades están limitadas a 99 unidades.
*   **Rate Limiting:** El endpoint de reclamos aplica un límite best effort por IP. La validación de pedidos no crea órdenes ni modifica datos; si se incorpora almacenamiento o pagos, deberán añadirse controles distribuidos y antifraude.
*   **Gestión Segura de Variables de Entorno:** No hay credenciales de backend en el proyecto actual. El número de WhatsApp es un dato público de contacto y no debe tratarse como secreto.

### 5.3 Seguridad de Operaciones (Pendiente)
*   **Validación de Número Bot:** Puede integrarse reCAPTCHA o una alternativa equivalente cuando exista un endpoint de checkout en servidor. En el flujo actual no hay endpoint que pueda protegerse contra automatización.
