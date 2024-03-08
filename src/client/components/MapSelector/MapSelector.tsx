import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Select,
  ModalFooter,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { ChangeEvent, useEffect } from 'react';
import { NewDiagram } from '../CreateNew/CreateNew';
import { setSelectedMap, setSelectedMapName } from '../../redux/mainSlice';
import { RootState } from '../../redux/store';

export const MapSelector = () => {
  //! set true to bypass map selector
  const devBypassMapSelector = false;
  const dispatch = useDispatch();
  const maps = useSelector((state: RootState) => state.main.allMaps);
  const user = useSelector((state: RootState) => state.main.user.username);
  const mapOptions = maps.map((map: any, indx: number) => {
    return (
      <option value={map.map_id + ' | ' + map.map_name} key={map.map_id + indx}>
        {map.map_name}
      </option>
    );
  });
  const {
    isOpen: isOpenSelection,
    onOpen: onOpenSelection,
    onClose: onCloseSelection,
  } = useDisclosure();
  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onClose: onCloseCreate,
  } = useDisclosure();

  useEffect(() => {
    if (!devBypassMapSelector) {
      onOpenSelection();
    }
  }, [maps]);

  function onSelection(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value !== '') {
      const [id, name] = e.target.value.split(' | ');
      console.log(e.target.value.split(' | '));
      dispatch(setSelectedMap(id));
      dispatch(setSelectedMapName(name));
      onCloseSelection();
    }
  }
  function onCreateNew() {
    onCloseSelection();
    onOpenCreate();
  }
  function onNewMap() {
    onCloseCreate();
    onOpenSelection();
  }

  return isOpenSelection ? (
    <>
      <Modal isOpen={isOpenSelection} onClose={onCloseSelection} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={'center'}>
            Map Selector <br /> {user}'s Maps
          </ModalHeader>
          <ModalBody>
            <Select
              shadow={'lg'}
              size={'lg'}
              borderRadius={'md'}
              placeholder="Select Map"
              borderColor={'gray.400'}
              _focus={{ borderColor: 'teal.500' }}
              _hover={{ borderColor: 'teal.500' }}
              onChange={onSelection}
            >
              {mapOptions}
            </Select>
          </ModalBody>
          <ModalFooter
            display={'flex'}
            justifyContent={'space-between'}
            flexDirection={'column'}
          >
            <h1>
              <b>Don't see your map?</b>
            </h1>
            <Button
              colorScheme="green"
              variant={'outline'}
              rightIcon={<PlusSquareIcon />}
              onClick={onCreateNew}
            >
              Create New Map
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  ) : (
    <Modal isOpen={isOpenCreate} onClose={onCloseCreate} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={'center'}>Create New Map</ModalHeader>
        <NewDiagram cb={onNewMap} />
      </ModalContent>
    </Modal>
  );
};
