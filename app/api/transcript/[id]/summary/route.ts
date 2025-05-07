import { summarizeAnswer } from "@/utils/summarizeHelper";
import { NextRequest, NextResponse } from 'next/server';

// POST method to handle summarization
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const transcriptId = params.id; // Get transcriptId from URL params
    const { combinedAnswers } = await req.json();  // Assuming filteredBookmarks are sent in the body
    console.log("Summarizing for Transcript ID:", transcriptId);
    
    if (!combinedAnswers || combinedAnswers.trim() === '') {
        return NextResponse.json({ success: false, message: 'No answers to summarize' }, { status: 400 });
      }
  
    try {
      const summary = await summarizeAnswer(combinedAnswers); 
      return NextResponse.json({ success: true, summary }); 
    } catch (error) {
      console.error("Error generating summary:", error);
      return NextResponse.json({ success: false, message: 'Error generating summary' }, { status: 500 });
    }
  }

  
  
  