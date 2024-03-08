import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Main } from './pages/Main';
import { ChakraProvider } from '@chakra-ui/react';
import { Dashboard } from './components/Dashboard';
import { AuthProvider } from './context/Authentication';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { theme } from './util/theme';
import { Settings } from './pages/Settings';

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AuthProvider>
                <Main />
              </AuthProvider>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};
