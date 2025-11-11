# 🎓 Sistema de Notas por Período - Resumen de Cambios

## 📅 Fecha: 2024
## 🎯 Objetivo: Permitir a docentes inscribir alumnos y asignar calificaciones por período (P1, P2, P3, P4)

---

## ✨ Funcionalidades Implementadas

### 1. Inscripción de Alumnos por Docente
- ✅ Modal con lista de alumnos disponibles
- ✅ Validación de cupo máximo del grupo
- ✅ Prevención de inscripciones duplicadas
- ✅ Uso de período académico activo
- ✅ Transacciones con rollback en caso de error

### 2. Sistema de Notas por Período
- ✅ 4 períodos configurables (P1, P2, P3, P4)
- ✅ Cada nota es opcional (puede quedar vacía)
- ✅ Rango válido: 0.00 - 10.00
- ✅ Cálculo automático de nota final (promedio)
- ✅ Actualización en tiempo real del promedio
- ✅ Validaciones en frontend y backend

### 3. Gestión de Alumnos
- ✅ Visualizar alumnos inscritos por materia
- ✅ Ver desglose de notas por período
- ✅ Retirar alumnos de materias
- ✅ Estado de inscripción (ACTIVO/RETIRADO)

---

## 📁 Archivos Modificados

### Frontend

#### `views/docente/mis-materias.html`
**Cambios:**
- ✅ Modal para inscribir alumnos con dropdown
- ✅ Modal para asignar notas por período
- ✅ Tabla mejorada con botones de acción
- ✅ Display de notas P1-P4 en cada alumno
- ✅ Cálculo automático de nota final
- ✅ Sistema de notificaciones

**Elementos Nuevos:**
```html
<!-- Modal Inscribir Alumno -->
<div id="agregarAlumnoModal">
  <select id="select_alumno">...</select>
  <button onclick="inscribirAlumno()">Inscribir</button>
</div>

<!-- Modal Notas -->
<div id="notasModal">
  <input id="nota_p1" type="number" min="0" max="10" step="0.01">
  <input id="nota_p2" type="number" min="0" max="10" step="0.01">
  <input id="nota_p3" type="number" min="0" max="10" step="0.01">
  <input id="nota_p4" type="number" min="0" max="10" step="0.01">
  <span id="nota_final_calculada"></span>
  <button onclick="guardarNotas()">Guardar</button>
</div>
```

#### `public/js/docente/mis-materias.js`
**Funciones Nuevas:**
- `cargarTodosLosAlumnos()` - Carga lista de alumnos disponibles
- `abrirModalAgregar(id_grupo)` - Abre modal de inscripción
- `cerrarModalAgregar()` - Cierra modal
- `inscribirAlumno()` - POST para crear inscripción
- `abrirModalNotas(alumno)` - Abre modal de notas
- `cerrarModalNotas()` - Cierra modal
- `calcularNotaFinal()` - Calcula promedio automático
- `guardarNotas()` - POST para guardar notas por período
- `retirarAlumno(id, nombre)` - DELETE para retirar alumno
- `mostrarNotificacion(mensaje, tipo)` - Muestra alertas

**Actualizaciones:**
- `cargarMateriasConAlumnos()` - Ahora muestra P1-P4 y botones de acción

---

### Backend

#### `routes/docente.js`
**APIs Nuevas:**

1. **GET `/docente/api/alumnos-disponibles`**
   - Retorna todos los alumnos activos del sistema
   - Para poblar el dropdown de inscripción
   ```json
   {
     "success": true,
     "alumnos": [
       {
         "ID_ALUMNO": 1,
         "CARNET": "2024001",
         "NOMBRES": "Juan",
         "APELLIDOS": "Pérez",
         "EMAIL": "juan@mail.com"
       }
     ]
   }
   ```

2. **POST `/docente/api/inscribir-alumno`**
   - Body: `{id_grupo: 1, id_alumno: 5}`
   - Valida permisos del docente
   - Verifica cupo disponible
   - Previene duplicados
   - Crea inscripción con período activo
   ```json
   {
     "success": true,
     "message": "Alumno inscrito exitosamente"
   }
   ```

