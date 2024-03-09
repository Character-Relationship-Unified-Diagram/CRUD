import { LinkIcon } from '@chakra-ui/icons';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setActiveModal } from '../../redux/mainSlice';
import { useEffect } from 'react';
import { dispatch } from 'd3';

export const Share = () => {
  const dispatch = useDispatch();
  function onClick() {
    console.log('Share button clicked');
    dispatch(setActiveModal(4));
  }
  return (
    <Button
      colorScheme="teal"
      variant="outline"
      rightIcon={<LinkIcon />}
      onClick={onClick}
    >
      Share
    </Button>
  );
};

export const ShareModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  // generate a URL to share the currently selected map
  const selectedMap = useSelector((state: RootState) => state.main.selectedMap);

  useEffect(() => {
    if (!selectedMap) {
      onClose();
    } else {
      onOpen();
    }
  }, [selectedMap]);

  const onCloseModal = () => {
    dispatch(setActiveModal(null));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Share Map</ModalHeader>
        <ModalBody display="flex" justifyContent="center">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/view?pubID=${selectedMap}`,
              );
            }}
          >
            Copy Link
          </Button>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="center">
          Paste this link to share your map with others!
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
