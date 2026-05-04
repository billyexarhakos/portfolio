"use client";

import { useEffect, useMemo, useState } from "react";
import { AssistantChat } from "@/components/AssistantChat";
import { EditorPane } from "@/components/EditorPane";
import { FileTree } from "@/components/FileTree";
import { StatusBar } from "@/components/StatusBar";
import { TabStrip } from "@/components/TabStrip";
import { Terminal } from "@/components/Terminal";
import {
  assistantMessages,
  assistantPrompts,
  defaultActiveFileId,
  editorTabFileIds,
  filesById,
  siteTree,
  terminalBoot,
} from "@/content/siteData";
import { useChipChatStream } from "@/hooks/useChipChatStream";

function fileFor(id: string) {
  return filesById[id] ?? filesById[defaultActiveFileId];
}

export function IdeFrame() {
  const [activeFileId, setActiveFileId] = useState<string>(defaultActiveFileId);
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false);
  const [mobileExplorerOpen, setMobileExplorerOpen] = useState<boolean>(false);
  const [mobileAssistantOpen, setMobileAssistantOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const openTabs = useMemo(() => editorTabFileIds, []);

  const activeFile = useMemo(() => fileFor(activeFileId), [activeFileId]);

  const chipChat = useChipChatStream({
    initialMessages: assistantMessages,
    prompts: assistantPrompts,
    onOpenFile: setActiveFileId,
  });

  return (
    <div className="ideRoot">
      <div className="ideChrome" aria-label="IDE window">
        <div className="ideTop">
          <div className="ideTitleBar">
            <div className="ideTraffic" aria-hidden="true">
              <span className="dot dotRed" />
              <span className="dot dotYellow" />
              <span className="dot dotGreen" />
            </div>
            <div className="ideTitle">
              <span className="titleStrong">PhD Researcher</span>
              <span className="titleFaint"> — in-IDE assistant</span>
            </div>
            <div className="ideTopRight">
              <span className="pill">main</span>
              <button
                type="button"
                className="pill pillBtn"
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              >
                {theme === "dark" ? "☾" : "☀"}
              </button>
            </div>
          </div>
        </div>

        <div className="ideMain">
          <aside className="ideExplorer" aria-label="File explorer">
            <div className="paneHeader">
              <span className="paneTitle">EXPLORER</span>
              <button
                className="paneIconBtn"
                type="button"
                onClick={() => setTerminalOpen((v) => !v)}
                aria-pressed={terminalOpen}
                aria-label={terminalOpen ? "Collapse terminal" : "Expand terminal"}
              >
                ⌃
              </button>
            </div>
            <FileTree
              nodes={siteTree}
              activeId={activeFileId}
              onSelect={(id) => setActiveFileId(id)}
            />
          </aside>

          <section className="ideEditor" aria-label="Editor">
            <div className="ideEditorTabRow">
              <TabStrip
                tabs={openTabs.map((id) => fileFor(id))}
                activeId={activeFileId}
                onSelect={(id) => setActiveFileId(id)}
              />
            </div>
            <div className="ideEditorBody">
              <div className="paneHeader">
                <div className="editorHeaderLeft">
                  <button
                    className="mobileBarBtn"
                    type="button"
                    onClick={() => {
                      setMobileExplorerOpen(true);
                      setMobileAssistantOpen(false);
                    }}
                  >
                    Files
                  </button>
                  <button
                    className="mobileBarBtn"
                    type="button"
                    onClick={() => {
                      setMobileAssistantOpen(true);
                      setMobileExplorerOpen(false);
                    }}
                  >
                    Chat
                  </button>
                  <span className="paneTitle">{activeFile.path}</span>
                </div>
                <span className="paneMeta">
                  {activeFile.language.toUpperCase()} · UTF-8 · LF
                </span>
              </div>
              <EditorPane file={activeFile} />
            </div>
          </section>

          <aside className="ideAssistant" aria-label="AI assistant">
            <div className="paneHeader">
              <span className="paneTitle">ASSISTANT</span>
              <span className="paneMeta">local · themed</span>
            </div>
            <AssistantChat
              messages={chipChat.messages}
              isStreaming={chipChat.isStreaming}
              prompts={assistantPrompts}
              onChipClick={chipChat.onChipClick}
            />
          </aside>
        </div>

        <div
          className={`mobileOverlay ${mobileExplorerOpen ? "open" : ""}`}
          role="dialog"
          aria-label="Files"
          aria-modal="true"
        >
          <div className="mobileSheet">
            <div className="paneHeader">
              <span className="paneTitle">FILES</span>
              <button
                className="paneIconBtn"
                type="button"
                onClick={() => setMobileExplorerOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <FileTree
              nodes={siteTree}
              activeId={activeFileId}
              onSelect={(id) => {
                setActiveFileId(id);
                setMobileExplorerOpen(false);
              }}
            />
          </div>
        </div>

        <div
          className={`mobileOverlay ${mobileAssistantOpen ? "open" : ""}`}
          role="dialog"
          aria-label="Assistant"
          aria-modal="true"
        >
          <div className="mobileSheet">
            <div className="paneHeader">
              <span className="paneTitle">ASSISTANT</span>
              <button
                className="paneIconBtn"
                type="button"
                onClick={() => setMobileAssistantOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <AssistantChat
              messages={chipChat.messages}
              isStreaming={chipChat.isStreaming}
              prompts={assistantPrompts}
              onChipClick={(id) => {
                chipChat.onChipClick(id);
                setMobileAssistantOpen(false);
              }}
            />
          </div>
        </div>

        <div className={`ideTerminalWrap ${terminalOpen ? "open" : ""}`}>
          <Terminal
            bootLines={terminalBoot}
            onCommand={(cmd) => {
              if (cmd === "open publications") setActiveFileId("publications");
              if (cmd === "open research") setActiveFileId("research");
              if (cmd === "open contact") setActiveFileId("contact");
            }}
          />
        </div>

        <StatusBar />
      </div>
    </div>
  );
}

