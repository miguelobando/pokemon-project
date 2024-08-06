import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserContextProvider } from './context/users';
import { DashboardPage } from './pages/DashboardPage';
// import PrivateRoutes from './utils/PrivateRoutes';
import { RegisterPage } from './pages/RegisterPage';
import { PokedexPage } from './pages/PokedexPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { MyPokemonsPage } from './pages/MyPokemonsPage';
import { TradesPage } from './pages/TradesPage';
import NotFoundPage from './pages/NotFoundPage';

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

            <Route path="/my-pokemons" element={
              <DashboardLayout>
              <MyPokemonsPage />
              </DashboardLayout>
              } />
              <Route path="/trades" element={
              <DashboardLayout>
              <TradesPage />
              </DashboardLayout>
              } />
              <Route path="/*" element={<NotFoundPage />} />

        </Routes>
      </Router>
      </UserContextProvider>
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App
