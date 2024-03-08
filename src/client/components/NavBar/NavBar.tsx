import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  MenuButton,
  Text,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  MoonIcon,
  SunIcon,
  ArrowDownIcon,
  LockIcon,
  ArrowRightIcon,
} from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { CreateNew } from '../CreateNew';
import { Delete } from '../Delete';
import { useNavigate } from 'react-router';
import { Share } from '../../pages/Share';
import { RootState } from '../../redux/store';

interface Props {
  children: React.ReactNode;
  href: string;
}

const Links = ['Dashboard', 'Settings'];

const NavLink = (props: Props) => {
  const { children, href } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      textAlign={'center'}
      w={'7em'}
      transition={'background-color 0.2s ease-in-out'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={`/${href.toLowerCase()}`}
    >
      {children}
    </Box>
  );
};

export const Logout = ({ user }: { user: string }) => {
  const navigate = useNavigate();
  const sendLogout = () => {
    fetch('users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 200) {
          return navigate('/login');
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box flexBasis={0} whiteSpace={'nowrap'}>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ArrowDownIcon />}
          shadow={'md'}
          colorScheme="teal"
        >
          {user || 'User'}
        </MenuButton>
        <MenuList shadow={'md'} p={0} overflow={'hidden'}>
          <MenuItem
            border={'none'}
            shadow={'none'}
            transition={'background-color 0.2s ease-in-out'}
            icon={<LockIcon />}
            bg={useColorModeValue('blackAlpha.100', 'blackAlpha.500')}
            _hover={{
              bg: useColorModeValue('blackAlpha.200', 'blackAlpha.700'),
            }}
            onClick={sendLogout}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const selectedMapName = useSelector(
    (state: RootState) => state.main.selectedMapName,
  );
  const user = useSelector((state: RootState) => state.main.user.username);

  return (
    <>
      <Box
        bg={useColorModeValue('blackAlpha.200', '#222533')}
        px={2}
        borderBottom={'1px solid rgba(0, 0, 0, 0.75)'}
        shadow={'md'}
        as="nav"
      >
        <Flex h={16} alignItems={'center'} gap={2}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ base: 'flex', xl: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack
            spacing={0}
            bg={'rgba(0, 0, 0, 0.15)'}
            rounded={'md'}
            overflow={'hidden'}
            shadow={'md'}
            border={'1px solid rgba(0, 0, 0, 0.75)'}
            display={{ base: 'none', sm: 'flex' }}
          >
            {Links.map((link) => (
              <NavLink key={link} href={link}>
                {link}
              </NavLink>
            ))}
          </HStack>
          <Box
            flexBasis={0}
            whiteSpace={'nowrap'}
            display={{ base: 'none', md: 'flex' }}
          >
            <Text fontSize={'lg'}>
              Selected Map <ArrowRightIcon />{' '}
              <span style={{ textDecoration: 'underline' }}>
                {selectedMapName || 'Project'}
              </span>
            </Text>
          </Box>
          <Flex alignItems={'center'} gap={2} marginLeft={'auto'}>
            <HStack
              spacing={2}
              alignItems={'center'}
              display={{ base: 'none', xl: 'flex' }}
            >
              <CreateNew />
              <Delete />
              <Share />
            </HStack>
            <Logout user={user} />
            <Menu>
              <Button onClick={toggleColorMode} shadow={'md'}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Menu>
          </Flex>
        </Flex>
        {isOpen ? (
          <>
            <Box
              pb={4}
              display={{ base: 'flex', xl: 'none' }}
              alignItems={'center'}
              flexDirection={'column'}
              margin={'auto'}
              gap={2}
            >
              <Box
                flexBasis={0}
                whiteSpace={'nowrap'}
                display={{ base: 'flex', md: 'none' }}
              >
                <Text fontSize={'xl'}>
                  Selected Map <ArrowRightIcon />{' '}
                  <span style={{ textDecoration: 'underline' }}>
                    {selectedMapName || 'Project'}
                  </span>
                </Text>
              </Box>
              <CreateNew />
              <Delete />
              <Share />
              <HStack
                spacing={0}
                bg={'rgba(0, 0, 0, 0.15)'}
                rounded={'md'}
                overflow={'hidden'}
                shadow={'md'}
                border={'1px solid rgba(0, 0, 0, 0.75)'}
                display={{ base: 'flex', sm: 'none' }}
                margin={'auto'}
                width={'fit-content'}
              >
                {Links.map((link) => (
                  <NavLink key={link} href={link}>
                    {link}
                  </NavLink>
                ))}
              </HStack>
            </Box>
          </>
        ) : null}
      </Box>
    </>
  );
};
