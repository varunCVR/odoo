import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth/AuthProvider";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import "./App.css";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main>
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
