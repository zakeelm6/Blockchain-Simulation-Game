// activity2.js
// Activity 2 – DAO Governance Game (token-weighted voting)

// Team management (Activity 2 Home)
function renderTeamsList(){ const container = document.getElementById('teamsList'); const teams = loadTeams();
  if(!container) return;
  if(!teams.length){ container.innerHTML = '<div class="muted">No teams yet — add some above.</div>'; return }
  let html = '<table style="width:100%"><thead><tr><th>Team</th><th>Score</th><th>Actions</th></tr></thead><tbody>';
  teams.forEach(t=>{ html += `<tr><td>${escapeHtml(t.name)}</td><td>${t.score}</td><td><button data-name="${escapeHtml(t.name)}" class="delBtn btn-outline">Delete</button></td></tr>` });
  html += '</tbody></table>';
  container.innerHTML = html;
  container.querySelectorAll('.delBtn').forEach(b=>b.addEventListener('click', ()=>{ if(confirm('Delete team '+b.dataset.name+'?')){ deleteTeam(b.dataset.name) }}))
}
function addTeam(name, score){ name = (name||'').trim(); score = Number(score)||0; if(!name) return alert('Enter a team name');
  const teams = loadTeams(); if(teams.some(t=>t.name.toLowerCase()===name.toLowerCase())) return alert('Team already exists');
  teams.push({ name, score, votesFor:0, votesAgainst:0, votersFor:[], votersAgainst:[], votedFor:[], votedAgainst:[] }); saveTeams(teams); renderTeamsList(); renderScoreboard(); }
function deleteTeam(name){ let teams = loadTeams(); teams = teams.filter(t=>t.name!==name); saveTeams(teams); renderTeamsList(); renderScoreboard(); }
function clearAll(){ if(!confirm('Reset ALL data? This cannot be undone.')) return; localStorage.removeItem(LS_KEY); if(typeof renderAll==='function') renderAll(); }

// Scoreboard and voting
function renderVotesLog(){ const box = document.getElementById('votesLogList'); if(!box) return; const log = loadVotesLog(); if(!log.length){ box.innerText = 'Aucun vote encore.'; const clearBtn = document.getElementById('clearVotesLog'); if(clearBtn){ clearBtn.disabled = true; } return }
  // render all entries with a delete button per line
  box.innerHTML = log.map((v,i)=>{
    const label = v.choice==='for' ? 'Pour +3×tokens' : 'Contre −1×tokens';
    return `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:4px 0;border-bottom:1px dashed rgba(0,0,0,0.06)">`
      + `<span>• ${escapeHtml(v.from)} → ${escapeHtml(v.to)} : ${label} (tokens=${v.weight}, Δ=${v.delta})</span>`
      + `<button class="btn-outline" data-idx="${i}" data-action="del-log">Supprimer</button>`
      + `</div>`;
  }).join('');
  box.querySelectorAll('[data-action="del-log"]').forEach(btn=>{
    btn.addEventListener('click', ()=> deleteVoteAtIndex(Number(btn.dataset.idx)));
  });
  const clearBtn = document.getElementById('clearVotesLog'); if(clearBtn){ clearBtn.disabled = false; clearBtn.onclick = deleteAllVotes; }
}

function revertVote(entry, teams){
  const voter = teams.find(t=>t.name===entry.from);
  const target = teams.find(t=>t.name===entry.to);
  if(!target) return;
  target.score = Number(target.score||0) - Number(entry.delta||0);
  const w = Number(entry.weight)||0;
  if(entry.choice==='for'){
    target.votesFor = Math.max(0, (Number(target.votesFor)||0) - w);
    if(Array.isArray(target.votersFor)) target.votersFor = target.votersFor.filter(n=>n!==entry.from);
    if(voter && Array.isArray(voter.votedFor)) voter.votedFor = voter.votedFor.filter(n=>n!==entry.to);
  } else if(entry.choice==='against'){
    target.votesAgainst = Math.max(0, (Number(target.votesAgainst)||0) - w);
    if(Array.isArray(target.votersAgainst)) target.votersAgainst = target.votersAgainst.filter(n=>n!==entry.from);
    if(voter && Array.isArray(voter.votedAgainst)) voter.votedAgainst = voter.votedAgainst.filter(n=>n!==entry.to);
  }
}

