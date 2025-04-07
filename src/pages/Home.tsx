
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-india-blue">Digital Vote India</h1>
          
          <div className="flex items-center justify-center w-full my-8">
            <div className="h-4 w-1/3 bg-india-saffron"></div>
            <div className="h-4 w-1/3 bg-white relative india-flag-badge"></div>
            <div className="h-4 w-1/3 bg-india-green"></div>
          </div>
          
          <p className="text-xl mb-8 max-w-2xl text-gray-700">
            A secure platform that allows eligible Indian citizens to cast their vote digitally from anywhere in the country.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-india-saffron hover:bg-india-saffron/90 text-white">
              <Link to="/login">Voter Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin-login">Election Officer Login</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-india-saffron/10 rounded-full mb-4">
                  <span className="text-4xl">🔐</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Voting</h3>
                <p className="text-gray-600">
                  Vote securely with multi-factor authentication and encryption.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-india-green/10 rounded-full mb-4">
                  <span className="text-4xl">🏠</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Vote From Anywhere</h3>
                <p className="text-gray-600">
                  Cast your vote from anywhere in India without visiting your constituency.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-india-blue/10 rounded-full mb-4">
                  <span className="text-4xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast Results</h3>
                <p className="text-gray-600">
                  Election results calculated more efficiently with digital counting.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="border-t border-gray-200 pt-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-india-saffron text-white flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="font-medium mb-2">Register/Login</h3>
              <p className="text-sm text-gray-600">Login using your mobile number with OTP verification</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-india-saffron text-white flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="font-medium mb-2">Verify Identity</h3>
              <p className="text-sm text-gray-600">Confirm your identity with Aadhaar or Voter ID</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-india-saffron text-white flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="font-medium mb-2">View Candidates</h3>
              <p className="text-sm text-gray-600">See list of candidates from your constituency</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-india-saffron text-white flex items-center justify-center font-bold mb-4">4</div>
              <h3 className="font-medium mb-2">Cast Your Vote</h3>
              <p className="text-sm text-gray-600">Vote for your preferred candidate or choose NOTA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
