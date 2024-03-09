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
import { Link, useNavigate } from 'react-router-dom';
import { MovingGrid } from '../../components/MovingGrid';
import { setUser } from '../../redux/mainSlice';
import './Signup.css';

export const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = (e: any) => {
    e.preventDefault();
    fetch('/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    })
      .then((res) => {
        console.log(res.status);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        dispatch(setUser(data));
        return navigate('/');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <MovingGrid />
      <Modal isOpen={true} onClose={() => {}} isCentered>
        <ModalOverlay />
        <ModalContent>
          <Box className="modal" p={2} borderRadius={4} boxShadow="lg">
            <ModalHeader
              textAlign={'center'}
              rounded={'1rem'}
              bg={'blackAlpha.900'}
              color={'white'}
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
                <Button width={'10rem'} type="submit" border="2px solid black">
                  Signup
                </Button>
                <Link to="/login">Login</Link>
              </form>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};
