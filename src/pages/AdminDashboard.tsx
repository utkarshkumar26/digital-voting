
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth, isAdmin } from '@/context/AuthContext';
import { getAllConstituencies, getVotingStats, getCandidateVoteCounts } from '@/services/mockData';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [selectedConstituency, setSelectedConstituency] = useState<string | null>(null);
  const [candidateStats, setCandidateStats] = useState<any[]>([]);

  // Colors for charts
  const COLORS = ['#FF9933', '#138808', '#000080', '#FF5733', '#C70039'];

  useEffect(() => {
    // Load voting statistics
    const votingStats = getVotingStats();
    setStats(votingStats);
    
    // Set default selected constituency
    if (votingStats.length > 0 && !selectedConstituency) {
      setSelectedConstituency(votingStats[0].name);
    }
  }, []);

  useEffect(() => {
    if (selectedConstituency) {
      // Load candidate-wise statistics for the selected constituency
      const candidateData = getCandidateVoteCounts(selectedConstituency);
      setCandidateStats(candidateData);
    }
  }, [selectedConstituency]);

  const handleConstituencyChange = (constituency: string) => {
    setSelectedConstituency(constituency);
  };

  // Calculate total numbers across all constituencies
  const totalVoters = stats.reduce((acc, curr) => acc + curr.totalVoters, 0);
  const totalVoted = stats.reduce((acc, curr) => acc + curr.votedCount, 0);
  const totalPending = totalVoters - totalVoted;
  const overallParticipation = totalVoters > 0 ? ((totalVoted / totalVoters) * 100).toFixed(1) : '0';

  // Redirect if not logged in or not admin
  if (!user) {
    return <Navigate to="/admin-login" />;
  }
  
  if (!isAdmin(user)) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Election Officer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Registered Voters</h3>
              <p className="text-3xl font-bold">{totalVoters.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Votes Cast</h3>
              <p className="text-3xl font-bold text-india-green">{totalVoted.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Pending Votes</h3>
              <p className="text-3xl font-bold text-india-saffron">{totalPending.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Overall Participation</h3>
              <p className="text-3xl font-bold">{overallParticipation}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="constituencies">Constituencies</TabsTrigger>
          <TabsTrigger value="candidate-stats">Candidate Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Voter Participation Overview</CardTitle>
              <CardDescription>Participation rates across all constituencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Voted', value: totalVoted },
                        { name: 'Not Voted', value: totalPending }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      <Cell fill="#138808" />
                      <Cell fill="#FF9933" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="constituencies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Constituency-wise Statistics</CardTitle>
              <CardDescription>Voter participation by constituency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="votedCount" name="Voted" fill="#138808" />
                    <Bar dataKey="pendingVotes" name="Not Voted" fill="#FF9933" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="candidate-stats" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Candidate-wise Statistics</CardTitle>
              <CardDescription>
                <div className="flex items-center space-x-2">
                  <span>Constituency:</span>
                  <select 
                    className="border rounded px-2 py-1"
                    value={selectedConstituency || ''}
                    onChange={(e) => handleConstituencyChange(e.target.value)}
                  >
                    {stats.map((constituency) => (
                      <option key={constituency.name} value={constituency.name}>
                        {constituency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={candidateStats}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="voteCount"
                      nameKey="name"
                      label={({ name, voteCount }) => `${name}: ${voteCount}`}
                    >
                      {candidateStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Detailed Constituency Reports</CardTitle>
          <CardDescription>Comprehensive voting statistics by region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-3 px-4 border-b">Constituency</th>
                  <th className="text-left py-3 px-4 border-b">State</th>
                  <th className="text-right py-3 px-4 border-b">Total Voters</th>
                  <th className="text-right py-3 px-4 border-b">Votes Cast</th>
                  <th className="text-right py-3 px-4 border-b">Pending</th>
                  <th className="text-right py-3 px-4 border-b">Participation</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((constituency, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{constituency.name}</td>
                    <td className="py-3 px-4 border-b">{constituency.state}</td>
                    <td className="text-right py-3 px-4 border-b">
                      {constituency.totalVoters.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 border-b text-india-green">
                      {constituency.votedCount.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 border-b text-india-saffron">
                      {constituency.pendingVotes.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-4 border-b font-medium">
                      {constituency.participationRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
