import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Modal,
  ModalHeader,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { useState, ReactNode } from 'react';

const DeleteRelationship = () => {
  return <ModalHeader>Hello Relationship</ModalHeader>;
};

const DeleteCharacter = () => {
  return <ModalHeader>Hello Character</ModalHeader>;
};

const DeleteDiagram = () => {
  return <ModalHeader>Hello Diagram</ModalHeader>;
};

export const Delete = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selection, setSelection] = useState<ReactNode | null>(null);
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ArrowDownIcon />}
        colorScheme={'red'}
        variant={'outline'}
      >
        Delete
      </MenuButton>
      <MenuList shadow={'md'} p={0} overflow={'hidden'}>
        <MenuItem
          border={'none'}
          shadow={'none'}
          transition={'background-color 0.2s ease-in-out'}
          _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
          }}
          onClick={() => {
            setSelection(<DeleteDiagram />);
            onOpen();
          }}
        >
          Delete Diagram
        </MenuItem>
        <MenuItem
          border={'none'}
          shadow={'none'}
          transition={'background-color 0.2s ease-in-out'}
          _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
          }}
          onClick={() => {
            setSelection(<DeleteRelationship />);
            onOpen();
          }}
        >
          Delete Relationship
        </MenuItem>
        <MenuItem
          border={'none'}
          shadow={'none'}
          transition={'background-color 0.2s ease-in-out'}
          _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
          }}
          onClick={() => {
            setSelection(<DeleteCharacter />);
            onOpen();
          }}
        >
          Delete Character
        </MenuItem>
      </MenuList>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton onClick={onClose} />
          {selection}
        </ModalContent>
      </Modal>
    </Menu>
  );
};
