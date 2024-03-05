import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons';
import React from 'react';

export const FilterBtn = () => {
  return (
  <Menu>
    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
      Filter by...
    </MenuButton>
      <MenuList>
        <MenuItem>Primary Affiliation</MenuItem>
        <MenuItem>Secondary Affiliation</MenuItem>
      </MenuList>
  </Menu>
  )
}