function deleteVoteAtIndex(idx){ const log = loadVotesLog(); if(idx<0 || idx>=log.length) return; const entry = log[idx];
  if(!confirm('Supprimer ce vote ? Cette action rétablira les scores affectés.')) return;
  const teams = loadTeams();
  revertVote(entry, teams);
  saveTeams(teams);
  // remove the log entry and persist
  log.splice(idx,1);
  saveVotesLog(log);
  // refresh UI
  renderScoreboard();
  renderVotesLog();
}

function deleteAllVotes(){ const log = loadVotesLog(); if(!log.length) return; if(!confirm('Supprimer TOUT le journal des votes et rétablir tous les scores ?')) return;
  const teams = loadTeams();
  // revert in reverse order to be safe (not strictly needed here)
  for(let i=log.length-1;i>=0;i--){ revertVote(log[i], teams); }
  saveTeams(teams);
  saveVotesLog([]);
  renderScoreboard();
  renderVotesLog();
}

function renderScoreboard(){ const tbody = document.querySelector('#scoreboardTable tbody'); const teams = loadTeams();
  if(!tbody) return;
  if(!teams.length){ tbody.innerHTML = '<tr><td colspan="5" class="muted">No teams yet</td></tr>'; renderVotesLog(); return }
  tbody.innerHTML = teams.map(t=>`<tr>
    <td>${escapeHtml(t.name)}</td>
    <td>${t.score}</td>
    <td>${t.votesFor||0}</td>
    <td>${t.votesAgainst||0}</td>
    <td><button class="voteAction" data-name="${escapeHtml(t.name)}">Vote</button></td>
  </tr>`).join('');
  document.querySelectorAll('.voteAction').forEach(b=>b.addEventListener('click', onStartVote));
  renderVotesLog();
}

let currentVoter = null; // name
let currentChoices = {}; // targetName -> 'for'|'against'|null

function onStartVote(){ const validatorName = prompt('Validator team name (exact):'); if(!validatorName) return; const teams = loadTeams(); const voter = teams.find(t=>t.name===validatorName);
  if(!voter) { alert('Team not found. Make sure exact name matches.'); return }
  currentVoter = voter.name; currentChoices = {};
  showVoteViewFor(voter.name);
}

function showVoteViewFor(voterName){ showView('view-vote'); const teams = loadTeams().filter(t=>t.name!==voterName);
  const title = document.getElementById('voterTitle'); if(title) title.innerText = `Voting — ${voterName}`;
  const notice = document.getElementById('voterNotice'); if(notice) notice.innerHTML = `<div class="muted small">Available points: <strong>${findTeam(voterName)?.score||0}</strong></div>`;
  const container = document.getElementById('voteList'); if(!container) return; if(!teams.length){ container.innerHTML = '<div class="muted">No other teams to vote on.</div>'; return }
  let html = '<table style="width:100%"><thead><tr><th>Team</th><th>For</th><th>Against</th></tr></thead><tbody>';
  teams.forEach(t=>{ html += `<tr data-target="${escapeHtml(t.name)}"><td>${escapeHtml(t.name)}</td>
    <td><button class="vote-btn vote-for" data-target="${escapeHtml(t.name)}" data-choice="for">Vote For</button></td>
    <td><button class="vote-btn vote-against" data-target="${escapeHtml(t.name)}" data-choice="against">Vote Against</button></td>
  </tr>` });
  html += '</tbody></table>';
  container.innerHTML = html;
  container.querySelectorAll('.vote-btn').forEach(b=>b.addEventListener('click', onToggleChoice));
}

function onToggleChoice(e){ const btn = e.currentTarget; const target = btn.dataset.target; const choice = btn.dataset.choice;
  const row = btn.closest('tr'); const prev = currentChoices[target] || null;
  if(prev===choice) { delete currentChoices[target]; row.querySelectorAll('.vote-btn').forEach(x=>{x.style.borderColor='rgba(255,255,255,0.04)'; x.style.opacity=1}); return }
  currentChoices[target]=choice;
  row.querySelectorAll('.vote-btn').forEach(x=>{ x.style.opacity = 0.35; x.style.borderColor='rgba(255,255,255,0.04)'; });
  btn.style.opacity = 1; btn.style.borderColor = 'rgba(110,231,183,0.5)';
}

