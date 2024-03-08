import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: ({ colorMode }: any) => ({
      body: {
        bg: colorMode === 'dark' ? '#272936' : 'gray.200',
        color: colorMode === 'dark' ? 'white' : 'black',
      },
      nav: {
        gap: 0,
      },
      button: {
        boxShadow: 'md',
        border: '1px solid black',
      },
      input: {
        boxShadow: 'md',
        border: '1px solid',
        borderColor: 'black',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        boxShadow: 'md',
        _focus: { boxShadow: 'none' },
      },
    },
    Input: {
      baseStyle: {
        field: {},
      },
      variants: {
        outline: {
          field: {
            border: '2px solid',
            borderColor: 'teal.500',
            _hover: {
              borderColor: 'teal.600',
            },
            _focus: {
              outline: 'none',
              borderColor: 'teal.700',
              boxShadow: 'none',
            },
          },
        },
      },
    },
    MenuItem: {
      baseStyle: {
        border: 'none',
        _focus: { bg: 'gray.200' },
      },
    },
  },
});
