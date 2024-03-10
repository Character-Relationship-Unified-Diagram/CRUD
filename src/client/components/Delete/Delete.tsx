import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  FormLabel,
  FormControl,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useColorModeValue,
  Select,
} from '@chakra-ui/react';
import { MinusIcon } from '@chakra-ui/icons';
import { useState, ReactNode, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveModal } from '../../redux/mainSlice';
import { RootState } from '../../redux/store';
import { useAuth } from '../../context/Authentication';

export const DeleteDiagram = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useDispatch();
  const { fetchMap } = useAuth();
  const [mapName, setMapName] = useState('');
  const selectedMap = useSelector((state: RootState) => state.main.selectedMap);
  const allMaps = useSelector((state: RootState) => state.main.allMaps);
  const options = allMaps.map((map) => (
    <option key={map.map_id} value={map.map_id}>
      {map.map_name}
    </option>
  ));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('/maps/delete-map', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mapID: mapName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);

      onClose();
      dispatch(setActiveModal(1));
      fetchMap({ mapID: selectedMap });
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
          <ModalHeader>Delete Map</ModalHeader>
          <ModalBody>
            <FormControl>
              <Select
                name="map"
                placeholder="Map Name"
                onChange={(event) => {
                  setMapName(event.target.value);
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
// add map_id to factions
export const DeleteRelationship = () => {
  const dispatch = useDispatch();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { fetchMap } = useAuth();
  const [mode, setMode] = useState<string | null>(null);
  const [selectedRel, setSelectedRel] = useState({
    char_sender: '',
    char_recipient: '',
    status_name: '',
  });

  const selectedMap = useSelector((state: RootState) => state.main.selectedMap);
  const selectedMapCharRelationships = useSelector(
    (state: RootState) => state.main.selectedMapCharRelationships,
  );
  const selectedMapFactionRelationships = useSelector(
    (state: RootState) => state.main.selectedMapFactionRelationships,
  );

  const characterOptions = selectedMapCharRelationships.map((relationship) => (
    <option
      key={relationship.sender_id}
      value={`${relationship.sender_id} ${relationship.recipient_id} ${relationship.status}`}
    >
      {relationship.source + ' -> ' + relationship.target}
    </option>
  ));

  const factionOptions = selectedMapFactionRelationships.map((relationship) => (
    <option
      key={relationship.faction_stat_id}
      value={`${relationship.faction_stat_id}`}
    >
      {relationship.source + ' -> ' + relationship.target}
    </option>
  ));
  console.log(selectedMapFactionRelationships)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(selectedRel);
    try {
      const response =
        mode === 'character'
          ? await fetch('/maps/delete-character-relationship', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ...selectedRel, mapID: selectedMap }),
            })
          : await fetch('/maps/delete-faction-status', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                faction_stat_id: selectedRel.status_name,
              }),
            });
      console.log(selectedRel.status_name);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Success:', result);

      onClose();
      dispatch(setActiveModal(null));
      fetchMap({ mapID: selectedMap });
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
        <ModalHeader>Delete Relationship</ModalHeader>
        <form onSubmit={onSubmit}>
          <ModalBody>
            <FormControl>
              <FormLabel>Relationship</FormLabel>
              <Select
                name="relationship"
                placeholder="Relationship"
                onChange={(event) => {
                  setMode(event.target.value);
                }}
              >
                <option value="character">Character</option>
                <option value="faction">Faction</option>
              </Select>
              {mode === 'character' && (
                <Select
                  name="relationship"
                  placeholder="Relationship"
                  onChange={(event) => {
                    const [char_sender, char_recipient, status_name] =
                      event.target.value.split(' ');
                    setSelectedRel({
                      char_sender,
                      char_recipient,
                      status_name,
                    });
                  }}
                >
                  {characterOptions}
                </Select>
              )}
              {mode === 'faction' && (
                <Select
                  name="relationship"
                  placeholder="Relationship"
                  onChange={(event) => {
                    setSelectedRel({
                      ...selectedRel,
                      status_name: event.target.value,
                    });
                  }}
                >
                  {factionOptions}
                </Select>
              )}
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

export const DeleteCharacter = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [characterID, setCharacterID] = useState('');
  const { fetchMap } = useAuth();
  const dispatch = useDispatch();
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

      onClose();
      dispatch(setActiveModal(null));
      fetchMap({ mapID: selectedMapCharacters[0].map_id });
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

export const DeleteFaction = () => {
  const allFactions = useSelector(
    (state: RootState) => state.main.selectedMapFactions,
  );
  const { fetchMap } = useAuth();
  const dispatch = useDispatch();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const selectedMap = useSelector((state: RootState) => state.main.selectedMap);
  const [factionID, setFactionID] = useState('');
  const options = allFactions.map((faction) => (
    <option key={faction.faction_id} value={faction.faction_id}>
      {faction.faction_name}
    </option>
  ));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('/maps/delete-faction', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ faction_id: factionID }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Success:', result);

      onClose();
      dispatch(setActiveModal(null));
      fetchMap({ mapID: selectedMap });
    } catch (error) {
      console.error('Error during faction creation:', error);
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
          <ModalHeader>Delete Faction</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Faction Name</FormLabel>
              <Select
                name="faction"
                placeholder="Faction Name"
                onChange={(event) => {
                  setFactionID(event.target.value);
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
          Delete Map
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
            dispatch(setActiveModal(10));
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
