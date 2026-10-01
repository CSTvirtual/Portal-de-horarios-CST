# Portal institucional de horarios · Colegio San Tarsicio

Sitio estático para GitHub Pages con tres páginas independientes: Preescolar, Primaria y Bachillerato.

## Estructura

```text
/
├── index.html
├── preescolar.html
├── primaria.html
├── bachillerato.html
├── css/styles.css
├── js/utils.js
├── js/app.js
├── datos/config.js
├── datos/profesores.js
├── datos/preescolar.js
├── datos/primaria.js
├── datos/bachillerato.js
└── img/
    ├── escudo-san-tarsicio.jpg
    └── efqm.png
```


## Reglas conservadas
- Nicolás Bedoya no trabaja los lunes y su jornada es 7:30–14:00 de martes a viernes.
- R&W/Reading and writing de Primaria se maneja con las asignaciones ya consolidadas en el horario.
- Los grupos de Inglés de Primaria con tres docentes mantienen las tres profesoras simultáneas.
- Trabajo manual, Integración y Actividad dirigida de Preescolar se asignan a las directoras cuando la información está disponible.
- La disponibilidad consulta las tres secciones para detectar profesores compartidos.
- Cuando un bloque de Bachillerato puede corresponder a más de un profesor según el listado actualizado, se muestra como “Por confirmar” en vez de escoger uno arbitrariamente.

## GitHub Pages
Settings → Pages → Deploy from a branch → `main` → `/ (root)`.

No requiere Node, npm, base de datos, servidor ni librerías externas.


## Correcciones v6.1

- Bachillerato: **Sistemas de Noveno** corresponde a **Ma Clara Velásquez**.
- Primaria, Reading & Writing de Quinto:
  - **Lunes:** Viviana Montaño.
  - **Martes:** Patricia Reyes.
- En Inglés, que aparezcan varios profesores para un mismo curso puede ser correcto:
  el grupo puede dividirse y los docentes trabajan simultáneamente. La interfaz admite
  varios nombres en una misma clase. Cuando la composición exacta del equipo no puede
  determinarse de forma inequívoca con los datos disponibles, se conserva el estado
  `Por confirmar` en lugar de escoger un docente arbitrariamente.


## Mantenimiento desde GitHub

Los botones públicos de edición fueron eliminados del portal.

Los coordinadores y visitantes solo usan el sitio para consultar información. Los cambios se hacen entrando directamente al repositorio de GitHub con una cuenta que tenga permisos de escritura.

Archivos principales para mantenimiento:

- `datos/profesores.js`: nombres, asignaturas, cursos y jornadas.
- `datos/preescolar.js`: horario de Preescolar.
- `datos/primaria.js`: horario de Primaria.
- `datos/bachillerato.js`: horario de Bachillerato.

Una persona que visite el portal público no puede modificar estos archivos desde la página.


## Versión 6.3 — Coberturas por ausencia

Cada sección incluye una cuarta consulta: **Coberturas por ausencia**.

Funcionamiento:

- Selecciona un docente y uno o varios días.
- El portal identifica todas las clases exactas que ese docente debía dictar en esos días, incluso si trabaja en más de una sección.
- Para cada clase descarta automáticamente docentes:
  - en clase,
  - con asignación por confirmar,
  - fuera de jornada,
  - o que no estén libres durante todo el bloque.
- Los candidatos se clasifican como:
  - **Reemplazo recomendado**: misma asignatura o área relacionada.
  - **Reemplazo posible**: docente de la misma sección.
  - **Cobertura alternativa**: cualquier otro docente completamente disponible.
- La prioridad considera:
  - compatibilidad con la asignatura,
  - pertenencia a la sección,
  - bloques libres restantes ese día,
  - disponibilidad semanal,
  - y coberturas que ya fueron sugeridas dentro del mismo plan.
- Un docente con un único bloque libre sigue siendo elegible, pero baja de prioridad cuando hay alternativas con mayor margen.
- No existe ninguna penalización fija por nombre de profesor.

### Regla especial de Inglés en Primaria

Las clases de Inglés de Primaria se dividen en tres subgrupos con tres docentes simultáneos.
Si falta uno de los tres, **no se genera reemplazo**: los otros dos docentes absorben el grupo.
La herramienta muestra los nombres de los dos docentes presentes.

La herramienta es una simulación y no modifica los horarios guardados.
