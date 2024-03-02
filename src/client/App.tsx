import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Main } from './pages/Main';
import { ChakraProvider } from '@chakra-ui/react';
import { Dashboard } from './components/Dashboard';
import { AuthProvider } from './context/ProtectedRoute';

export const App = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route
              path="/"
              element={
                <AuthProvider>
                  <Dashboard />
                </AuthProvider>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};
