// main.js
// App wiring and navigation

function showView(id){ document.querySelectorAll('section').forEach(s=>s.classList.add('hidden')); document.getElementById(id).classList.remove('hidden');
  document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'));
  if(id==='view-accueil') document.getElementById('nav-accueil')?.classList.add('active');
  if(id==='view-landing') document.getElementById('nav-landing')?.classList.add('active');
  if(id==='view-teams') document.getElementById('nav-teams')?.classList.add('active');
  if(id==='view-activity1') document.getElementById('nav-activity1')?.classList.add('active');
  if(id==='view-home') document.getElementById('nav-home')?.classList.add('active');
  if(id==='view-scoreboard') document.getElementById('nav-score')?.classList.add('active');
  if(id==='view-results') document.getElementById('nav-results')?.classList.add('active');
}

function renderFinalPlaceholder(){ const teams = loadTeams(); const tbody = document.querySelector('#finalTable tbody'); if(!tbody) return;
  if(!teams.length){ tbody.innerHTML = '<tr><td colspan="6" class="muted">No teams</td></tr>'; document.getElementById('finalSummary').innerText=''; return }
  const snapshot = teams.slice().sort((a,b)=>{ return ( (Number(b.votesFor)||0)-(Number(b.votesAgainst)||0) ) - ( (Number(a.votesFor)||0)-(Number(a.votesAgainst)||0) ); });
  document.getElementById('finalSummary').innerText = 'Classement courant par (Pour - Contre) pondérés. +5 au plus soutenu, -5 au plus rejeté lors du calcul final.';
  renderFinalTable(snapshot, null);
}

function renderAll(){ renderTeamsList(); renderScoreboard(); renderFinalPlaceholder(); }

// Export/import helpers
defaultExport = undefined;
function exportTeams(){ return JSON.stringify(loadTeams(), null, 2); }
function importTeams(json){ try{ const arr = JSON.parse(json); if(!Array.isArray(arr)) throw 'expected array'; saveTeams(arr); renderAll(); alert('Imported'); }catch(e){ alert('Import failed: '+e) } }

// Event wiring
window.addEventListener('DOMContentLoaded', ()=>{
  // Landing
  document.getElementById('nav-accueil')?.addEventListener('click', ()=>showView('view-accueil'));
  document.getElementById('nav-landing')?.addEventListener('click', ()=>showView('view-landing'));
  document.getElementById('nav-teams')?.addEventListener('click', ()=>{ showView('view-teams'); initTeamsSetup(); });
  document.getElementById('goHomeFromLanding')?.addEventListener('click', ()=>{ showView('view-activity1'); renderAct1(); });
  document.getElementById('goScoreFromLanding')?.addEventListener('click', ()=>{ showView('view-scoreboard'); renderScoreboard(); });
  document.getElementById('nav-minting')?.addEventListener('click', ()=>{ showView('view-minting'); renderMinting(); });

  // Activity 1
  document.getElementById('nav-activity1')?.addEventListener('click', ()=>{ showView('view-activity1'); renderAct1(); });
  document.getElementById('act1Reset')?.addEventListener('click', resetAct1);
  document.getElementById('act1ViewEligible')?.addEventListener('click', listEligibleTeamsAct1);
  document.getElementById('act1Proceed')?.addEventListener('click', ()=>{ showView('view-minting'); renderMinting(); });

  // Activity 2 home
  document.getElementById('nav-home')?.addEventListener('click', ()=>showView('view-home'));
  document.getElementById('addTeamBtn')?.addEventListener('click', ()=>{ addTeam(document.getElementById('teamName').value, document.getElementById('teamScore').value); document.getElementById('teamName').value = ''; });
  document.getElementById('clearBtn')?.addEventListener('click', clearAll);
  document.getElementById('startChallenge')?.addEventListener('click', ()=>{ showView('view-scoreboard'); renderScoreboard(); });

  // Scoreboard/vote
  document.getElementById('nav-score')?.addEventListener('click', ()=>{ showView('view-scoreboard'); renderScoreboard(); });
  document.getElementById('cancelVote')?.addEventListener('click', ()=>{ currentVoter=null; currentChoices={}; showView('view-scoreboard'); });
  document.getElementById('submitVote')?.addEventListener('click', submitVotes);
  document.getElementById('endVoting')?.addEventListener('click', ()=>{ computeFinal(); showView('view-results'); });

  // Results
  document.getElementById('nav-results')?.addEventListener('click', ()=>{ showView('view-results'); renderFinalPlaceholder(); });
  document.getElementById('computeFinal')?.addEventListener('click', computeFinal);
  document.getElementById('resetRound')?.addEventListener('click', resetVotes);

  // Initial render
  renderAll();
  showView('view-accueil');

  // expose for debug
  window.exportTeams = exportTeams; window.importTeams = importTeams; window.clearAll = clearAll;
});

