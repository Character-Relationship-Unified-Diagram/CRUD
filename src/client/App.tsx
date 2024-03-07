import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Main } from './pages/Main';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Dashboard } from './components/Dashboard';
import { AuthProvider } from './context/Authentication';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

export const App = () => {
  const theme = extendTheme({
    styles: {
      global: ({ colorMode }: any) => ({
        body: {
          bg: colorMode === 'dark' ? '#272936' : 'gray.200',
          color: colorMode === 'dark' ? 'white' : 'black',
        },
        nav: {
          gap: 0,
        },
        button: {
          boxShadow: 'md',
          border: '1px solid black',
        },
        input: {
          boxShadow: 'md',
          border: '1px solid',
          borderColor: 'black',
        },
      }),
    },
    components: {
      Button: {
        baseStyle: {
          boxShadow: 'md',
          _focus: { boxShadow: 'none' },
        },
      },
      Input: {
        baseStyle: {
          field: {},
        },
        variants: {
          outline: {
            field: {
              border: '2px solid',
              borderColor: 'teal.500',
              _hover: {
                borderColor: 'teal.600',
              },
            },
          },
        },
      },
      MenuItem: {
        baseStyle: {
          border: 'none',
          _focus: { bg: 'gray.200' },
        },
      },
    },
  });
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
            <Route index element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};