3. **POST `/docente/api/guardar-notas-periodo`**
   - Body: `{id_inscripcion: 10, nota_p1: 7.5, nota_p2: 8.0, nota_p3: 6.5, nota_p4: 9.0}`
   - Valida rango 0-10 para cada nota
   - Calcula nota_final automáticamente
   - Acepta notas NULL (opcionales)
   ```json
   {
     "success": true,
     "message": "Notas guardadas exitosamente",
     "nota_final": 7.75
   }
   ```

4. **DELETE `/docente/api/retirar-alumno/:id_inscripcion`**
   - Valida permisos del docente
   - Cambia estado a 'RETIRADO' (no elimina)
   ```json
   {
     "success": true,
     "message": "Alumno retirado exitosamente"
   }
   ```

**APIs Actualizadas:**

- **GET `/docente/api/materias-alumnos`**
  - Ahora incluye: `nota_p1`, `nota_p2`, `nota_p3`, `nota_p4`
  - Incluye `id_inscripcion` para operaciones

---

### Base de Datos

#### `database/agregar_notas_periodo.sql`
**Nuevo Script de Migración:**

```sql
-- Agregar columnas para notas por período
ALTER TABLE inscripciones ADD (
  nota_p1 NUMBER(4,2),
  nota_p2 NUMBER(4,2),
  nota_p3 NUMBER(4,2),
  nota_p4 NUMBER(4,2)
);

-- Constraints de validación
ALTER TABLE inscripciones ADD CONSTRAINT ck_nota_p1_rango 
  CHECK (nota_p1 IS NULL OR (nota_p1 >= 0 AND nota_p1 <= 10));
  
ALTER TABLE inscripciones ADD CONSTRAINT ck_nota_p2_rango 
  CHECK (nota_p2 IS NULL OR (nota_p2 >= 0 AND nota_p2 <= 10));
  
ALTER TABLE inscripciones ADD CONSTRAINT ck_nota_p3_rango 
  CHECK (nota_p3 IS NULL OR (nota_p3 >= 0 AND nota_p3 <= 10));
  
ALTER TABLE inscripciones ADD CONSTRAINT ck_nota_p4_rango 
  CHECK (nota_p4 IS NULL OR (nota_p4 >= 0 AND nota_p4 <= 10));
```

**Estructura Actualizada de `inscripciones`:**
```
Column Name       Type           Nullable
--------------    ------------   --------
ID_INSCRIPCION    NUMBER         No
ID_ALUMNO         NUMBER         No
ID_GRUPO          NUMBER         No
ID_PERIODO        NUMBER         No
FECHA_INSCRIPCION DATE           No
ESTADO            VARCHAR2(20)   No
NOTA_P1           NUMBER(4,2)    Yes  ← NUEVO
NOTA_P2           NUMBER(4,2)    Yes  ← NUEVO
NOTA_P3           NUMBER(4,2)    Yes  ← NUEVO
NOTA_P4           NUMBER(4,2)    Yes  ← NUEVO
NOTA_FINAL        NUMBER(4,2)    Yes
```

---

## 📋 Archivos de Documentación

### Nuevos Archivos Creados:

1. **`INSTRUCCIONES_NOTAS_PERIODO.md`**
   - Guía completa paso a paso
   - Instrucciones para ejecutar SQL
   - Cómo probar el sistema
   - Troubleshooting
   - Checklist de verificación

2. **`actualizar_db_notas.bat`**
   - Script automatizado para Windows
   - Ejecuta el SQL de actualización
   - Muestra mensajes de progreso

3. **`database/agregar_notas_periodo.sql`**
   - Script de migración de base de datos
   - Agrega columnas y constraints
   - Incluye verificaciones

4. **`RESUMEN_CAMBIOS_NOTAS_PERIODO.md`** (este archivo)
   - Documentación técnica completa
   - Lista de archivos modificados
   - APIs documentadas

---

## 🔄 Flujo de Uso

