import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import {Transcript, TranscriptQA, BookMark, Folder, BookMarkWithInfo} from '@/utils/types';


export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const transcriptId = params.id;
  const { title, transcriptQId, folderId } = await req.json();

  const result = await sql`
    INSERT INTO bookmarks (title, transcript_question_answer_id, transcript_id, folder_id)
    VALUES (${title}, ${transcriptQId}, ${transcriptId}, ${folderId})
    RETURNING *;
  `;

  const newBookmark = result.rows[0];

  return NextResponse.json({ success: true, bookmark: newBookmark }, { status: 201 });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const transcriptId = params.id;

  const result = await sql`
    SELECT 
      b.id AS bookmark_id,
      b.title AS bookmark_title,
      b.transcript_question_answer_id,
      b.transcript_id,
      b.folder_id,
      f.id AS folder_id,
      f.name AS folder_name,
      t.id AS transcript_id,
      t.interview_name AS transcript_interview_name,
      q.id AS transcript_qa_id,
      q.question AS transcript_question,
      q.answer AS transcript_answer
    FROM bookmarks b
    LEFT JOIN folders f ON b.folder_id = f.id
    LEFT JOIN transcript t ON b.transcript_id = t.id
    LEFT JOIN transcript_question_answer q ON b.transcript_question_answer_id = q.id
    WHERE b.transcript_id = ${transcriptId}
  `;

  const bookmarksWithInfo: BookMarkWithInfo[] = result.rows.map((row: any) => {
    const bookmark: BookMark = {
      id: row.bookmark_id,
      title: row.bookmark_title,
      transcriptQId: row.transcript_question_answer_id,
      transcriptId: row.transcript_id,
      folderId: row.folder_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    const folder: Folder = {
      id: row.folder_id,
      name: row.folder_name,
    };

    const transcript: Transcript = {
      id: row.transcript_id,
      interview_name: row.transcript_interview_name,
    };

    const transcriptQA: TranscriptQA = {
      id: row.transcript_qa_id,
      transcript_id: row.transcript_id,
      question: row.transcript_question,
      answer: row.transcript_answer,
    };

    return {
      bookmark,
      folder,
      transcriptQA,
      transcript,
    };
  });

  return NextResponse.json({ success: true, bookmarks: bookmarksWithInfo }, { status: 200 });
}

