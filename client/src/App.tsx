import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CRMLayout from "./components/CRMLayout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Home />;
  }

  return (
    <CRMLayout>
      <Component />
    </CRMLayout>
  );
}

function Router() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"}>
        {isAuthenticated ? (
          <CRMLayout>
            <Dashboard />
          </CRMLayout>
        ) : (
          <Home />
        )}
      </Route>      <Route path={"/clients"}>
        {isAuthenticated ? (
          <CRMLayout>
            <Clients />
          </CRMLayout>
        ) : (
          <Home />
        )}
      </Route>
      <Route path={"/orders"}>
        {isAuthenticated ? (
          <CRMLayout>
            <Orders />
          </CRMLayout>
        ) : (
          <Home />
        )}
      </Route>
      <Route path={"/settings"}>
        {isAuthenticated ? (
          <CRMLayout>
            <Settings />
          </CRMLayout>
        ) : (
          <Home />
        )}
      </Route>
      <Route path={"/404"} component={NotFound} />  {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
