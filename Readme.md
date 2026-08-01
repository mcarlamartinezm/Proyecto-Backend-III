# 🐾 Sistema de Adopción de Mascotas
--

# 📖 Descripción

Este proyecto corresponde a la entrega final del curso **Desarrollo Backend III**.

Para el desarrollo de esta aplicación se reutilizó como base el sistema de autenticación implementado previamente en el proyecto de desarrollo Backend II, permitiendo aprovechar la gestión de usuarios, la autenticación mediante Passport y JWT, el manejo de roles y la estructura general de la aplicación. Luego se desarrollaron las funcionalidades solicitadas para Backend III, incorporando un sistema de gestión de adopción de mascotas, pruebas funcionales automatizadas y la contenerización de la aplicación mediante Docker.

El objetivo de esta entrega es demostrar la integración de estas funcionalidades en una aplicación organizada por capas, aplicando buenas prácticas de desarrollo, pruebas y despliegue.

---

# ♻️ Base reutilizada de Backend II

Con el fin de evitar la reimplementación de funcionalidades ya desarrolladas, esta entrega reutiliza los siguientes componentes del proyecto realizado en Backend II:

- Registro de usuarios.
- Inicio de sesión mediante Passport Local.
- Autenticación utilizando JWT.
- Gestión de roles (Usuario y Administrador).
- Modelo de usuarios.
- Arquitectura base del proyecto.

---

# 🎯 Funcionalidades incorporadas

Las funcionalidades incorporadas para esta entrega son:

- Administración de mascotas.
- Gestión de adopciones.
- Endpoints para el proceso de adopción.
- Pruebas funcionales de los endpoints principales.
- Contenerización mediante Docker.
- Publicación de la imagen en Docker Hub.

---

# 🔄 Flujo general del sistema

```text
Administrador
      │
      ▼
Registra una mascota
      │
      ▼
La mascota queda disponible
      │
      ▼
Usuario autenticado solicita la adopción
      │
      ▼
Se registra una solicitud pendiente
      │
      ▼
Administrador aprueba la solicitud
      │
      ▼
La mascota cambia a estado "Adoptada"
      │
      ▼
Las demás solicitudes pendientes son rechazadas automáticamente
```

---

# 📁 Estructura del proyecto / Arbol de carpetas. 

La siguiente estructura corresponde a los módulos principales utilizados en el desarrollo de la aplicación.

```text
    src
    │
    ├── config
    |   └──database.js
    ├── controllers
    |   └──adoption.controller.js
    |   └──pet.controller.js
    |   └──session.controller.js
    ├── middlewares
    |   └──auth.middleware.js
    |   └──role.middleware.js
    ├── models
    |   └──adoption.model.js
    |   └──pet.model.js
    |   └──user.model.js
    ├── public
    |   └──style.css
    ├── routes
    |   └──adoption.router.js
    |   └──pet.routes.js
    |   └──session.routes.js
    |   └──views.router.js
    ├── strategies
    |   └──google.strategy.js
    |   └──local.strategy.js
    ├── utils
    |   └──hash.js
    |   └──jwt.js
    ├── views
    |   └──layout
    |       └──main.handlebars
    |      login.handlebars
    |      profile.handlebars
    |      register.handlebars
    └── app.js
└──test
|   └──helpers
|       └──test.factory.js
|      adoption.router.test.js
└──.dockerignore
└──.env
└──.gitignore
└──Dockerfile
└──package.json
└──README.md
└──server.js
```

---

# 🛠️ Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Passport
- JSON Web Token (JWT)
- bcrypt
- Mocha
- Chai
- Supertest
- Docker

---

# 🧪 Pruebas funcionales

Para validar el funcionamiento de la aplicación se desarrollaron pruebas funcionales utilizando:

- Mocha
- Chai
- Supertest

Las pruebas verifican el comportamiento de los principales endpoints del sistema.

|   Módulo  | Estado |
|-----------|--------|
|  Sessions |   ✅  |
|    Pets   |   ✅  |
| Adoptions |   ✅  |

Resultado de ejecución:

- 13 pruebas exitosas.
- 0 pruebas fallidas.

---

# 🐳 Docker

## Construcción de la imagen

```bash
docker build -t proyecto-backend-iii .
```

## Ejecución del contenedor

```bash
docker run --env-file .env -p 8080:8080 proyecto-backend-iii
```

---

# 🚀 Instalación

Clonar el repositorio.

```bash
git clone https://github.com/mcarlamartinezm/Proyecto-Backend-III.git
```

Ingresar al proyecto.

```bash
cd Proyecto-Backend-III
```

Instalar dependencias.

```bash
npm install
```

Crear un archivo `.env` con las variables correspondientes.

Iniciar la aplicación.

```bash
npm start
```

---

# 🔗 Recursos

## Repositorio GitHub

https://github.com/mcarlamartinezm/Proyecto-Backend-III

## Imagen Docker Hub

https://hub.docker.com/r/mcarlamartinez/proyecto-backend-iii

---

# 📷 Evidencias

Durante el desarrollo del proyecto se obtuvieron evidencias del funcionamiento de la aplicación.
Este apartado incorpora capturas correspondientes a:

- Ejecución de las pruebas.
- Construcción de la imagen Docker.
- Ejecución del contenedor.
- Imagen publicada en Docker Hub.

---

# 👩‍💻 Autora

**María Carla Martínez Muñoz**

Entrega final correspondiente al curso **Backend III** CODERHOUSE 2026.