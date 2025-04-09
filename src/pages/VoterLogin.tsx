
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, MailIcon, RefreshCwIcon } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const VoterLogin = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const { loginWithEmail, verifyOtp, resendOtp, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [resendCountdown, resendDisabled]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginWithEmail(email);
    if (success) {
      setOtpSent(true);
      setResendDisabled(true);
      setResendCountdown(30); // 30 seconds cooldown
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyOtp(otp);
    if (success) {
      navigate('/verify-id');
    }
  };

  const handleResendOtp = async () => {
    if (resendDisabled) return;
    
    const success = await resendOtp();
    if (success) {
      setOtp(''); // Clear OTP field
      setResendDisabled(true);
      setResendCountdown(30); // 30 seconds cooldown
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  return (
    <div className="container mx-auto px-4 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Voter Login</CardTitle>
          <CardDescription>
            {otpSent 
              ? 'Enter the verification code from your email' 
              : 'Login with your registered email address'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              {otpSent 
                ? 'Check your email for a message with the subject "Confirm your email". Look for a 6-digit verification code.' 
                : 'This is a demo application. For testing purposes, you can use any valid email address.'}
            </AlertDescription>
          </Alert>
          
          {!otpSent ? (
            <form onSubmit={handleSendOtp}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center relative">
                    <MailIcon className="w-4 h-4 absolute left-3 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-india-saffron hover:bg-india-saffron/90" 
                  disabled={loading || !email.includes('@')}
                >
                  {loading ? 'Sending Verification Code...' : 'Send Verification Code'}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <div className="flex justify-center mb-2">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={handleOtpChange}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, index) => (
                            <InputOTPSlot key={index} {...slot} />
                          ))}
                        </InputOTPGroup>
                      )}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Check your email with subject "Confirm your email"<br/>
                    Look for a 6-digit verification code in the message
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-india-saffron hover:bg-india-saffron/90" 
                    disabled={loading || otp.length < 6}
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleResendOtp}
                    disabled={loading || resendDisabled}
                  >
                    <RefreshCwIcon className="w-4 h-4 mr-2" />
                    {resendDisabled 
                      ? `Resend available in ${resendCountdown}s` 
                      : 'Resend Verification Code'}
                  </Button>
                </div>
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
