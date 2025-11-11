cd C:\Users\kathy\Documents\TechnoAcademy-University
actualizar_db_notas.bat

@echo off
echo ================================================
echo ACTUALIZACION BASE DE DATOS - NOTAS POR PERIODO
echo ================================================
echo.
echo Este script agregara las columnas para notas por periodo
echo (nota_p1, nota_p2, nota_p3, nota_p4) a la tabla inscripciones.
echo.
echo Presiona CTRL+C para cancelar o
pause

echo.
echo Conectando a Oracle...
echo.

sqlplus system/Kathya.p03@localhost:1521/XE @"%~dp0database\agregar_notas_periodo.sql"

echo.
echo ================================================
echo PROCESO COMPLETADO
echo ================================================
echo.
echo Si viste el mensaje "Columnas de notas por periodo agregadas exitosamente"
echo entonces la actualizacion fue exitosa.
echo.
echo Ahora puedes iniciar el servidor con: npm start
echo.
pause
