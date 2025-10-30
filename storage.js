// storage.js
// Shared constants and storage helpers

// Keys
const LS_KEY = 'bc_challenge_teams_v1';
const LS_KEY_ACT1 = 'bc_activity1_teams_v1';
const LS_KEY_ACT2_LOG = 'bc_activity2_votes_log_v1';

// Generic helpers
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) }

// Activity 2 teams (DAO voting)
function loadTeams(){ try{ const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : [] } catch(e){return []} }
function saveTeams(teams){ localStorage.setItem(LS_KEY, JSON.stringify(teams)); }
function findTeam(name){ return loadTeams().find(t=>t.name === name) }

// Activity 1 data
function loadAct1(){ try{ const raw = localStorage.getItem(LS_KEY_ACT1); return raw ? JSON.parse(raw) : [] } catch(e){ return [] } }
function saveAct1(arr){ localStorage.setItem(LS_KEY_ACT1, JSON.stringify(arr)); }

// Activity 2 votes log
function loadVotesLog(){ try{ const raw = localStorage.getItem(LS_KEY_ACT2_LOG); return raw ? JSON.parse(raw) : [] } catch(e){ return [] } }
function saveVotesLog(arr){ localStorage.setItem(LS_KEY_ACT2_LOG, JSON.stringify(arr)); }
function appendVoteLog(entry){ const log = loadVotesLog(); log.unshift(entry); saveVotesLog(log); if (typeof renderVotesLog === 'function') renderVotesLog(); }
