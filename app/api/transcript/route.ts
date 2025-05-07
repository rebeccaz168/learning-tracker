import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

import { Transcript, TranscriptQA } from '@/utils/types';

// Opt out of caching for all data requests in the route segment
// See: https://github.com/orgs/vercel/discussions/4696#discussioncomment-7490969
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const transcript = await sql<Transcript>`
    SELECT * FROM transcript
  `;

  const quotes = await sql<TranscriptQA>`
    SELECT * FROM transcript_question_answer
  `;

  const groupedData = transcript.rows.map((transcriptItem: Transcript) => {
    const transcriptQuotes = quotes.rows.filter(
      (quote: any) => quote.transcript_id === transcriptItem.id
    );
    return { transcript: transcriptItem, quotes: transcriptQuotes };
  });

  return NextResponse.json({ transcripts: groupedData }, { status: 200 });
}
