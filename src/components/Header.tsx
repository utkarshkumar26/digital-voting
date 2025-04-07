
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goHome = () => {
    navigate(user ? (user && 'role' in user && user.role === 'admin' ? '/admin' : '/dashboard') : '/');
  };

  return (
    <header className="bg-white shadow-sm mb-6 india-flag-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
            alt="Emblem of India"
            className="w-12 h-12"
          />
          <div>
            <h1 className="text-xl font-bold text-india-blue">Digital Vote India</h1>
            <p className="text-xs text-gray-500">Election Commission of India</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {user && (
            <>
              <Button variant="ghost" onClick={goHome} size="sm">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Button variant="outline" onClick={handleLogout} size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
