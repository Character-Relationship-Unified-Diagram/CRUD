import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  FormLabel,
  FormControl,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useColorModeValue,
  IconButton,
  HStack,
  Select,
} from '@chakra-ui/react';
import { CloseIcon, MinusIcon } from '@chakra-ui/icons';
import {
  useState,
  ReactNode,
  ChangeEvent,
  FormEvent,
  useEffect,
  ChangeEventHandler,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveModal } from '../../redux/mainSlice';
import { RootState } from '../../redux/store';

interface Attribute {
  key: string;
  value: string;
}

interface CharFormData {
  character: string;
  characterAttributes: { [key: string]: string };
  characterFaction: string;
  characterDescriptor: string;
}

interface DiagFormData {
  diagram: string;
}

export const DeleteDiagram = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<DiagFormData>({
    diagram: '',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const diagramCreationPayload = {
      ...formData,
    };

    console.log('Diagram Creation Payload:', diagramCreationPayload);

    try {
      const response = await fetch('/maps/delete-map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diagramCreationPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error during diagram creation:', error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        dispatch(setActiveModal(null));
        onClose();
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Delete Diagram</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Diagram Name</FormLabel>
              <Input
                name="diagram"
                value={formData.diagram}
                onChange={handleChange}
                placeholder="Diagram Name"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="teal">
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export const DeleteRelationship = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, []);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Relationship</ModalHeader>
      </ModalContent>
    </Modal>
  );
};

export const DeleteCharacter = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [characterID, setCharacterID] = useState('');
  const selectedMapCharacters = useSelector(
    (state: RootState) => state.main.selectedMapCharacters,
  );
  const options = selectedMapCharacters.map((character) => (
    <option key={character.character_id} value={character.character_id}>
      {character.character_name}
    </option>
  ));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('/maps/delete-character', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ characterID }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error during character creation:', error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Delete Character</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Character Name</FormLabel>
              <Select
                name="character"
                placeholder="Character Name"
                onChange={(event) => {
                  setCharacterID(event.target.value);
                }}
              >
                {options}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="teal">
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export const DeleteNewButton = () => {
  const dispatch = useDispatch();
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<MinusIcon />}
        colorScheme="red"
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
            dispatch(setActiveModal(8));
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
            dispatch(setActiveModal(3));
          }}
        >
          Delete Character
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
            dispatch(setActiveModal(7));
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
            dispatch(setActiveModal(0)); // TODO: change to delete faction
          }}
        >
          Delete Faction
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export const DeleteNew = ({
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
