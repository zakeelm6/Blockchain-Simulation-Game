const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data && data.error) msg = data.error;
    } catch (_) {}
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  health: () => request('/health'),
  // Activity 1
  getAct1Teams: () => request('/activity1/teams'),
  initAct1: (teams) => request('/activity1/init', { method: 'POST', body: JSON.stringify({ teams }) }),
  bumpAct1: (name, field, delta) => request('/activity1/bump', { method: 'POST', body: JSON.stringify({ name, field, delta }) }),
  resetAct1: () => request('/activity1/reset', { method: 'POST' }),
  getAct1Eligible: () => request('/activity1/eligible'),
  // Minting
  applyMint: (statuses) => request('/mint/apply', { method: 'POST', body: JSON.stringify({ statuses }) }),
  // Teams / Activity 2
  getTeams: () => request('/teams'),
  resetTeams: () => request('/teams/reset', { method: 'POST' }),
  // Votes
  getVotesLog: () => request('/votes/log'),
  submitVotes: (voterName, choices) => request('/votes/submit', { method: 'POST', body: JSON.stringify({ voterName, choices }) }),
  deleteVoteAtIndex: (index) => request('/votes/deleteOne', { method: 'POST', body: JSON.stringify({ index }) }),
  clearVotes: () => request('/votes/clear', { method: 'POST' }),
  resetVoteAggregates: () => request('/votes/resetAggregates', { method: 'POST' }),
  // Results
  computeResults: () => request('/results/compute', { method: 'POST' }),
  // Solo mode
  getSoloContractsPair: () => request('/solo/contracts/pair'),
  answerSoloContract: (playerName, chosenId) => request('/solo/contracts/answer', {
    method: 'POST',
    body: JSON.stringify({ playerName, chosenId })
  })
};
