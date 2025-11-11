# 📋 Instrucciones para Agregar Sistema de Notas por Período

## 🎯 Objetivo
Este documento explica cómo aplicar las actualizaciones necesarias en la base de datos para soportar el nuevo sistema de calificaciones por período (P1, P2, P3, P4).

## ✅ Cambios Implementados

### Frontend
- ✅ `views/docente/mis-materias.html` - Interfaz con modales para inscribir alumnos y asignar notas por período
- ✅ `public/js/docente/mis-materias.js` - Lógica para gestionar inscripciones y notas

### Backend
- ✅ `routes/docente.js` - Nuevas APIs:
  - `GET /docente/api/alumnos-disponibles` - Lista alumnos para inscribir
  - `POST /docente/api/inscribir-alumno` - Inscribe alumno a materia
  - `POST /docente/api/guardar-notas-periodo` - Guarda notas P1, P2, P3, P4
  - `DELETE /docente/api/retirar-alumno/:id` - Retira alumno de materia

### Base de Datos
- ⏳ **PENDIENTE** - Agregar columnas para notas por período

---

## 🔧 Pasos para Aplicar Cambios en Base de Datos

### Opción 1: SQL*Plus (Línea de comandos)

1. **Abrir SQL*Plus:**
   ```cmd
   sqlplus system/Kathya.p03@localhost:1521/XE
   ```

2. **Ejecutar el script:**
   ```sql
   @C:\Users\kathy\Documents\TechnoAcademy-University\database\agregar_notas_periodo.sql
   ```

3. **Verificar que las columnas se agregaron:**
   ```sql
   DESC inscripciones;
   ```

   Deberías ver las nuevas columnas:
   - NOTA_P1 NUMBER(4,2)
   - NOTA_P2 NUMBER(4,2)
   - NOTA_P3 NUMBER(4,2)
   - NOTA_P4 NUMBER(4,2)

### Opción 2: Oracle SQL Developer (GUI)

1. **Abrir SQL Developer**
2. **Conectar con:**
   - Usuario: `system`
   - Contraseña: `Kathya.p03`
   - Host: `localhost`
   - Puerto: `1521`
   - SID: `XE`

3. **Abrir el archivo:**
   - File → Open → `database\agregar_notas_periodo.sql`

4. **Ejecutar el script:**
   - Presiona F5 o haz clic en "Run Script" (ícono de papel verde)

5. **Verificar:**
   - Navega a Connections → SYSTEM → Tables → INSCRIPCIONES
   - Click derecho → Columns
   - Verifica que aparezcan nota_p1, nota_p2, nota_p3, nota_p4

---

## 🧪 Probar el Sistema

### 1. Iniciar el servidor
```cmd
cd C:\Users\kathy\Documents\TechnoAcademy-University
npm start
```

### 2. Login como Docente
- Ir a: http://localhost:3000/login
- Usar credenciales de docente (ej: `docente1` / contraseña)

### 3. Ir a "Mis Materias"
- Navegar a: http://localhost:3000/docente/mis-materias

### 4. Probar funcionalidades:

#### a) Inscribir Alumno
1. Hacer clic en "**+ Inscribir Alumno**"
2. Seleccionar alumno del dropdown
3. Hacer clic en "**Inscribir**"
4. Verificar que aparece en la lista de alumnos

#### b) Asignar Notas por Período
1. Hacer clic en "**Notas**" junto al alumno
2. Ingresar notas para cada período (0-10):
   - Período 1: Ej. 7.5
   - Período 2: Ej. 8.0
   - Período 3: Ej. 6.5
   - Período 4: Ej. 9.0
3. Verificar que la **Nota Final** se calcula automáticamente
4. Hacer clic en "**Guardar Notas**"
5. Verificar mensaje de éxito

#### c) Retirar Alumno
1. Hacer clic en "**Retirar**" junto al alumno
2. Confirmar la acción
3. Verificar que el alumno se retira de la lista

---

## 🔍 Verificar Datos en Base de Datos

```sql
-- Ver inscripciones con notas por período
SELECT 
  i.id_inscripcion,
  a.carnet,
  a.nombres || ' ' || a.apellidos as alumno,
  m.nombre_materia,
  i.nota_p1,
  i.nota_p2,
  i.nota_p3,
  i.nota_p4,
  i.nota_final,
  i.estado
FROM inscripciones i
JOIN alumnos a ON i.id_alumno = a.id_alumno
JOIN grupos g ON i.id_grupo = g.id_grupo
JOIN materias m ON g.id_materia = m.id_materia
WHERE i.estado = 'ACTIVO'
ORDER BY m.nombre_materia, a.apellidos;
```

