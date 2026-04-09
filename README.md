# penitenciaria-frontend

Frontend Angular del sistema de gestión penitenciaria, que se conecta al backend REST API `penitenciaria-api-v2` mediante JWT para autenticación y autorización [cite:30][cite:28].

## Objetivo

El objetivo principal del frontend es ofrecer una interfaz web modular y segura para administradores y personal penitenciario, con acceso a módulos como reclusos, visitas, visitantes e incidentes, siempre validando las credenciales mediante tokens JWT emitidos por el backend [cite:30][cite:304].

## Fase 1 completada

En la fase 1 del desarrollo se ha implementado y probado la base mínima de autenticación y navegación:

- Login real contra el endpoint `http://localhost:8080/penitenciaria-api/api/login`.
- Almacenamiento del token JWT en sesión del navegador.
- Navegación desde `/login` a `/monitor` tras autenticación correcta.
- Protección de rutas mediante `AuthGuard`.
- Logout que borra la sesión y bloquea el acceso a pantallas protegidas.
- Uso de `AuthInterceptor` para adjuntar automáticamente el header `Authorization: Bearer ...` en peticiones al backend [cite:93][cite:28].

## Tecnologías usadas

- Angular 17+ (o versión usada en tu proyecto).
- TypeScript.
- Angular Router + HTTP Client.
- JWT para autenticación (JWT Bearer).
- HTTP Interceptor para adjuntar el token.
- PrimeNG u otro conjunto de componentes UI (ajusta según el que estés usando realmente) [cite:204].

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/IvanDiazSilva/penitenciaria-frontend.git
   cd penitenciaria-frontend
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Asegúrate de que el backend `penitenciaria-api-v2` está ejecutándose en `http://localhost:8080/penitenciaria-api/api` [cite:28].

## Arrancar el frontend

Desde la carpeta del proyecto, ejecuta:

```bash
ng serve
```

Una vez arrancado, accede a:

- `http://localhost:4200/login` para iniciar sesión.
- `http://localhost:4200/monitor` será la pantalla principal tras el login, protegida por el guard [cite:93].

## Estructura de carpetas

- `src/app/core/`: servicios (`auth.services.ts`), interceptores (`auth.interceptor.ts`) y guards (`auth.guard.ts`, `role.guard.ts`).
- `src/app/features/login/`: `LoginComponent` con formulario reactivo.
- `src/app/features/monitor/`: `MonitorComponent`, primera pantalla interna protegida.
- `src/app/features/visitas/`: `VisitasComponent`, módulo parcialmente creado.
- Resto de componentes de `features/` se crearán según la fase 2 (reos, incidentes, etc.) [cite:30].

## Fase 2 propuesta

Con la fase 1 ya terminada, los siguientes bloques de trabajo previstos son:

- Construir un `MonitorComponent` funcional con datos reales del backend.
- Completar el módulo `VisitasComponent` con tabla y operaciones sobre el endpoint `/api/visitas` o `/api/visitas/validar-qr` según el diseño.
- Añadir módulos de `Reos` y `Visitantes` conectados a sus respectivos endpoints.
- Reintroducir y refinar `RoleGuard` para controlar pantallas según el rol (`ADMIN`, `GUARDIA`, etc.).
- Mejorar la experiencia de usuario con mensajes de error, loaders y estados vacíos [cite:30][cite:204].

## Contribuyendo

Si estás en el equipo de trabajo (Estefanía, Carlos, etc.), coordina los cambios en `penitenciaria-api-v2` y `penitenciaria-frontend` para mantener la API y la interfaz sincronizadas. Este repositorio está pensado como frontal independiente, conectado al backend en otro repositorio [cite:30][cite:28].