// ---------------- Teams setup (crypto selection) ----------------
let teamsSetup = [];
let selectedCrypto = null; // {label,img}

function initTeamsSetup(){
  // reset selection visuals
  selectedCrypto = null;
  const hint = document.getElementById('selectedCryptoHint'); if(hint) hint.innerText = 'Aucune crypto sélectionnée';
  document.querySelectorAll('#cryptoGrid .crypto-card').forEach(btn=>{
    btn.style.borderColor = 'var(--border)'; btn.style.background = '#ffffff';
    btn.onclick = ()=>{
      document.querySelectorAll('#cryptoGrid .crypto-card').forEach(b=>{ b.style.background='#ffffff'; b.style.borderColor='var(--border)'; });
      btn.style.background = 'rgba(124,58,237,0.08)'; btn.style.borderColor = 'rgba(124,58,237,0.35)';
      selectedCrypto = { label: btn.dataset.label, img: btn.dataset.img };
      if(hint) hint.innerText = `${selectedCrypto.label} sélectionnée`;
    }
  });
  // wire controls
  document.getElementById('resetTeamsSelect')?.addEventListener('click', ()=>{ selectedCrypto=null; if(hint) hint.innerText='Aucune crypto sélectionnée'; document.getElementById('teamLabelInput').value=''; document.querySelectorAll('#cryptoGrid .crypto-card').forEach(b=>{ b.style.background='#ffffff'; b.style.borderColor='var(--border)'; }); });
  document.getElementById('addTeamFromCrypto')?.addEventListener('click', onAddTeamFromCrypto);
  document.getElementById('proceedToAct1FromTeams')?.addEventListener('click', proceedToAct1FromTeams);
  // keep existing teams if returning
  renderTeamsSetupTable();
}

function onAddTeamFromCrypto(){ const name = (document.getElementById('teamLabelInput')?.value||'').trim(); if(!selectedCrypto) return alert('Sélectionnez d\'abord une cryptomonnaie'); if(!name) return alert('Saisissez un nom d\'équipe');
  if(teamsSetup.some(t=>t.name.toLowerCase()===name.toLowerCase())) return alert('Nom d\'équipe déjà utilisé');
  teamsSetup.push({ name, crypto: { ...selectedCrypto } });
  document.getElementById('teamLabelInput').value='';
  renderTeamsSetupTable();
}

function renderTeamsSetupTable(){ const tbody = document.querySelector('#teamsSetupTable tbody'); if(!tbody) return; if(!teamsSetup.length){ tbody.innerHTML = '<tr><td colspan="3" class="muted">Aucune équipe encore</td></tr>'; return }
  tbody.innerHTML = teamsSetup.map((t,idx)=>`<tr>
    <td>${escapeHtml(t.name)}</td>
    <td><img src="${t.crypto.img}" alt="${escapeHtml(t.crypto.label)}" style="width:18px;height:18px;vertical-align:middle;margin-right:6px;border-radius:4px"/> ${escapeHtml(t.crypto.label)}</td>
    <td><button class="btn-outline" data-i="${idx}" data-action="del-team-setup">Supprimer</button></td>
  </tr>`).join('');
  tbody.querySelectorAll('[data-action="del-team-setup"]').forEach(b=> b.addEventListener('click', ()=>{ const i = Number(b.dataset.i); teamsSetup.splice(i,1); renderTeamsSetupTable(); }));
}

function proceedToAct1FromTeams(){ if(!teamsSetup.length) return alert('Ajoutez au moins une équipe');
  // Prepare Activity 1 storage structure: {name, s:{...}, crypto:{...}}
  const act1 = teamsSetup.map(t=>({ name: t.name, crypto: { label: t.crypto.label, img: t.crypto.img }, s: { good:0, vs:0, block:0, bad:0, wrong:0, val:0 } }));
  saveAct1(act1);
  // Navigate to Activity 1
  showView('view-activity1');
  renderAct1();
}

