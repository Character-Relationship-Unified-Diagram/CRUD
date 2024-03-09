import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveModal } from '../../redux/mainSlice';
import { RootState } from '../../redux/store';
import { useAuth } from '../../context/Authentication';

interface DiagFormData {
  faction: string;
}

export const NewFaction = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useDispatch();
  const selectedMap = useSelector((state: RootState) => state.main.selectedMap);
  const [faction_name, setFactionName] = useState<string>('');
  const { fetchMap } = useAuth();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFactionName(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('/maps/create-faction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ faction_name, map_id: selectedMap }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchMap({ mapID: selectedMap });
      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error during faction creation:', error);
    }

    onClose();
    dispatch(setActiveModal(null));
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
          <ModalHeader>New Faction</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Faction Name</FormLabel>
              <Input
                name="faction"
                value={faction_name}
                onChange={handleChange}
                placeholder="Faction Name"
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
