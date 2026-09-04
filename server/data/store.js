import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'db_dump.json');

const hash = (pw) => bcrypt.hashSync(pw, 10);

// Default Seed Data with customized user names:
// Admin: Meena
// Students: Zayed, Sid, Varun
// Teachers: Prabhavathi, Vidhya, Nirmala
const initialData = {
  users: [
    {
      id: 'usr-student-1',
      name: 'Zayed',
      email: 'zayed@student.college.edu',
      passwordHash: hash('password123'),
      role: 'student',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      rollNo: '22CS104',
      avatar: null,
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      enrolledSubjects: ['sub-nlp', 'sub-dbms', 'sub-dl', 'sub-daa']
    },
    {
      id: 'usr-student-2',
      name: 'Sid',
      email: 'sid@student.college.edu',
      passwordHash: hash('password123'),
      role: 'student',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      rollNo: '22CS108',
      avatar: null,
      lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      enrolledSubjects: ['sub-nlp', 'sub-dbms', 'sub-cloud']
    },
    {
      id: 'usr-student-3',
      name: 'Varun',
      email: 'varun@student.college.edu',
      passwordHash: hash('password123'),
      role: 'student',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      rollNo: '22CS119',
      avatar: null,
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      enrolledSubjects: ['sub-nlp', 'sub-dbms', 'sub-dl']
    },
    {
      id: 'usr-teacher-1',
      name: 'Prof. Prabhavathi',
      email: 'prabhavathi@faculty.college.edu',
      passwordHash: hash('password123'),
      role: 'teacher',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor & AI Lead',
      facultyId: 'FAC-CSE-042',
      verified: true,
      bio: 'Ph.D. in Computational Linguistics & Data Systems. Research focus on Transformers, Multilingual NLP, and LLM reasoning.',
      avatar: null,
      assignedSubjects: ['sub-nlp', 'sub-dl']
    },
    {
      id: 'usr-teacher-2',
      name: 'Prof. Vidhya',
      email: 'vidhya@faculty.college.edu',
      passwordHash: hash('password123'),
      role: 'teacher',
      department: 'Computer Science & Engineering',
      designation: 'Professor & Head of Department',
      facultyId: 'FAC-CSE-001',
      verified: true,
      bio: '20+ years in Distributed Data Systems, ACID guarantees, and Query Optimization Engines.',
      avatar: null,
      assignedSubjects: ['sub-dbms', 'sub-daa']
    },
    {
      id: 'usr-teacher-3',
      name: 'Dr. Nirmala',
      email: 'nirmala@faculty.college.edu',
      passwordHash: hash('password123'),
      role: 'teacher',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor',
      facultyId: 'FAC-CSE-018',
      verified: true,
      bio: 'Specialist in Cloud Native Computing, Kubernetes, and Distributed Microservices.',
      avatar: null,
      assignedSubjects: ['sub-cloud']
    },
    {
      id: 'usr-admin-1',
      name: 'Dr. Meena',
      email: 'meena@college.edu',
      passwordHash: hash('admin123'),
      role: 'admin',
      department: 'Academic Administration',
      designation: 'Dean of Academic Affairs',
      avatar: null
    }
  ],

  facultyInviteCodes: [
    { code: 'FAC-CSE-2026-X98', department: 'Computer Science & Engineering', valid: true },
    { code: 'FAC-AI-2026-K42', department: 'Artificial Intelligence & Data Science', valid: true },
    { code: 'FAC-ECE-2026-M11', department: 'Electronics & Communication', valid: true }
  ],

  subjects: [
    {
      id: 'sub-nlp',
      code: 'CS601',
      name: 'Natural Language Processing',
      department: 'Computer Science & Engineering',
      semester: '6th Semester',
      credits: 4,
      teachers: [
        { id: 'usr-teacher-1', name: 'Prof. Prabhavathi', email: 'prabhavathi@faculty.college.edu' }
      ],
      description: 'Covers morphology, syntactic parsing, semantic analysis, sequence modeling, transformers, and prompt engineering.',
      icon: 'Brain'
    },
    {
      id: 'sub-dbms',
      code: 'CS402',
      name: 'Database Management Systems',
      department: 'Computer Science & Engineering',
      semester: '4th Semester',
      credits: 4,
      teachers: [
        { id: 'usr-teacher-2', name: 'Prof. Vidhya', email: 'vidhya@faculty.college.edu' }
      ],
      description: 'Relational model, SQL/NoSQL architectures, ACID properties, transaction indexing, and distributed DBs.',
      icon: 'Database'
    },
    {
      id: 'sub-dl',
      code: 'CS703',
      name: 'Deep Learning & Neural Networks',
      department: 'Computer Science & Engineering',
      semester: '7th Semester',
      credits: 3,
      teachers: [
        { id: 'usr-teacher-1', name: 'Prof. Prabhavathi', email: 'prabhavathi@faculty.college.edu' }
      ],
      description: 'Backpropagation, CNNs, Recurrent architectures, Attention Mechanisms, Generative AI models.',
      icon: 'Cpu'
    },
    {
      id: 'sub-cloud',
      code: 'CS604',
      name: 'Cloud Computing & Distributed Systems',
      department: 'Computer Science & Engineering',
      semester: '6th Semester',
      credits: 3,
      teachers: [
        { id: 'usr-teacher-3', name: 'Dr. Nirmala', email: 'nirmala@faculty.college.edu' }
      ],
      description: 'Virtualization, Containerization, Docker, Kubernetes, Serverless Architecture, and AWS/GCP pipelines.',
      icon: 'Network'
    }
  ],

  studyMaterials: [
    {
      id: 'mat-1',
      title: 'Unit 2: Syntactic Parsing & Dependency Graphs PPT',
      subjectId: 'sub-nlp',
      subjectName: 'Natural Language Processing',
      teacherId: 'usr-teacher-1',
      teacherName: 'Prof. Prabhavathi',
      type: 'ppt',
      unit: 'Unit 2',
      category: 'Lecture Slides',
      description: 'Comprehensive presentation on CYK parsing, PCFGs, Transition-based dependency parsing with visual tree examples.',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'NLP_Unit_2_Syntactic_Parsing.pptx',
      fileSize: '4.8 MB',
      rating: 4.9,
      reviewsCount: 24,
      isNew: true,
      isUpdated: false,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      lastEditedBy: 'Prof. Prabhavathi'
    },
    {
      id: 'mat-2',
      title: 'Unit 1: Tokenization, Word Vectors & N-Grams Notes',
      subjectId: 'sub-nlp',
      subjectName: 'Natural Language Processing',
      teacherId: 'usr-teacher-1',
      teacherName: 'Prof. Prabhavathi',
      type: 'notes',
      unit: 'Unit 1',
      category: 'Lecture Notes',
      description: 'Detailed companion notes covering BPE tokenization, Word2Vec CBOW vs Skipgram, and Language Models.',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'NLP_Unit_1_Foundations_Notes.pdf',
      fileSize: '2.3 MB',
      rating: 4.8,
      reviewsCount: 38,
      isNew: false,
      isUpdated: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      lastEditedBy: 'Prof. Prabhavathi'
    },
    {
      id: 'mat-3',
      title: 'NLP Previous Year University Exam Questions (2021-2025 Solved)',
      subjectId: 'sub-nlp',
      subjectName: 'Natural Language Processing',
      teacherId: 'usr-teacher-1',
      teacherName: 'Prof. Prabhavathi',
      type: 'pyq',
      unit: 'All Units',
      category: 'Previous Year Questions',
      description: 'Compilation of 5 years of university questions with step-by-step model solutions and mark breakdowns.',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'NLP_PYQ_Solved_2021_2025.pdf',
      fileSize: '6.1 MB',
      rating: 5.0,
      reviewsCount: 45,
      isNew: true,
      isUpdated: false,
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      lastEditedBy: 'Prof. Prabhavathi'
    },
    {
      id: 'mat-4',
      title: 'DBMS Unit 2: Relational Algebra & Normal Forms Master Guide',
      subjectId: 'sub-dbms',
      subjectName: 'Database Management Systems',
      teacherId: 'usr-teacher-2',
      teacherName: 'Prof. Vidhya',
      type: 'pdf',
      unit: 'Unit 2',
      category: 'Lecture Notes',
      description: 'Rigorous mathematical proof and 20 practice questions for 1NF, 2NF, 3NF, BCNF and lossless join decompositions.',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'DBMS_Normalization_Master_Notes.pdf',
      fileSize: '3.4 MB',
      rating: 4.7,
      reviewsCount: 19,
      isNew: true,
      isUpdated: false,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      lastEditedBy: 'Prof. Vidhya'
    },
    {
      id: 'mat-5',
      title: 'Cloud Computing: Kubernetes Architecture & Ingress Controllers PPT',
      subjectId: 'sub-cloud',
      subjectName: 'Cloud Computing & Distributed Systems',
      teacherId: 'usr-teacher-3',
      teacherName: 'Dr. Nirmala',
      type: 'ppt',
      unit: 'Unit 3',
      category: 'Lecture Slides',
      description: 'Hands-on guide to Pods, Deployments, Services, and Horizontal Pod Autoscaling on GCP GKE.',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileName: 'Cloud_Kubernetes_Master_Slides.pptx',
      fileSize: '5.2 MB',
      rating: 4.9,
      reviewsCount: 14,
      isNew: true,
      isUpdated: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      lastEditedBy: 'Dr. Nirmala'
    }
  ],

  announcements: [
    {
      id: 'ann-1',
      title: 'Mandatory DBMS Assignment 2 Submission Deadline',
      content: 'All third-year CSE students must submit the DBMS assignment on Normalization and B+ Tree Indexing by September 8 at 5 PM. Submissions after the deadline will incur a 20% mark deduction.',
      teacherId: 'usr-teacher-2',
      teacherName: 'Prof. Vidhya',
      subjectId: 'sub-dbms',
      subjectName: 'Database Management Systems',
      category: 'Assignment',
      department: 'Computer Science & Engineering',
      targetYear: '3rd Year',
      priority: 'High',
      deadline: 'September 8, 2026 at 5:00 PM',
      action: 'Submit DBMS assignment on Normalization and Indexing',
      isNew: true,
      isUpdated: true,
      lastEditedBy: 'Prof. Vidhya',
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'ann-2',
      title: 'NLP Internal Mid-Term Exam Rescheduled to September 12',
      content: 'The first internal assessment for Natural Language Processing (CS601) is rescheduled to September 12, 10:00 AM in Hall 302. Syllabus covers Unit 1 & Unit 2.',
      teacherId: 'usr-teacher-1',
      teacherName: 'Prof. Prabhavathi',
      subjectId: 'sub-nlp',
      subjectName: 'Natural Language Processing',
      category: 'Exam',
      department: 'Computer Science & Engineering',
      targetYear: '3rd Year',
      priority: 'High',
      deadline: 'September 12, 2026 at 10:00 AM',
      action: 'Prepare for NLP Internal Exam (Units 1 & 2)',
      isNew: false,
      isUpdated: true,
      lastEditedBy: 'Prof. Prabhavathi',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'ann-3',
      title: 'Google Cloud On-Campus Recruitment Drive 2026',
      content: 'Google Cloud is visiting our campus for Summer Internships and SDE Full-Time roles. Eligible branches: CSE, IT, ECE with CGPA >= 7.5. Online aptitude round on Sep 20.',
      teacherId: 'usr-admin-1',
      teacherName: 'Dean Meena (Placement Cell)',
      subjectId: null,
      subjectName: 'Campus Placement & Career',
      category: 'Placement',
      department: 'All Departments',
      targetYear: '3rd & 4th Year',
      priority: 'High',
      deadline: 'September 15, 2026',
      action: 'Register on Placement Portal with updated resume',
      isNew: true,
      isUpdated: false,
      lastEditedBy: 'Dr. Meena',
      createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'ann-4',
      title: 'National AI & Web3 Hackathon 2026 Registrations Open',
      content: 'CollegeConnect Community is organizing HackSprint 2026 with $15,000 in cash prizes. Teams of 2-4 can register online. Mentorship from top AI industry leaders included.',
      teacherId: 'usr-teacher-1',
      teacherName: 'Prof. Prabhavathi (Faculty Coordinator)',
      subjectId: null,
      subjectName: 'College Events & Hackathons',
      category: 'Event',
      department: 'All Departments',
      targetYear: 'All Years',
      priority: 'Medium',
      deadline: 'September 25, 2026',
      action: 'Form a team and submit hackathon project proposal',
      isNew: true,
      isUpdated: false,
      lastEditedBy: 'Prof. Prabhavathi',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
  ],

  assignments: [
    {
      id: 'asg-1',
      title: 'DBMS Assignment 2: Relational Calculus & Index Tuning',
      subjectId: 'sub-dbms',
      subjectName: 'Database Management Systems',
      teacherId: 'usr-teacher-2',
      teacherName: 'Prof. Vidhya',
      dueDate: 'September 8, 2026 (5:00 PM)',
      totalPoints: 25,
      priority: 'High',
      description: 'Implement tuple relational calculus queries and analyze B+ tree splits for 50,000 inserted keys.',
      submissionCount: 42,
      totalStudents: 68,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'asg-2',
      title: 'NLP Lab 3: Bidirectional LSTM POS Tagger',
      subjectId: 'sub-nlp',
      subjectName: 'Natural Language Processing',
      teacherId: 'usr-teacher-1',
      teacherName: 'Prof. Prabhavathi',
      dueDate: 'September 14, 2026 (11:59 PM)',
      totalPoints: 30,
      priority: 'Medium',
      description: 'Build and train a character-level and word-level BiLSTM on Penn Treebank dataset using PyTorch.',
      submissionCount: 18,
      totalStudents: 68,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  ],

  exams: [
    {
      id: 'ex-1',
      title: 'NLP Mid-Term Assessment (Internal 1)',
      subjectId: 'sub-nlp',
      subjectName: 'Natural Language Processing',
      teacherId: 'usr-teacher-1',
      teacherName: 'Prof. Prabhavathi',
      examDate: 'September 12, 2026',
      time: '10:00 AM - 11:30 AM',
      venue: 'Main Examination Hall 302',
      syllabus: 'Unit 1 (Tokenization, Word2Vec, N-Grams) and Unit 2 (Constituency & Dependency Parsing)',
      totalMarks: 50,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'ex-2',
      title: 'DBMS Model Practical & Viva Examination',
      subjectId: 'sub-dbms',
      subjectName: 'Database Management Systems',
      teacherId: 'usr-teacher-2',
      teacherName: 'Prof. Vidhya',
      examDate: 'September 18, 2026',
      time: '02:00 PM - 05:00 PM',
      venue: 'Advanced Database Lab 3',
      syllabus: 'PL/SQL triggers, cursors, nested subqueries, and indexing execution plans.',
      totalMarks: 50,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 1000).toISOString()
    }
  ],

  timetables: [
    {
      id: 'tt-1',
      day: 'Monday',
      timeSlot: '09:00 AM - 10:00 AM',
      subjectId: 'sub-nlp',
      subjectName: 'Natural Language Processing',
      teacherName: 'Dr. Meena',
      room: 'Room 304',
      status: 'Active',
      note: 'Regular Lecture'
    },
    {
      id: 'tt-2',
      day: 'Monday',
      timeSlot: '10:15 AM - 11:15 AM',
      subjectId: 'sub-dbms',
      subjectName: 'Database Management Systems',
      teacherName: 'Prof. Vidhya',
      room: 'Room 304',
      status: 'Rescheduled',
      note: 'Shifted to Lab 2 for hands-on query tuning demo'
    },
    {
      id: 'tt-3',
      day: 'Tuesday',
      timeSlot: '02:00 PM - 04:00 PM',
      subjectId: 'sub-cloud',
      subjectName: 'Cloud Computing Lab',
      teacherName: 'Dr. Nirmala',
      room: 'Cloud Server Lab 1',
      status: 'Active',
      note: 'Kubernetes cluster deployment lab session'
    }
  ],

  experiences: [
    {
      id: 'exp-1',
      title: 'Winning 1st Place at Smart India Hackathon (SIH 2025) — Edge AI for Disaster Response',
      authorId: 'usr-student-1',
      authorName: 'Zayed',
      authorRole: 'Student',
      department: 'CSE',
      category: 'Hackathon',
      organization: 'Ministry of Electronics & IT',
      date: 'August 2025',
      technologies: ['PyTorch', 'YOLOv10', 'FastAPI', 'Raspberry Pi', 'React'],
      description: 'Our team built an autonomous drone video analyzer capable of detecting trapped flood victims in sub-second latency on constrained hardware. We competed against 32 national finalist teams in a 36-hour sprint.',
      challenges: 'Quantizing deep neural networks to run on 4GB edge compute without dropping mAP accuracy. We had to use INT8 TensorRT optimization.',
      whatILearned: 'Fast prototyping, high-pressure team debugging, and pitching technical architecture to senior ministry evaluators.',
      advice: 'Never spend 20 hours designing slides. Build an end-to-end working MVP first, test with mock live data, and prepare for edge-case questions during judging.',
      upvotes: 52,
      upvotedBy: ['usr-student-2', 'usr-teacher-1'],
      savedBy: ['usr-student-2'],
      tags: ['AI', 'Hackathon', 'ComputerVision', 'SIH', 'Hardware'],
      comments: [
        {
          id: 'comm-1',
          authorId: 'usr-teacher-1',
          authorName: 'Prof. Prabhavathi',
          authorRole: 'Teacher',
          content: 'Tremendous work Zayed & team! The edge quantization technique was exceptionally well executed. Proud moment for our department.',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'exp-2',
      title: 'Cracking the Microsoft Summer Research Internship (LLM Optimization Team)',
      authorId: 'usr-student-2',
      authorName: 'Sid',
      authorRole: 'Student',
      department: 'CSE',
      category: 'Internship',
      organization: 'Microsoft Research India',
      date: 'May - July 2025',
      technologies: ['Transformers', 'vLLM', 'CUDA', 'Python', 'Algorithms'],
      description: 'Worked on speculative decoding and KV-cache compression algorithms for large language models. Reduced token generation latency by 34%.',
      challenges: 'Understanding low-level GPU memory access patterns and reading 15 research papers in the first 2 weeks.',
      whatILearned: 'Academic rigor, reproducible benchmarking, and clean modular research coding standards.',
      advice: 'Master your core DAA fundamentals (Dynamic Programming, Graphs) alongside hands-on PyTorch implementations.',
      upvotes: 68,
      upvotedBy: ['usr-student-1', 'usr-teacher-1', 'usr-teacher-2'],
      savedBy: ['usr-student-1'],
      tags: ['Internship', 'Microsoft', 'Research', 'LLMs', 'Career'],
      comments: [],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'exp-3',
      title: 'Publishing Your First Top-Tier AI Research Paper: A Faculty Roadmap for Undergrads',
      authorId: 'usr-teacher-1',
      authorName: 'Prof. Prabhavathi',
      authorRole: 'Teacher',
      department: 'CSE',
      category: 'Research',
      organization: 'Association for Computational Linguistics (ACL)',
      date: 'July 2025',
      technologies: ['Research Methodology', 'LaTeX', 'Ablation Studies', 'Statistical Significance'],
      description: 'A structured blueprint for undergraduate students on formulating novel research questions, designing ablation experiments, and writing compelling abstracts.',
      challenges: 'Students often get discouraged by initial negative empirical results. Understanding failure cases is where true research begins.',
      whatILearned: 'Guiding undergraduates into publishing high-impact work is the most rewarding aspect of faculty mentorship.',
      advice: 'Start with literature surveys. Identify what current state-of-the-art models fail at, and build controlled synthetic datasets to test hypotheses.',
      upvotes: 94,
      upvotedBy: ['usr-student-1', 'usr-student-2', 'usr-admin-1'],
      savedBy: ['usr-student-1', 'usr-student-2'],
      tags: ['Research', 'Publishing', 'FacultyAdvice', 'ACL', 'Guidance'],
      comments: [],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],

  studentReports: [
    {
      id: 'rep-1',
      title: 'Missing Study Material for DBMS Unit 4 Transaction Concurrency Control',
      category: 'Missing study material',
      description: 'The syllabus specifies multi-version concurrency control (MVCC) and Two-Phase Locking, but the uploaded Unit 4 folder only contains slide previews without full practice proofs.',
      subjectId: 'sub-dbms',
      subjectName: 'Database Management Systems',
      teacherId: 'usr-teacher-2',
      teacherName: 'Prof. Vidhya',
      studentId: 'usr-student-1',
      studentName: 'Zayed',
      status: 'Under Review',
      adminNote: 'Prof. Vidhya has been notified and is preparing the updated Unit 4 master notes for release by Friday.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'rep-2',
      title: 'Timetable Clash on Friday Afternoon between Cloud Lab and DAA Tutorial',
      category: 'Timetable issue',
      description: 'Both slots are currently scheduled from 2:00 PM - 4:00 PM for CSE Batch A on the ERP portal.',
      subjectId: 'sub-daa',
      subjectName: 'Design & Analysis of Algorithms',
      teacherId: 'usr-teacher-2',
      teacherName: 'Prof. Vidhya',
      studentId: 'usr-student-2',
      studentName: 'Sid',
      status: 'Resolved',
      adminNote: 'DAA tutorial shifted to Friday 4:00 PM - 5:00 PM. Timetable updated on portal.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],

  teachingFeedback: [
    {
      id: 'fb-1',
      teacherId: 'usr-teacher-1',
      teacherName: 'Prof. Prabhavathi',
      subjectId: 'sub-nlp',
      subjectName: 'Natural Language Processing',
      ratings: {
        teachingClarity: 4.9,
        explanation: 5.0,
        doubtClarification: 4.8,
        practicalExamples: 5.0,
        courseCoverage: 4.7,
        materialUsefulness: 4.9
      },
      anonymousComments: [
        'Prof. Prabhavathi breaks down complex transformer self-attention math into intuitive visual diagrams!',
        'The solved PYQs provided before midterms were life-saving.'
      ]
    },
    {
      id: 'fb-2',
      teacherId: 'usr-teacher-2',
      teacherName: 'Prof. Vidhya',
      subjectId: 'sub-dbms',
      subjectName: 'Database Management Systems',
      ratings: {
        teachingClarity: 4.7,
        explanation: 4.8,
        doubtClarification: 4.6,
        practicalExamples: 4.9,
        courseCoverage: 4.9,
        materialUsefulness: 4.7
      },
      anonymousComments: [
        'Great real-world examples from industry banking database architectures by Prof. Vidhya.',
        'Would love more interactive practice sessions on SQL query plan optimizations.'
      ]
    },
    {
      id: 'fb-3',
      teacherId: 'usr-teacher-3',
      teacherName: 'Dr. Nirmala',
      subjectId: 'sub-cloud',
      subjectName: 'Cloud Computing & Distributed Systems',
      ratings: {
        teachingClarity: 4.8,
        explanation: 4.9,
        doubtClarification: 4.7,
        practicalExamples: 5.0,
        courseCoverage: 4.8,
        materialUsefulness: 4.9
      },
      anonymousComments: [
        'Dr. Nirmala gives amazing hands-on Kubernetes and Docker container labs!'
      ]
    }
  ],

  materialReviews: [
    {
      id: 'rev-1',
      materialId: 'mat-1',
      studentId: 'usr-student-1',
      studentName: 'Zayed',
      rating: 5,
      clarity: 5,
      completeness: 5,
      usefulness: 5,
      comment: 'Super crisp slides with excellent parsing tree step-by-step visuals.',
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
    }
  ],

  auditLogs: [
    {
      id: 'aud-1',
      userId: 'usr-teacher-1',
      userName: 'Prof. Prabhavathi',
      userRole: 'teacher',
      action: 'UPDATE_EXAM_SCHEDULE',
      entityType: 'Exam',
      entityId: 'ex-1',
      entityTitle: 'NLP Mid-Term Assessment',
      subjectName: 'Natural Language Processing',
      oldValue: {
        examDate: 'September 8, 2026',
        time: '09:00 AM - 10:30 AM'
      },
      newValue: {
        examDate: 'September 12, 2026',
        time: '10:00 AM - 11:30 AM'
      },
      changeSummary: 'Exam Date rescheduled from September 8 to September 12 to provide additional preparation time after hackathon.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'aud-2',
      userId: 'usr-teacher-2',
      userName: 'Prof. Vidhya',
      userRole: 'teacher',
      action: 'UPDATE_ASSIGNMENT_DEADLINE',
      entityType: 'Assignment',
      entityId: 'asg-1',
      entityTitle: 'DBMS Assignment 2',
      subjectName: 'Database Management Systems',
      oldValue: {
        dueDate: 'September 6, 2026 (5:00 PM)'
      },
      newValue: {
        dueDate: 'September 8, 2026 (5:00 PM)'
      },
      changeSummary: 'Extended submission deadline by 48 hours following student council request.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'aud-3',
      userId: 'usr-admin-1',
      userName: 'Dr. Meena',
      userRole: 'admin',
      action: 'APPROVE_STUDENT_REPORT',
      entityType: 'StudentVoice',
      entityId: 'rep-2',
      entityTitle: 'Timetable Clash Resolution',
      subjectName: 'Design & Analysis of Algorithms',
      oldValue: { status: 'Submitted' },
      newValue: { status: 'Resolved' },
      changeSummary: 'Dean Meena approved Friday tutorial time slot adjustment.',
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
    }
  ],

  notifications: [
    {
      id: 'notif-1',
      userId: 'usr-student-1',
      title: '🚨 High Priority: DBMS Assignment Due Soon',
      message: 'Prof. Vidhya updated the deadline for DBMS Assignment 2 to September 8, 5:00 PM.',
      type: 'assignment',
      priority: 'High',
      link: '/assignments',
      read: false,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif-2',
      userId: 'usr-student-1',
      title: '📅 Exam Schedule Update: NLP Mid-Term',
      message: 'Prof. Prabhavathi rescheduled the NLP Internal Assessment to September 12 at 10:00 AM.',
      type: 'exam',
      priority: 'High',
      link: '/exams',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif-3',
      userId: 'usr-student-1',
      title: '📚 New Solved PYQ Uploaded for NLP',
      message: 'Prof. Prabhavathi uploaded "NLP Previous Year Solved Questions (2021-2025)" with detailed solutions.',
      type: 'material',
      priority: 'Medium',
      link: '/study-materials',
      read: true,
      createdAt: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString()
    }
  ]
};

// In-Memory Data Store with JSON sync
class DataStore {
  constructor() {
    this.data = initialData;
    this.save();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      this.data = initialData;
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving data store:', err);
    }
  }

  getUsers() { return this.data.users; }
  getSubjects() { return this.data.subjects; }
  getStudyMaterials() { return this.data.studyMaterials; }
  getAnnouncements() { return this.data.announcements; }
  getAssignments() { return this.data.assignments; }
  getExams() { return this.data.exams; }
  getTimetables() { return this.data.timetables; }
  getExperiences() { return this.data.experiences; }
  getStudentReports() { return this.data.studentReports; }
  getTeachingFeedback() { return this.data.teachingFeedback; }
  getMaterialReviews() { return this.data.materialReviews; }
  getAuditLogs() { return this.data.auditLogs; }
  getNotifications() { return this.data.notifications; }
  getFacultyInviteCodes() { return this.data.facultyInviteCodes; }

  recordAudit({ userId, userName, userRole, action, entityType, entityId, entityTitle, subjectName, oldValue, newValue, changeSummary }) {
    const log = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      userName,
      userRole,
      action,
      entityType,
      entityId,
      entityTitle: entityTitle || 'Official Academic Record',
      subjectName: subjectName || 'General',
      oldValue: oldValue || null,
      newValue: newValue || null,
      changeSummary: changeSummary || 'Modified official information',
      timestamp: new Date().toISOString()
    };
    this.data.auditLogs.unshift(log);
    this.save();
    return log;
  }

  addNotification({ userId, title, message, type = 'info', priority = 'Medium', link = '/' }) {
    const notif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      title,
      message,
      type,
      priority,
      link,
      read: false,
      createdAt: new Date().toISOString()
    };
    this.data.notifications.unshift(notif);
    this.save();
    return notif;
  }
}

export const db = new DataStore();
