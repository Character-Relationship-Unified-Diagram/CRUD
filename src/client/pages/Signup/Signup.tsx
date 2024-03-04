import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './Signup.css';

export const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSignup = (e: any) => {
    e.preventDefault();
    fetch('/api/signup', {
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
    <Modal isOpen={true} onClose={() => {}} isCentered>
      <ModalOverlay />
      <ModalContent>
        <Box className="modal" p={2} borderRadius={4} boxShadow="lg">
          <ModalHeader
            textAlign={'center'}
            rounded={'1rem'}
            bg={'blackAlpha.400'}
          >
            CRUD
          </ModalHeader>
          <ModalHeader textAlign={'center'}>Signup</ModalHeader>
          <ModalBody>
            <form className="modal-form" onSubmit={handleSignup}>
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
              <Button width={'10rem'} type="submit">
                Signup
              </Button>
              <Link to="/login">Login</Link>
            </form>
          </ModalBody>
        </Box>
      </ModalContent>
    </Modal>
  );
};
