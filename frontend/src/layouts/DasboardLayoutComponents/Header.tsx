import React from 'react';
import {
  Text,
  Flex,
  Box,
  Link,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  gender: string;
}

interface HeaderProps {
  user: User;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="blue.500"
      color="white"
      w="100%"
      position="fixed"
      top={0}
      zIndex={1000}
    >
      <Box display={{ base: 'block', md: 'none' }} onClick={onOpen}>
        <IconButton
          icon={<HamburgerIcon />}
          variant="outline"
          aria-label="Toggle Navigation"
        />
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <VStack alignItems="flex-start">
                <Link href="/" p={2} onClick={onClose}>Home</Link>
                <Link href="/my-pokemons" p={2} onClick={onClose}>Pokemons</Link>
                <Link href="/pokedex" p={2} onClick={onClose}>Pokedex</Link>
                <Link href="/trades" p={2} onClick={onClose}>Trades</Link>
                <Link href="/notifications" p={2} onClick={onClose}>Notifications</Link>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      <Box
        display={{ base: 'none', md: 'flex' }}
        width={{ base: 'full', md: 'auto' }}
        alignItems="center"
        flexGrow={1}
      >
        <Text fontSize={'2xl'} mr={4}>Pokemon Project</Text>
        <Link href="/" p={2}>Home</Link>
        <Link href="/my-pokemons" p={2}>Pokemons</Link>
        <Link href="/pokedex" p={2}>Pokedex</Link>
        <Link href="/trades" p={2}>Trades</Link>
        <Link href="/notifications" p={2}>Notifications</Link>
      </Box>

      <Menu>
        <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
          <Avatar size="sm" name={user.name} />
        </MenuButton>
        <MenuList>
          <MenuItem textColor={'black'}>{user.name}</MenuItem>
          <MenuItem textColor={'black'}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};