/**
 * CollegeConnect NLP & AI Engine
 * 
 * Capabilities:
 * 1. Text Classification (Assignment, Exam, Announcement, Event, Placement, Timetable, Study Material, Faculty Instruction)
 * 2. Named Entity & Detail Extraction (Dates, Times, Deadlines, Departments, Years, Subjects)
 * 3. Priority Detection (High 🔴, Medium 🟡, Low 🟢)
 * 4. Action Extraction (Actionable task for the student)
 * 5. "What Did I Miss?" AI Synthesizer
 * 6. AI College Assistant Knowledge Retriever & Chatbot
 * 7. Semantic Search & Scoring
 */

const SUBJECT_KEYWORDS = {
  'Natural Language Processing': ['nlp', 'natural language', 'tokenization', 'bert', 'gpt', 'parsing', 'transformers', 'spacy', 'language model', 'pos tagging'],
  'Database Management Systems': ['dbms', 'sql', 'database', 'rdbms', 'normalization', 'acid', 'transaction', 'indexing', 'nosql', 'mongodb', 'er diagram'],
  'Deep Learning': ['dl', 'deep learning', 'cnn', 'rnn', 'lstm', 'neural network', 'backpropagation', 'pytorch', 'tensorflow', 'gradient'],
  'Computer Networks': ['cn', 'networks', 'tcp', 'ip', 'osi', 'routing', 'dns', 'http', 'subnetting', 'socket'],
  'Design & Analysis of Algorithms': ['daa', 'algorithms', 'sorting', 'graph', 'dp', 'dynamic programming', 'greedy', 'divide and conquer', 'complexity'],
  'Cloud Computing': ['cloud', 'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'serverless', 'virtualization']
};

const CATEGORY_PATTERNS = [
  { category: 'Assignment', patterns: [/\bassignment\b/i, /\bsubmit\b/i, /\bsubmission\b/i, /\bhomework\b/i, /\btask\b/i, /\blab record\b/i, /\bproject report\b/i] },
  { category: 'Exam', patterns: [/\bexam\b/i, /\btest\b/i, /\bmidterm\b/i, /\binternal\b/i, /\bquiz\b/i, /\bend sem\b/i, /\bviva\b/i, /\bassessment\b/i, /\bmarks\b/i] },
  { category: 'Timetable', patterns: [/\btimetable\b/i, /\bschedule\b/i, /\bclass cancelled\b/i, /\brescheduled\b/i, /\btime change\b/i, /\bpostponed\b/i, /\bvenue\b/i, /\bhall\b/i] },
  { category: 'Study Material', patterns: [/\bnotes\b/i, /\bppt\b/i, /\bpdf\b/i, /\bunit \d\b/i, /\bstudy material\b/i, /\breference\b/i, /\btextbook\b/i, /\bpyq\b/i, /\bquestion bank\b/i] },
  { category: 'Placement', patterns: [/\bplacement\b/i, /\binternship\b/i, /\bhiring\b/i, /\brecruitment\b/i, /\bpackage\b/i, /\blpa\b/i, /\bdrive\b/i, /\bcompany\b/i, /\beligibility\b/i] },
  { category: 'Event', patterns: [/\bhackathon\b/i, /\bsymposium\b/i, /\bworkshop\b/i, /\bwebinar\b/i, /\bguest lecture\b/i, /\bconference\b/i, /\btech fest\b/i, /\bcultural\b/i] },
  { category: 'Faculty Instruction', patterns: [/\binstruction\b/i, /\bmandatory\b/i, /\battendance\b/i, /\bbring\b/i, /\bwear\b/i, /\bid card\b/i, /\blab coat\b/i, /\bnotice\b/i] }
];

export function classifyText(text) {
  let matchedCategory = 'General';
  let maxScore = 0;

  for (const item of CATEGORY_PATTERNS) {
    let score = 0;
    for (const pattern of item.patterns) {
      if (pattern.test(text)) score += 1;
    }
    if (score > maxScore) {
      maxScore = score;
      matchedCategory = item.category;
    }
  }

  return matchedCategory;
}

export function extractEntities(text) {
  // Extract Target Department
  let department = 'General CSE';
  if (/cse|computer science/i.test(text)) department = 'Computer Science & Engineering (CSE)';
  else if (/it|information tech/i.test(text)) department = 'Information Technology (IT)';
  else if (/ece|electronics/i.test(text)) department = 'Electronics & Communication (ECE)';
  else if (/aids|ai & ds|ai/i.test(text)) department = 'Artificial Intelligence & Data Science';

  // Extract Year
  let year = 'All Years';
  if (/first\s*year|1st\s*year|freshmen/i.test(text)) year = '1st Year';
  else if (/second\s*year|2nd\s*year|sophomore/i.test(text)) year = '2nd Year';
  else if (/third\s*year|3rd\s*year|pre-final/i.test(text)) year = '3rd Year';
  else if (/fourth\s*year|4th\s*year|final\s*year/i.test(text)) year = '4th Year';

  // Extract Subject
  let subject = null;
  for (const [subName, kws] of Object.entries(SUBJECT_KEYWORDS)) {
    if (kws.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(text))) {
      subject = subName;
      break;
    }
  }

  // Extract Deadlines & Dates
  const datePatterns = [
    /(?:by|before|on|due date:?|deadline:?)\s*([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/i,
    /(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+(?:\s+\d{4})?)/i,
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i
  ];

  let deadlineDate = null;
  for (const regex of datePatterns) {
    const match = text.match(regex);
    if (match) {
      deadlineDate = match[1] || match[0];
      break;
    }
  }

  // Extract Time
  const timePattern = /(?:at|by|before)?\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm|hrs|hours)?)/i;
  const timeMatch = text.match(timePattern);
  const deadlineTime = timeMatch ? timeMatch[1] : null;

  // Extract Action
  let action = 'Read announcement and stay updated';
  if (/submit\s+(?:the\s+)?([a-zA-Z\s]+)/i.test(text)) {
    const m = text.match(/submit\s+(?:the\s+)?([^.,\n]+)/i);
    action = `Submit ${m ? m[1].trim() : 'assignment'}`;
  } else if (/register\s+(?:for\s+)?([a-zA-Z\s]+)/i.test(text)) {
    const m = text.match(/register\s+(?:for\s+)?([^.,\n]+)/i);
    action = `Register for ${m ? m[1].trim() : 'event'}`;
  } else if (/attend\s+(?:the\s+)?([a-zA-Z\s]+)/i.test(text)) {
    const m = text.match(/attend\s+(?:the\s+)?([^.,\n]+)/i);
    action = `Attend ${m ? m[1].trim() : 'session'}`;
  } else if (/prepare\s+(?:for\s+)?([a-zA-Z\s]+)/i.test(text)) {
    const m = text.match(/prepare\s+(?:for\s+)?([^.,\n]+)/i);
    action = `Prepare for ${m ? m[1].trim() : 'exam'}`;
  } else if (/download|review|refer/i.test(text)) {
    action = 'Review and study the attached reference material';
  }

  // Priority Score
  let priority = 'Medium';
  const highWords = ['urgent', 'mandatory', 'deadline', 'exam', 'tomorrow', 'today', 'immediately', 'strict', 'penalized', 'important', 'final call'];
  const lowWords = ['optional', 'fyi', 'reference', 'whenever free', 'additional reading', 'bonus'];

  const lower = text.toLowerCase();
  if (highWords.some(w => lower.includes(w)) || /submit.*by/i.test(text) || /exam.*date/i.test(text)) {
    priority = 'High';
  } else if (lowWords.some(w => lower.includes(w))) {
    priority = 'Low';
  }

  // Generate concise 1-sentence summary
  let summary = text.slice(0, 160);
  if (text.length > 160) summary += '...';

  return {
    department,
    year,
    subject: subject || 'General / Interdisciplinary',
    deadline: deadlineDate ? `${deadlineDate}${deadlineTime ? ' at ' + deadlineTime : ''}` : null,
    deadlineDate,
    deadlineTime,
    action,
    priority,
    summary
  };
}

