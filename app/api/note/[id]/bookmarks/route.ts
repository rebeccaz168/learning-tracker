import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import {
  Topic,
  Note,
  BookMark,
  Folder,
  BookMarkWithInfo
} from '@/utils/types';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const topicId = params.id;

  const result = await sql`
    SELECT 
      b.id AS bookmark_id,
      b.title AS bookmark_title,
      b.noteId,
      b.topicId,
      b.folderId,
      
      f.id AS folder_id,
      f.name AS folder_name,
      
      n.id AS note_id,
      n.title AS note_title,
      n.reflection AS note_reflection,
      n.date AS note_date,
      n.topic_id AS note_topic_id,
      
      t.id AS topic_id,
      t.topic_name AS topic_name

    FROM bookmark b
    LEFT JOIN folder f ON b.folderId = f.id
    LEFT JOIN note n ON b.noteId = n.id
    LEFT JOIN topic t ON b.topicId = t.id
    WHERE b.topicId = ${topicId};
  `;

  const bookmarksWithInfo: BookMarkWithInfo[] = result.rows.map((row: any) => {
    const bookmark: BookMark = {
      id: row.bookmark_id,
      title: row.bookmark_title,
      noteId: row.noteid,
      topicId: row.topicid,
      folderId: row.folderid,
    };

    const folder: Folder = {
      id: row.folder_id,
      name: row.folder_name,
    };

    const note: Note = {
      id: row.note_id,
      topic_id: row.note_topic_id,
      title: row.note_title,
      reflection: row.note_reflection,
      date: row.note_date,
    };

    const topic: Topic = {
      id: row.topic_id,
      topic_name: row.topic_name,
    };

    return {
      bookmark,
      folder,
      note,
      topic,
    };
  });

  return NextResponse.json({ success: true, bookmarks: bookmarksWithInfo }, { status: 200 });
}
