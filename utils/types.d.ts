export interface Topic {
  id : string; 
  topic_name : string; 
}

export interface Note {
  id : string; 
  topic_id : string; 
  title : string; 
  reflection : string; 
  date? : string; 
}

export interface TopicWithNote {
  topic : Topic; 
  notes : Note []; 
}

export interface BookMark {
  id : string 
  title : string 
  topicId : string 
  noteId: string 
  folderId: string 
}

export interface BookMarkWithInfo {
  bookmark : BookMark
  folder: Folder 
  note : Note
  topic: Topic
}

export interface Folder {
  id : string; 
  name : string; 
}