### Inscribir Alumno:
```
1. Docente entra a "Mis Materias"
2. Ve sus materias con alumnos inscritos
3. Click en "+ Inscribir Alumno"
4. Selecciona alumno del dropdown
5. Click en "Inscribir"
6. Sistema valida y crea inscripción
7. Alumno aparece en la lista
```

### Asignar Notas:
```
1. Click en "Notas" junto al alumno
2. Modal se abre con campos P1, P2, P3, P4
3. Ingresa notas (opcionales)
4. Nota final se calcula automáticamente
5. Click en "Guardar Notas"
6. Sistema actualiza base de datos
7. Notas se reflejan en la lista
```

### Retirar Alumno:
```
1. Click en "Retirar" junto al alumno
2. Confirma la acción
3. Estado cambia a 'RETIRADO'
4. Alumno desaparece de la lista activa
```

---

## 🎨 Mejoras de UX/UI

### Modales
- Diseño moderno con overlay
- Animaciones suaves
- Botón X para cerrar
- Click fuera del modal no cierra (previene errores)

### Validaciones
- **Frontend:**
  - Input type="number" con min/max
  - Step 0.01 para decimales
  - Placeholder "0.00"
  - Requerido al guardar

- **Backend:**
  - Validación de rango 0-10
  - Validación de permisos
  - Validación de cupo
  - Validación de duplicados

### Notificaciones
- Sistema de alertas en la parte superior
- Colores según tipo (éxito verde, error rojo)
- Auto-hide después de 5 segundos
- Scroll automático al tope

### Color Coding
```css
Nota < 6.0  → 🔴 Rojo   (badge-danger)
Nota 6-7    → 🟡 Amarillo (badge-warning)
Nota ≥ 7    → 🟢 Verde   (badge-success)
```

---

## 🔐 Seguridad

### Validaciones Implementadas:

1. **Permisos de Docente:**
   - Solo puede ver/editar alumnos de SUS materias
   - Valida id_docente en cada operación
   - Session-based authentication

2. **Validación de Cupo:**
   - Verifica cupo_actual < cupo_maximo
   - Previene sobrecupo
   - Mensaje de error claro

3. **Prevención de Duplicados:**
   - Query verifica inscripción existente
   - Solo permite un alumno por grupo activo

4. **Transacciones:**
   - Uso de rollback en caso de error
   - Commit solo si todo OK

5. **Sanitización:**
   - Express escapa JSON automáticamente
   - Oracle prepared statements (`:param`)
   - Previene SQL injection

---

## 🧪 Testing Sugerido

### Casos de Prueba:

#### Inscripción:
- [ ] Inscribir alumno nuevo → Debe aparecer en lista
- [ ] Inscribir alumno duplicado → Debe mostrar error
- [ ] Inscribir con cupo lleno → Debe mostrar error
- [ ] Inscribir sin período activo → Debe mostrar error

#### Notas:
- [ ] Guardar 4 notas → Nota final = promedio
- [ ] Guardar solo 2 notas → Nota final = promedio de 2
- [ ] Guardar nota = 0 → Debe aceptar
- [ ] Guardar nota = 10 → Debe aceptar
- [ ] Guardar nota = 11 → Debe rechazar
- [ ] Guardar nota = -1 → Debe rechazar
- [ ] Modificar notas existentes → Debe actualizar

#### Retirar:
- [ ] Retirar alumno → Estado = RETIRADO
- [ ] Retirar y volver a inscribir → Debe crear nueva inscripción
- [ ] Alumno retirado no aparece en lista activa

#### Permisos:
- [ ] Docente A no puede editar alumnos de Docente B
- [ ] Sin sesión redirige a login

---

## 📊 Estructura de Datos

### Request/Response Examples:

#### Inscribir Alumno
**Request:**
```http
POST /docente/api/inscribir-alumno
Content-Type: application/json

{
  "id_grupo": 5,
  "id_alumno": 12
}
```

**Response (Éxito):**
```json
{
  "success": true,
  "message": "Alumno inscrito exitosamente"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "El alumno ya está inscrito en esta materia"
}
```

