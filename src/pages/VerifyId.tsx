
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/AuthContext';

const VerifyId = () => {
  const [idType, setIdType] = useState<'aadhaar' | 'voterId'>('aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const { verifyVoterId, loading } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyVoterId(idNumber, idType);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container mx-auto px-4 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
          <CardDescription>
            Provide your Aadhaar or Voter ID for verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label>ID Type</Label>
                <RadioGroup 
                  defaultValue="aadhaar" 
                  value={idType}
                  onValueChange={(value) => setIdType(value as 'aadhaar' | 'voterId')}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aadhaar" id="aadhaar" />
                    <Label htmlFor="aadhaar" className="cursor-pointer">Aadhaar Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="voterId" id="voterId" />
                    <Label htmlFor="voterId" className="cursor-pointer">Voter ID Card</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="idNumber">
                  {idType === 'aadhaar' ? 'Aadhaar Number' : 'Voter ID Number'}
                </Label>
                <Input
                  id="idNumber"
                  type="text"
                  placeholder={idType === 'aadhaar' 
                    ? 'Enter 12-digit Aadhaar number' 
                    : 'Enter Voter ID (e.g., ABC1234567)'}
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  maxLength={idType === 'aadhaar' ? 12 : 10}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {idType === 'aadhaar' 
                    ? 'For demo, enter any 12 digits' 
                    : 'For demo, enter format like ABC1234567'}
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-india-saffron hover:bg-india-saffron/90" 
                disabled={loading || (
                  idType === 'aadhaar' ? idNumber.length !== 12 : !idNumber.match(/^[A-Z]{3}\d{7}$/)
                )}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyId;
