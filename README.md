# Sistema de Alertas de Calibración de Equipos - DVA Ingeniería

## Descripción
Sistema automatizado desarrollado en Google Apps Script para el control 
y seguimiento de vencimientos de calibración de equipos patrón del 
departamento de calificaciones y validaciones de DVA Ingeniería.

## Problema que resolvía
El área manejaba demasiados equipos patrón con diferentes frecuencias 
de calibración. Sin un sistema de alertas, los equipos podían vencer 
sin ser detectados, generando retrasos en los servicios de calificación.

## Funcionalidades
- Registro de equipos con fecha de calibración y frecuencia
- Cálculo automático de 3 niveles de alerta:
  - 🟡 Alerta mínima: 30 días antes del vencimiento
  - 🟠 Alerta intermedia: 7 días antes
  - 🔴 Alerta máxima: 1 día antes
- Envío automático de correos vía Gmail API al equipo
- Formato visual con colores por estado en Google Sheets
- Trigger diario automático configurado entre 2pm - 3pm
- Control de notificaciones para evitar alertas duplicadas

## Stack
- Google Sheets
- Google Apps Script
- Gmail API
- Time-based Triggers

## Estado del equipo
Cada equipo maneja los siguientes estados:
- ✅ Calibrado
- ❌ No calibrado
- 🔄 En proceso
