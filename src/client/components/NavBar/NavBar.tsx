import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';

interface Props {
  children: React.ReactNode;
  href: string;
}

const Links = ['Dashboard', 'Settings', 'Share'];

const NavLink = (props: Props) => {
  const { children, href } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      textAlign={'center'}
      w={'7em'}
      // rounded={'md'}
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

export const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const currentProject = useSelector((state: any) => state?.currentProject);
  const user = useSelector((state: any) => state?.user);

  return (
    <nav>
      <Box
        bg="blackAlpha.200"
        px={4}
        borderBottom={'1px solid rgba(255, 255, 255, 0.25)'}
        shadow={'md'}
      >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <HStack
              as={'nav'}
              spacing={0}
              display={{ base: 'none', md: 'flex' }}
              bg={'rgba(0, 0, 0, 0.15)'}
              rounded={'md'}
              overflow={'hidden'}
              shadow={'md'}
            >
              {Links.map((link) => (
                <NavLink key={link} href={link}>
                  {link}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'} gap={4}>
            <Box flexBasis={0} whiteSpace={'nowrap'}>
              {currentProject || 'Project'}
            </Box>
            <Box flexBasis={0} whiteSpace={'nowrap'}>
              {user?.username || 'User'}
            </Box>
            <Menu>
              <Button onClick={toggleColorMode} shadow={'md'}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={0}>
              {Links.map((link) => (
                <NavLink key={link} href={link}>
                  {link}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </nav>
  );
};
