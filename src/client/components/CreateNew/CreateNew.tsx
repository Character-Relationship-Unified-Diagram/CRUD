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

const NewRelationship = () => {
  return <ModalHeader>Hello Relationship</ModalHeader>;
};

const NewCharacter = () => {
  return <ModalHeader>Hello Character</ModalHeader>;
};

export const NewDiagram = ({ cb }: { cb?: () => any }) => {
  //! invoke cb when new diagram is created, this is needed because of the MapSelector Modal
  return <ModalHeader textAlign={'center'}>Hello Diagram</ModalHeader>;
};

export const CreateNew = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selection, setSelection] = useState<ReactNode | null>(null);
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ArrowDownIcon />}
        colorScheme="green"
        variant={'outline'}
      >
        Create
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
            setSelection(<NewDiagram />);
            onOpen();
          }}
        >
          New Diagram
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
            setSelection(<NewRelationship />);
            onOpen();
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
            bg: useColorModeValue('gray.200', 'gray.700'),
          }}
          onClick={() => {
            setSelection(<NewCharacter />);
            onOpen();
          }}
        >
          New Character
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
