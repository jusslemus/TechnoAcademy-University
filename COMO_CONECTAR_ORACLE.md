# 🔧 CÓMO CONECTAR CORRECTAMENTE A ORACLE

## ❌ PROBLEMA ACTUAL

```
Service "SISTEMA_REGISTRO" is not registered with the listener
```

Esto significa que el nombre de la base de datos en tu Oracle es diferente.

---

## ✅ SOLUCIÓN: Encuentra el nombre correcto de tu BD

### Opción 1: Desde SQL Developer

1. Abre **SQL Developer**
2. Mira la conexión que usaste para ejecutar SCHEMA.sql
3. En el nombre de la conexión, verás el SID/SERVICE_NAME
4. Generalmente es: **ORCL** o **XE**

### Opción 2: Desde SQL*Plus

1. Abre **SQL*Plus**
2. Usa `SHOW PARAMETER db_name;` para ver el nombre

### Opción 3: Desde tnsnames.ora

1. Ve a: `C:\Oracle\product\21c\homes\home1\network\admin\` (o similar)
2. Abre el archivo `tnsnames.ora`
3. Busca el nombre del servicio (por ejemplo: `ORCL`, `XE`, `ORCL21C`)

---

## 📝 CAMBIAR EL .env

Una vez que encontraste el nombre correcto, actualiza el `.env`:

```properties
DB_USER=system
DB_PASSWORD=123
DB_CONNECT_STRING=localhost:1521/ORCL
```

Donde `ORCL` debe reemplazarse con el nombre real de tu BD.

---

## 🔍 NOMBRES COMUNES DE ORACLE

- **ORCL** - Oracle Database (default)
- **XE** - Oracle Express Edition
- **ORCL21C** - Oracle 21c
- **SISTEMA_REGISTRO** - Si creaste esta BD específicamente

---

## ✅ DESPUÉS DE CAMBIAR

1. Guarda el `.env`
2. En PowerShell, presiona **CTRL+C** para detener el servidor
3. Ejecuta de nuevo:
   ```powershell
   npm start
   ```

---

## 🎯 VERIFICAR LA CONEXIÓN

Si quieres verificar antes que la conexión funciona, ejecuta en SQL Developer:

```sql
SELECT name FROM v$database;
```

El resultado es el nombre que debes usar en el `.env`.

---

**¿Encontraste el nombre correcto? Cuéntame** 👇
