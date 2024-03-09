import {
  Box,
  Button,
  Heading,
  Text,
  flexbox,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Logout } from '../../components/NavBar/NavBar';
import { MovingGrid } from '../../components/MovingGrid';
import { EditIcon, LockIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';

export const Settings = () => {
  const user = useSelector((state: any) => state.main.user.username);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const currentTime = new Date().getHours();
    let newGreeting = '';

    if (currentTime >= 5 && currentTime < 12) {
      newGreeting = 'Good morning';
    } else if (currentTime >= 12 && currentTime < 18) {
      newGreeting = 'Good afternoon';
    } else {
      newGreeting = 'Good evening';
    }

    setGreeting(newGreeting);
  }, []);

  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      width={'100%'}
      height={'100%'}
    >
      <MovingGrid />
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        width={'100%'}
        height={'100%'}
        bg={useColorModeValue('blackAlpha.100', 'blackAlpha.400')}
        rowGap={'0.5rem'}
        backdropFilter={'blur(2px)'}
      >
        <Heading>
          {greeting} {user}!
        </Heading>
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={'1rem'}
        >
          <Logout user={user} />
          <Button
            colorScheme="yellow"
            variant={'outline'}
            rightIcon={<EditIcon />}
          >
            <Text fontSize={'x-large'}>Change Username</Text>
          </Button>
          <Button
            colorScheme="red"
            variant={'outline'}
            rightIcon={<LockIcon />}
          >
            <Text fontSize={'x-large'}>Change Password</Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
