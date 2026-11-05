// Catálogo de torneos compartido por la página de captura y los administradores.
// id: clave corta que viaja en el mensaje de WhatsApp.
// nombre: debe coincidir con el inicio del "Nombre del torneo" del administrador.
// tipo: 'goles' (goles, puntos o carreras) o 'sets' (voleibol).
window.MCD_TORNEOS = [
  { id: 'futbolv',    nombre: 'Fútbol Soccer Varonil',     carpeta: 'futbol',     archivo: 'data-futbolv.json',    tipo: 'goles', unidad: 'Goles' },
  { id: 'futbolf',    nombre: 'Fútbol Soccer Femenil',     carpeta: 'futbol',     archivo: 'data-futbolf.json',    tipo: 'goles', unidad: 'Goles' },
  { id: 'futbol7v',   nombre: 'Fútbol 7 Varonil',          carpeta: 'futbol',     archivo: 'data-futbol7v.json',   tipo: 'goles', unidad: 'Goles' },
  { id: 'futbol7f',   nombre: 'Fútbol 7 Femenil',          carpeta: 'futbol',     archivo: 'data-futbol7f.json',   tipo: 'goles', unidad: 'Goles' },
  { id: 'basquetv',   nombre: 'Baloncesto 5x5 Varonil',    carpeta: 'basquetbol', archivo: 'data-basquetv.json',   tipo: 'goles', unidad: 'Puntos' },
  { id: 'basquetf',   nombre: 'Baloncesto 5x5 Femenil',    carpeta: 'basquetbol', archivo: 'data-basquetf.json',   tipo: 'goles', unidad: 'Puntos' },
  { id: '3x3v',       nombre: 'Baloncesto 3x3 Varonil',    carpeta: '3x3',        archivo: 'data-3x3v.json',       tipo: 'goles', unidad: 'Puntos' },
  { id: '3x3f',       nombre: 'Baloncesto 3x3 Femenil',    carpeta: '3x3',        archivo: 'data-3x3f.json',       tipo: 'goles', unidad: 'Puntos' },
  { id: 'handballv',  nombre: 'Balonmano Varonil',         carpeta: 'handball',   archivo: 'data-handballv.json',  tipo: 'goles', unidad: 'Goles' },
  { id: 'handballf',  nombre: 'Balonmano Femenil',         carpeta: 'handballf',  archivo: 'data-handballf.json',  tipo: 'goles', unidad: 'Goles' },
  { id: 'beisbol',    nombre: 'Béisbol',                   carpeta: 'beisbol',    archivo: 'data.json',            tipo: 'goles', unidad: 'Carreras' },
  { id: 'softbol',    nombre: 'Softbol',                   carpeta: 'softbol',    archivo: 'data.json',            tipo: 'goles', unidad: 'Carreras' },
  { id: 'voleibolv',  nombre: 'Voleibol de Sala Varonil',  carpeta: 'voleibol',   archivo: 'data-voleibolv.json',  tipo: 'sets',  unidad: 'Sets', sets: [25, 25, 15] },
  { id: 'voleibolf',  nombre: 'Voleibol de Sala Femenil',  carpeta: 'voleibol',   archivo: 'data-voleibolf.json',  tipo: 'sets',  unidad: 'Sets', sets: [25, 25, 15] },
  { id: 'playav',     nombre: 'Voleibol de Playa Varonil', carpeta: 'voleiplaya', archivo: 'data-playav.json',     tipo: 'sets',  unidad: 'Sets', sets: [15, 15, 11] },
  { id: 'playaf',     nombre: 'Voleibol de Playa Femenil', carpeta: 'voleiplaya', archivo: 'data-playaf.json',     tipo: 'sets',  unidad: 'Sets', sets: [15, 15, 11] },
];

window.MCD_FASES = { sf1: 'Semifinal 1', sf2: 'Semifinal 2', final: 'Final', third: 'Tercer lugar' };

// Firma del mensaje: SHA-256 de "PIN|contenido", primeros 8 caracteres.
// El PIN nunca viaja en el mensaje; el administrador lo comprueba con los PIN que tú registras.
window.mcdFirma = async function (pin, contenido) {
  const data = new TextEncoder().encode(String(pin).trim() + '|' + contenido);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 8);
};

// Normaliza texto para comparar nombres (sin acentos, minúsculas, espacios simples).
window.mcdNorm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

// Equipos de la eliminatoria según lo cargado en los datos (sin calcular desde la tabla).
window.mcdEquiposKO = function (data, key) {
  const k = (data.knockout || {})[key] || {};
  const st = data.semifinalTeams || {};
  let home = k.homeName || k.home || '';
  let away = k.awayName || k.away || '';
  if (key === 'sf1') { home = home || st.sf1Home || ''; away = away || st.sf1Away || ''; }
  if (key === 'sf2') { home = home || st.sf2Home || ''; away = away || st.sf2Away || ''; }
  if (key === 'final' || key === 'third') {
    const ko = data.knockout || {};
    const lado = sf => {
      const m = ko[sf] || {};
      const h = mcdEquiposKO(data, sf);
      if (!m.winner || !h.home || !h.away) return '';
      if (key === 'final') return m.winner;
      return mcdNorm(m.winner) === mcdNorm(h.home) ? h.away : h.home;
    };
    home = home || lado('sf1');
    away = away || lado('sf2');
  }
  return { home, away };
};
