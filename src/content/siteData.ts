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
      "`HCAI` `Human-AI Interaction` `Human-Centered AI` `HCI` `AI-Assisted Programming`",
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
      "- Conducting research in human-centered AI, with a focus on supporting developer workflows and interaction with AI-assisted programming tools.",
      "- Applying mixed-methods research approaches, including interviews, iterative prototyping, and controlled user studies, to investigate usability, trust, and workflow integration.",
      "- Developed skills in study design, prototype implementation, and both qualitative and quantitative analysis, as well as in evaluating complex software systems.",
      "- Fast-tracked from the master’s to the PhD program based on research performance, recognizing strong potential for independent graduate-level research.",
      "",
      "## Co-Organizer — Human-Centered AI Reading Group",
      "*2024 – Present*",
      "- Organized and facilitated bi-weekly interdisciplinary discussions on AI, HCI, and ethics.",
      "- Selected and distributed readings, coordinated scheduling, and moderated discussions.",
      "- Invited guest researchers in the field of HCI and responsible AI to give talks, fostering knowledge exchange and expanding the group’s academic network.",
      "- Built a community around responsible AI practices, encouraging collaboration across research groups.",
      "",
      "## Teaching Assistant — McGill University",
      "*Winter 2024, Winter 2026*",
      "- Teaching Assistant for COMP 303 (Software Design) and COMP 555 (Information Privacy)",
      "- Conducted regular office hours, providing individualized academic support and guidance to students.",
      "- Managed and actively participated in the course discussion board, fostering a collaborative learning environment.",
      "- Independently designed and ran lab tests, creating hands-on exercises to reinforce course materials.",
      "- Solely managed and supported 250+ students in COMP 303 as the only Teaching Assistant during a faculty strike, earning a TA award for outstanding performance.",
      "",
      "## Solutions Developer Intern — Ericsson",
      "*May 2024 – Jan 2026*",
      "- Developed and delivered a proof of concept for a Zero Touch Deployment system to automate network deployment processes.",
      "- Leveraged an Angular frontend and a Go backend to build an interactive dashboard for monitoring and managing deployment workflows.",
      "- Gained hands-on experience with cloud infrastructure, scripting, and deployment automation tools.",
      "- Utilized GitOps to manage and store customer configurations, ensuring version control and a single source of truth for infrastructure details.",
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
      "Hi! I'm Vassilios (Billy) Exarhakos, a PhD Student at McGill University. My work is in human-centered AI (HCAI), with a current focus on AI for software development. You can navigate this site like an IDE: use the file explorer on the left, the terminal on the bottom, or use the chat box below to ask a question.",
  },
  { role: "user" as const, content: "What are you focused on in your day-to-day research?" },
  {
    role: "assistant" as const,
    content:
      "I study human-centered AI broadly, especially how people can effectively collaborate with AI systems. Right now, my main application domain is supporting software development workflows for developers using AI.",
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
    label: "Ask about research",
    openFileId: "about",
    userPrompt: "What research themes are you pursuing?",
    assistantReply:
      "My work sits in human-centered AI, with three recurring themes: designing human-AI collaboration workflows, improving transparency and controllability of AI behavior, and supporting reasoning through better interaction design. At the moment, I investigate these themes primarily in AI for software development, including AI-assisted programming and interaction versioning of prompts and code.",
  },
  {
    id: "show_publications",
    label: "Ask about publications",
    openFileId: "publications",
    userPrompt: "What’s your latest publication?",
    assistantReply:
      "My most recent paper is “Choose Your Own Adventure: Non-Linear AI-Assisted Programming with EvoGraph”, with Jinghui Cheng and Jin L.C. Guo. It presents an IDE plugin that captures branching human-AI coding trajectories as a graph so developers can compare, merge, and revisit prior states.",
  },
  {
    id: "show_contact",
    label: "Ask about contact info",
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

