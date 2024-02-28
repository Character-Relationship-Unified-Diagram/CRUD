import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Main } from './pages/Main';
import { ChakraProvider } from '@chakra-ui/react';
import { Dashboard } from './components/Dashboard';

export const App = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route path="/dashboard" element={ <Dashboard /> } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};
