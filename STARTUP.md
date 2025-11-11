# 🚀 GUÍA COMPLETA - INICIAR TECHNOACADEMY

## ✅ Paso 1: Instalar Node.js

Si aún no lo tienes, descárgalo desde: https://nodejs.org/

Verifica que esté instalado:
```powershell
node --version
npm --version
```

---

## ✅ Paso 2: Instalar Dependencias

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
cd "c:\Users\Usuario\Documents\TechnoAcademy University"
npm install
```

Esto instalará:
- **express** - Framework web
- **oracledb** - Driver de Oracle
- **bcryptjs** - Encriptación de contraseñas
- **express-session** - Gestión de sesiones
- **body-parser** - Parseo de datos
- **dotenv** - Variables de entorno
- **nodemon** - Recargar en desarrollo

---

## ✅ Paso 3: Configurar Variables de Entorno

### Copiar archivo de configuración:
```powershell
Copy-Item ".env.example" ".env"
```

### Editar `.env` con tus credenciales Oracle:

```env
# =====================================================
# CONFIGURACIÓN DE BASE DE DATOS ORACLE
# =====================================================
DB_USER=tu_usuario_oracle
DB_PASSWORD=tu_contrasena_oracle
DB_CONNECT_STRING=localhost:1521/ORCL

# =====================================================
# SEGURIDAD
# =====================================================
SESSION_SECRET=una_clave_muy_secreta_de_al_menos_32_caracteres

# =====================================================
# SERVIDOR
# =====================================================
PORT=3000
NODE_ENV=development
```

---

## ✅ Paso 4: Crear Base de Datos en Oracle

### Abrir SQL*Plus o SQL Developer

Conectarse a tu base de datos Oracle y ejecutar:

```sql
@SCHEMA.sql
```

O copiar todo el contenido del archivo `SCHEMA.sql` y ejecutarlo en tu cliente Oracle.

### Verificar que las tablas fueron creadas:
```sql
SELECT table_name FROM user_tables;
```

Deberías ver:
- `usuarios`
- `administradores`
- `alumnos`
- `carreras`
- `materias`
- `docentes`
- `periodos_academicos`
- `grupos`
- `inscripciones`
- `evaluaciones`
- `pagos`

---

## ✅ Paso 5: Iniciar el Servidor

### En modo desarrollo (con auto-recarga):
```powershell
npm run dev
```

### En modo normal:
```powershell
npm start
```

Verás algo como:
```
╔═══════════════════════════════════════════╗
║  🎓 TECHNOACADEMY UNIVERSITY              ║
║  Sistema de Registro Académico            ║
║                                           ║
║  🚀 Servidor ejecutándose en:             ║
║  http://localhost:3000                    ║
║                                           ║
║  📝 Accede a: http://localhost:3000/login ║
╚═══════════════════════════════════════════╝
```

---

## ✅ Paso 6: Acceder al Sistema

Abre tu navegador y ve a: **http://localhost:3000**

Te redirigirá a: **http://localhost:3000/login**

### Credenciales de prueba:

**ADMIN:**
- Usuario: `admin`
- Contraseña: `admin123`

**ALUMNO:**
- Usuario: `alumno1`
- Contraseña: `alumno123`

---

## 🎯 Funcionalidades Disponibles

### 👨‍💼 Panel Admin (acceso con usuario "admin")

- ✅ Gestionar usuarios
- ✅ Administrar carreras
- ✅ Crear materias
- ✅ Periodos académicos
- ✅ Asignar grupos
- ✅ Registrar alumnos

### 👨‍🎓 Panel Alumno (acceso con usuario "alumno1")

- ✅ Ver información personal
- ✅ Ver inscripciones
- ✅ Materias disponibles
- ✅ Ver calificaciones
- ✅ Ver horarios

---

## 🔧 Solución de Problemas

### ❌ Error: "Cannot find module 'oracledb'"

**Solución:**
```powershell
npm install oracledb
```

### ❌ Error de conexión a Oracle

Verifica:
1. Oracle esté ejecutándose
2. Usuario y contraseña correctos en `.env`
3. Connection String correcto (ej: `localhost:1521/ORCL`)

### ❌ Puerto 3000 ya está en uso

Cambiar puerto en `.env`:
```env
PORT=3001
```

### ❌ Base de datos vacía o sin tablas

Ejecuta nuevamente el script `SCHEMA.sql` en Oracle.

---

## 📁 Estructura del Proyecto

```
TechnoAcademy University/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── dashboard.js
│   │   ├── admin/
│   │   │   └── usuarios.js
│   │   └── alumno/
│   │       ├── dashboard.js
│   │       └── inscripciones.js
│   └── 404.html
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
│   ├── auth.js
│   ├── admin.js
│   ├── alumno.js
│   └── usuario.js
│
├── controllers/
│   └── authController.js
│
├── models/
│   ├── adminModel.js
│   └── alumnoModel.js
│
├── config/
│   ├── database.js
│   └── session.js
│
├── middleware/
│   └── auth.js
│
├── app.js
├── package.json
├── SCHEMA.sql
├── STARTUP.md (este archivo)
└── README.md
```

---

## 🔐 Seguridad - Cambiar Contraseñas de Prueba

### 1. Generar contraseña hasheada

En PowerShell:
```powershell
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('miNuevaPassword123', 10));"
```

### 2. Actualizar en Oracle

```sql
UPDATE usuarios SET contrasena = '$2b$10$...hash_generado...' WHERE nombre_usuario = 'admin';
COMMIT;
```

---

## 📚 Próximos Pasos

1. **Personalizar vistas** - Adaptar HTML/CSS a tu diseño
2. **Completar controladores** - Implementar más funcionalidades
3. **Agregar validaciones** - Validar datos en cliente y servidor
4. **Autenticación mejorada** - JWT, 2FA, etc.
5. **Testing** - Pruebas unitarias e integración
6. **Despliegue** - Preparar para producción

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs de la consola
2. Verifica credenciales de Oracle
3. Comprueba que el SCHEMA.sql se ejecutó sin errores
4. Asegúrate que Node.js esté correctamente instalado

---

**¡Listo para empezar! 🚀**

Para detener el servidor presiona: `CTRL + C`
