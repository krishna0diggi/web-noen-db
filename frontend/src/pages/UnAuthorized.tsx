
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please contact an administrator if you believe this is an error.
            </p>
            
            <div className="flex gap-2 justify-center">
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </Link>
              <Link to="/login">
                <Button>
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