function submitVotes(){ if(!currentVoter) return alert('No voter selected'); const teams = loadTeams(); const voter = teams.find(t=>t.name===currentVoter); const targets = Object.keys(currentChoices);
  if(!voter){ alert('Voter not found'); return }
  const weight = Number(voter.score)||0;
  targets.forEach(targetName=>{
    const choice = currentChoices[targetName]; const target = teams.find(t=>t.name===targetName);
    if(!target) return;
    let delta = 0;
    if(choice==='for'){
      delta = 3 * weight;
      target.votesFor = (Number(target.votesFor)||0) + weight; // weighted sum for transparency
      target.votersFor = target.votersFor || []; if(!target.votersFor.includes(voter.name)) target.votersFor.push(voter.name);
      voter.votedFor = voter.votedFor || []; if(!voter.votedFor.includes(targetName)) voter.votedFor.push(targetName);
    } else if(choice==='against'){
      delta = -1 * weight;
      target.votesAgainst = (Number(target.votesAgainst)||0) + weight; // weighted sum for transparency
      target.votersAgainst = target.votersAgainst || []; if(!target.votersAgainst.includes(voter.name)) target.votersAgainst.push(voter.name);
      voter.votedAgainst = voter.votedAgainst || []; if(!voter.votedAgainst.includes(targetName)) voter.votedAgainst.push(targetName);
    }
    target.score = Number(target.score||0) + delta;
    appendVoteLog({ ts: Date.now(), from: voter.name, to: target.name, choice, weight, delta });
  });
  saveTeams(teams);
  currentVoter = null; currentChoices = {};
  renderScoreboard(); showView('view-scoreboard');
}

// Results
function renderFinalTable(teams, adjustments){ const tbody = document.querySelector('#finalTable tbody'); if(!tbody) return;
  tbody.innerHTML = teams.map((t,idx)=>`<tr>
    <td>${idx+1}</td>
    <td>${escapeHtml(t.name)}</td>
    <td>${t.score}</td>
    <td>${t.votesFor||0}</td>
    <td>${t.votesAgainst||0}</td>
    <td>${adjustments && adjustments[t.name] ? adjustments[t.name] : ''}</td>
  </tr>`).join('');
}

function computeFinal(){ const teams = loadTeams(); if(teams.length===0) return alert('No teams');
  let mostFor = null, mostAgainst = null;
  teams.forEach(t=>{
    if(!mostFor || (Number(t.votesFor)||0) > (Number(mostFor.votesFor)||0)) mostFor = t;
    if(!mostAgainst || (Number(t.votesAgainst)||0) > (Number(mostAgainst.votesAgainst)||0)) mostAgainst = t;
  });
  const adjustments = {};
  if(mostFor){ adjustments[mostFor.name] = (adjustments[mostFor.name]||0) + 5; }
  if(mostAgainst){ adjustments[mostAgainst.name] = (adjustments[mostAgainst.name]||0) - 5; }
  const store = loadTeams(); store.forEach(t=>{ const adj = adjustments[t.name]||0; t.score = Number(t.score||0) + adj; }); saveTeams(store);
  const finalSnapshot = loadTeams().slice().sort((a,b)=>b.score - a.score);
  renderFinalTable(finalSnapshot, adjustments);
  alert('Bonus/Malus appliqués: +5 à l’équipe la plus soutenue, -5 à la plus rejetée.');
}

function resetVotes(){ if(!confirm('Reset only votes (keeps current scores)?')) return; const teams = loadTeams(); teams.forEach(t=>{ t.votesFor = 0; t.votesAgainst = 0; t.votersFor = []; t.votersAgainst = []; t.votedFor = []; t.votedAgainst = []; }); saveTeams(teams); if(typeof renderAll==='function') renderAll(); }
