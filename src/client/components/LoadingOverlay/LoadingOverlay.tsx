import { Modal, ModalContent, ModalOverlay, Spinner } from '@chakra-ui/react';

export const LoadingOverlay = ({
  size,
  colorScheme,
}: {
  size?: string;
  colorScheme?: string;
}) => {
  return (
    <Modal isOpen={true} onClose={() => {}} isCentered>
      <ModalOverlay />
      <ModalContent
        bg={'transparent'}
        shadow={'none'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Spinner size={size || 'md'} colorScheme={colorScheme || 'blue'} />
      </ModalContent>
    </Modal>
  );
};
