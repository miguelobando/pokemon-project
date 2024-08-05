import React, { useContext } from 'react';
import {  Flex } from '@chakra-ui/react';
import { UserDataContext } from '../interfaces/userInfo';
import UserContext from '../context/users';
import { Footer } from './DasboardLayoutComponents/Footer';
import { Header } from './DasboardLayoutComponents/Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useContext(UserContext) as UserDataContext;
  

  return (
    <Flex minW={'100vw'} minH={'100vh'} direction={'column'} justifyContent={'center'} alignItems={'center'}>
        <Header user={ user ? user : {
            id: 0,
            email: '',
            password: '',
            name: '',
            gender: '',
        } } />
        {children}
       <Footer />
    </Flex>
  );
};
