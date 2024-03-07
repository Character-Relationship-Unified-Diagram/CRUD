import { Box, Text } from '@chakra-ui/react';
import './Legend.css';

export const Legend = () => {
  return (
    <Box className="legend">
      <Box className="legend__item">
        <span className="legend__color legend__color--red">⬤</span>
        <Text className="legend__label">Negative</Text>
      </Box>
      <Box className="legend__item">
        <span className="legend__color legend__color--gray">⬤</span>
        <Text className="legend__label">Neutral</Text>
      </Box>
      <Box className="legend__item">
        <span className="legend__color legend__color--green">⬤</span>
        <Text className="legend__label">Positive</Text>
      </Box>
    </Box>
  );
};
