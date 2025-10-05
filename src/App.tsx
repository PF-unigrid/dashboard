// src/App.tsx (con React Router)

import React from 'react';
import { AuthProvider } from './modules/auth/context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;