Este proyecto corresponde al backend del trabajo integrador final Full Stack.
Fue desarrollado en Node.js con Express, utilizando MongoDB como base de datos principal y una arquitectura modular por capas (routes, controllers, services, repositories).

El sistema gestiona la autenticación de usuarios mediante JWT, el encriptado de contraseñas con bcrypt, la verificación de cuenta a través de correo electrónico y la recuperación de contraseña mediante Nodemailer.
Provee todos los endpoints necesarios para el correcto funcionamiento del frontend de la aplicación de mensajería.

Utilicé:
1- Node.js + Express
2- MongoDB + Mongoose
3- bcrypt
4- jsonwebtoken (JWT)
5- Nodemailer
6- dotenv
7- CORS
8- Nodemon (modo desarrollo)

El backend utiliza un flujo completo de autenticación y validación:
1- Encriptado de contraseñas con bcrypt.
2- Generación de tokens JWT con expiración.
3- Middleware que valida el token y protege rutas sensibles.
4- Envío de correos electrónicos con tokens de verificación y recuperación de contraseña.
5- Variables de entorno gestionadas con dotenv.
6- Política CORS para permitir la comunicación con el frontend.

Los endpoints principales, por ejemplo, para testearlos en Postman son:
Autenticación

POST /api/auth/register: crea usuario y envía correo de verificación.

GET /api/auth/verify-email/:token: valida cuenta.

POST /api/auth/login: autentica usuario y devuelve JWT.

POST /api/auth/forgot-password: envía correo con token de recuperación.

POST /api/auth/reset-password/:token: permite establecer nueva contraseña.

Conversaciones

GET /api/conversations: lista las conversaciones del usuario.

POST /api/conversations: crea o recupera una conversación con otro usuario.

Mensajes

GET /api/messages/:conversationId: lista los mensajes de una conversación.

POST /api/messages/:conversationId: envía un mensaje nuevo.

DELETE /api/messages/:messageId: elimina un mensaje propio.

Contactos

GET /api/contacts: lista contactos del usuario.


Los modelos están definidos con Mongoose e implementan las relaciones necesarias entre usuarios, conversaciones y mensajes.

1- User: email, username, passwordHash, verified_email, tokens temporales.
2- Conversation: participantes, fecha del último mensaje.
3- Message: conversación, emisor, texto, timestamps.
4- Contact: propietario, contacto, alias.
Las referencias entre entidades permiten recuperar fácilmente todas las conversaciones y mensajes de cada usuario.


El backend está dividido en capas claramente separadas:
1- Routes: definen los endpoints de la API.
2- Controllers: gestionan la lógica de request y response.
3- Services: contienen la lógica de negocio principal.
4- Repositories: manejan el acceso a la base de datos.
Este esquema facilita la escalabilidad y el mantenimiento del código, respetando las buenas prácticas de arquitectura.

De este modo, el backend implementa un sistema completo de autenticación, seguridad y persistencia de datos.
Cumple con todos los requerimientos exigidos por la consigna: arquitectura modular, manejo de JWT, hashing, verificación de email, recuperación de contraseña, CRUD real sobre entidades relacionadas, y despliegue público funcional.
El proyecto demuestra una comprensión integral del desarrollo full stack, tanto a nivel técnico como estructural, garantizando seguridad, mantenibilidad y coherencia entre el frontend y el backend.