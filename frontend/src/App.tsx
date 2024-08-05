import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserContextProvider } from './context/users';
import { DashboardPage } from './pages/DashboardPage';

const queryClient = new QueryClient();

function App() {

  return (
    <ChakraProvider>
      <UserContextProvider>        
        <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Router>
      
      </QueryClientProvider>
      </UserContextProvider>
    </ChakraProvider>
  )
}

export default App
