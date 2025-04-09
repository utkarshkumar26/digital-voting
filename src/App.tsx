
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth, isAdmin, isVoter } from "./context/AuthContext";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import VoterLogin from "./pages/VoterLogin";
import AdminLogin from "./pages/AdminLogin";
import VerifyId from "./pages/VerifyId";
import VoterDashboard from "./pages/VoterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component for voters
const VoterRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isVoter(user)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Protected route component for admins
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }
  
  if (!isAdmin(user)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<VoterLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/verify-id" element={
              <VoterRoute>
                <VerifyId />
              </VoterRoute>
            } />
            <Route path="/dashboard" element={
              <VoterRoute>
                <VoterDashboard />
              </VoterRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
