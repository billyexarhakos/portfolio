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
      "# TODO: Your Name",
      "",
      "CS PhD researcher working on **TODO: research area** at **TODO: university / lab**.",
      "",
      "- Interests: TODO, TODO, TODO",
      "- Advisors/mentors: TODO",
      "- Email: TODO",
      "",
      "## Current focus",
      "",
      "I build methods and systems for TODO: short, crisp 2–3 line research summary.",
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
      "- TODO: Theme 1 — one-liner",
      "- TODO: Theme 2 — one-liner",
      "- TODO: Theme 3 — one-liner",
      "",
      "## Keywords",
      "`TODO` `TODO` `TODO`",
      "",
      "## What I care about",
      "TODO: 3–6 lines of the 'why' behind your work.",
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
            title: "TODO: Paper title",
            venue: "TODO: Conference/Journal",
            year: 2026,
            links: { pdf: "TODO", doi: "TODO", code: "TODO" },
          },
          {
            title: "TODO: Another paper",
            venue: "TODO: Venue",
            year: 2025,
            links: { pdf: "TODO", doi: "TODO", code: "TODO" },
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
      '  email: "TODO@university.edu",',
      '  github: "https://github.com/TODO",',
      '  scholar: "TODO",',
      '  linkedin: "TODO",',
      '  x: "TODO",',
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
      "- TODO: Course assistant — Course name (Term/Year)",
      "- TODO: Guest lecture — Topic (Term/Year)",
      "",
      "## Mentoring",
      "TODO: a sentence about how you mentor and who you work with.",
    ].join("\n"),
  },
  talks: {
    id: "talks",
    path: "talks.md",
    language: "md",
    content: ["# Talks", "", "- TODO: Invited talk — Venue (Year)", "- TODO: Workshop — Venue (Year)"].join(
      "\n",
    ),
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
      '    name: "TODO: Project name",',
      '    oneLiner: "TODO: what it is in one sentence.",',
      '    stack: ["TODO", "TODO"],',
      "    links: { demo: \"TODO\", code: \"TODO\" },",
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
      "## TODO: Project A",
      "- What: TODO",
      "- Why: TODO",
      "- Outcome: TODO",
      "",
      "## TODO: Project B",
      "- What: TODO",
      "- Why: TODO",
      "- Outcome: TODO",
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

