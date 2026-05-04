import type { EditorFile } from "@/components/EditorPane";
import type { TreeNode } from "@/components/FileTree";

export const defaultActiveFileId = "about";

export const siteTree: TreeNode[] = [
  {
    type: "folder",
    id: "root",
    name: "researcher-site",
    children: [
      { type: "file", id: "about", name: "about.md" },
      { type: "file", id: "research", name: "research.md" },
      { type: "file", id: "publications", name: "publications.json" },
      {
        type: "folder",
        id: "projects",
        name: "projects",
        children: [
          { type: "file", id: "proj-1", name: "lab-notes.ts" },
          { type: "file", id: "proj-2", name: "systems.md" },
        ],
      },
      { type: "file", id: "teaching", name: "teaching.md" },
      { type: "file", id: "talks", name: "talks.md" },
      { type: "file", id: "contact", name: "contact.ts" },
    ],
  },
];

export const filesById: Record<string, EditorFile> = {
  about: {
    id: "about",
    path: "about.md",
    language: "md",
    content: [
      "# Vassilios (Billy) Exarhakos",
      "",
      "CS researcher at McGill University working on **human-AI interaction for software development**.",
      "",
      "- Interests: AI-assisted programming, developer tools, HCI, LLM interaction",
      "- Experience: Course Assistant (COMP 303 — Software Design)",
      "- Email: vassilios.exarhakos@mail.mcgill.ca",
      "",
      "## Current focus",
      "",
      "I design and study systems that improve how developers interact with AI coding tools, with a focus on controllability, transparency, and non-linear versioning of prompt and code trajectories.",
    ].join("\n"),
  },
  research: {
    id: "research",
    path: "research.md",
    language: "md",
    content: [
      "# Research",
      "",
      "## Themes",
      "- AI-assisted programming — understanding and improving developer workflows with LLMs",
      "- Interaction versioning — tracking and revisiting prompt + code evolution",
      "- Developer cognition — designing tools that support reasoning and exploration",
      "",
      "## Keywords",
      "`LLMs` `HCI` `developer-tools` `version-control` `UX`",
      "",
      "## What I care about",
      "I care about making AI tools more transparent and controllable. As models become more capable, the challenge shifts from generation to interaction — helping users understand, trust, and steer AI outputs effectively.",
    ].join("\n"),
  },
  publications: {
    id: "publications",
    path: "publications.json",
    language: "json",
    content: JSON.stringify(
      {
        selected: [
          {
            title: "Choose Your Own Adventure: Non-Linear AI-Assisted Programming with EvoGraph",
            venue: "arXiv (cs.HC, cs.AI, cs.SE)",
            year: 2026,
            authors: ["Vassilios Exarhakos", "Jinghui Cheng", "Jin L.C. Guo"],
            links: {
              abs: "https://arxiv.org/abs/2604.18883",
              pdf: "https://arxiv.org/pdf/2604.18883",
              doi: "https://doi.org/10.48550/arXiv.2604.18883",
            },
          },
        ],
      },
      null,
      2,
    ),
  },
  contact: {
    id: "contact",
    path: "contact.ts",
    language: "ts",
    content: [
      "export const contact = {",
      '  email: "vassilios.exarhakos@mail.mcgill.ca",',
      '  website: "https://arxiv.org/abs/2604.18883",',
      '  scholar: "https://scholar.google.com/citations?hl=en&user=nQ2kn10AAAAJ",',
      '  linkedin: "https://www.linkedin.com/in/vassilios-exarhakos-593913233/",',
      "};",
    ].join("\n"),
    
  },
  teaching: {
    id: "teaching",
    path: "teaching.md",
    language: "md",
    content: [
      "# Teaching & Mentoring",
      "",
      "- Course Assistant — COMP 303: Software Design (Winter 2024, Winter 2026)",
      "",
      "## Mentoring",
      "Supported students through office hours, discussion boards, and lab design, focusing on object-oriented design principles.",
    ].join("\n"),
  },
  talks: {
    id: "talks",
    path: "talks.md",
    language: "md",
    content: [
      "# Talks",
      "",
      "- Choose Your Own Adventure: Non-Linear AI-Assisted Programming with EvoGraph — paper presentation (2026)",
      "- Developer interaction with LLMs — reading group (2025)",
    ].join("\n"),
  },
  "proj-1": {
    id: "proj-1",
    path: "projects/lab-notes.ts",
    language: "ts",
    content: [
      "type Project = {",
      "  name: string;",
      "  oneLiner: string;",
      "  stack: string[];",
      "  links?: { demo?: string; code?: string; paper?: string };",
      "};",
      "",
      "export const projects: Project[] = [",
      "  {",
      '    name: "EvoGraph",',
      '    oneLiner: "A non-linear, graph-based interaction history for AI-assisted programming in the IDE.",',
      '    stack: ["TypeScript", "VS Code API", "D3.js"],',
      '    links: { paper: "https://arxiv.org/abs/2604.18883" },',
      "  },",
      "];",
    ].join("\n"),
  },
  "proj-2": {
    id: "proj-2",
    path: "projects/systems.md",
    language: "md",
    content: [
      "# Projects",
      "",
      "## EvoGraph",
      "- What: An IDE plugin that records AI interactions and code changes as a lightweight development graph",
      "- Why: Linear chat workflows make it hard to explore alternatives and trace branching progress",
      "- Outcome: In a user study (n=20), participants reported lower cognitive load and better support for safe exploration and reflection",
      "",
    ].join("\n"),
  },
};

export const assistantMessages = [
  {
    role: "assistant" as const,
    content:
      "Hi — I’m the (themed) in-IDE assistant for this site. Click a file to explore, or use a prompt below.",
  },
  {
    role: "assistant" as const,
    content:
      "This is placeholder content for a CS PhD researcher. Replace TODOs in `src/content/siteData.ts`.",
  },
  { role: "user" as const, content: "What are you working on right now?" },
  {
    role: "assistant" as const,
    content:
      "Right now: making this website feel like an editor + assistant. Next: swapping placeholders for your real bio + publications.",
  },
];

export const assistantPrompts = [
  { id: "show_research" as const, label: "Show research", openFileId: "research" },
  { id: "show_publications" as const, label: "Show publications", openFileId: "publications" },
  { id: "show_contact" as const, label: "Show contact", openFileId: "contact" },
];

export const terminalBoot = [
  "researcher-site@dev  ▸  npm run dev",
  "ready - started server on 0.0.0.0:3000",
  "",
  "try: help · open publications · open research · open contact",
];