---

## 📊 Características del Sistema

### ✨ Funcionalidades Nuevas:

1. **Inscripción de Alumnos:**
   - Docente puede inscribir alumnos a sus materias
   - Valida cupo máximo del grupo
   - Previene inscripciones duplicadas
   - Usa período académico actual

2. **Notas por Período:**
   - 4 períodos (P1, P2, P3, P4)
   - Cada nota es opcional (0-10)
   - Nota final se calcula automáticamente: `(P1 + P2 + P3 + P4) / n`
   - Validación de rango en frontend y backend
   - Actualización instantánea del cálculo

3. **Gestión de Inscripciones:**
   - Ver alumnos inscritos por materia
   - Ver notas por período de cada alumno
   - Retirar alumnos de materias
   - Estado cambia a 'RETIRADO' (no se elimina)

### 🎨 Mejoras de Interfaz:

- Modales modernos con animaciones
- Botones de acción por alumno
- Visualización de notas P1-P4 en lista
- Cálculo automático de nota final
- Notificaciones de éxito/error
- Color coding por nivel de nota:
  - 🔴 Rojo: < 6
  - 🟡 Amarillo: 6-7
  - 🟢 Verde: ≥ 7

---

## ⚠️ Notas Importantes

1. **Backup:** Si ya tienes datos importantes, haz backup antes:
   ```cmd
   expdp system/Kathya.p03@XE directory=DATA_PUMP_DIR dumpfile=backup.dmp
   ```

2. **Datos Existentes:** Las columnas nuevas permiten valores NULL, por lo que inscripciones existentes no se afectarán.

3. **Período Académico:** Asegúrate de tener un período académico activo:
   ```sql
   SELECT * FROM periodos_academicos 
   WHERE SYSDATE BETWEEN fecha_inicio AND fecha_fin;
   ```

4. **Permisos:** El docente solo puede:
   - Ver/gestionar alumnos de SUS materias
   - Inscribir alumnos en SUS grupos
   - Asignar notas en SUS materias

---

## 🐛 Troubleshooting

### Error: "ORA-00904: invalid identifier"
**Causa:** Las columnas nota_p1, nota_p2, etc. no existen aún.  
**Solución:** Ejecuta el script `agregar_notas_periodo.sql`

### Error: "El grupo está lleno"
**Causa:** El cupo máximo del grupo fue alcanzado.  
**Solución:** Incrementa el cupo_maximo en la tabla grupos o retira alumnos.

### Error: "No hay periodo académico activo"
**Causa:** No existe un período con fechas que incluyan la fecha actual.  
**Solución:** Inserta o actualiza un período académico:
```sql
INSERT INTO periodos_academicos (id_periodo, nombre, fecha_inicio, fecha_fin, estado)
VALUES (seq_periodos.NEXTVAL, '2024-1', TO_DATE('2024-01-15', 'YYYY-MM-DD'), 
        TO_DATE('2024-05-30', 'YYYY-MM-DD'), 'ACTIVO');
COMMIT;
```

### Error de conexión en el navegador
**Causa:** El servidor Node.js no está ejecutándose.  
**Solución:** Ejecuta `npm start` en la carpeta del proyecto.

---

## 📞 Soporte

Si encuentras algún problema:
1. Revisa los logs del servidor Node.js en la consola
2. Revisa la consola del navegador (F12)
3. Verifica que las columnas existan en la base de datos
4. Asegúrate de estar logueado como DOCENTE

---

## ✅ Checklist Final

- [ ] Script SQL ejecutado exitosamente
- [ ] Columnas nota_p1, nota_p2, nota_p3, nota_p4 existen en tabla inscripciones
- [ ] Constraints de validación agregados
- [ ] Servidor Node.js iniciado (puerto 3000)
- [ ] Login con cuenta de docente exitoso
- [ ] Modal de inscripción se abre correctamente
- [ ] Lista de alumnos disponibles carga
- [ ] Inscripción de alumno funciona
- [ ] Modal de notas se abre correctamente
- [ ] Nota final se calcula automáticamente
- [ ] Guardado de notas funciona
- [ ] Retirar alumno funciona
- [ ] Datos persisten en base de datos

¡Sistema listo para usar! 🎉
