import React, { useEffect } from 'react';
import {
  Text,
  Flex,
  Box,
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
import { Link } from 'react-router-dom';
import { UserData, UserDataContext } from '../../interfaces/userInfo';
import { getUserCookie, removeUserCookie } from '../../utils/cookies';
import { useContext } from 'react';
import UserContext from '../../context/users';
import { useNavigate } from 'react-router-dom';


interface HeaderProps {
  user: UserData | null;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  
    const { user: localUser, setUser } = useContext(UserContext) as UserDataContext;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    useEffect(() => {
        const cookieUser = getUserCookie() as unknown as UserData;
        if (!cookieUser) {
            navigate('/');
        } else {
            if (localUser == null) {
                setUser(cookieUser);
            }
        }
    }, [localUser, navigate, setUser]);

    const logoutUser = () => {
        removeUserCookie();
        setUser(null);
        navigate('/', { replace: true });
    };

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
                            <VStack alignItems="flex-start" spacing={2}>
                                <Link to="/my-pokemons" onClick={onClose}>My Pokemons</Link>
                                <Link to="/pokedex" onClick={onClose}>Pokedex</Link>
                                <Link to="/trades" onClick={onClose}>Trades</Link>
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
                gap={3}
            >
                <Text fontSize={'2xl'} mr={4}>Pokemon Project</Text>
                <Link to="/my-pokemons">My Pokemons</Link>
                <Link to="/pokedex">Pokedex</Link>
                <Link to="/trades">Trades</Link>
            </Box>

            <Menu>
                <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
                    <Avatar size="sm" name={user?.name || ''} />
                </MenuButton>
                <MenuList>
                    <MenuItem textColor={'black'}>{user?.name || ''}</MenuItem>
                    <MenuItem textColor={'black'} onClick={logoutUser}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
};