import { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';

export const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = (e: any) => {
    e.preventDefault();
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        // dispatch({ type: 'SET_USER', payload: data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box>
      <form onSubmit={handleLogin}>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button type="submit">Signup</Button>
      </form>
    </Box>
  );
};
