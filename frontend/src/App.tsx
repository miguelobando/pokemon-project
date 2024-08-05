import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserContextProvider } from './context/users';
import { DashboardPage } from './pages/DashboardPage';
import PrivateRoutes from './utils/PrivateRoutes';
import { RegisterPage } from './pages/RegisterPage';
import { PokedexPage } from './pages/PokedexPage';
import { DashboardLayout } from './layouts/DashboardLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

export function App() {

  return (
    <ChakraProvider>
        <QueryClientProvider client={queryClient}>
        <UserContextProvider>        

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route element={<PrivateRoutes />}> */}
            <Route path="/dashboard" element={
              <DashboardLayout>
              <DashboardPage />
              </DashboardLayout>
              } />
            <Route path="/pokedex" element={
              <DashboardLayout>
              <PokedexPage />
              </DashboardLayout>
              } />
          {/* </Route> */}
        </Routes>
      </Router>
      </UserContextProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App
