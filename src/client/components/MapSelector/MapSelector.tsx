import { ChangeEvent, useEffect } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { EditIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import {
  setActiveModal,
  setSelectedMap,
  setSelectedMapName,
} from '../../redux/mainSlice';
import { RootState } from '../../redux/store';

export const MapSelectorButton = () => {
  const dispatch = useDispatch();
  return (
    <Button
      colorScheme="blue"
      variant="outline"
      onClick={() => dispatch(setActiveModal(1))}
      rightIcon={<EditIcon />}
    >
      Select Map
    </Button>
  );
};

export const MapSelector = () => {
  const devBypassMapSelector = false;
  const dispatch = useDispatch();
  const maps = useSelector((state: RootState) => state.main.allMaps);
  const user = useSelector((state: RootState) => state.main.user.username);
  const {
    isOpen: isOpenSelection,
    onOpen: onOpenSelection,
    onClose: onCloseSelection,
  } = useDisclosure();

  useEffect(() => {
    if (!devBypassMapSelector) {
      onOpenSelection();
    }
  }, [maps]);

  const handleSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== '') {
      const [id, name] = e.target.value.split(' | ');
      dispatch(setSelectedMap(id));
      dispatch(setSelectedMapName(name));
      dispatch(setActiveModal(null));
      onCloseSelection();
    }
  };

  const mapOptions = maps.map((map: any, indx: number) => (
    <option
      value={`${map.map_id} | ${map.map_name}`}
      key={`${map.map_id}${indx}`}
    >
      {map.map_name}
    </option>
  ));

  return (
    <Modal
      isOpen={isOpenSelection}
      onClose={() => {
        dispatch(setActiveModal(null));
        onCloseSelection();
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          Map Selector <br /> {user}'s Maps
        </ModalHeader>
        <ModalBody>
          <Select
            shadow="lg"
            size="lg"
            borderRadius="md"
            placeholder="Select Map"
            borderColor="gray.400"
            _focus={{ borderColor: 'teal.500' }}
            _hover={{ borderColor: 'teal.500' }}
            onChange={handleSelection}
          >
            {mapOptions}
          </Select>
        </ModalBody>
        <ModalFooter
          display="flex"
          justifyContent="space-between"
          flexDirection="column"
        >
          <h1>
            <b>Don't see your map?</b>
          </h1>
          <Button
            colorScheme="green"
            variant="outline"
            rightIcon={<PlusSquareIcon />}
            onClick={() => dispatch(setActiveModal(2))}
          >
            Create New Map
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
