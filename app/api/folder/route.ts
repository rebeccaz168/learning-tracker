import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  const result = await sql`
    SELECT * FROM folders;
  `;
  const folders = result.rows;
  return NextResponse.json({ success: true, folders }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  
  const result = await sql`
    INSERT INTO folders (name)
    VALUES (${name})
    RETURNING *;
  `;

  const newFolder = result.rows[0];

  return NextResponse.json({ success: true, folder: newFolder }, { status: 201 });
}
