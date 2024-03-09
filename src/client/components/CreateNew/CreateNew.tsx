import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveModal } from '../../redux/mainSlice';
import { RootState } from '../../redux/store';

export const CreateNewButton = () => {
  const dispatch = useDispatch();
  const selectedMap = useSelector((state: RootState) => state.main.selectedMap);
  const color = useColorModeValue('gray.200', 'gray.700');

  const options = selectedMap ? (
    <>
      <MenuItem
        border={'none'}
        shadow={'none'}
        transition={'background-color 0.2s ease-in-out'}
        _hover={{
          textDecoration: 'none',
          bg: color,
        }}
        onClick={() => {
          dispatch(setActiveModal(2));
        }}
      >
        New Map
      </MenuItem>
      <MenuItem
        border={'none'}
        shadow={'none'}
        transition={'background-color 0.2s ease-in-out'}
        _hover={{
          textDecoration: 'none',
          bg: color,
        }}
        onClick={() => {
          dispatch(setActiveModal(6));
        }}
      >
        New Character
      </MenuItem>
      <MenuItem
        border={'none'}
        shadow={'none'}
        transition={'background-color 0.2s ease-in-out'}
        _hover={{
          textDecoration: 'none',
          bg: color,
        }}
        onClick={() => {
          dispatch(setActiveModal(5));
        }}
      >
        New Relationship
      </MenuItem>
      <MenuItem
        border={'none'}
        shadow={'none'}
        transition={'background-color 0.2s ease-in-out'}
        _hover={{
          textDecoration: 'none',
          bg: color,
        }}
        onClick={() => {
          dispatch(setActiveModal(9));
        }}
      >
        New Faction
      </MenuItem>
    </>
  ) : (
    <MenuItem
      border={'none'}
      shadow={'none'}
      transition={'background-color 0.2s ease-in-out'}
      _hover={{
        textDecoration: 'none',
        bg: color,
      }}
      onClick={() => {
        dispatch(setActiveModal(2));
      }}
    >
      New Map
    </MenuItem>
  );
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<PlusSquareIcon />}
        colorScheme="green"
        variant={'outline'}
      >
        Create
      </MenuButton>
      <MenuList shadow={'md'} p={0} overflow={'hidden'}>
        {options}
      </MenuList>
    </Menu>
  );
};

export const CreateNew = ({
  selection,
  onClose,
}: {
  selection: ReactNode;
  onClose: () => any;
}) => {
  return (
    <Modal isOpen={true} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton onClick={onClose} />
        {selection}
      </ModalContent>
    </Modal>
  );
};
