import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Main } from './pages/Main';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Dashboard } from './components/Dashboard';
import { AuthProvider } from './context/ProtectedRoute';

export const App = () => {
  const theme = extendTheme({
    styles: {
      global: ({ colorMode }: any) => ({
        body: {
          bg: colorMode === 'dark' ? 'gray.900' : 'gray.200',
          color: colorMode === 'dark' ? 'white' : 'black',
        },
        nav: {
          gap: 0,
        },
      }),
    },
  });
  return (
    <ChakraProvider theme={theme}>
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
