import React from 'react';
import {  Flex } from '@chakra-ui/react';

interface LayoutProps {
  children: React.ReactNode;
}

const HomePageLayout: React.FC<LayoutProps> = ({ children }) => {

  return (
    <Flex minW={'100vw'} minH={'100vh'} direction={'column'} justifyContent={'center'} alignItems={'center'}>
        <h1>Header</h1>
        {children}
    </Flex>
  );
};

export default HomePageLayout;