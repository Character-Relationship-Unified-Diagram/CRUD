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
import { useDispatch } from 'react-redux';
import { setActiveModal } from '../../redux/mainSlice';

export const NewDiagram = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const dispatch = useDispatch();
  const [mapName, setMapName] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMapName(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('/maps/create-map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ map_name: mapName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      dispatch(setActiveModal(1));
      const result = await response.json();
      console.log('Success:', result);

      onClose();
      dispatch(setActiveModal(null));
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
          <ModalHeader>New Map</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Map Name</FormLabel>
              <Input
                name="mapName"
                value={mapName}
                onChange={handleChange}
                placeholder="Map Name"
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
