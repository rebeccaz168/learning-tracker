import { NextRequest, NextResponse } from 'next/server';
import { db, sql } from '@vercel/postgres';
import { faker } from '@faker-js/faker';
import { Topic } from '@/utils/types';

const seedDb = async ({ reset = false }: { reset?: boolean }) => {
  console.log('Creating tables');

  if (reset) {
    console.log('Resetting database');
    await sql`DROP TABLE IF EXISTS bookmark`;
    await sql`DROP TABLE IF EXISTS note`;
    await sql`DROP TABLE IF EXISTS topic`;
    await sql`DROP TABLE IF EXISTS folder`;
  
    // Create tables
    await sql`
      CREATE TABLE topic (
        id SERIAL PRIMARY KEY,
        topic_name TEXT
      );
    `;
  
    await sql`
      CREATE TABLE note (
        id SERIAL PRIMARY KEY,
        topic_id INTEGER,
        title TEXT,
        reflection TEXT,
        date TEXT,
        FOREIGN KEY(topic_id) REFERENCES topic(id) ON DELETE CASCADE
      );
    `;
  
    await sql`
      CREATE TABLE folder (
        id SERIAL PRIMARY KEY,
        name TEXT
      );
    `;
  
    await sql`
      CREATE TABLE bookmark (
        id SERIAL PRIMARY KEY,
        title TEXT,
        topic_id INTEGER,
        note_id INTEGER,
        folder_id INTEGER,
        FOREIGN KEY(topic_id) REFERENCES topic(id) ON DELETE CASCADE,
        FOREIGN KEY(note_id) REFERENCES note(id) ON DELETE CASCADE,
        FOREIGN KEY(folder_id) REFERENCES folder(id) ON DELETE CASCADE
      );
    `;
  }
  

  console.log('Seeding data');

  // Seed 5 topics
  const topics = Array.from({ length: 5 }, () => faker.company.catchPhrase());

  console.log('topics', topics);

  const createdTopics = await Promise.all(
    topics.map(
      (name) =>
        sql<Topic>`INSERT INTO topic (topic_name) VALUES (${name}) RETURNING id;`
    )
  );

  const topicRows = createdTopics.flatMap((t) => t.rows);

  const noteRows = topicRows.flatMap((topic) => {
    const sessionId = topic.id;

    return Array.from({ length: 5 }, () => {
      const title = faker.hacker.verb() + ' ' + faker.hacker.noun();
      const reflection = faker.lorem.paragraphs(2);
      const date = faker.date.recent().toISOString().split('T')[0];
      return [sessionId, title, reflection, date];
    });
  });

  await Promise.all(
    noteRows.map(
      (note) =>
        sql`INSERT INTO note (topic_id, title, reflection, date) VALUES (${note[0]}, ${note[1]}, ${note[2]}, ${note[3]})`
    )
  );

  console.log('created note rows:', noteRows);
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reset = searchParams.get('reset');

  try {
    await sql`BEGIN`;
    await seedDb({ reset: reset === 'true' });
    await sql`COMMIT`;
  } catch (error) {
    console.error(error);
    await sql`ROLLBACK`;
    return NextResponse.json({ success: false }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
