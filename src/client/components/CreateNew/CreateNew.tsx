import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  FormLabel,
  FormControl,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useColorModeValue,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { ArrowDownIcon, CloseIcon } from '@chakra-ui/icons';
import { useState, ReactNode, ChangeEvent, FormEvent } from 'react';


interface Attribute {
  key: string;
  value: string;
}

interface CharFormData {
  character: string;
  characterAttributes: { [key: string]: string };
  characterFaction: string;
  characterDescriptor: string;
}

interface DiagFormData {
  diagram: string;
  
}

export const NewDiagram = ({ cb }: { cb?: () => any }) => {
  const [ formData, setFormData ] = useState<DiagFormData>({
    diagram: ''
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const diagramCreationPayload = {
      ...formData
    };
    
    console.log('Diagram Creation Payload:', diagramCreationPayload);
    
    try {
      const response = await fetch('/maps/create-map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diagramCreationPayload),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Success:', result);

    } catch (error) {
      console.error('Error during diagram creation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ModalHeader>New Diagram</ModalHeader>
      <ModalBody>
        <FormControl>
          <FormLabel>Diagram Name</FormLabel>
          <Input
            name="diagram"
            value={formData.diagram}
            onChange={handleChange}
            placeholder="Diagram Name"
          />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" colorScheme="teal">
            Submit
        </Button>
        {/* <Button variant="ghost">Cancel</Button> */}
      </ModalFooter>
    </form>
  );
};

export const NewRelationship = () => {
  return <ModalHeader>Hello Relationship</ModalHeader>;
};

const NewCharacter = () => {
  const [formData, setFormData] = useState<CharFormData>({
    character: '',
    characterAttributes: {},
    characterFaction: '',
    characterDescriptor: '',
  });

  const [attributes, setAttributes] = useState<Attribute[]>([{ key: '', value: '' }]);

  const handleAttributeChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
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
    attributesArray.forEach(attribute => {
      if (attribute.key) attributesObject[attribute.key] = attribute.value;
    });
    setFormData({ ...formData, characterAttributes: attributesObject });
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
    
    const characterCreationPayload = {
      ...formData,
      characterAttributes: JSON.stringify(formData.characterAttributes),
    };
    
    console.log('Character Creation Payload:', characterCreationPayload);
    
    try {
      const response = await fetch('/maps/create-character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterCreationPayload),
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

  return (
    <form onSubmit={handleSubmit}>
        <ModalHeader>New Character</ModalHeader>
        <ModalBody>
        <FormControl>
          <FormLabel>Character Name</FormLabel>
          <Input
            name="character"
            value={formData.character}
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
          <Button mt={2} onClick={handleAddAttribute}>Add Attribute</Button>
        </FormControl>

        <FormControl>
          <FormLabel>Character Faction</FormLabel>
          <Input
            name="characterFaction"
            value={formData.characterFaction}
            onChange={handleChange}
            placeholder="Character Faction"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Character Descriptor</FormLabel>
          <Input
            name="characterDescriptor"
            value={formData.characterDescriptor}
            onChange={handleChange}
            placeholder="Character Descriptor"
          />
        </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" colorScheme="teal">
            Submit
          </Button>
          {/* <Button variant="ghost">Cancel</Button> */}
        </ModalFooter>
    </form>
  );
};

export const CreateNew = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selection, setSelection] = useState<ReactNode | null>(null);
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ArrowDownIcon />}
        colorScheme="green"
        variant={'outline'}
      >
        Create
      </MenuButton>
      <MenuList shadow={'md'} p={0} overflow={'hidden'}>
        <MenuItem
          border={'none'}
          shadow={'none'}
          transition={'background-color 0.2s ease-in-out'}
          _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
          }}
          onClick={() => {
            setSelection(<NewDiagram />);
            onOpen();
          }}
        >
          New Diagram
        </MenuItem>
      
        <MenuItem
          border={'none'}
          shadow={'none'}
          transition={'background-color 0.2s ease-in-out'}
          _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
          }}
          onClick={() => {
            setSelection(<NewCharacter />);
            onOpen();
          }}
        >
          New Character
        </MenuItem>

        <MenuItem
          border={'none'}
          shadow={'none'}
          transition={'background-color 0.2s ease-in-out'}
          _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
          }}
          onClick={() => {
            setSelection(<NewRelationship />);
            onOpen();
          }}
        >
          New Relationship
        </MenuItem>
      </MenuList>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton onClick={onClose} />
          {selection}
        </ModalContent>
      </Modal>
    </Menu>
  );
};
