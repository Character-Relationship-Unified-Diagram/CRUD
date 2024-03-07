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
  Spinner,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { MovingGrid } from '../../components/MovingGrid';
import { setUser } from '../../redux/mainSlice';
import './Login.css';
import { LoadingOverlay } from '../../components/LoadingOverlay';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (e: any) => {
    e.preventDefault();
    setLoading(true);
    fetch('/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 401) {
          console.log('Invalid username or password');
          return;
        } else if (res.status !== 200) {
          console.log('An error occurred');
          return;
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        dispatch(setUser(data));
        return navigate('/dashboard');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <MovingGrid />
      {loading && <LoadingOverlay size={'lg'} />}
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
            <ModalHeader textAlign={'center'}>Login</ModalHeader>
            <ModalBody>
              <form className="modal-form" onSubmit={handleLogin}>
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
                  Login
                </Button>
                <Link to="/signup">Signup</Link>
              </form>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};
