import { NextRequest, NextResponse } from 'next/server';
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

// end point to create a new note and insert it in the database 
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, reflection, topic_name } = body;

  if (!title || !reflection || !topic_name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // check to see if there is already an existing topic with the topic name 
    const existingTopic = await sql<Topic>`
      SELECT * FROM topic WHERE topic_name = ${topic_name}
    `;

    let topicId: string;

    if (existingTopic.rows.length > 0) {
      // Topic exists, use its ID
      topicId = existingTopic.rows[0].id;
    } else {
      // Create a new topic
      const newTopic = await sql<Topic>`
        INSERT INTO topic (topic_name)
        VALUES (${topic_name})
        RETURNING *
      `;
      topicId = newTopic.rows[0].id;
    }

    // Create the note with the associated topic_id
    const newNote = await sql<Note>`
      INSERT INTO note (title, reflection, topic_id)
      VALUES (${title}, ${reflection}, ${topicId})
      RETURNING *
    `;

    return NextResponse.json({ note: newNote.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('Error creating note with topic:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}