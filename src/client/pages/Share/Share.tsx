import { LinkIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export const Share = () => {
  // generate a URL to share the currently selected map
  const selectedMap = useSelector((state: RootState) => state.main.selectedMap);
  return (
    <Button colorScheme="teal" variant="outline" rightIcon={<LinkIcon />}>
      Share
    </Button>
  );
};
