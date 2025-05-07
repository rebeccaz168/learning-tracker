## README

I spent around 6 hours on this project. 

Design Overview

I designed the system around four primary entities: bookmarks, folders, transcripts, and transcript question-answers. My goal was to keep the architecture clean, intuitive, and scalable, while making it easy for users to organize and retrieve bookmarked content. Additionally, I integrated the Groq API for text summary. 

Database Design
- Created a normalized schema with a bookmarks table referencing folders, transcripts, and transcript_question_answers via foreign keys.
- Designed a separate folders table to support reusability.

API Design
- Built new routes to support folder operations,because it exists on its own, it is not nested under transcripts.
- To maintain compatibility with the existing route structure (/transcript/:id/bookmarks), I implemented client-side filtering by interviewee name, and created a query that would filter based on transcriptId.
- built a route for summary, under transcript/:id such that quotes could be summarized for each Person (based on transcriptId). 

Possible Future Enhancements
- Add backend checks to prevent duplicate bookmarks within the same folder.
- Improve the user experience by allowing users to create folders inline while bookmarking.
- Introduce integration tests to improve confidence in end-to-end functionality.
- Consider caching or pagination for performance optimization at scale.
- Add limit to number of quotes per folder bc. Groq model input can only take in text of a certain length. 

Demo : 
[Watch the demo on Loom](https://www.loom.com/share/6c33b532618840ac9aa12979e2f2ad56?sid=ead7bddc-93b6-4e56-9989-ff207792e234)

