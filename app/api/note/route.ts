import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

import { Topic, Note } from '@/utils/types';

// Opt out of caching for all data requests in the route segment
// See: https://github.com/orgs/vercel/discussions/4696#discussioncomment-7490969
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const topic = await sql<Topic>`
    SELECT * FROM topic
  `;

  const notes = await sql<Note>`
    SELECT * FROM note
  `;

  const groupedData = topic.rows.map((topicItem: Topic) => {
    const topicNotes = notes.rows.filter(
      (quote: any) => quote.topic_id === topicItem.id
    );
    return { topic: topicItem, notes: topicNotes };
  });

  return NextResponse.json({ topics: groupedData }, { status: 200 });
}
