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

## Editar directamente desde GitHub

1. Sube toda la carpeta a la raíz del repositorio.
2. Si publicas con la URL estándar de GitHub Pages (`usuario.github.io/repositorio`), el portal detecta automáticamente el repositorio y no necesitas configurar nada.
3. Si usas un dominio personalizado, abre `datos/config.js` y cambia:

```js
githubRepoUrl: ""
```

por la URL de tu repositorio, por ejemplo:

```js
githubRepoUrl: "https://github.com/usuario/portal-horarios"
```

4. Haz Commit. Desde ese momento los botones “Editar datos” del portal abrirán el archivo correcto en el editor de GitHub.

### Cambio de nombre, jornada o asignatura
Edita `datos/profesores.js`.

### Cambio de una clase
Edita el archivo de la sección correspondiente: `preescolar.js`, `primaria.js` o `bachillerato.js`.

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
