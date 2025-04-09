
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const VoterLogin = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { loginWithEmail, verifyOtp, loading } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginWithEmail(email);
    if (success) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyOtp(otp);
    if (success) {
      navigate('/verify-id');
    }
  };

  return (
    <div className="container mx-auto px-4 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Voter Login</CardTitle>
          <CardDescription>
            {otpSent 
              ? 'Enter the OTP sent to your email' 
              : 'Login with your registered email address'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              This is a demo application. For testing purposes, you can use any valid email address.
            </AlertDescription>
          </Alert>
          
          {!otpSent ? (
            <form onSubmit={handleSendOtp}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-india-saffron hover:bg-india-saffron/90" 
                  disabled={loading || !email.includes('@')}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="otp">One-Time Password</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    For demo, use OTP: 123456 or check your email for the actual code
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-india-saffron hover:bg-india-saffron/90" 
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {otpSent && (
            <Button variant="link" onClick={() => setOtpSent(false)}>
              Change Email Address
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VoterLogin;
