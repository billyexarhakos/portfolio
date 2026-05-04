import type { EditorFile } from "@/components/EditorPane";
import type { TreeNode } from "@/components/FileTree";

export const defaultActiveFileId = "about";

export const siteTree: TreeNode[] = [
  {
    type: "folder",
    id: "root",
    name: "src",
    children: [
      { type: "file", id: "about", name: "about.md" },
      { type: "file", id: "research", name: "research.md" },
      { type: "file", id: "publications", name: "publications.json" },
      { type: "file", id: "teaching", name: "teaching.md" },
      { type: "file", id: "talks", name: "talks.md" },
      { type: "file", id: "contact", name: "contact.ts" },
    ],
  },
];

function collectFileIdsInOrder(nodes: TreeNode[]): string[] {
  const out: string[] = [];
  for (const node of nodes) {
    if (node.type === "file") out.push(node.id);
    else out.push(...collectFileIdsInOrder(node.children));
  }
  return out;
}

/** File ids shown as tabs in the top bar (same order as the explorer tree). */
export const editorTabFileIds: string[] = siteTree.flatMap((node) =>
  node.type === "folder" ? collectFileIdsInOrder(node.children) : node.type === "file" ? [node.id] : [],
);

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
};

export const assistantMessages = [
  {
    role: "assistant" as const,
    content:
      "Hi! I'm Vassilios (Billy) Exarhakos, a computer science researcher at McGill University. My work focuses on human–computer interaction for software development. You can navigate this site like an IDE: use the file explorer on the left, the terminal on the bottom, or use the chips below to ask about research, publications, or contact.",
  },
  { role: "user" as const, content: "What are you focused on in your day-to-day research?" },
  {
    role: "assistant" as const,
    content:
      "I spend most of my time on AI-assisted programming, interaction versioning for prompts and code, and the design of tools that improve transparency and control when developers work with large language models. I also serve as a course assistant for COMP 303 (Software Design).",
  },
];

export type AssistantPromptChip = {
  id: string;
  label: string;
  openFileId: string;
  userPrompt: string;
  assistantReply: string;
};

export const assistantPrompts: AssistantPromptChip[] = [
  {
    id: "show_research",
    label: "Show research",
    openFileId: "research",
    userPrompt: "What research themes are you pursuing?",
    assistantReply:
      "My research is organized around three themes: AI-assisted programming and developer workflows with large language models; interaction versioning, or tracking and revisiting the joint evolution of prompts and code; and developer cognition, including tools that support exploration and structured reasoning.",
  },
  {
    id: "show_publications",
    label: "Show publications",
    openFileId: "publications",
    userPrompt: "What’s your latest publication?",
    assistantReply:
      "My most recent paper is “Choose Your Own Adventure: Non-Linear AI-Assisted Programming with EvoGraph” (arXiv, 2026), with Jinghui Cheng and Jin L.C. Guo. It introduces an IDE plugin that records branching AI-assisted coding history as a graph so that developers can compare, merge, and revisit prior states. Abstract, PDF, and DOI links are listed in publications.json.",
  },
  {
    id: "show_contact",
    label: "Show contact",
    openFileId: "contact",
    userPrompt: "How can I get in touch?",
    assistantReply:
      "You can reach me by email at vassilios.exarhakos@mail.mcgill.ca. My Google Scholar and LinkedIn profiles are also listed in contact.ts.",
  },
];

export const terminalBoot = [
  "researcher-site@dev  ▸  npm run dev",
  "ready - started server on 0.0.0.0:3000",
  "",
  "try: help · open publications · open research · open contact",
];

