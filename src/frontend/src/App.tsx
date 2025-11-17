import React from "react";
import { AuthProvider } from "./auth/AuthProvider";
import { TailwindTest } from "./pages/TailwindTest";

export default function App() {
  return (
    <div className="min-h-screen bg-agendou-dark text-white p-8">
      <AuthProvider>
        <main>
          <TailwindTest />
        </main>
      </AuthProvider>
    </div>
  );
}
