---
name: UMA Safe Deploy
description: Instrucciones estrictas de seguridad técnica, git y validación antes de commits, push o despliegues.
---

# UMA Safe Deploy

- **Trigger:** Activarse antes de commits, push, deploy, cambios de datos o cambios estructurales.
- **Autorización:** No hacer deploy sin autorización explícita.
- **Checklist de Compilación:** Antes de commit ejecutar cuando aplique:
  - `npx tsc --noEmit`
  - `npm run lint`
  - `npm run build`
- **Control de Versiones:** Revisar `git status` antes y después. Hacer commits pequeños, descriptivos y revisables.
- **Limpieza:** No subir `.env`, secretos, backups, scratch, reportes temporales ni archivos innecesarios.
- **Aislamiento de Cambios:** No tocar admin, auth, db, datos o importación si la tarea es solo visual. No mezclar rediseño, datos, admin y deploy en un mismo cambio salvo autorización.
- **Confirmación Final:** Confirmar rama, remoto y estado de Vercel antes de push/deploy.
- **Manejo de Errores:** Si algo falla, detenerse y reportar antes de intentar correcciones grandes.
