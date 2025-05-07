export interface Transcript {
  id: string;
  interview_name: string;
}

export interface TranscriptQA {
  id: string;
  transcript_id: string;
  question: string;
  answer: string;
}

export interface TranscriptWithQA {
  transcript: Transcript;
  quotes: TranscriptQA[];
}

export interface BookMark {
  id : string; 
  title : string; 
  transcriptQId: string; 
  transcriptId : string; 
  folderId: string; 
  created_at?: string; // Optional 
  updated_at?: string; 
}

// contains all the info displayed for each bookmark 
export interface BookMarkWithInfo {
  bookmark : BookMark
  folder: Folder 
  transcript : Transcript
  transcriptQA: TranscriptQA
}

export interface Folder {
  id : string; 
  name : string; 
}