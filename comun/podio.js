// Podio y logros individuales, debajo del encabezado de cada torneo.
// El podio sale solo de la fase final del JSON del torneo (final y 3er lugar).
// Los logros individuales se capturan en comun/logros.json, por id de torneo (futbolv, handballf, playav, ...).
(function () {
  const RE = /data-([\w-]+)\.json/i;
  let logros = null;
  let ultimo = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function equipo(nombre) {
    const m = String(nombre || '').match(/^((?:PL|CE|EM)-\d+)\s+(.*)$/i);
    return m ? `<span class="mcdp-nom">${esc(m[2])}</span><span class="mcdp-cod">${esc(m[1])}</span>`
             : `<span class="mcdp-nom">${esc(nombre)}</span>`;
  }

  function podio(data) {
    const ko = (data && data.knockout) || {};
    const fin = ko.final || {}, ter = ko.third || {};
    const lugares = [];
    if (fin.winner) {
      const sub = fin.winner === fin.home ? fin.away : fin.home;
      lugares.push({ n: 1, t: fin.winner }, { n: 2, t: sub });
    }
    if (ter.winner) lugares.push({ n: 3, t: ter.winner });
    return lugares;
  }

  async function cargarLogros() {
    if (logros) return logros;
    try {
      const r = await (window.__mcdFetchOriginal || fetch)('../comun/logros.json', { cache: 'no-store' });
      logros = r.ok ? await r.json() : {};
    } catch (e) { logros = {}; }
    return logros;
  }

  function estilos() {
    if (document.getElementById('mcdPodioCss')) return;
    const st = document.createElement('style');
    st.id = 'mcdPodioCss';
    st.textContent = `
      #mcdPodio{margin:16px auto}
      #mcdPodio .mcdp-card{background:#fff;border-radius:14px;padding:16px 18px;box-shadow:0 2px 10px rgba(0,0,0,.08);border-top:4px solid var(--accent,#0284c7)}
      #mcdPodio h2{font-size:1.15rem;margin:0 0 12px;color:#0f172a}
      #mcdPodio h3{font-size:.95rem;margin:16px 0 8px;color:#475569;text-transform:uppercase;letter-spacing:.04em}
      #mcdPodio .mcdp-lugares{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
      #mcdPodio .mcdp-lugar{border-radius:12px;padding:12px 10px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:3px}
      #mcdPodio .mcdp-l1{background:#fef3c7;border:2px solid #f59e0b}
      #mcdPodio .mcdp-l2{background:#f1f5f9;border:2px solid #94a3b8}
      #mcdPodio .mcdp-l3{background:#ffedd5;border:2px solid #c2410c}
      #mcdPodio .mcdp-med{font-size:1.8rem;line-height:1}
      #mcdPodio .mcdp-pos{font-size:.75rem;font-weight:700;text-transform:uppercase;color:#334155}
      #mcdPodio .mcdp-nom{font-weight:700;font-size:1rem;color:#0f172a}
      #mcdPodio .mcdp-cod{font-size:.75rem;color:#475569}
      #mcdPodio .mcdp-pend{opacity:.55}
      #mcdPodio .mcdp-logros{list-style:none;margin:0;padding:0;display:grid;gap:8px}
      #mcdPodio .mcdp-logros li{background:#f1f5f9;border-left:4px solid var(--accent,#0284c7);border-radius:10px;padding:9px 12px;display:flex;gap:10px;align-items:flex-start}
      #mcdPodio .mcdp-ico{font-size:1.2rem;line-height:1.3}
      #mcdPodio .mcdp-tit{font-size:.78rem;font-weight:700;text-transform:uppercase;color:var(--accent,#0284c7)}
      #mcdPodio .mcdp-per{font-weight:600;color:#0f172a}
      #mcdPodio .mcdp-det{font-size:.82rem;color:#475569}
      @media (max-width:520px){#mcdPodio .mcdp-lugares{gap:6px}#mcdPodio .mcdp-lugar{padding:10px 4px}#mcdPodio .mcdp-nom{font-size:.85rem}#mcdPodio .mcdp-med{font-size:1.5rem}}
      @media print{#mcdPodio .mcdp-card{box-shadow:none}}
    `;
    document.head.appendChild(st);
  }

  // Debajo de la portada del torneo (el recuadro de color con el título); si aún no existe, debajo del encabezado.
  function ancla() {
    const cont = document.getElementById('tournamentContent') || document.querySelector('main');
    const portada = document.querySelector('.cover') || (cont && cont.querySelector(':scope > .card'));
    return portada || document.querySelector('body > header') || document.querySelector('header');
  }
  function colocar(sec) {
    const a = ancla();
    sec.className = a && a.tagName === 'HEADER' ? 'container' : '';
    if (a && a.parentNode) { if (a.nextSibling !== sec) a.parentNode.insertBefore(sec, a.nextSibling); }
    else if (!sec.parentNode) document.body.insertBefore(sec, document.body.firstChild);
  }
  // Las páginas vuelven a dibujar su contenido al recargar datos: se recoloca la sección cuando cambia.
  let pend = false;
  new MutationObserver(() => {
    if (pend) return; pend = true;
    requestAnimationFrame(() => {
      pend = false;
      const sec = document.getElementById('mcdPodio');
      if (ultimo && sec && sec.innerHTML) { const a = ancla(); if (a && a.nextSibling !== sec) colocar(sec); }
      else if (ultimo && !sec) pintar(ultimo.id, ultimo.data);
    });
  }).observe(document.documentElement, { childList: true, subtree: true });

  async function pintar(id, data) {
    ultimo = { id, data };
    const lugares = podio(data);
    const todos = await cargarLogros();
    const lista = todos[id] || [];
    const ajuste = ((todos._podio || {})[id]) || {};   // p. ej. {"3": "Desierto"}
    Object.keys(ajuste).forEach(k => { const n = +k; if (!lugares.some(x => x.n === n)) lugares.push({ n, t: ajuste[k], nota: true }); });
    let sec = document.getElementById('mcdPodio');
    if (!lugares.length && !lista.length) { if (sec) sec.remove(); return; }
    estilos();
    if (!sec) { sec = document.createElement('section'); sec.id = 'mcdPodio'; }
    colocar(sec);
    const med = { 1: '🥇', 2: '🥈', 3: '🥉' }, pos = { 1: 'Campeón', 2: 'Subcampeón', 3: 'Tercer lugar' };
    let html = '<div class="mcdp-card">';
    if (lugares.length) {
      html += '<h2>🏆 Podio</h2><div class="mcdp-lugares">';
      [1, 2, 3].forEach(n => {
        const l = lugares.find(x => x.n === n);
        html += `<div class="mcdp-lugar mcdp-l${n}${l ? '' : ' mcdp-pend'}"><span class="mcdp-med">${med[n]}</span><span class="mcdp-pos">${pos[n]}</span>${l ? (l.nota ? `<span class="mcdp-nom">${esc(l.t)}</span>` : equipo(l.t)) : '<span class="mcdp-nom">Por definir</span>'}</div>`;
      });
      html += '</div>';
    }
    if (lista.length) {
      html += `<h3>⭐ Logros individuales</h3><ul class="mcdp-logros">`;
      lista.forEach(x => {
        html += `<li><span class="mcdp-ico">${esc(x.icono || '🏅')}</span><div><div class="mcdp-tit">${esc(x.titulo)}</div><div class="mcdp-per">${esc(x.nombre)}</div><div class="mcdp-det">${esc([x.plantel, x.detalle].filter(Boolean).join(' · '))}</div></div></li>`;
      });
      html += '</ul>';
    }
    sec.innerHTML = html + '</div>';
  }

  // Se engancha a la carga del JSON del torneo que ya hace cada página (también en las recargas automáticas).
  const original = window.fetch.bind(window);
  window.__mcdFetchOriginal = original;
  window.fetch = function (input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    const p = original(input, init);
    const m = url.match(RE);
    if (m) {
      p.then(r => { if (r.ok) r.clone().json().then(d => pintar(m[1], d)).catch(() => {}); }).catch(() => {});
    }
    return p;
  };
})();