// ---------------- Minting page ----------------
let mintStatuses = {}; // name -> 'first'|'second'|'others'|'fail'
let mintTimer = null; let mintRemain = 240;

function renderMinting(){
  // populate table with eligible teams from Activity 1
  const tbody = document.querySelector('#mintTable tbody'); if(!tbody) return;
  const arr = (loadAct1()||[]).filter(t=> (Number(t?.s?.val)||0) >= 2 );
  if(!arr.length){ tbody.innerHTML = '<tr><td colspan="2" class="muted">Aucune équipe éligible</td></tr>'; return }
  // initialize statuses if empty
  arr.forEach(t=>{ if(!mintStatuses[t.name]) mintStatuses[t.name] = 'others'; });
  tbody.innerHTML = arr.map(t=>{
    const name = t.name;
    const opts = [
      {v:'first',l:'1er (+10)'},
      {v:'second',l:'2ème (+5)'},
      {v:'others',l:'Autres (réussi) (+1)'},
      {v:'fail',l:"Échec (0)"}
    ].map(o=>`<option value="${o.v}" ${mintStatuses[name]===o.v?'selected':''}>${o.l}</option>`).join('');
    return `<tr>
      <td>${escapeHtml(name)}</td>
      <td><select class="mint-select" data-name="${escapeHtml(name)}">${opts}</select></td>
    </tr>`;
  }).join('');
  tbody.querySelectorAll('.mint-select').forEach(sel=> sel.addEventListener('change', (e)=>{
    mintStatuses[e.currentTarget.dataset.name] = e.currentTarget.value;
  }));
  // wire timer buttons
  document.getElementById('mintStart')?.addEventListener('click', startMintTimer, { once:false });
  document.getElementById('mintStop')?.addEventListener('click', stopMintTimer, { once:false });
  document.getElementById('mintReset')?.addEventListener('click', resetMintTimer, { once:false });
  document.getElementById('mintApply')?.addEventListener('click', applyMintAndProceed, { once:false });
  // ensure timer display
  updateMintTimerDisplay();
}

function updateMintTimerDisplay(){ const el = document.getElementById('mintTimer'); if(!el) return; const m = Math.floor(mintRemain/60); const s = mintRemain%60; el.innerText = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`; }
function tickMint(){ if(mintRemain<=0){ stopMintTimer(); alert('Temps écoulé (4 min). Terminez la saisie des résultats.'); return } mintRemain--; updateMintTimerDisplay(); }
function startMintTimer(){ if(mintTimer) return; mintTimer = setInterval(tickMint, 1000); }
function stopMintTimer(){ if(mintTimer){ clearInterval(mintTimer); mintTimer=null; } }
function resetMintTimer(){ stopMintTimer(); mintRemain = 240; updateMintTimerDisplay(); }

function applyMintAndProceed(){
  // enforce only one first and one second
  const chosen = Object.entries(mintStatuses);
  const firsts = chosen.filter(([_,v])=>v==='first');
  const seconds = chosen.filter(([_,v])=>v==='second');
  if(firsts.length>1 || seconds.length>1){ alert('Veuillez sélectionner au plus un 1er et au plus un 2ème.'); return }
  if(firsts.length===0){ if(!confirm('Aucun 1er sélectionné. Continuer ?')) return }
  if(seconds.length===0){ if(!confirm('Aucun 2ème sélectionné. Continuer ?')) return }

  // build Activity 2 teams with adjusted scores
  const act1 = loadAct1();
  const elig = act1.filter(t=> (Number(t?.s?.val)||0) >= 2 );
  const bonusFor = (name)=>{
    const st = mintStatuses[name]||'others';
    if(st==='first') return 10; if(st==='second') return 5; if(st==='others') return 1; return 0;
  };
  const teams = elig.map(t=>({
    name: t.name,
    score: ( (t.s.good*3)+(t.s.vs*2)+(t.s.block*5)-(t.s.bad*3)-(t.s.wrong*2) ) + bonusFor(t.name),
    votesFor:0, votesAgainst:0, votersFor:[], votersAgainst:[], votedFor:[], votedAgainst:[]
  }));
  saveTeams(teams);
  // proceed to Activity 2
  showView('view-home');
  renderTeamsList();
  renderScoreboard();
}
