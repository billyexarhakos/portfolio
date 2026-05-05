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
      { type: "file", id: "publications", name: "publications.json" },
      { type: "file", id: "experience", name: "experience.md" },
//      { type: "file", id: "talks", name: "talks.md" },
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
      "I'm a PhD student in the Software Technology Lab at McGill University, where I am advised by Professor Jin Guo. I am a CS researcher focusing on **human-centered AI (HCAI)**. I design and study interactive systems that put human needs, values, and workflows at the center of AI. My interests include making AI more transparent, trustworthy, and supportive across a range of creative, analytical, and collaborative activities. As models become more capable, the challenge shifts from generation to interaction: helping users understand, trust, and steer AI outputs effectively.",
      "",
      "## Research themes",
      "- Human-AI collaboration — designing AI systems that augment human reasoning, creativity, and control",
      "- Interaction transparency — making AI systems' behavior more understandable and predictable",
      "- Controllability — giving users meaningful ways to steer, refine, and interpret AI outputs",
      "- Versioning and provenance — tracking and revisiting the evolution of human-AI co-created artifacts",
      "",
      "## Keywords",
      "`HCAI` `Human-AI Interaction` `Human-Centered AI` `HCI` `AI-assisted programming`",
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
  experience: {
    id: "experience",
    path: "experience.md",
    language: "md",
    content: [
      "# Experience",
      "",
      "## Graduate Researcher — McGill University",
      "*Aug 2024 – Present*",
      "- Leading the design and evaluation of a version control system for AI-assisted programming",
      "- Conducting mixed-methods research: interviews, prototyping, and user studies",
      "- Working on systems for tracking prompt + code evolution",
      "",
      "## Co-Organizer — Human-Centered AI Reading Group",
      "*2024 – Present*",
      "- Organized bi-weekly discussions on AI, HCI, and responsible AI",
      "- Coordinated readings and moderated sessions",
      "- Invited guest speakers and fostered interdisciplinary collaboration",
      "",
      "## Course Assistant — McGill University",
      "*Winter 2024, Winter 2026*",
      "- COMP 303 (Software Design) — led labs, office hours, and course operations",
      "- COMP 555 — teaching assistant responsibilities including student support and evaluation",
      "- Recognized with TA award for outstanding performance",
      "",
      "## Solutions Developer Intern — Ericsson",
      "*May 2024 – Jan 2026*",
      "- Built a Zero Touch Deployment proof-of-concept for network automation",
      "- Developed dashboard using Angular (frontend) and Go (backend)",
      "- Applied GitOps principles for configuration management",
    ].join("\n"),
  },
//  talks: {
//    id: "talks",
//    path: "talks.md",
//    language: "md",
//    content: [
//      "# Talks",
//      "",
//      "- Choose Your Own Adventure: Non-Linear AI-Assisted Programming with EvoGraph — paper presentation (2026)",
//      "- Developer interaction with LLMs — reading group (2025)",
//    ].join("\n"),
//  },
};

export const assistantMessages = [
  {
    role: "assistant" as const,
    content:
      "Hi! I'm Vassilios (Billy) Exarhakos, a computer science researcher at McGill University. My work focuses on human–computer interaction for software development. You can navigate this site like an IDE: use the file explorer on the left, the terminal on the bottom, or use the chips below to ask about myself, my publications, or how to contact me.",
  },
  { role: "user" as const, content: "What are you focused on in your day-to-day research?" },
  {
    role: "assistant" as const,
    content:
      "Currently, I spend most of my time on AI-assisted programming, interaction versioning for prompts and code, and the design of tools that improve transparency and control when developers work with large language models.",
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
    label: "Research",
    openFileId: "about",
    userPrompt: "What research themes are you pursuing?",
    assistantReply:
      "My research is organized around three themes: AI-assisted programming and developer workflows with large language models; interaction versioning, or tracking and revisiting the joint evolution of prompts and code; and developer cognition, including tools that support exploration and structured reasoning.",
  },
  {
    id: "show_publications",
    label: "Publications",
    openFileId: "publications",
    userPrompt: "What’s your latest publication?",
    assistantReply:
      "My most recent paper is “Choose Your Own Adventure: Non-Linear AI-Assisted Programming with EvoGraph” (arXiv, 2026), with Jinghui Cheng and Jin L.C. Guo. It introduces an IDE plugin that records branching AI-assisted coding history as a graph so that developers can compare, merge, and revisit prior states. Abstract, PDF, and DOI links are listed in publications.json.",
  },
  {
    id: "show_contact",
    label: "Contact",
    openFileId: "contact",
    userPrompt: "How can I get in touch?",
    assistantReply:
      "You can reach me by email at vassilios.exarhakos@mail.mcgill.ca. My Google Scholar and LinkedIn profiles are also listed in contact.ts.",
  },
];

export const terminalBoot = [
  "site@dev  ▸  npm run dev",
  "ready - started server on 0.0.0.0:3000",
  "",
  "try: help · ls · open <page>",
];

