'use client';

import { useEffect, useState } from 'react';
import { fetchBookmark, fetchSummary, fetchTranscript } from '@/utils/api';
import { BookMarkWithInfo, Transcript, TranscriptWithQA } from '@/utils/types';


import { Box, Heading, Text, Stack, Divider, Container, Button, WrapItem, Wrap, Spinner } from '@chakra-ui/react';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState<BookMarkWithInfo[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookMarkWithInfo[]>([]);
  const [transcriptId, setTranscriptId] = useState('all');
  const [transcripts, setTranscripts] = useState<TranscriptWithQA[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // get all the transcripts 
  useEffect(() => {
    const getTranscripts = async () => {
      try {
        const data = await fetchTranscript();
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
        transcripts.map(async (t: TranscriptWithQA) => {
            const data = await fetchBookmark(t.transcript.id);
            return data.bookmarks || [];
            })
        );

        // Flatten the array of arrays
        const mergedBookmarks = allBookmarks.flat();
        setBookmarks(mergedBookmarks);
    };

    loadAllBookmarks();
    }, [transcripts]);

    // Filter bookmarks by selected transcriptId
    useEffect(() => {
        // create default case 
        if (transcriptId === 'all') {
          setFilteredBookmarks(bookmarks);
        } else {
          const filtered = bookmarks.filter(b => b.transcript.id === transcriptId);
          setFilteredBookmarks(filtered);
        }
      }, [bookmarks, transcriptId]);
      

  // download all the bookmarks (not filtered)
  const handleDownloadCSV = () => {
    const headers = [
      'Bookmark Title',
      'Interview Name',
      'Folder Name',
      'Question',
      'Answer'
    ];
  
    const rows = bookmarks.map(({ bookmark, folder, transcript, transcriptQA }) => [
      `"${bookmark.title}"`,
      `"${transcript.interview_name}"`,
      `"${folder.name}"`,
      `"${transcriptQA.question}"`,
      `"${transcriptQA.answer}"`
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
    const combinedAnswers : string = filteredBookmarks.map(b => b.transcriptQA.answer).join(' ');
    try {
      const response = await fetchSummary(combinedAnswers, transcriptId)
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
            variant={transcriptId === 'all' ? 'solid' : 'outline'}
            onClick={() => setTranscriptId('all')}
            >
            All
            </Button>
        </WrapItem>

        {transcripts.map(t => (
            <WrapItem key={t.transcript.id}>
            <Button
                variant={transcriptId === t.transcript.id ? 'solid' : 'outline'}
                onClick={() => setTranscriptId(t.transcript.id)}
            >
                {t.transcript.interview_name}
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
        {filteredBookmarks?.map(({ bookmark, folder,  transcript, transcriptQA}) => (
          <Box key={bookmark.id} borderWidth="1px" borderRadius="lg" p={4} boxShadow="sm">
            <Heading as="h3" size="md" mb={2}>
              {bookmark.title}
            </Heading>

            <Text fontSize="sm" color="gray.600">
              <strong>Interview:</strong> {transcript.interview_name}
            </Text>
            <Text fontSize="sm" color="gray.600">
              <strong>Folder:</strong> {folder.name}
            </Text>

            <Divider my={2} />

            <Text>
              <strong>Question:</strong> {transcriptQA.question}
            </Text>
            <Text>
              <strong>Answer:</strong> {transcriptQA.answer}
            </Text>
          </Box>
        ))}
      </Stack>
    </Container>
  );
};

export default BookmarksPage;
