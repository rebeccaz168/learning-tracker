'use client';

import { useEffect, useState } from 'react';
import { fetchBookmark, fetchSummary, fetchNote } from '@/utils/api';
import { BookMarkWithInfo, Note, Topic, TopicWithNote } from '@/utils/types';


import { Box, Heading, Text, Stack, Divider, Container, Button, WrapItem, Wrap, Spinner } from '@chakra-ui/react';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState<BookMarkWithInfo[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookMarkWithInfo[]>([]);
  const [topicId, setTopicId] = useState('all');
  const [transcripts, setTranscripts] = useState<TopicWithNote[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  console.log("inside bookmarks page", bookmarks);
  // get all the transcripts 
  useEffect(() => {
    const getTranscripts = async () => {
      try {
        const data = await fetchNote();
        setTranscripts(data.transcripts || []);
      } catch (error) {
        console.error('Error fetching transcripts:', error);
      }
    };

    getTranscripts();
  }, []);


  // once transcripts are loaded get all of the bookmarks 
  useEffect(() => {
    const loadAllBookmarks = async () => {
        if (transcripts.length === 0) return;
        const allBookmarks = await Promise.all(
        transcripts.map(async (t: TopicWithNote) => {
            const data = await fetchBookmark(t.topic.id);
            return data.bookmarks || [];
            })
        );

        // Flatten the array of arrays
        const mergedBookmarks = allBookmarks.flat();
        setBookmarks(mergedBookmarks);
    };

    loadAllBookmarks();
    }, [transcripts]);

    // Filter bookmarks by selected topicId
    useEffect(() => {
        // create default case 
        if (topicId === 'all') {
          setFilteredBookmarks(bookmarks);
        } else {
          const filtered = bookmarks.filter(b => b.topic.id === topicId);
          setFilteredBookmarks(filtered);
        }
      }, [bookmarks, topicId]);
      

  // download all the bookmarks (not filtered)
  const handleDownloadCSV = () => {
    const headers = [
      'Bookmark Title',
      'Interview Name',
      'Folder Name',
      'Question',
      'Answer'
    ];
    
    // need to check this type 
    const rows = bookmarks.map(({ bookmark, folder, topic, note }) => [
      `"${bookmark.title}"`,
      `"${topic.topic_name}"`,
      `"${folder.name}"`,
      `"${note.title}"`,
      `"${note.reflection}"`
    ]);
  
    const csvContent =
      [headers, ...rows].map(row => row.join(',')).join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'bookmarks.csv');
    link.click();
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary(null);
    const combinedAnswers : string = filteredBookmarks.map(b => b.note.reflection).join(' ');
    try {
      const response = await fetchSummary(combinedAnswers, topicId)
      setSummary(response.summary || 'No summary returned');
    } catch (error) {
      console.error('Error summarizing:', error);
      setSummary('Failed to summarize.');
    } finally {
      setIsSummarizing(false);
    }
  };

  
  return (
    <Container maxW="container.md" py={8}>
      <Heading mb={6}>Bookmarks</Heading>
      <Button onClick = {handleDownloadCSV}> Download CSV </Button>
      <Button onClick={handleSummarize} isDisabled={filteredBookmarks.length === 0}>
        {isSummarizing ? <Spinner size="sm" /> : 'Summarize'}
      </Button>
    
      <Wrap spacing={2} mb={6}>
        <WrapItem>
            <Button
            variant={topicId === 'all' ? 'solid' : 'outline'}
            onClick={() => setTopicId('all')}
            >
            All
            </Button>
        </WrapItem>

        {transcripts.map(t => (
            <WrapItem key={t.topic.id}>
            <Button
                variant={topicId === t.topic.id ? 'solid' : 'outline'}
                onClick={() => setTopicId(t.topic.id)}
            >
                {t.topic.topic_name}
            </Button>
            </WrapItem>
        ))}
        </Wrap>

      {/* Summary Box */}
      {summary && summary.length > 0 && (
        <Box
            p={6}
            bg="white"
            borderRadius="md"
            boxShadow="md"
            w="full"
            mt={6}
        >
            <Heading size="md" mb={4} color="teal.600">Summary</Heading>
            <Text fontSize="lg" color="gray.700">
            {summary}
            </Text>
        </Box>
      )}
      <Stack spacing={6}>
        {filteredBookmarks?.map(({ bookmark, folder,  topic, note}) => (
          <Box key={bookmark.id} borderWidth="1px" borderRadius="lg" p={4} boxShadow="sm">
            <Heading as="h3" size="md" mb={2}>
              {bookmark.title}
            </Heading>

            <Text fontSize="sm" color="gray.600">
              <strong>Topic:</strong> {topic.topic_name}
            </Text>
            <Text fontSize="sm" color="gray.600">
              <strong>Folder:</strong> {folder.name}
            </Text>

            <Divider my={2} />

            <Text>
              <strong>Title:</strong> {note.title}
            </Text>
            <Text>
              <strong>Reflection:</strong> {note.reflection}
            </Text>
          </Box>
        ))}
      </Stack>
    </Container>
  );
};

export default BookmarksPage;
