import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield } from 'lucide-react';

export function LoginScreen() {
  const { login, loginStatus, loginError, isLoggingIn, isLoginError } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-2xl shadow-lg p-8 space-y-6">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Stock Register</h1>
            <p className="text-muted-foreground">
              Sign in to access your inventory management system
            </p>
          </div>

          {/* Error Message */}
          {isLoginError && loginError && (
            <Alert variant="destructive">
              <AlertDescription>
                {loginError.message || 'Login failed. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Login Button */}
          <div className="space-y-4">
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Sign in with Internet Identity
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secure authentication powered by Internet Computer
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'stock-register'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}
