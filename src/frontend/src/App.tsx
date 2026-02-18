import { useInternetIdentity } from './hooks/useInternetIdentity';
import { LoginScreen } from './features/auth/LoginScreen';
import { StockRegisterPage } from './features/stock-register/StockRegisterPage';
import { Loader2 } from 'lucide-react';

function App() {
  const { identity, isInitializing } = useInternetIdentity();

  // Show loading state while checking for stored identity
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!identity) {
    return <LoginScreen />;
  }

  // Show main app when authenticated
  return <StockRegisterPage />;
}

export default App;
