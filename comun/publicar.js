// Ajustes comunes al botón "Publicar" de los administradores (Muestra Deportiva 2026).
// 1) El archivo descargado lleva el nombre que espera el sitio (data-futbolv.json, data-playaf.json, …)
//    según el torneo cargado, en lugar del genérico data.json.
// 2) Si ya terminó la fase de grupos, el JSON publicado incluye los nombres de los equipos que el
//    administrador muestra en la llave (semifinales; final y tercer lugar cuando ya hay ganadores).
//    Solo se publican nombres de equipos reales y solo en campos vacíos: los nombres escritos a mano
//    se respetan. El estado del administrador no se modifica, así que si se corrige un resultado de
//    grupos, los cruces se recalculan.
// Requiere: comun/torneos.js y las variables globales `state` (y opcionalmente `saveState`, `updateKnockout`).
(function () {
  const N = window.mcdNorm || (s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim());
  const carpeta = location.pathname.split('/').filter(Boolean).slice(-2, -1)[0] || '';
  const LLAVE = [['sf1', 'sf1h', 'sf1a'], ['sf2', 'sf2h', 'sf2a'], ['final', 'fih', 'fia'], ['third', 'thirdh', 'thirda']];

  function torneoCargado() {
    if (typeof state === 'undefined' || !state) return null;
    const nombre = N(state.tournamentName);
    const cands = (window.MCD_TORNEOS || []).filter(t => t.carpeta === carpeta);
    return cands.find(t => nombre.startsWith(N(t.nombre))) || (cands.length === 1 ? cands[0] : null);
  }

  function hayResultado(m) {
    if (!m) return false;
    if (Array.isArray(m.sets)) {
      let h = 0, a = 0;
      m.sets.forEach(s => {
        if (!s || s.home === '' || s.home == null || s.away === '' || s.away == null) return;
        if (+s.home > +s.away) h++; else if (+s.away > +s.home) a++;
      });
      return h !== a;
    }
    const ok = v => v !== null && v !== undefined && v !== '' && !isNaN(v);
    return ok(m.gh) && ok(m.ga);
  }

  function gruposCompletos() {
    const gs = Object.values((state && state.groups) || {}).filter(g => g && (g.teams || []).length);
    return gs.length > 0 && gs.every(g => (g.matches || []).length && g.matches.every(hayResultado));
  }

  // Copia temporal de los nombres de la llave a state.knockout; devuelve una función que deshace el cambio.
  function completarLlave() {
    if (typeof state === 'undefined' || !state || !state.knockout || !gruposCompletos()) return null;
    try { if (typeof updateKnockout === 'function') updateKnockout(); } catch (e) {}
    const equipos = new Set();
    Object.values(state.groups || {}).forEach(g => (g.teams || []).forEach(t => equipos.add(t)));
    const antes = [];
    LLAVE.forEach(([clave, idH, idA]) => {
      const k = state.knockout[clave];
      if (!k) return;
      [['home', idH], ['away', idA]].forEach(([lado, id]) => {
        const el = document.getElementById(id);
        const t = el && el.dataset ? el.dataset.team : '';
        if (!k[lado] && t && equipos.has(t)) { antes.push([k, lado, k[lado]]); k[lado] = t; }
      });
    });
    if (!antes.length) return null;
    return () => {
      antes.forEach(([k, lado, v]) => { k[lado] = v; });
      try { if (typeof saveState === 'function') saveState(); } catch (e) {}
      try { if (typeof updateKnockout === 'function') updateKnockout(); } catch (e) {}
    };
  }

  // Nombre correcto del archivo mientras se procesa el clic en "Publicar"
  let publicando = false;
  const clickOriginal = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (publicando && this.download && /\.json$/i.test(this.download)) {
      const t = torneoCargado();
      if (t && t.archivo) this.download = t.archivo;
    }
    return clickOriginal.apply(this, arguments);
  };

  document.addEventListener('click', ev => {
    const btn = ev.target && ev.target.closest ? ev.target.closest('#btnPublish') : null;
    if (!btn) return;
    publicando = true;
    let deshacer = null;
    try { deshacer = completarLlave(); } catch (e) { deshacer = null; }
    // Los administradores generan el archivo de forma síncrona dentro del clic
    setTimeout(() => { publicando = false; if (deshacer) deshacer(); }, 0);
  }, true);
})();
