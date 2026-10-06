const $ = s => document.querySelector(s);
const set = (id, t) => { const e = document.getElementById(id); if (e) e.textContent = t; };
const y = $('#yr'); if (y) y.textContent = new Date().getFullYear();

fetch('version.json', { cache: 'no-store' })
  .then(r => r.json())
  .then(v => {
    const date = v.date ? new Date(v.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
    const size = v.size_mb ? v.size_mb + ' Mo' : '—';
    set('v-version', 'v' + v.version);
    set('v-date', date);
    set('v-size', size);
    set('v-android', v.min_android ? 'Android ' + v.min_android + ' et plus' : '—');
    set('v-sha', v.sha256 || 'non communiquée');
    set('publisher', v.publisher || '');
    set('contact', v.contact_email || 'via le canal de mises à jour');
    ['dl', 'dl2'].forEach(id => {
      const a = document.getElementById(id);
      if (a) { a.href = v.download_url; a.textContent = 'Télécharger · v' + v.version + (v.size_mb ? ' (' + size + ')' : ''); }
    });
    const link = (id, url) => { const a = document.getElementById(id); if (a && url) { a.href = url; a.hidden = false; } };
    link('n-tg', v.telegram_url);
    link('n-wa', v.whatsapp_channel_url);
    if (v.contact_email) link('n-mail', 'mailto:' + v.contact_email + '?subject=Prévenez-moi des mises à jour de Status Saver');
    const c = $('#copy');
    if (c && v.sha256) { c.hidden = false; c.onclick = () => navigator.clipboard.writeText(v.sha256).then(() => { c.textContent = 'Copié ✓'; }); }
    const h = $('#hist');
    if (h && v.history) {
      h.innerHTML = '';
      v.history.forEach(x => {
        const t = document.createElement('h3'); t.textContent = 'v' + x.version + ' · ' + new Date(x.date).toLocaleDateString('fr-FR');
        const ul = document.createElement('ul');
        x.notes.forEach(n => { const li = document.createElement('li'); li.textContent = n; ul.appendChild(li); });
        h.append(t, ul);
      });
    }
  })
  .catch(() => {});
