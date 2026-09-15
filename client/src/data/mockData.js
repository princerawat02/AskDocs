export const mockUser = {
  name: "Prince Rawat",
  email: "prince@example.com",
  initials: "PR",
};

export const mockDocuments = [
  {
    id: "resume",
    name: "Resume.pdf",
    size: "1.2 MB",
    pages: 2,
    color: "orange",
    updated: "Today",
  },
  {
    id: "vibe",
    name: "Vibe Engineering Guide.pdf",
    size: "3.8 MB",
    pages: 19,
    color: "blue",
    updated: "Today",
  },
  {
    id: "research",
    name: "Research Paper.pdf",
    size: "2.4 MB",
    pages: 12,
    color: "violet",
    updated: "Yesterday",
  },
  {
    id: "javascript",
    name: "JavaScript Notes.pdf",
    size: "890 KB",
    pages: 8,
    color: "yellow",
    updated: "Mar 14",
  },
];

export const mockChats = [
  {
    id: "vibe-chat",
    documentId: "vibe",
    title: "Understanding Vibe Engineering",
    updated: "10:42 AM",
  },
  {
    id: "resume-chat",
    documentId: "resume",
    title: "Resume feedback",
    updated: "Yesterday",
  },
  {
    id: "research-chat",
    documentId: "research",
    title: "Key findings and methods",
    updated: "Mar 14",
  },
];

export const mockMessages = [
  { id: 1, role: "user", text: "What is Vibe Engineering?", time: "10:38 AM" },
  {
    id: 2,
    role: "assistant",
    text: "Vibe Engineering is a workflow where AI handles much of the planning and implementation while the developer remains in control of the important decisions.",
    time: "10:38 AM",
    sources: [
      { page: "2", title: "Vibe Engineering" },
      { page: "3", title: "The One Idea" },
    ],
  },
  {
    id: 3,
    role: "user",
    text: "What is the main idea behind it?",
    time: "10:41 AM",
  },
  {
    id: 4,
    role: "assistant",
    text: "The main idea is to give the AI high-level direction and let it help create the implementation plan and code while you review and approve the decisions.",
    time: "10:41 AM",
    sources: [{ page: "4", title: "Direction and control" }],
  },
];

export const mockPdfPage = {
  eyebrow: "VIBE ENGINEERING / A PRACTICAL GUIDE",
  title: "The One Idea",
  intro:
    "Vibe Engineering is a new way of working with AI that puts intent before implementation. The developer remains the director while the AI becomes an exceptionally capable collaborator.",
  sections: [
    {
      heading: "01  Start with the outcome",
      text: "Begin with what you want to be true, not with a list of technical instructions. A clear outcome gives the system room to explore the right path.",
    },
    {
      heading: "02  Keep the important decisions",
      text: "The best workflows leave architecture, quality, and product decisions in human hands. AI can propose, explain, and implement, but direction still matters.",
    },
    {
      heading: "03  Work in visible loops",
      text: "A short loop of context, proposal, implementation, and review keeps momentum high without losing understanding of the work.",
    },
  ],
};
