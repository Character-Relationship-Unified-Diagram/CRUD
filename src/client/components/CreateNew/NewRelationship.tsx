import {
  FormLabel,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  Button,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Character, Faction } from '../../../types/data';
import { useAuth } from '../../context/Authentication';
import { setActiveModal } from '../../redux/mainSlice';

const createCharacterRelationship = async (
  charRecipient: string,
  charSender: string,
  status_name: string,
) => {
  try {
    const response = await fetch('/maps/create-character-relationship', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        char_recipient: charRecipient,
        char_sender: charSender,
        status_name,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error during character relationship creation:', error);
  }
};

const createFactionRelationship = async (
  faction_sender: string,
  faction_recipient: string,
  status_name: string,
) => {
  if (!faction_sender || !faction_recipient || !status_name) {
    throw new Error('Missing required fields');
  }
  try {
    const response = await fetch('/maps/create-faction-relationship', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ faction_sender, faction_recipient, status_name }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error during faction relationship creation:', error);
  }
};

const NewCharacterRelationship = ({
  setStatusReceiver,
  setStatusSender,
}: any) => {
  // provide 2 selections, character one and character two
  const allCharacters = useSelector(
    (state: RootState) => state.main.selectedMapCharacters,
  );
  const [receiverFiltered, setReceiverFiltered] =
    useState<Character[]>(allCharacters);

  const senderOptions = allCharacters.map((char: Character, indx: number) => (
    <option value={char.character_id} key={char.character_name + indx}>
      {char.character_name}
    </option>
  ));

  const receiverOptions = receiverFiltered.map(
    (char: Character, indx: number) => (
      <option value={char.character_id} key={char.character_name + indx}>
        {char.character_name}
      </option>
    ),
  );

  function onSenderChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const senderValue = e.target.value;
    const filteredOptions = allCharacters.filter(
      (character) => character.character_name !== senderValue,
    );
    setStatusSender(senderValue);
    // update options for receiver
    setReceiverFiltered(filteredOptions);
  }

  function onReceiverChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const receiverValue = e.target.value;
    setStatusReceiver(receiverValue);
  }

  return (
    <>
      <FormLabel>Relationship Sender</FormLabel>
      <Select placeholder="Select Character Sender" onChange={onSenderChange}>
        {senderOptions}
      </Select>
      <FormLabel>Relationship Receiver</FormLabel>
      <Select
        placeholder="Select Character Reciever"
        onChange={onReceiverChange}
      >
        {receiverOptions}
      </Select>
    </>
  );
};

const NewFactionRelationship = ({
  setStatusReceiver,
  setStatusSender,
}: any) => {
  // provide 2 selections, faction one and faction two
  const allFactions = useSelector(
    (state: RootState) => state.main.selectedMapFactions,
  );
  const [receiverFiltered, setReceiverFiltered] =
    useState<Faction[]>(allFactions);

  const handleSenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const senderValue = e.target.value;
    const filteredOptions = allFactions.filter(
      (faction) => faction.faction_id !== senderValue,
    );
    setStatusSender(senderValue);
    // update options for receiver
    setReceiverFiltered(filteredOptions);
  };

  const handleReceiverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const receiverValue = e.target.value;
    setStatusReceiver(receiverValue);
  };

  const senderOptions = allFactions.map((faction: Faction, indx: number) => (
    <option value={faction.faction_id} key={faction.faction_id + indx}>
      {faction.faction_name}
    </option>
  ));

  const receiverOptions = receiverFiltered.map(
    (faction: Faction, indx: number) => (
      <option value={faction.faction_id} key={faction.faction_id + indx}>
        {faction.faction_name}
      </option>
    ),
  );

  return (
    <>
      <FormLabel>Relationship Sender</FormLabel>
      <Select placeholder="Select Faction Sender" onChange={handleSenderChange}>
        {senderOptions}
      </Select>
      <FormLabel>Relationship Receiver</FormLabel>
      <Select
        placeholder="Select Faction Receiver"
        onChange={handleReceiverChange}
      >
        {receiverOptions}
      </Select>
    </>
  );
};

export const NewRelationship = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [mode, setMode] = useState<'character' | 'faction' | null>(null);
  const selectedMap = useSelector((state: RootState) => state.main.selectedMap);
  const dispatch = useDispatch();
  const { fetchMap } = useAuth();
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    relationshipStatus: '',
    statusSender: '',
    statusReceiver: '',
  });

  useEffect(() => {
    console.log('formData:', formData);
  }, [formData]);

  function setStatusSender(sender: string) {
    setFormData({ ...formData, statusSender: sender });
  }

  function setStatusReceiver(receiver: string) {
    setFormData({ ...formData, statusReceiver: receiver });
  }

  function setRelationshipStatus(status: string) {
    setFormData({ ...formData, relationshipStatus: status });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mode === 'character') {
      createCharacterRelationship(
        formData.statusReceiver,
        formData.statusSender,
        formData.relationshipStatus,
      ).then(() => fetchMap({ mapID: selectedMap }));
    } else if (mode === 'faction') {
      createFactionRelationship(
        formData.statusSender,
        formData.statusReceiver,
        formData.relationshipStatus,
      ).then(() => fetchMap({ mapID: selectedMap }));
    }

    onClose();
    dispatch(setActiveModal(null));
  }

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, []);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Relationship</ModalHeader>
        <ModalBody>
          <form onSubmit={onSubmit}>
            <FormControl display="flex" flexDirection="column">
              <FormLabel>Relationship Type</FormLabel>
              <Select
                placeholder="Select Relationship Type"
                display="flex"
                flexDirection="column"
                gap={2}
                onChange={(e) => {
                  setMode(e.target.value as 'character' | 'faction');
                }}
              >
                <option value="character">Character</option>
                <option value="faction">Faction</option>
              </Select>
              <FormLabel>Relationship Status</FormLabel>
              <Select
                placeholder="Select Relationship Status"
                onChange={(e) => setRelationshipStatus(e.target.value)}
              >
                <option value="friend">Friend</option>
                <option value="enemy">Enemy</option>
                <option value="neutral">Neutral</option>
              </Select>
              {mode === 'character' && (
                <NewCharacterRelationship
                  formData={formData}
                  setStatusReceiver={setStatusReceiver}
                  setStatusSender={setStatusSender}
                />
              )}
              {mode === 'faction' && (
                <NewFactionRelationship
                  formData={formData}
                  setStatusReceiver={setStatusReceiver}
                  setStatusSender={setStatusSender}
                />
              )}
            </FormControl>
            <Button type="submit" colorScheme="teal">
              Submit
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
