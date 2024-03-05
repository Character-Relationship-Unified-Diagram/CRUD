import {
  Button,
  Input,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useColorModeValue,
  useColorMode,
  Stack,
} from '@chakra-ui/react';
import { 
  MoonIcon,
  SunIcon, 
} from '@chakra-ui/icons';

import { FilterBtn } from '../Filter';
import React from 'react';


export const ToolsDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef<HTMLButtonElement>(null)
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        Start Relating
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>CRUD</DrawerHeader>

          <DrawerBody>
            <Stack spacing={4}>
              <Button colorScheme='teal'>Create New</Button>
              <FilterBtn />
              <Button variant='outline'>
                Edit
              </Button>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
              <Button onClick={toggleColorMode}>
                  {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}