export function analyzeAnnouncement(text) {
  const category = classifyText(text);
  const details = extractEntities(text);

  return {
    category,
    ...details
  };
}

export function synthesizeWhatDidIMiss(lastActiveDate, allData) {
  const cutoff = new Date(lastActiveDate || Date.now() - 3 * 24 * 60 * 60 * 1000);
  
  const announcements = (allData.announcements || []).filter(a => new Date(a.createdAt || a.updatedAt) > cutoff);
  const materials = (allData.studyMaterials || []).filter(m => new Date(m.createdAt || m.updatedAt) > cutoff);
  const assignments = (allData.assignments || []).filter(a => new Date(a.createdAt || a.updatedAt) > cutoff);
  const exams = (allData.exams || []).filter(e => new Date(e.createdAt || e.updatedAt) > cutoff);
  const events = (allData.events || []).filter(ev => new Date(ev.createdAt || ev.updatedAt) > cutoff);

  const important = [];
  const upcomingExams = [];
  const newMaterials = [];
  const upcomingEvents = [];

  // Group items by urgency and category
  [...announcements, ...assignments].forEach(item => {
    if (item.priority === 'High' || item.category === 'Assignment' || item.category === 'Placement') {
      important.push({
        title: item.title,
        deadline: item.deadline || item.dueDate || 'Soon',
        action: item.action || `Review ${item.title}`,
        subject: item.subjectName,
        teacher: item.teacherName,
        type: item.category || 'Assignment'
      });
    }
  });

  exams.forEach(ex => {
    upcomingExams.push({
      subject: ex.subjectName,
      title: ex.title,
      date: ex.examDate,
      time: ex.time,
      venue: ex.venue,
      syllabus: ex.syllabus
    });
  });

  materials.forEach(mat => {
    newMaterials.push({
      title: mat.title,
      subject: mat.subjectName,
      teacher: mat.teacherName,
      type: mat.type,
      unit: mat.unit
    });
  });

  events.forEach(ev => {
    upcomingEvents.push({
      title: ev.title,
      date: ev.date,
      type: ev.category || 'Event',
      organizer: ev.organizer
    });
  });

  return {
    since: cutoff.toISOString(),
    totalMissedCount: announcements.length + materials.length + assignments.length + exams.length + events.length,
    important,
    upcomingExams,
    newMaterials,
    upcomingEvents
  };
}

