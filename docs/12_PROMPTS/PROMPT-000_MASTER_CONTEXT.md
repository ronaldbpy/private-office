# PROMPT-000 — Contexto Maestro de Private Office

Pegar al inicio de cualquier sesión de IA que trabaje en este proyecto.

## Qué es esto

Private Office es el sistema operativo privado del grupo de Ronald Barrios:
empresas (Axentia EAS, Casa Amelia EAS, RUC personal, y futuras —
constructora, arquitectura, terminación de obras), patrimonio personal,
inversiones, obligaciones y documentos. NO es un ERP. Es una capa de
decisión privada sobre capacidades financieras y contables.

## Reglas de oro (no negociables)

1. Un hecho se registra una sola vez y se referencia — nunca se duplica.
2. Todo objeto económico tiene un dueño (persona, entidad, proyecto).
3. Los registros financieros se corrigen con reversas/ajustes, nunca se
   sobrescriben en silencio.
4. La IA propone; el humano autorizado decide. Ninguna IA cambia registros
   financieros, legales, de propiedad o de pago por sí sola.
5. No inventar certeza tributaria, legal, contable o de vencimientos.
   Si el dato no viene confirmado por el usuario o su contador, se marca
   como "pendiente de confirmar" — nunca se calcula ni se asume.
6. Toda cifra material muestra: período, alcance, moneda y fecha de
   actualización (freshness).

## Decisiones ya tomadas (no volver a discutir sin ADR)

- **Hosting (ADR-003):** sitio web institucional en Bluehost (sin tocar).
  Private Office (app + base de datos) en Render. Vault (documentos) en
  Google Drive con capa de auditoría propia encima.
- **Motor contable (ADR-005):** diferido. Arranca con módulo de Tesorería
  simple propio (FS-006). ERPNext u otro motor formal se evalúa solo cuando
  haya volumen real y equipo administrativo.
- **Identidad/login (ADR-004):** Clerk, modelado con Organizations por
  entidad legal.
- **Roles (FS-005):** Owner (todo), Contador (empresas asignadas, puede
  haber varios), Asistente (empresas asignadas), Gerente Amelia (todo
  Amelia). MFA obligatorio para Owner y Contador.
- **Parties externas (FS-004):** proveedores/clientes/contactos sin acceso
  al sistema; un mismo party puede vincularse a varias empresas; datos
  bancarios son Restricted.
- **Identidad visual (UI-003):** paleta basada en ronaldbarrios.com —
  grafito cálido/crema/oliva/espresso, modo claro y oscuro. Inter para
  interfaz, Cormorant Garamond solo para títulos grandes.
- **Alertas de obligaciones tributarias (FS-017):** 5 días antes del
  vencimiento, agrupadas según lo que cada usuario tiene permitido ver.

## Antes de proponer código o diseño

1. Identificar qué MD/FS/DM/API/SEC controla el tema.
2. Si hay conflicto entre lo pedido y un documento existente: señalarlo
   y proponer un ADR, no elegir en silencio.
3. Nunca acoplar UI o IA directamente a una base de datos o ERP — todo
   pasa por API de dominio (MD-500, MD-700).

## Fecha y hora

Siempre verificar fecha/hora actual antes de calcular vencimientos,
plazos o antigüedad de algo. No asumir la fecha del último dato cargado.

## Change history

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-23 | Creación inicial a partir de sesión de trabajo con el owner. |
