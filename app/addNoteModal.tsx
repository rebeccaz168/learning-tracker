import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
  Textarea,
} from '@chakra-ui/react';
import { useState } from 'react';


interface AddNoteModalProps {
  onAddNote: (note: { title: string; reflection: string; topic_name: string }) => void;
}

export const AddNoteModal = ({ onAddNote }: AddNoteModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [reflection, setReflection] = useState('');
  const [topicName, setTopicName] = useState('');

  const handleAdd = () => {
    if (!title || !reflection || !topicName) return;

    onAddNote({ title, reflection, topic_name: topicName });
    setTitle('');
    setReflection('');
    setTopicName('');
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="green" ml={3}>
        Add Note
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Note</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Reflection"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
              />
              <Input
                placeholder="Topic name"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={handleAdd}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

