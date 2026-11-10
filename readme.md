# 🏆 Plataforma de Torneos Deportivos - Muestra Deportiva

Plataforma web unificada para gestionar y visualizar torneos multideportivos estudiantiles.

## 🎯 Características Principales

- **Sistema Multi-deporte**: Fútbol, Basquetbol, Voleibol, Handball, Beisbol, Softbol
- **Separación por disciplinas**: Cada deporte con su sistema especializado
- **Doble interfaz**: Panel de administración + Vista pública
- **Diseño responsive**: Optimizado para desktop y móvil
- **Tiempo real**: Resultados actualizados automáticamente
- **Gestión independiente**: Cada torneo funciona de forma autónoma

## 🚀 Uso Rápido

### Portal Principal
Accede al [portal principal](index.html) para ver todos los deportes disponibles.

### Para Administradores
1. **Beisbol**: [`beisbol/admin.html`](beisbol/admin.html)
2. **Softbol**: [`softbol/admin.html`](softbol/admin.html)
3. **Fútbol**: [`futbol/admin.html`](futbol/admin.html)
4. **Basquetbol**: [`basquetbol/admin.html`](basquetbol/admin.html)
5. **Voleibol**: [`voleibol/admin.html`](voleibol/admin.html)
6. **Handball Varonil**: [`handball/admin.html`](handball/admin.html)
7. **Handball Femenil**: [`handballf/admin.html`](handballf/admin.html)

### Para Público General
1. **Beisbol**: [`beisbol/index.html`](beisbol/index.html)
2. **Softbol**: [`softbol/index.html`](softbol/index.html)
3. **Fútbol**: [`futbol/index.html`](futbol/index.html)
4. **Basquetbol**: [`basquetbol/index.html`](basquetbol/index.html)
5. **Voleibol**: [`voleibol/index.html`](voleibol/index.html)
6. **Handball Varonil**: [`handball/index.html`](handball/index.html)
7. **Handball Femenil**: [`handballf/index.html`](handballf/index.html)

## 📁 Estructura del Proyecto

```
muestra-deportiva-2025/
│
├── index.html                      # Portal principal multideportivo
├── readme.md                       # Documentación
│
├── beisbol/                        # Sistema de torneos de béisbol
│   ├── admin.html                  # Panel de administración
│   ├── index.html                  # Vista pública
│   └── data.json                   # Datos del torneo (generado)
│
├── softbol/                        # Sistema de torneos de softbol
│   ├── admin.html                  # Panel de administración
│   ├── index.html                  # Vista pública
│   └── data.json                   # Datos del torneo (generado)
│
├── futbol/                         # Sistema de torneos de fútbol
│   ├── admin.html                  # Panel de administración
│   ├── index.html                  # Vista pública
│   └── data.json                   # Datos del torneo (generado)
│
├── basquetbol/                     # Sistema de torneos de basquetbol
│   ├── admin.html                  # Panel de administración
│   ├── index.html                  # Vista pública
│   └── data.json                   # Datos del torneo (generado)
│
├── voleibol/                       # Sistema de torneos de voleibol
│   ├── admin.html                  # Panel de administración
│   ├── index.html                  # Vista pública
│   └── data.json                   # Datos del torneo (generado)
│
├── handball/                       # Sistema de handball varonil
│   ├── admin.html                  # Panel de administración
│   ├── index.html                  # Vista pública
│   └── data.json                   # Datos del torneo (generado)
│
└── handballf/                      # Sistema de handball femenil
    ├── admin.html                  # Panel de administración
    ├── index.html                  # Vista pública
    └── data.json                   # Datos del torneo (generado)
```

## 🛠️ Formatos (edición 2026, según el programa de torneos)

| Carpeta | Disciplina | Grupos | Semifinales |
|---|---|---|---|
| `futbol/` | Fútbol soccer y Fútbol 7 (V/F) | 4 grupos de 3 | 1.º A vs 1.º B · 1.º C vs 1.º D |
| `basquetbol/` | Baloncesto 5x5 (V/F) | 4 grupos de 3 | 1.º A vs 1.º B · 1.º C vs 1.º D |
| `3x3/` | Baloncesto 3x3 (V/F) | 4 grupos de 2 o 3 | 1.º A vs 1.º B · 1.º C vs 1.º D |
| `handball/` | Balonmano varonil | 4 grupos de 1 a 3 | 1.º A vs 1.º B · 1.º C vs 1.º D |
| `handballf/` | Balonmano femenil | 2 grupos de 3 o 4 | 1.º A vs 2.º B · 1.º B vs 2.º A |
| `beisbol/` | Béisbol | 2 grupos de 3 o 4 | 1.º A vs 2.º B · 1.º B vs 2.º A |
| `softbol/` | Softbol | 2 grupos de 3 o 4 | 1.º A vs 2.º B · 1.º B vs 2.º A |
| `voleiplaya/` | Voleibol de playa (V/F) | 2 grupos de 3 o 4 | 1.º A vs 2.º B · 1.º B vs 2.º A |
| `voleibol/` | Voleibol de sala (V/F) | A: 3, B: 3, C: 4 | Tres primeros + mejor 2.º (ver abajo) |

**Voleibol de sala, mejor 2.º:** se compara puntos de clasificación por partido jugado, luego cociente de sets y luego cociente de puntos. Si el mejor 2.º es de A o B: SF1 1.º A vs 1.º B y SF2 1.º C vs mejor 2.º. Si es de C: SF1 1.º A vs 2.º C y SF2 1.º B vs 1.º C (evita revancha del mismo grupo).

