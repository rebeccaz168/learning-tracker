'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Flex, HStack, Heading, Input, Link, Popover, PopoverContent, PopoverTrigger, Portal, Text, VStack} from '@chakra-ui/react';
import { fetchNote, fetchFolder, createFolder, createBookmark } from '@/utils/api';
import { Folder, TopicWithNote } from '@/utils/types';
import { BookmarkPopover } from './bookmarkPopover';

const Home = () => {
  const [notes, setNotes] = useState<TopicWithNote[] | null>(
    null
  );
  const [folders, setFolders] = useState<Folder[] | null> (
    null 
  );
  const [loading, setLoading] = useState(false);
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchNote()
      .then((data) => {
        setNotes(data.topics);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchFolder()
      .then((data) => {
        setFolders(data.folders);
      })
      .catch(() => {
        console.error("Error fetching folders");
      });
  }, []); 

  const handleCreateFolder = async () => {
    try {
      const data = await createFolder(folderName);

    // Immediately update local folders state
    setFolders((prev) => prev ? [data.folder, ...prev] : [data.folder]);
    } catch (err) {
      console.error('Error creating folder:', err);
    }
    // reset folder name 
    setFolderName('')
  }

  const handleCreateBookmark = async (folderId: string, transcriptQId: string, transcriptId: string, title: string) => {
    //future add : check if that bookmark is already added => get what folder it is in, don't want to add duplicates 
    try{
      const data = await createBookmark(title, transcriptQId, transcriptId, folderId)
      console.log('Created bookmark:', data.bookmark)
    }catch(err){
      console.error('Error creating new bookmark')
    }
  }

  return (
    <HStack align="flex-start" height="full" width="full" spacing={0}>
      {/* Navigation Sidebar */}
      <Box
        maxWidth="250px"
        width="full"
        bg="gray.100"
        p={4}
        height="100vh"
        position="sticky"
        top={0}
      >
        <Flex direction="column" justify="space-between" height="full">
        {/* Top section: Transcripts */}
        <VStack align="stretch" width="full" spacing={2}>
          {notes?.map(({ topic }) => (
            <Link
              p={2}
              key={topic.id}
              href={`#${topic.id}`}
              borderRadius="md"
              _hover={{ bg: 'teal.100' }}
            >
              <Text fontSize="sm" >{topic.topic_name}</Text>
            </Link>
          ))}
        </VStack>
        {/* Bottom section: Bookmarks */}
        <VStack align="stretch" width="full" spacing={2}>
          <Link href = "/bookmarks"> Folders </Link>
          {folders?.map((folder) => (
              <Text key={folder.id} fontSize="sm" color="gray.700">{folder.name || 'untitled'}</Text>
          ))}
          <Popover>
            <PopoverTrigger>
              <Button>Create New Folder + </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Folder name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                />
                <Button onClick={handleCreateFolder}>Create</Button>
              </div>
            </PopoverContent>
          </Popover>
        </VStack>
        </Flex>
      </Box>

      {/* Main Content */}
      <VStack
        p={8}
        spacing={8}
        align="stretch"
        bg="gray.50"
        borderRadius="md"
        boxShadow="lg"
        w="full"
      >
        {loading && <Box>Loading...</Box>}
        {notes?.map(({ topic, notes }) => (
          <Box
            id={topic.id}
            key={topic.id}
            p={6}
            bg="white"
            borderRadius="md"
            boxShadow="md"
          >
            <Heading size="md" mb={4} color="teal.600">
              Study Topics
            </Heading>
            <Text fontSize="lg" mb={6} color="gray.700">
              {topic.topic_name}
            </Text>

            <Heading size="md" mb={4} color="teal.600">
              Notes
            </Heading>

            <VStack align="stretch" spacing={6}>
              {notes?.map((note) => (
                <VStack
                  key={note.id}
                  align="stretch"
                  borderWidth={1}
                  borderRadius="md"
                  spacing={4}
                  p={6}
                  bg="gray.100"
                  boxShadow="sm"
                >
                  <Text fontWeight="bold" fontSize="lg" color="teal.700">
                    {note.title}
                  </Text>
                  <Text fontSize="md" color="gray.800">
                    {note.reflection}
                  </Text>
                  <BookmarkPopover
                    folders={folders || []}
                    onSave={(folderId, title) => {
                      handleCreateBookmark(folderId, note.id, topic.id, title)
                    }}
                  />
                </VStack>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    </HStack>
  );
};

export default Home;
