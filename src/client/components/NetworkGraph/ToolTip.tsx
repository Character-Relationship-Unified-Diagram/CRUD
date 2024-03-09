import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface ToolTipProps {
  children: React.ReactNode;
}

export const ToolTip = ({ children }: ToolTipProps) => {
  return (
    <Box
      bg="blue.500"
      color={useColorModeValue('black', 'white')}
      p="1rem"
      textShadow={useColorModeValue('0 0 5px white', '0 0 0.5rem black')}
      rounded={'1rem'}
      maxWidth={'370px'}
      textAlign={'center'}
      border="1px"
      borderColor="lightgray"
      borderStyle="solid"
    >
      {children}
    </Box>
  );
};