#### Guardar Notas
**Request:**
```http
POST /docente/api/guardar-notas-periodo
Content-Type: application/json

{
  "id_inscripcion": 25,
  "nota_p1": 7.50,
  "nota_p2": 8.00,
  "nota_p3": 6.50,
  "nota_p4": 9.00
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notas guardadas exitosamente",
  "nota_final": 7.75
}
```

---

## 🚀 Pasos para Desplegar

1. **Actualizar Base de Datos:**
   ```cmd
   cd C:\Users\kathy\Documents\TechnoAcademy-University
   actualizar_db_notas.bat
   ```

2. **Verificar Columnas:**
   ```sql
   DESC inscripciones;
   ```

3. **Iniciar Servidor:**
   ```cmd
   npm start
   ```

4. **Probar Sistema:**
   - Login: http://localhost:3000/login
   - Credenciales de docente
   - Navegar a "Mis Materias"

---

## 📝 Notas Técnicas

### Cálculo de Nota Final:
```javascript
// Frontend
const notas = [p1, p2, p3, p4].filter(n => n > 0);
const promedio = notas.reduce((a, b) => a + b, 0) / notas.length;

// Backend
const notas = [nota_p1, nota_p2, nota_p3, nota_p4].filter(n => n !== null);
let nota_final = null;
if (notas.length > 0) {
  nota_final = notas.reduce((a, b) => a + b, 0) / notas.length;
}
```

### SQL Queries Importantes:

**Alumnos de un grupo:**
```sql
SELECT 
  i.id_inscripcion,
  a.carnet,
  a.nombres || ' ' || a.apellidos as NOMBRE_COMPLETO,
  i.nota_p1, i.nota_p2, i.nota_p3, i.nota_p4,
  i.nota_final
FROM inscripciones i
JOIN alumnos a ON i.id_alumno = a.id_alumno
WHERE i.id_grupo = :id_grupo AND i.estado = 'ACTIVO';
```

**Verificar cupo:**
```sql
SELECT 
  (SELECT COUNT(*) FROM inscripciones 
   WHERE id_grupo = :id_grupo AND estado = 'ACTIVO') as CUPO_ACTUAL,
  cupo_maximo
FROM grupos
WHERE id_grupo = :id_grupo;
```

---

## ✅ Checklist de Implementación

### Base de Datos:
- [x] Script SQL creado
- [x] Columnas nota_p1, nota_p2, nota_p3, nota_p4 definidas
- [x] Constraints de validación agregados
- [ ] **PENDIENTE: Ejecutar script en Oracle**

### Backend:
- [x] GET /api/alumnos-disponibles
- [x] POST /api/inscribir-alumno
- [x] POST /api/guardar-notas-periodo
- [x] DELETE /api/retirar-alumno
- [x] Actualizar GET /api/materias-alumnos
- [x] Validaciones de seguridad
- [x] Manejo de errores
- [x] Transacciones con rollback

### Frontend:
- [x] Modal inscribir alumno
- [x] Modal asignar notas
- [x] Cálculo automático de promedio
- [x] Validaciones de input
- [x] Sistema de notificaciones
- [x] Botones de acción
- [x] Display de notas P1-P4

### Documentación:
- [x] INSTRUCCIONES_NOTAS_PERIODO.md
- [x] RESUMEN_CAMBIOS_NOTAS_PERIODO.md
- [x] actualizar_db_notas.bat
- [x] agregar_notas_periodo.sql

### Testing:
- [ ] Pruebas de inscripción
- [ ] Pruebas de notas
- [ ] Pruebas de retiro
- [ ] Pruebas de permisos
- [ ] Pruebas de validación

---

## 🎉 Resultado Final

El sistema ahora permite a los docentes:
1. ✅ Ver sus materias asignadas
2. ✅ Inscribir alumnos a sus materias
3. ✅ Asignar notas por 4 períodos
4. ✅ Ver cálculo automático de nota final
5. ✅ Retirar alumnos de materias
6. ✅ Gestionar inscripciones con validaciones

Todo con una interfaz moderna, validaciones completas y seguridad implementada.

---

**Última Actualización:** 2024  
**Versión:** 3.0  
**Estado:** ✅ Listo para desplegar (pendiente ejecutar SQL)
