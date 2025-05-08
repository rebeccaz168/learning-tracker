import { createNote } from '@/utils/api';
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

export const AddNoteModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [reflection, setReflection] = useState('');
  const [topicName, setTopicName] = useState('');

 
  const handleCreateNote = async (title: string, reflection: string, topic_name: string) => {
    // missing fields 
    if (!title || !reflection || !topicName) return;
    try{
      await createNote(title, reflection, topic_name)
      onClose(); // close the modal after note creation 
    }catch(err){
      console.error('Error creating note')
    }
  }

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
            <Button colorScheme="green" onClick={()=> handleCreateNote(title, reflection, topicName)}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

