
// Types
export interface Candidate {
  id: string;
  name: string;
  party: string;
  constituency: string;
  partySymbol: string;
}

export interface Constituency {
  id: string;
  name: string;
  state: string;
  totalVoters: number;
  votedCount: number;
}

// Mock candidates data
export const candidates: Candidate[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    party: "Bharatiya Janata Party",
    constituency: "Mumbai North",
    partySymbol: "🪷" // Lotus
  },
  {
    id: "2",
    name: "Priya Sharma",
    party: "Indian National Congress",
    constituency: "Mumbai North",
    partySymbol: "👐" // Hand
  },
  {
    id: "3",
    name: "Amit Singh",
    party: "Aam Aadmi Party",
    constituency: "Mumbai North",
    partySymbol: "🧹" // Broom
  },
  {
    id: "4",
    name: "Sunita Patel",
    party: "Bahujan Samaj Party",
    constituency: "Mumbai North",
    partySymbol: "🐘" // Elephant
  },
  {
    id: "5",
    name: "NOTA",
    party: "None of the Above",
    constituency: "Mumbai North",
    partySymbol: "❌" // X mark
  },
  {
    id: "6",
    name: "Arjun Mathur",
    party: "Bharatiya Janata Party",
    constituency: "Delhi East",
    partySymbol: "🪷" // Lotus
  },
  {
    id: "7",
    name: "Meera Reddy",
    party: "Indian National Congress",
    constituency: "Delhi East",
    partySymbol: "👐" // Hand
  },
  {
    id: "8",
    name: "Ravi Verma",
    party: "Aam Aadmi Party",
    constituency: "Delhi East",
    partySymbol: "🧹" // Broom
  },
  {
    id: "9",
    name: "NOTA",
    party: "None of the Above",
    constituency: "Delhi East",
    partySymbol: "❌" // X mark
  },
  {
    id: "10",
    name: "Vijay Mishra",
    party: "Bharatiya Janata Party",
    constituency: "Demo Constituency",
    partySymbol: "🪷" // Lotus
  },
  {
    id: "11",
    name: "Anita Desai",
    party: "Indian National Congress",
    constituency: "Demo Constituency",
    partySymbol: "👐" // Hand
  },
  {
    id: "12",
    name: "Suresh Joshi",
    party: "Aam Aadmi Party",
    constituency: "Demo Constituency",
    partySymbol: "🧹" // Broom
  },
  {
    id: "13",
    name: "NOTA",
    party: "None of the Above",
    constituency: "Demo Constituency",
    partySymbol: "❌" // X mark
  }
];

// Mock constituencies data
export const constituencies: Constituency[] = [
  {
    id: "1",
    name: "Mumbai North",
    state: "Maharashtra",
    totalVoters: 1500000,
    votedCount: 850000
  },
  {
    id: "2",
    name: "Delhi East",
    state: "Delhi",
    totalVoters: 1200000,
    votedCount: 720000
  },
  {
    id: "3",
    name: "Demo Constituency",
    state: "Demo State",
    totalVoters: 1000000,
    votedCount: 500000
  }
];

// Mock voting service methods
export const getCandidatesByConstituency = (constituencyName: string): Candidate[] => {
  return candidates.filter(candidate => candidate.constituency === constituencyName);
};

export const getConstituencyByName = (name: string): Constituency | undefined => {
  return constituencies.find(constituency => constituency.name === name);
};

export const getAllConstituencies = (): Constituency[] => {
  return constituencies;
};

// Mock vote storage
let votes: Record<string, string> = {};

// Cast a vote (returns true if successful, false if user already voted)
export const castVote = (userId: string, candidateId: string): boolean => {
  if (votes[userId]) {
    return false; // Already voted
  }
  
  votes[userId] = candidateId;
  
  // Update constituency vote count
  const candidate = candidates.find(c => c.id === candidateId);
  if (candidate) {
    const constituency = constituencies.find(c => c.name === candidate.constituency);
    if (constituency) {
      constituency.votedCount += 1;
    }
  }
  
  return true;
};

// Check if user has already voted
export const hasVoted = (userId: string): boolean => {
  return !!votes[userId];
};

// Get voting statistics for admin dashboard
export const getVotingStats = () => {
  return constituencies.map(constituency => ({
    name: constituency.name,
    state: constituency.state,
    totalVoters: constituency.totalVoters,
    votedCount: constituency.votedCount,
    pendingVotes: constituency.totalVoters - constituency.votedCount,
    participationRate: ((constituency.votedCount / constituency.totalVoters) * 100).toFixed(1)
  }));
};

// Get candidate-wise vote counts for a constituency (for admin)
export const getCandidateVoteCounts = (constituencyName: string) => {
  const constituencyCandidates = getCandidatesByConstituency(constituencyName);
  
  // Count votes for each candidate
  const voteCounts = constituencyCandidates.map(candidate => {
    const voteCount = Object.values(votes).filter(candidateId => candidateId === candidate.id).length;
    return {
      ...candidate,
      voteCount
    };
  });
  
  return voteCounts;
};
