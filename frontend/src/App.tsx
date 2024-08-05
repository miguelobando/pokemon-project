import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserContextProvider } from './context/users';
import { DashboardPage } from './pages/DashboardPage';
import PrivateRoutes from './utils/PrivateRoutes';
import { RegisterPage } from './pages/RegisterPage';

const queryClient = new QueryClient();

export function App() {

  return (
    <ChakraProvider>
      <UserContextProvider>        
        <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </Router>
      
      </QueryClientProvider>
      </UserContextProvider>
    </ChakraProvider>
  )
}

export default App
