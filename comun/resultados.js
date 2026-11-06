// Panel "Pegar resultados de WhatsApp" para los administradores.
// Lee las líneas #MCD1|… que genera captura/index.html, verifica el PIN y carga los marcadores en el estado.
// Requiere: comun/torneos.js y las variables globales `state` y `saveState` del administrador.
(function () {
  if (document.readyState !== 'complete') { window.addEventListener('load', () => setTimeout(iniciar, 0)); } else { iniciar(); }
  function iniciar() {
  const T = window.MCD_TORNEOS || [];
  const N = window.mcdNorm;
  const KEY_PINES = 'mcd_pines';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const carpeta = location.pathname.split('/').filter(Boolean).slice(-2, -1)[0] || '';

  // ---------- Estilos y panel ----------
  const css = `
  .mcd-card{border:2px solid #1fa855;border-radius:12px;padding:8px 14px;margin:0 0 12px;background:#f3fbf6;color:#16302a;font-family:inherit}
  .mcd-sum{cursor:pointer;font-weight:800;font-size:15px;padding:4px 0;list-style-position:inside}
  #mcdBox[open] .mcd-sum{margin-bottom:6px}
  .mcd-card p{margin:4px 0 8px;font-size:13.5px;color:#43594f}
  .mcd-card textarea{width:100%;min-height:80px;font:13px/1.35 ui-monospace,Consolas,monospace;padding:8px;border:1px solid #b9cfc1;border-radius:8px;box-sizing:border-box}
  .mcd-btn{border:0;border-radius:8px;padding:9px 14px;font-weight:700;cursor:pointer;margin:8px 6px 0 0;background:#08713d;color:#fff}
  .mcd-btn.sec{background:#fff;color:#08713d;border:1px solid #9fc3ad}
  .mcd-tab{width:100%;border-collapse:collapse;margin-top:10px;font-size:13px;background:#fff}
  .mcd-tab th,.mcd-tab td{border:1px solid #d6e3da;padding:6px 8px;text-align:left;vertical-align:top}
  .mcd-tab th{background:#e8f3ec}
  .mcd-ok{color:#05512b;font-weight:700}.mcd-warn{color:#9a6700;font-weight:700}.mcd-err{color:#b42318;font-weight:700}.mcd-mute{color:#6b7c74}
  .mcd-pines td input{width:100%;box-sizing:border-box;padding:5px;border:1px solid #b9cfc1;border-radius:6px}
  .mcd-tor{display:inline-block;background:#fff;border:1px solid #9fc3ad;border-radius:999px;padding:3px 10px;font-size:13px;font-weight:700}
  details.mcd-det{margin-top:12px;background:#fff;border:1px solid #d6e3da;border-radius:8px;padding:8px 10px}
  details.mcd-det summary{cursor:pointer;font-weight:700}
  .mcd-flash{background:#e8f3ec;border-left:4px solid #08713d;padding:8px 10px;margin:8px 0;font-size:13.5px}`;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  const card = document.createElement('section');
  card.className = 'mcd-card';
  card.innerHTML = `
    <div id="mcdFlash"></div>
    <details id="mcdBox"><summary class="mcd-sum">📲 Pegar resultados de WhatsApp <span class="mcd-mute" style="font-weight:400">· clic para abrir o cerrar</span></summary>
    <p>Copia los mensajes que te enviaron los comisionados (uno o varios) y pégalos aquí. Solo se usan las líneas que empiezan con <b>#MCD1</b>.</p>
    <div>Torneo cargado en este administrador: <span class="mcd-tor" id="mcdTorneo"></span></div>
    <textarea id="mcdTexto" placeholder="Pega aquí los mensajes…"></textarea>
    <div><button class="mcd-btn" id="mcdRevisar" type="button">Revisar</button><button class="mcd-btn sec" id="mcdLimpiar" type="button">Limpiar</button></div>
    <div id="mcdRes"></div>
    <details class="mcd-det"><summary>⚙️ Comisionados y PIN</summary>
      <p>Los PIN se guardan solo en este navegador (sirven para todos los administradores de esta computadora) y nunca se publican. Dale a cada comisionado su PIN de 4 a 8 dígitos.</p>
      <table class="mcd-tab mcd-pines"><thead><tr><th>Comisionado</th><th>PIN</th><th></th></tr></thead><tbody id="mcdPines"></tbody></table>
      <button class="mcd-btn sec" id="mcdAgregar" type="button">+ Agregar comisionado</button>
      <button class="mcd-btn" id="mcdGuardarPines" type="button">Guardar PIN</button>
    </details>
    </details>`;
  const cont = document.querySelector('.container') || document.body;
  const ancla = cont.querySelector('header, h1');
  if (ancla && ancla.parentElement === cont) ancla.insertAdjacentElement('afterend', card);
  else cont.insertBefore(card, cont.firstChild);
  const $ = id => document.getElementById(id);
  try { if (localStorage.getItem('mcd_panel_abierto') === '1') $('mcdBox').open = true; } catch (e) {}
  $('mcdBox').addEventListener('toggle', () => { try { localStorage.setItem('mcd_panel_abierto', $('mcdBox').open ? '1' : '0'); } catch (e) {} });

  // ---------- Torneo actual ----------
  function torneoActual() {
    const nombre = N(state && state.tournamentName);
    const candidatos = T.filter(t => !carpeta || t.carpeta === carpeta);
    return candidatos.find(t => nombre.startsWith(N(t.nombre))) || (candidatos.length === 1 ? candidatos[0] : null);
  }
  function pintarTorneo() {
    const t = torneoActual();
    $('mcdTorneo').textContent = t ? t.nombre : `No identificado (“${(state && state.tournamentName) || 'sin nombre'}”). Importa el archivo del torneo.`;
  }
  pintarTorneo();

  // ---------- PIN ----------
  const leerPines = () => { try { return JSON.parse(localStorage.getItem(KEY_PINES) || '[]'); } catch (e) { return []; } };
  function pintarPines(lista) {
    const filas = (lista.length ? lista : [{ nombre: '', pin: '' }]);
    $('mcdPines').innerHTML = filas.map(p => `<tr><td><input class="mcdN" value="${esc(p.nombre)}" placeholder="Nombre"></td><td><input class="mcdP" value="${esc(p.pin)}" inputmode="numeric" placeholder="PIN"></td><td><button class="mcd-btn sec mcdDel" type="button" style="margin:0">✕</button></td></tr>`).join('');
  }
  pintarPines(leerPines());
  $('mcdAgregar').onclick = () => { const l = recogerPines(); l.push({ nombre: '', pin: '' }); pintarPines(l); };
  $('mcdPines').addEventListener('click', e => { if (e.target.classList.contains('mcdDel')) { e.target.closest('tr').remove(); } });
  function recogerPines() {
    return [...$('mcdPines').querySelectorAll('tr')].map(tr => ({ nombre: tr.querySelector('.mcdN').value.trim(), pin: tr.querySelector('.mcdP').value.trim() }));
  }
  $('mcdGuardarPines').onclick = () => {
    const l = recogerPines().filter(p => p.nombre || p.pin);
    const malos = l.filter(p => !/^\d{4,8}$/.test(p.pin) || !p.nombre);
    if (malos.length) { alert('Cada comisionado necesita nombre y un PIN de 4 a 8 dígitos.'); return; }
    const rep = l.map(p => p.pin).filter((p, i, a) => a.indexOf(p) !== i);
    if (rep.length) { alert('Hay PIN repetidos. Cada comisionado debe tener uno distinto.'); return; }
    localStorage.setItem(KEY_PINES, JSON.stringify(l)); pintarPines(l); alert('PIN guardados (' + l.length + ').');
  };

  // ---------- Revisar ----------
  let propuestas = [];

  function nombresKO(key) {
    const k = state.knockout[key] || {};
    const st = state.semifinalTeams || {};
    let home = k.homeName || k.home || '', away = k.awayName || k.away || '';
    if (key === 'sf1') { home = home || st.sf1Home || ''; away = away || st.sf1Away || ''; }
    if (key === 'sf2') { home = home || st.sf2Home || ''; away = away || st.sf2Away || ''; }
    // Para final y tercero se aceptan los nombres que trae el mensaje (el administrador los deriva de las semifinales)
    return { home, away };
  }
  function orientacion(grupo, a, b) {
    // Orientación local/visita que usa el propio administrador al generar el rol
    const teams = (state.groups[grupo] || {}).teams || [];
    let pares = [];
    try {
      if (teams.length === 4 && typeof roundRobin4 === 'function') pares = roundRobin4(teams);
      else if (typeof roundRobin3 === 'function') pares = roundRobin3(teams) || [];
    } catch (e) {}
    if (!pares.length && teams.length === 2) pares = [[teams[0], teams[1]]];
    const p = pares.find(([h, v]) => (N(h) === N(a) && N(v) === N(b)) || (N(h) === N(b) && N(v) === N(a)));
    return p ? { home: p[0], away: p[1] } : null;
  }
  const textoMarcador = (t, m, swap) => {
    if (!m) return '';
    if (t.tipo === 'sets') return (m.sets || []).map(s => swap ? `${s.away}-${s.home}` : `${s.home}-${s.away}`).join(', ');
    if (!Number.isFinite(m.gh) || !Number.isFinite(m.ga)) return '';
    return swap ? `${m.ga}-${m.gh}` : `${m.gh}-${m.ga}`;
  };

  $('mcdRevisar').onclick = async () => {
    const tor = torneoActual();
    const pines = leerPines();
    const lineas = $('mcdTexto').value.split(/\r?\n/).map(l => l.trim()).filter(l => /^#MCD1\|/.test(l));
    propuestas = [];
    if (!lineas.length) { $('mcdRes').innerHTML = '<p class="mcd-err">No encontré líneas #MCD1 en lo que pegaste.</p>'; return; }
    for (const linea of lineas) {
      const partes = linea.slice(1).split('|');
      const p = { linea, estado: 'err', motivo: '', marcar: false };
      propuestas.push(p);
      if (partes.length !== 8) { p.motivo = 'Línea incompleta o modificada.'; continue; }
      const [, id, fase, home, away, marcador, ganador, firma] = partes;
      Object.assign(p, { id, fase, home, away, marcador, ganador: ganador === '-' ? '' : ganador, firma });
      const contenido = partes.slice(0, 7).join('|');
      let quien = null;
      for (const c of pines) { if (await mcdFirma(c.pin, contenido) === firma) { quien = c.nombre; break; } }
      p.comisionado = quien;
      const tMsg = T.find(t => t.id === id);
      p.torneoMsg = tMsg ? tMsg.nombre : id;
      if (!pines.length) { p.motivo = 'Primero registra los PIN de tus comisionados (⚙️ abajo).'; continue; }
      if (!quien) { p.motivo = 'PIN no válido: el mensaje no corresponde a ningún comisionado registrado o fue modificado.'; continue; }
      if (!tor) { p.motivo = 'No identifico el torneo cargado en este administrador.'; continue; }
      if (id !== tor.id) { p.motivo = `Es de ${p.torneoMsg}; aquí tienes cargado ${tor.nombre}.`; continue; }
      // Marcador
      let nuevo;
      if (tor.tipo === 'sets') {
        const sets = marcador.split(',').map(s => s.split('-').map(Number));
        if (!sets.length || sets.some(s => s.length !== 2 || s.some(x => !Number.isFinite(x)))) { p.motivo = 'Marcador de sets ilegible.'; continue; }
        nuevo = { sets: sets.map(([h, a]) => ({ home: h, away: a })) };
      } else {
        const [h, a] = marcador.split('-').map(Number);
        if (!Number.isFinite(h) || !Number.isFinite(a)) { p.motivo = 'Marcador ilegible.'; continue; }
        nuevo = { gh: h, ga: a };
      }
      // Partido
      const [tipoFase, clave] = fase.split(':');
      if (tipoFase === 'G') {
        const g = state.groups[clave];
        if (!g) { p.motivo = `El grupo ${clave} no existe aquí.`; continue; }
        let m = (g.matches || []).find(x => (N(x.home) === N(home) && N(x.away) === N(away)) || (N(x.home) === N(away) && N(x.away) === N(home)));
        let crear = null;
        if (!m) {
          const o = orientacion(clave, home, away);
          if (!o) { p.motivo = `No encontré ${home} vs ${away} en el Grupo ${clave}.`; continue; }
          crear = o;
        }
        const ref = m || crear;
        p.swap = N(ref.home) !== N(home);
        p.destino = { tipo: 'G', grupo: clave, crear };
        p.titulo = `Grupo ${clave}`;
        p.previo = textoMarcador(tor, m, p.swap);
      } else if (tipoFase === 'KO' && MCD_FASES[clave]) {
        const nk = nombresKO(clave);
        if ((nk.home || nk.away) && !((N(nk.home) === N(home) && N(nk.away) === N(away)) || (N(nk.home) === N(away) && N(nk.away) === N(home)))) {
          p.motivo = `${MCD_FASES[clave]}: aquí está cargada como ${nk.home || '?'} vs ${nk.away || '?'}.`; continue;
        }
        p.swap = nk.home ? N(nk.home) !== N(home) : false;
        p.destino = { tipo: 'KO', clave };
        p.titulo = MCD_FASES[clave];
        p.previo = textoMarcador(tor, state.knockout[clave], p.swap);
      } else { p.motivo = 'Fase desconocida.'; continue; }
      p.nuevo = nuevo;
      const nuevoTxt = tor.tipo === 'sets' ? nuevo.sets.map(s => `${s.home}-${s.away}`).join(', ') : `${nuevo.gh}-${nuevo.ga}`;
      p.nuevoTxt = nuevoTxt;
      if (p.previo && p.previo.replace(/\s/g, '') === nuevoTxt.replace(/\s/g, '')) { p.estado = 'mute'; p.motivo = 'Ya estaba capturado igual.'; }
      else if (p.previo) { p.estado = 'warn'; p.motivo = `Cambia el resultado anterior (${p.previo}).`; p.marcar = false; }
      else { p.estado = 'ok'; p.motivo = 'Listo para aplicar.'; p.marcar = true; }
    }
    // Varios mensajes del mismo partido en un mismo pegado
    const canon = p => {
      // Marcador en un orden fijo de equipos (alfabético) para poder comparar
      const inv = N(p.home) > N(p.away);
      const m = String(p.marcador).split(',').map(x => { const [a, b] = x.split('-'); return inv ? `${b}-${a}` : `${a}-${b}`; }).join(',');
      return m + '|' + N(p.ganador);
    };
    const grupos = {};
    propuestas.forEach((p, i) => {
      if (!p.destino) return;
      const k = p.destino.tipo === 'G' ? `G${p.destino.grupo}|${[N(p.home), N(p.away)].sort().join('|')}` : `KO${p.destino.clave}`;
      (grupos[k] = grupos[k] || []).push(i);
    });
    Object.values(grupos).forEach(ids => {
      if (ids.length < 2) return;
      const ps = ids.map(i => propuestas[i]);
      const distintos = new Set(ps.map(canon)).size > 1;
      if (!distintos) {
        // Mismo resultado repetido: se usa el último, los demás se marcan como duplicados
        ps.slice(0, -1).forEach(p => { p.estado = 'mute'; p.marcar = false; p.motivo = `Duplicado: ${ps[ps.length - 1].comisionado} reportó el mismo resultado.`; });
        return;
      }
      const resumen = ps.map(p => `${p.comisionado}: ${p.marcador}${p.ganador && p.destino.tipo === 'KO' ? ' (gana ' + p.ganador + ')' : ''}`).join(' · ');
      ps.forEach(p => { p.estado = 'warn'; p.marcar = false; p.conflicto = true; p.motivo = `Resultados distintos para este partido (${resumen}). Marca solo el correcto.`; });
    });
    pintarPropuestas();
  };

  function pintarPropuestas() {
    const icon = { ok: '✅', warn: '⚠️', err: '❌', mute: '♻️' };
    const aplicables = propuestas.filter(p => p.estado === 'ok' || p.estado === 'warn');
    $('mcdRes').innerHTML = `<table class="mcd-tab"><thead><tr><th>Aplicar</th><th>Partido</th><th>Resultado</th><th>Comisionado</th><th>Estado</th></tr></thead><tbody>${
      propuestas.map((p, i) => `<tr>
        <td>${(p.estado === 'ok' || p.estado === 'warn') ? `<input type="checkbox" data-i="${i}" ${p.marcar ? 'checked' : ''}>` : ''}</td>
        <td>${p.titulo ? esc(p.titulo) + '<br>' : ''}${esc(p.home || '')} vs ${esc(p.away || '')}</td>
        <td>${esc(p.marcador || '')}${p.ganador && p.destino && p.destino.tipo === 'KO' ? '<br><span class="mcd-mute">Gana: ' + esc(p.ganador) + '</span>' : ''}</td>
        <td>${esc(p.comisionado || '—')}</td>
        <td class="mcd-${p.estado}">${icon[p.estado]} ${esc(p.motivo)}</td></tr>`).join('')
    }</tbody></table>` + (aplicables.length ? `<button class="mcd-btn" id="mcdAplicar" type="button">Aplicar seleccionados</button>` : '');
    $('mcdRes').querySelectorAll('input[type=checkbox]').forEach(c => c.onchange = () => { propuestas[c.dataset.i].marcar = c.checked; });
    if ($('mcdAplicar')) $('mcdAplicar').onclick = aplicar;
  }

  // ---------- Aplicar ----------
  function aplicar() {
    const tor = torneoActual();
    const sel = propuestas.filter(p => p.marcar && (p.estado === 'ok' || p.estado === 'warn'));
    if (!sel.length) { alert('No hay resultados seleccionados.'); return; }
    const claves = sel.map(p => p.destino.tipo === 'G' ? `G${p.destino.grupo}|${[N(p.home), N(p.away)].sort().join('|')}` : `KO${p.destino.clave}`);
    if (new Set(claves).size !== claves.length) { alert('Marcaste más de un resultado para el mismo partido. Deja marcado solo el correcto.'); return; }
    let n = 0;
    for (const p of sel) {
      const val = JSON.parse(JSON.stringify(p.nuevo));
      if (p.swap) {
        if (tor.tipo === 'sets') val.sets = val.sets.map(s => ({ home: s.away, away: s.home }));
        else { const t = val.gh; val.gh = val.ga; val.ga = t; }
      }
      if (p.destino.tipo === 'G') {
        const g = state.groups[p.destino.grupo];
        g.matches = g.matches || [];
        let m = g.matches.find(x => (N(x.home) === N(p.home) && N(x.away) === N(p.away)) || (N(x.home) === N(p.away) && N(x.away) === N(p.home)));
        if (!m) {
          m = tor.tipo === 'sets' ? { home: p.destino.crear.home, away: p.destino.crear.away, sets: [], hour: '', place: '' }
                                  : { home: p.destino.crear.home, away: p.destino.crear.away, gh: null, ga: null, hour: '', place: '' };
          g.matches.push(m);
        }
        Object.assign(m, val);
      } else {
        const k = state.knockout[p.destino.clave];
        Object.assign(k, val);
        if (p.ganador) k.winner = p.ganador;
      }
      n++;
    }
    try { state.updatedAtLocal = new Date().toLocaleString('es-MX'); } catch (e) {}
    saveState();
    sessionStorage.setItem('mcd_flash', `✅ Se aplicaron ${n} resultado(s). Revisa la tabla y, cuando esté bien, publica como siempre.`);
    location.reload();
  }

  const flash = sessionStorage.getItem('mcd_flash');
  if (flash) { $('mcdFlash').innerHTML = `<div class="mcd-flash">${esc(flash)}</div>`; sessionStorage.removeItem('mcd_flash'); }
  $('mcdLimpiar').onclick = () => { $('mcdTexto').value = ''; $('mcdRes').innerHTML = ''; propuestas = []; };
  // Mantener el nombre del torneo al día si se importa otro archivo
  setInterval(pintarTorneo, 1500);
  }
})();
