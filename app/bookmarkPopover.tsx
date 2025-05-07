import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  Input,
  VStack,
  Text,
  Box,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Folder } from '@/utils/types';

interface BookmarkPopoverProps {
  folders: Folder[];
  onSave: (folderId: string, title: string) => void;
}

export const BookmarkPopover = ({ folders, onSave }: BookmarkPopoverProps) => {
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [titleTouched, setTitleTouched] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { onClose, onOpen, isOpen } = useDisclosure();

  const handleSave = () => {
    setTitleTouched(true);

    if (!bookmarkTitle.trim()) return;

    setIsSaving(true);
    onSave(selectedFolderId, bookmarkTitle);
    setBookmarkTitle('');
    setSelectedFolderId('');
    setSaveSuccess(true);

    setTimeout(() => {
      setSaveSuccess(false);
      setIsSaving(false);
      setTitleTouched(false);
      onClose();
    }, 1000);
  };

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="bottom">
      <PopoverTrigger>
        <Button>Add to Folder</Button>
      </PopoverTrigger>

      <PopoverContent>
        <PopoverBody>
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontSize="sm" mb={1}>
                Choose a folder:
              </Text>
              {folders.map((folder: Folder) => (
                <Button
                  key={folder.id}
                  variant={selectedFolderId === folder.id ? 'solid' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedFolderId(folder.id)}
                  width="100%"
                >
                  {folder.name || 'Untitled'}
                </Button>
              ))}
            </Box>

            <FormControl isInvalid={titleTouched && !bookmarkTitle.trim()} isRequired>
              <FormLabel>
                Bookmark title <Text as="span" color="red.500">*</Text>
              </FormLabel>
              <Input
                placeholder="Enter bookmark title"
                value={bookmarkTitle}
                onChange={(e) => setBookmarkTitle(e.target.value)}
                onBlur={() => setTitleTouched(true)}
              />
              <FormErrorMessage>Title is required</FormErrorMessage>
            </FormControl>

            <Button
              colorScheme="teal"
              onClick={handleSave}
              isDisabled={!selectedFolderId}
              isLoading={isSaving}
            >
              {saveSuccess ? 'Saved!' : 'Save Bookmark'}
            </Button>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