Cada página pública toma su archivo de datos con `?t=archivo.json` (por ejemplo `futbol/index.html?t=data-futbolv.json`); béisbol y softbol usan `data.json`.

## 🔗 Archivos de datos y enlaces públicos (2026)

| Torneo | Archivo | Página pública |
|---|---|---|
| Fútbol Soccer Varonil | `futbol/data-futbolv.json` | `futbol/index.html?t=data-futbolv.json` |
| Fútbol Soccer Femenil | `futbol/data-futbolf.json` | `futbol/index.html?t=data-futbolf.json` |
| Fútbol 7 Varonil | `futbol/data-futbol7v.json` | `futbol/index.html?t=data-futbol7v.json` |
| Fútbol 7 Femenil | `futbol/data-futbol7f.json` | `futbol/index.html?t=data-futbol7f.json` |
| Baloncesto 5x5 Varonil | `basquetbol/data-basquetv.json` | `basquetbol/index.html?t=data-basquetv.json` |
| Baloncesto 5x5 Femenil | `basquetbol/data-basquetf.json` | `basquetbol/index.html?t=data-basquetf.json` |
| Baloncesto 3x3 Varonil | `3x3/data-3x3v.json` | `3x3/index.html?t=data-3x3v.json` |
| Baloncesto 3x3 Femenil | `3x3/data-3x3f.json` | `3x3/index.html?t=data-3x3f.json` |
| Balonmano Varonil | `handball/data-handballv.json` | `handball/index.html?t=data-handballv.json` |
| Balonmano Femenil | `handballf/data-handballf.json` | `handballf/index.html?t=data-handballf.json` |
| Béisbol | `beisbol/data.json` | `beisbol/index.html` |
| Softbol | `softbol/data.json` | `softbol/index.html` |
| Voleibol de Sala Varonil | `voleibol/data-voleibolv.json` | `voleibol/index.html?t=data-voleibolv.json` |
| Voleibol de Sala Femenil | `voleibol/data-voleibolf.json` | `voleibol/index.html?t=data-voleibolf.json` |
| Voleibol de Playa Varonil | `voleiplaya/data-playav.json` | `voleiplaya/index.html?t=data-playav.json` |
| Voleibol de Playa Femenil | `voleiplaya/data-playaf.json` | `voleiplaya/index.html?t=data-playaf.json` |

| Animación (Porra y Baile) | orden fijo en `animacion/index.html` | `animacion/` |

Al publicar desde un administrador se descarga un archivo con otro nombre: renómbralo como en la tabla antes de subirlo.
Las mascotas están en `mascotas/` (PL-26.webp, CE-15.webp…); en los datos se indican como `"image": "../mascotas/PL-26.webp"` dentro de `teamProfiles`.

## 📲 Captura de resultados por comisionados

- **Comisionados:** abren `captura/index.html`, eligen disciplina y partido, capturan el marcador, escriben su nombre y PIN y envían el mensaje por WhatsApp.
- **Coordinador:** en cualquier administrador, sección **"Pegar resultados de WhatsApp"**, pega los mensajes, revisa y aplica. Luego publica como siempre.
- **PIN:** se registran en **⚙️ Comisionados y PIN** dentro de un administrador. Se guardan solo en ese navegador (sirven para todos los administradores de la misma computadora) y nunca se publican. Cada mensaje lleva una firma calculada con el PIN; si el PIN no es de un comisionado registrado o alguien modifica la línea `#MCD1`, el administrador lo rechaza.
- Para que el botón de WhatsApp abra directo tu chat, escribe tu número en `WHATSAPP_COORDINADOR` al inicio del script de `captura/index.html` (formato `52` + 10 dígitos, sin + ni espacios).
- La lista de torneos que usan la captura y el panel está en `comun/torneos.js`.

## 📋 Instrucciones de Uso

### Para Administradores
1. **Accede** al panel de administración del deporte correspondiente
2. **Configura** los equipos por grupo
3. **Genera** el calendario de partidos automáticamente
4. **Registra** resultados, horarios y lugares
5. **Publica** los datos para que se actualice la vista pública

### Para Espectadores
1. **Visita** la vista pública del deporte deseado
2. **Consulta** grupos, resultados y tablas de posiciones
3. **Sigue** la fase eliminatoria en tiempo real

## 🔧 Personalización

Cada sistema deportivo incluye:
- **Temas de colores** personalizables
- **Nombre del torneo** editable
- **Criterios específicos** por deporte
- **Horarios y lugares** configurables

## 🌐 Despliegue

### GitHub Pages
1. Sube todos los archivos al repositorio
2. Activa GitHub Pages en la configuración
3. Los torneos estarán disponibles en: `https://[usuario].github.io/[repositorio]`

### Servidor Web Tradicional
1. Sube los archivos a cualquier servidor web
2. Asegúrate de que todos los archivos mantengan la estructura de carpetas
3. Accede a `index.html` desde el navegador

## 📞 Soporte

- **Documentación**: Consulta este archivo README
- **Problemas técnicos**: Verifica la consola del navegador (F12)
- **Sugerencias**: Contacta al equipo de desarrollo

---

**Desarrollado para la Muestra Deportiva 2025**  
*Sistema unificado de gestión de torneos multideportivos*