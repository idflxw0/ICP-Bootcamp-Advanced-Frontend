// src/App.tsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createActor, canisterId } from "../../declarations/backend";
import { AuthProvider } from "./auth/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  const [greeting, setGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setIsLoading(true);
    const backend = createActor(canisterId);
    backend.greet(name)
      .then((greeting: string) => {
        setGreeting(greeting);
      })
      .catch((error) => {
        console.error("Error fetching greeting:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route 
              path="/login" 
              element={<Login />} 
            />
            <Route 
              path="/profile" 
              element={
                <>
                  <Navbar />
                  <Profile />
                </>
              } 
            />
            <Route 
              path="/" 
              element={
                <>
                  <Navbar />
                  <HomePage 
                    greeting={greeting} 
                    isLoading={isLoading} 
                    name={name} 
                    setName={setName} 
                    handleSubmit={handleSubmit} 
                  />
                </>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;