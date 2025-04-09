
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { getUserProfile, updateUserProfile } from '@/services/supabaseService';

// Define our user types
export type VoterType = {
  id: string;
  phone: string;
  name: string;
  aadhaarNumber?: string;
  voterId?: string;
  constituency: string;
  hasVoted: boolean;
};

export type AdminType = {
  id: string;
  username: string;
  name: string;
  role: 'admin';
};

export type UserType = VoterType | AdminType | null;

// Check if user is admin
export const isAdmin = (user: UserType): user is AdminType => {
  return user !== null && 'role' in user && user.role === 'admin';
};

// Check if user is voter
export const isVoter = (user: UserType): user is VoterType => {
  return user !== null && !('role' in user);
};

interface AuthContextType {
  user: UserType;
  supabaseUser: User | null;
  session: Session | null;
  login: (phone: string) => Promise<boolean>;
  loginWithEmail: (email: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  verifyVoterId: (id: string, idType: 'aadhaar' | 'voterId') => Promise<boolean>;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setSupabaseUser(newSession?.user ?? null);
        
        // If user is logged in, fetch their profile
        if (newSession?.user) {
          setTimeout(() => fetchUserProfile(newSession.user.id), 0);
        } else {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setSupabaseUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId);
      
      if (profile) {
        // Convert to our VoterType format
        const voterUser: VoterType = {
          id: profile.id,
          phone: profile.phone || '',
          name: profile.name || '',
          aadhaarNumber: profile.aadhaar_number || undefined,
          voterId: profile.voter_id || undefined,
          constituency: profile.constituencies?.name || '',
          hasVoted: profile.has_voted
        };
        
        setUser(voterUser);
      } else {
        // In case profile doesn't exist yet
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    }
  };

  // Login function (phone OTP)
  const login = async (phone: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Validate phone format
      if (!/^\d{10}$/.test(phone)) {
        toast.error('Please enter a valid 10-digit phone number');
        return false;
      }

      // Format phone with country code for Supabase
      const formattedPhone = `+91${phone}`;
      setPendingPhone(formattedPhone);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone
      });
      
      if (error) throw error;
      
      toast.success('OTP sent to your mobile number');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof AuthError ? error.message : 'Failed to send OTP. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Email OTP login
  const loginWithEmail = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Validate email format
      if (!email.includes('@')) {
        toast.error('Please enter a valid email address');
        return false;
      }

      setPendingEmail(email);
      
      const { error } = await supabase.auth.signInWithOtp({
        email: email
      });
      
      if (error) throw error;
      
      toast.success('OTP sent to your email address');
      return true;
    } catch (error) {
      console.error('Email login error:', error);
      toast.error(error instanceof AuthError ? error.message : 'Failed to send OTP. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // OTP verification
  const verifyOtp = async (otp: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!pendingPhone && !pendingEmail) {
        toast.error('No authentication method found. Please try logging in again.');
        return false;
      }
      
      const { error } = await supabase.auth.verifyOtp({
        phone: pendingPhone,
        email: pendingEmail,
        token: otp,
        type: 'email'
      });
      
      if (error) throw error;
      
      setPendingPhone(null);
      setPendingEmail(null);
      toast.success('OTP verified successfully');
      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error instanceof AuthError ? error.message : 'OTP verification failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verify voter ID or Aadhaar
  const verifyVoterId = async (id: string, idType: 'aadhaar' | 'voterId'): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Validate format
      if (idType === 'aadhaar' && !/^\d{12}$/.test(id)) {
        toast.error('Please enter a valid 12-digit Aadhaar number');
        return false;
      }
      
      if (idType === 'voterId' && !/^[A-Z]{3}\d{7}$/.test(id)) {
        toast.error('Please enter a valid Voter ID (Format: ABC1234567)');
        return false;
      }

      if (!supabaseUser) {
        toast.error('User profile not found. Please log in again.');
        return false;
      }
      
      // Update user profile
      const updates = idType === 'aadhaar' 
        ? { aadhaar_number: id } 
        : { voter_id: id };
      
      const success = await updateUserProfile(supabaseUser.id, updates);
      
      if (success) {
        // Update local user state
        if (isVoter(user)) {
          setUser({
            ...user,
            [idType === 'aadhaar' ? 'aadhaarNumber' : 'voterId']: id
          });
        }
        
        toast.success(`${idType === 'aadhaar' ? 'Aadhaar' : 'Voter ID'} verified successfully`);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('ID verification error:', error);
      toast.error('Verification failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Admin login (hardcoded for demo)
  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Hardcoded admin credentials for demo
      if (username === 'admin' && password === 'password') {
        const adminUser: AdminType = {
          id: 'admin-1',
          username: 'admin',
          name: 'Election Officer',
          role: 'admin'
        };
        setUser(adminUser);
        toast.success('Admin login successful');
        return true;
      } else {
        toast.error('Invalid credentials. For demo, use admin/password');
        return false;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.info('You have been logged out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const value = {
    user,
    supabaseUser,
    session,
    login,
    loginWithEmail,
    verifyOtp,
    verifyVoterId,
    adminLogin,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
