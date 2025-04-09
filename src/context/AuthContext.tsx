
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

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
  login: (phone: string) => Promise<boolean>;
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
  const [loading, setLoading] = useState(true);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Save user to local storage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Login function (mock OTP flow)
  const login = async (phone: string): Promise<boolean> => {
    try {
      setLoading(true);
      // In a real app, this would call an API to validate the phone and send OTP
      // For this demo, we simply simulate the API call with a 1-second delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if phone number is in correct format
      if (!/^\d{10}$/.test(phone)) {
        toast.error('Please enter a valid 10-digit phone number');
        return false;
      }

      // Store the phone number for the OTP verification step
      setPendingPhone(phone);
      toast.success('OTP sent to your mobile number');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to send OTP. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // OTP verification (mocked)
  const verifyOtp = async (otp: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Mock API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simple validation for demo purposes
      if (otp !== '123456' && otp !== '000000') {
        toast.error('Invalid OTP. For demo, use 123456 or 000000');
        return false;
      }

      if (!pendingPhone) {
        toast.error('No phone number found. Please try logging in again.');
        return false;
      }

      // Mock user data - in a real app, this would come from the backend
      const mockUsers: VoterType[] = [
        {
          id: '1',
          phone: '9876543210',
          name: 'Rahul Sharma',
          constituency: 'Mumbai North',
          hasVoted: false
        },
        {
          id: '2',
          phone: '9876543211',
          name: 'Priya Patel',
          constituency: 'Delhi East',
          hasVoted: true
        }
      ];

      // Find user by phone or create a new one for demo
      let foundUser = mockUsers.find(u => u.phone === pendingPhone);
      
      if (!foundUser) {
        foundUser = {
          id: Date.now().toString(),
          phone: pendingPhone,
          name: 'Demo User',
          constituency: 'Demo Constituency',
          hasVoted: false
        };
      }

      setUser(foundUser);
      setPendingPhone(null);
      toast.success('OTP verified successfully');
      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('OTP verification failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verify voter ID or Aadhaar (mocked)
  const verifyVoterId = async (id: string, idType: 'aadhaar' | 'voterId'): Promise<boolean> => {
    try {
      setLoading(true);
      // Mock API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validate format (simple validation for demo)
      if (idType === 'aadhaar' && !/^\d{12}$/.test(id)) {
        toast.error('Please enter a valid 12-digit Aadhaar number');
        return false;
      }
      
      if (idType === 'voterId' && !/^[A-Z]{3}\d{7}$/.test(id)) {
        toast.error('Please enter a valid Voter ID (Format: ABC1234567)');
        return false;
      }

      if (isVoter(user)) {
        // Update user with the ID
        setUser({
          ...user,
          [idType === 'aadhaar' ? 'aadhaarNumber' : 'voterId']: id
        });
        toast.success(`${idType === 'aadhaar' ? 'Aadhaar' : 'Voter ID'} verified successfully`);
        return true;
      } else {
        toast.error('User profile not found. Please log in again.');
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
      // Mock API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

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
  const logout = () => {
    setUser(null);
    toast.info('You have been logged out');
  };

  const value = {
    user,
    login,
    verifyOtp,
    verifyVoterId,
    adminLogin,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
