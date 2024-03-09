import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface CharFormData {
  character_name: string;
  attr_value: { [key: string]: string };
  faction_name: string;
  character_descriptor: string;
  map_id: string;
}

interface Attribute {
  key: string;
  value: string;
}

export const NewCharacter = () => {
  const selectedMap = useSelector((state: RootState) => state.main.selectedMap);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [formData, setFormData] = useState<CharFormData>({
    character_name: '',
    attr_value: {},
    faction_name: '',
    character_descriptor: '',
    map_id: selectedMap as string,
  });

  const [attributes, setAttributes] = useState<Attribute[]>([
    { key: '', value: '' },
  ]);

  const handleAttributeChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newAttributes = attributes.map((attribute, i) => {
      if (index === i) {
        return { ...attribute, [event.target.name]: event.target.value };
      }
      return attribute;
    });
    setAttributes(newAttributes);
    updateCharacterAttributes(newAttributes);
  };

  const updateCharacterAttributes = (attributesArray: Attribute[]) => {
    const attributesObject: { [key: string]: string } = {};
    attributesArray.forEach((attribute) => {
      if (attribute.key) attributesObject[attribute.key] = attribute.value;
    });
    setFormData({ ...formData, attr_value: attributesObject });
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }]);
  };

  const handleRemoveAttribute = (index: number) => {
    const filteredAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(filteredAttributes);
    updateCharacterAttributes(filteredAttributes);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Character Creation Payload:', formData);
    
    try {
      const response = await fetch('/maps/create-character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error during character creation:', error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>New Character</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Character Name</FormLabel>
              <Input
                name="character_name"
                value={formData.character_name}
                onChange={handleChange}
                placeholder="Character Name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Character Attributes</FormLabel>
              {attributes.map((attribute, index) => (
                <HStack key={index} spacing={2}>
                  <Input
                    name="key"
                    value={attribute.key}
                    placeholder="Attribute"
                    onChange={(event) => handleAttributeChange(index, event)}
                  />
                  <Input
                    name="value"
                    value={attribute.value}
                    placeholder="Value"
                    onChange={(event) => handleAttributeChange(index, event)}
                  />
                  <IconButton
                    aria-label="Remove attribute"
                    icon={<CloseIcon />}
                    onClick={() => handleRemoveAttribute(index)}
                  />
                </HStack>
              ))}
              <Button mt={2} onClick={handleAddAttribute}>
                Add Attribute
              </Button>
            </FormControl>
            <FormControl>
              <FormLabel>Character Faction</FormLabel>
              <Input
                name="faction_name"
                value={formData.faction_name}
                onChange={handleChange}
                placeholder="Character Faction"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Character Descriptor</FormLabel>
              <Input
                name="character_descriptor"
                value={formData.character_descriptor}
                onChange={handleChange}
                placeholder="Character Descriptor"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="teal">
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