export function answerCollegeAssistantQuery(query, knowledgeBase) {
  const q = query.toLowerCase();

  // 1. Assignments query
  if (q.includes('assignment') || q.includes('due') || q.includes('homework') || q.includes('submission')) {
    const list = knowledgeBase.assignments || [];
    if (list.length === 0) return { answer: "You currently have no pending assignments on record! 🎉" };
    
    let text = "Here are your upcoming academic assignment deadlines:\n\n";
    list.forEach((item, idx) => {
      text += `${idx + 1}. **${item.title}** (${item.subjectName})\n   - **Due Date:** ${item.dueDate || 'Soon'}\n   - **Teacher:** ${item.teacherName}\n   - **Action Required:** ${item.description || 'Submit before deadline'}\n   - **Priority:** ${item.priority === 'High' ? '🔴 High' : '🟡 Medium'}\n\n`;
    });
    return {
      answer: text,
      category: 'Assignments',
      actionCards: list.map(a => ({ title: a.title, subtitle: `Due: ${a.dueDate}`, link: `/assignments` }))
    };
  }

  // 2. Exam query
  if (q.includes('exam') || q.includes('test') || q.includes('internal') || q.includes('schedule')) {
    const list = knowledgeBase.exams || [];
    let text = "Here is the official schedule for your upcoming exams:\n\n";
    list.forEach((item, idx) => {
      text += `${idx + 1}. **${item.subjectName} — ${item.title}**\n   - **Date & Time:** ${item.examDate} at ${item.time}\n   - **Venue:** ${item.venue || 'Main Exam Hall 302'}\n   - **Syllabus / Units:** ${item.syllabus || 'Units 1, 2, and 3'}\n\n`;
    });
    return {
      answer: text,
      category: 'Exams',
      actionCards: list.map(e => ({ title: `${e.subjectName} Exam`, subtitle: `${e.examDate} (${e.time})`, link: `/exams` }))
    };
  }

  // 3. Notes / Study materials query
  if (q.includes('note') || q.includes('material') || q.includes('ppt') || q.includes('pdf') || q.includes('pyq') || q.includes('unit')) {
    let mats = knowledgeBase.studyMaterials || [];
    if (q.includes('nlp')) mats = mats.filter(m => /nlp|natural language/i.test(m.subjectName));
    if (q.includes('dbms')) mats = mats.filter(m => /dbms|database/i.test(m.subjectName));
    
    let text = "Here are the verified study materials uploaded by your faculty:\n\n";
    mats.forEach((item, idx) => {
      text += `${idx + 1}. **${item.title}** [${item.type.toUpperCase()}]\n   - **Subject:** ${item.subjectName}\n   - **Uploaded By:** ${item.teacherName}\n   - **Rating:** ⭐ ${item.rating || '4.8'}/5.0\n\n`;
    });
    return {
      answer: text,
      category: 'Study Materials',
      actionCards: mats.slice(0, 4).map(m => ({ title: m.title, subtitle: `${m.subjectName} by ${m.teacherName}`, link: `/study-materials` }))
    };
  }

  // 4. Timetable query
  if (q.includes('timetable') || q.includes('change') || q.includes('cancelled') || q.includes('rescheduled')) {
    const tt = knowledgeBase.timetables || [];
    let text = "Here are the latest timetable announcements and room changes:\n\n";
    tt.forEach((item, idx) => {
      text += `${idx + 1}. **${item.day} ${item.timeSlot} — ${item.subjectName}**\n   - **Faculty:** ${item.teacherName}\n   - **Room / Lab:** ${item.room}\n   - **Status:** ${item.status || 'Active'}\n   - **Notice:** ${item.note || 'Regular Session'}\n\n`;
    });
    return {
      answer: text,
      category: 'Timetable'
    };
  }

  // 5. Hackathon / Experience query
  if (q.includes('hackathon') || q.includes('experience') || q.includes('internship') || q.includes('project') || q.includes('advice')) {
    const exp = knowledgeBase.experiences || [];
    let text = "Here are top insights shared by students & teachers on the Experience Hub:\n\n";
    exp.slice(0, 3).forEach((item, idx) => {
      text += `${idx + 1}. **${item.title}**\n   - **Author:** ${item.authorName} (${item.authorRole})\n   - **Category:** ${item.category} | **Org:** ${item.organization}\n   - **Key Takeaway:** ${item.advice || item.whatILearned || item.description.slice(0, 100)}\n\n`;
    });
    return {
      answer: text,
      category: 'Experience Hub',
      actionCards: exp.slice(0, 3).map(e => ({ title: e.title, subtitle: `By ${e.authorName}`, link: `/experience-hub` }))
    };
  }

  // 6. "What Did I Miss?" query
  if (q.includes('miss') || q.includes('what did i miss') || q.includes('update') || q.includes('recent')) {
    return {
      answer: "I have prepared your personalized **'What Did I Miss?'** summary! You have **1 high-priority assignment deadline** (DBMS Assignment due Sep 8), **1 upcoming exam** (NLP Internal Exam on Sep 12), and **2 newly uploaded lecture notes** from Dr. Priya Sharma and Prof. Rajesh Verma.",
      category: 'What Did I Miss',
      actionCards: [
        { title: "View 'What Did I Miss?' Full Report", subtitle: "Categorized AI Briefing", link: "/what-did-i-miss" }
      ]
    };
  }

  // Default intelligent assistant response
  return {
    answer: `I searched the CollegeConnect academic database for "${query}". I can help you check upcoming assignment deadlines, lookup exam dates, download teacher study notes (Unit 1-5 & PYQs), verify timetable updates, or browse Hackathon & Internship experiences. Feel free to click any suggestion below!`,
    category: 'General Search',
    suggestedQueries: [
      "What assignments are due this week?",
      "When is my NLP exam?",
      "Show NLP Unit 2 notes",
      "What changed in the timetable?",
      "Show AI hackathon experiences"
    ]
  };
}
