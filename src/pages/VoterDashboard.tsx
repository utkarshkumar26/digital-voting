
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, isVoter } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  getCandidatesByConstituency, 
  getConstituencyByName, 
  castVote, 
  hasVoted,
  Candidate
} from '@/services/mockData';

const VoterDashboard = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isVoted, setIsVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [constituency, setConstituency] = useState<any>(null);

  useEffect(() => {
    if (isVoter(user) && user.constituency) {
      // Load candidates for the user's constituency
      const constituencyCandidates = getCandidatesByConstituency(user.constituency);
      setCandidates(constituencyCandidates);
      
      // Get constituency details
      const constituencyDetails = getConstituencyByName(user.constituency);
      setConstituency(constituencyDetails);
      
      // Check if user has already voted
      if (user.id) {
        const userHasVoted = hasVoted(user.id) || user.hasVoted;
        setIsVoted(userHasVoted);
      }
    }
  }, [user]);

  const handleVote = async () => {
    if (!isVoter(user) || !selectedCandidate) return;
    
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = castVote(user.id, selectedCandidate);
      
      if (success) {
        // Update local state
        setIsVoted(true);
        
        // Update user object to reflect vote status
        user.hasVoted = true;
        
        toast.success("Your vote has been recorded successfully!");
      } else {
        toast.error("You have already cast your vote.");
      }
    } catch (error) {
      console.error("Voting error:", error);
      toast.error("Failed to cast your vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not logged in or not a voter
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!isVoter(user)) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Voter Information</CardTitle>
            <CardDescription>Your details and voting status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p>{user.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Constituency</h3>
                <p>{user.constituency}</p>
              </div>
              {user.aadhaarNumber && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Aadhaar Number</h3>
                  <p>XXXX-XXXX-{user.aadhaarNumber.substring(8)}</p>
                </div>
              )}
              {user.voterId && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Voter ID</h3>
                  <p>{user.voterId}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Voting Status</h3>
                <p className={isVoted ? "text-india-green font-medium" : "text-red-500 font-medium"}>
                  {isVoted ? "Voted" : "Not Voted"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {constituency && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Constituency Information</CardTitle>
              <CardDescription>{constituency.name}, {constituency.state}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Total Voters</h3>
                  <p className="text-2xl font-bold">{constituency.totalVoters.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Votes Cast</h3>
                  <p className="text-2xl font-bold">{constituency.votedCount.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Participation</h3>
                  <p className="text-2xl font-bold">
                    {((constituency.votedCount / constituency.totalVoters) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Vote for Your Candidate</CardTitle>
            <CardDescription>
              {isVoted 
                ? "You have already cast your vote in this election." 
                : "Select a candidate and cast your vote."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isVoted ? (
              <div className="text-center p-6">
                <div className="text-6xl mb-4">🗳️</div>
                <h3 className="text-xl font-medium text-india-green mb-2">Thank You for Voting!</h3>
                <p className="text-gray-600">
                  Your vote has been recorded securely. This helps strengthen our democracy.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {candidates.map((candidate) => (
                    <div 
                      key={candidate.id}
                      className={`border p-4 rounded-lg cursor-pointer transition-all ${
                        selectedCandidate === candidate.id 
                          ? 'border-india-green bg-india-green/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCandidate(candidate.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{candidate.partySymbol}</div>
                          <div>
                            <h3 className="font-medium">{candidate.name}</h3>
                            <p className="text-sm text-gray-500">{candidate.party}</p>
                          </div>
                        </div>
                        <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                          {selectedCandidate === candidate.id && (
                            <div className="w-3 h-3 rounded-full bg-india-green"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full bg-india-green hover:bg-india-green/90"
                  disabled={!selectedCandidate || loading}
                  onClick={handleVote}
                >
                  {loading ? "Processing..." : "Cast Your Vote"}
                </Button>
                
                <p className="text-xs text-center text-gray-500">
                  Your vote is confidential and will be counted anonymously.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoterDashboard;
