// activity1.js
// Activity 1 – Smart Contract Validation Game

function addAct1Team(name){
  name=(name||'').trim();
  if(!name) return alert('Entrer un nom d\'équipe');
  const arr=loadAct1();
  if(arr.some(t=>t.name.toLowerCase()===name.toLowerCase())) return alert('Équipe déjà existante');
  arr.push({name, s:{good:0, vs:0, wrong:0, val:0}});
  saveAct1(arr);
  renderAct1();
  const input = document.getElementById('act1TeamName'); if(input) input.value='';
}

function deleteAct1Team(name){ let arr=loadAct1(); arr=arr.filter(t=>t.name!==name); saveAct1(arr); renderAct1(); }
function bumpAct1(name, field, delta){ const arr=loadAct1(); const t=arr.find(x=>x.name===name); if(!t) return; t.s[field]=Math.max(0, (Number(t.s[field])||0)+(delta||0)); saveAct1(arr); renderAct1(); }
function totalAct1(t){ return (t.s.good*3)+(t.s.vs*2)-(t.s.wrong*2) }
function eligibleAct1(t){ return (Number(t.s.val)||0) >= 2 }
function resetAct1(){ if(!confirm('Réinitialiser les données de l\'Activité 1 ?')) return; localStorage.removeItem(LS_KEY_ACT1); renderAct1(); }

function renderAct1(){ const tbody = document.querySelector('#act1Table tbody'); if(!tbody) return; const arr=loadAct1();
  if(!arr.length){ tbody.innerHTML = '<tr><td colspan="10" class="muted">Aucune équipe</td></tr>'; return }
  const esc = (s)=>String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  tbody.innerHTML = arr.map(t=>{
    const tot = totalAct1(t); const elig = eligibleAct1(t);
    return `<tr>
      <td>${esc(t.name)}</td>
      <td><div class="counter"><button class="btn-outline" data-f="good" data-d="-1" data-n="${esc(t.name)}">−</button><span class="val">${t.s.good}</span><button class="btn-outline" data-f="good" data-d="1" data-n="${esc(t.name)}">+</button></div></td>
      <td><div class="counter"><button class="btn-outline" data-f="vs" data-d="-1" data-n="${esc(t.name)}">−</button><span class="val">${t.s.vs}</span><button class="btn-outline" data-f="vs" data-d="1" data-n="${esc(t.name)}">+</button></div></td>
      <td><div class="counter"><button class="btn-outline" data-f="wrong" data-d="-1" data-n="${esc(t.name)}">−</button><span class="val">${t.s.wrong}</span><button class="btn-outline" data-f="wrong" data-d="1" data-n="${esc(t.name)}">+</button></div></td>
      <td><div class="counter"><button class="btn-outline" data-f="val" data-d="-1" data-n="${esc(t.name)}">−</button><span class="val">${t.s.val||0}</span><button class="btn-outline" data-f="val" data-d="1" data-n="${esc(t.name)}">+</button></div></td>
      <td>${elig ? '<span class="pill" style="background:rgba(110,231,183,0.12);color:#b7f3dd">Oui</span>' : '<span class="pill" style="background:rgba(255,255,255,0.04);color:#c0c6cf">Non</span>'}</td>
      <td><span class="pill">${tot}</span></td>
      <td><button class="btn-outline act1-del" data-n="${esc(t.name)}">Supprimer</button></td>
    </tr>`
  }).join('');
  tbody.querySelectorAll('button[data-f]').forEach(b=>{ b.addEventListener('click', ()=>{ bumpAct1(b.dataset.n, b.dataset.f, Number(b.dataset.d)) }) });
  tbody.querySelectorAll('.act1-del').forEach(b=>{ b.addEventListener('click', ()=>{ if(confirm('Supprimer '+b.dataset.n+' ?')) deleteAct1Team(b.dataset.n) }) });
}

function listEligibleTeamsAct1(){ const arr = loadAct1(); const elig = arr.filter(eligibleAct1);
  if(!elig.length){ alert('Aucune équipe éligible (≥ 2 validateurs).'); return }
  const lines = elig.map(t=>`${t.name} — validateurs: ${t.s.val||0}, total: ${totalAct1(t)}`);
  alert('Équipes éligibles:\n\n' + lines.join('\n'));
}

function proceedToActivity2FromAct1(){ const arr = loadAct1(); const elig = arr.filter(eligibleAct1);
  if(!elig.length){ alert('Aucune équipe éligible (≥ 2 validateurs).'); return }
  const teams = elig.map(t=>({ name: t.name, score: totalAct1(t), votesFor:0, votesAgainst:0, votersFor:[], votersAgainst:[], votedFor:[], votedAgainst:[] }));
  saveTeams(teams);
  if (typeof renderTeamsList === 'function') renderTeamsList();
  if (typeof renderScoreboard === 'function') renderScoreboard();
  if (typeof showView === 'function') showView('view-home');
  alert('Les équipes éligibles ont été transférées vers l’Activité 2 (vote) avec leurs scores initiaux.');
}
