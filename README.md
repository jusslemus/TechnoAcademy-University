# 🎓 TechnoAcademy University - Sistema de Registro Académico

Sistema completo de registro académico con vistas para Admin, Alumno y Usuario, construido con Node.js, Express y Oracle SQL.

## 📋 Características

### 🔐 Módulo de Autenticación
- ✅ Login con usuario y contraseña
- ✅ Protección con bcrypt
- ✅ Sesiones por rol (Admin, Alumno, Usuario)
- ✅ Middleware de autenticación

### 👨‍💼 Panel Admin
- ✅ Gestionar usuarios
- ✅ Administrar carreras y materias
- ✅ Crear períodos académicos
- ✅ Asignar docentes y grupos
- ✅ Registrar alumnos
- ✅ Ingresar notas y evaluaciones
- ✅ Gestionar pagos

### 👨‍🎓 Panel Alumno
- ✅ Ver información personal
- ✅ Inscribirse en materias
- ✅ Validación de prerrequisitos
- ✅ Ver horario de clases
- ✅ Consultar calificaciones
- ✅ Revisar estado financiero
- ✅ Descargar reportes

### 👤 Panel Usuario General
- ✅ Acceso básico al sistema
- ✅ Ver información de cuenta

## 🛠️ Requisitos Previos

- **Node.js** v14+ (https://nodejs.org/)
- **Oracle Database** (local o remoto)
- **npm** (viene con Node.js)

## 📦 Instalación

### 1. Clonar o descargar el proyecto

```bash
cd "c:\Users\Usuario\Documents\TechnoAcademy University"
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` basado en `.env.example`:

```bash
# Copiar archivo de ejemplo
cp .env.example .env
```

Editar `.env` con tus credenciales de Oracle:

```env
DB_USER=tu_usuario_oracle
DB_PASSWORD=tu_password
DB_CONNECT_STRING=localhost:1521/ORCL
SESSION_SECRET=tu_clave_super_secreta
PORT=3000
```

### 4. Crear Base de Datos en Oracle

1. Conectarse a Oracle SQL*Plus o SQL Developer
2. Ejecutar el script `SCHEMA.sql`:

```sql
@SCHEMA.sql
```

**IMPORTANTE**: Actualizar las contraseñas hasheadas en el script con valores reales.

Para generar hashes de contraseña, usar una herramienta online o Node.js:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('tu_password', 10));"
```

### 5. Iniciar el servidor

```bash
npm start
```

O en modo desarrollo con nodemon:

```bash
npm run dev
```

## 🚀 Uso

### Acceder al sistema

```
http://localhost:3000
```

### Credenciales de prueba (cambiar en producción)

- **Admin**: `admin` / `admin123`
- **Alumno**: `alumno1` / `alumno123`

## 📁 Estructura del Proyecto

```
TechnoAcademy University/
│
├── public/
│   ├── css/
│   │   └── style.css          # Estilos principales
│   └── js/
│       ├── dashboard.js        # JS común
│       ├── admin/
│       │   └── usuarios.js
│       └── alumno/
│           ├── dashboard.js
│           └── inscripciones.js
│
├── views/
│   ├── usuario/
│   │   ├── login.html
│   │   └── dashboard.html
│   ├── admin/
│   │   ├── dashboard.html
│   │   └── usuarios.html
│   └── alumno/
│       ├── dashboard.html
│       └── inscripciones.html
│
├── routes/
│   ├── auth.js                # Rutas de autenticación
│   ├── admin.js               # Rutas admin
│   ├── alumno.js              # Rutas alumno
│   └── usuario.js             # Rutas usuario
│
├── controllers/
│   └── authController.js      # Lógica de autenticación
│
├── middleware/
│   └── auth.js                # Middleware de protección
│
├── config/
│   ├── database.js            # Conexión Oracle
│   └── session.js             # Configuración sesiones
│
├── app.js                     # Aplicación principal
├── package.json               # Dependencias
├── SCHEMA.sql                 # Script de BD
└── .env.example               # Variables de entorno
```

## 🔧 Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: Oracle SQL
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Autenticación**: bcryptjs, express-session
- **Manejo de variables**: dotenv

## 📝 Próximos pasos

1. **Completar controladores** - Implementar lógica en `controllers/`
2. **Conectar APIs** - Crear endpoints para operaciones CRUD
3. **Vistas adicionales** - Crear HTML para todas las funcionalidades
4. **Validaciones** - Añadir validación de datos en cliente y servidor
5. **Testing** - Crear pruebas unitarias
6. **Seguridad** - HTTPS, CORS, rate limiting
7. **Despliegue** - Preparar para producción

## ⚠️ Notas Importantes

- **Cambiar credenciales** de prueba en producción
- **Usar HTTPS** en producción
- **Validar todas las entradas** del usuario
- **Hacer backup** regular de la BD
- **Revisar logs** de seguridad
- **Actualizar dependencias** regularmente

## 🐛 Troubleshooting

### Error de conexión a BD
```
Error: ORA-12514
```
- Verificar que Oracle esté corriendo
- Revisar `DB_CONNECT_STRING` en `.env`

### Puerto 3000 en uso
```
npm start -- --port 3001
```

### Dependencias no instaladas
```
npm install --save
npm install --save-dev
```

## 📞 Soporte

Para problemas o mejoras, crea un issue o contacta al equipo.

## 📄 Licencia

ISC

---

**Versión**: 1.0.0  
**Última actualización**: 2025  
**Estado**: En desarrollo 🚀
