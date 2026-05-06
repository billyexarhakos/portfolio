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
  const [terminalOpen, setTerminalOpen] = useState<boolean>(true);
  const [mobileExplorerOpen, setMobileExplorerOpen] = useState<boolean>(false);
  const [mobileAssistantOpen, setMobileAssistantOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (window.matchMedia("(max-width: 760px)").matches) {
      setTerminalOpen(false);
    }
  }, []);

  const openTabs = useMemo(() => editorTabFileIds, []);

  const openablePages = useMemo(
    () => editorTabFileIds.map((id) => ({ id, path: fileFor(id).path })),
    [],
  );

  const activeFile = useMemo(() => fileFor(activeFileId), [activeFileId]);

  const chipChat = useChipChatStream({
    initialMessages: assistantMessages,
    prompts: assistantPrompts,
    onOpenFile: setActiveFileId,
  });

  return (
    <div className="ideRoot">
      <div className="ideChrome" aria-label="IDE">
        <div className="ideTop">
          <div className="ideTitleBar">
            <div className="ideTitleBarLead">
              <div className="ideTitleBarNav">
                <button
                  type="button"
                  className="titleBarNavBtn titleBarNavBtn--files"
                  onClick={() => {
                    setMobileExplorerOpen(true);
                    setMobileAssistantOpen(false);
                  }}
                  aria-label="Open file explorer"
                >
                  Files
                </button>
                <button
                  type="button"
                  className="titleBarNavBtn titleBarNavBtn--chat"
                  onClick={() => {
                    setMobileAssistantOpen(true);
                    setMobileExplorerOpen(false);
                  }}
                  aria-label="Open assistant chat"
                >
                  Chat
                </button>
              </div>
            </div>
            <div className="ideTitle">
              <div className="ideCommandPalette" role="search" aria-label="Command palette">
                <span className="commandPaletteText">PhD Student @ McGill University</span>
              </div>
            </div>
            <div className="ideTopRight">
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
            </div>
            <FileTree
              nodes={siteTree}
              activeId={activeFileId}
              onSelect={(id) => setActiveFileId(id)}
            />
          </aside>

          <div className="ideCenterStack">
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
                    <span className="paneTitle">{activeFile.path}</span>
                  </div>
                  <span className="paneMeta">
                    {activeFile.language.toUpperCase()} · UTF-8 · LF
                  </span>
                </div>
                <EditorPane file={activeFile} />
              </div>
            </section>

            <div className="ideTerminalStack">
              <div className="ideTerminalHandleRow">
                <button
                  type="button"
                  className="ideTerminalHandleBtn"
                  onClick={() => setTerminalOpen((v) => !v)}
                  aria-expanded={terminalOpen}
                  aria-label={terminalOpen ? "Hide terminal" : "Show terminal"}
                >
                  <span className="ideTerminalHandleIcon" aria-hidden="true">
                    {terminalOpen ? "▼" : "▲"}
                  </span>
                </button>
              </div>
              <div className={`ideTerminalWrap ${terminalOpen ? "open" : ""}`}>
                <Terminal
                  bootLines={terminalBoot}
                  openablePages={openablePages}
                  onOpenPage={(id) => setActiveFileId(id)}
                />
              </div>
            </div>
          </div>

          <aside className="ideAssistant" aria-label="AI assistant">
            <div className="paneHeader">
              <span className="paneTitle">ASSISTANT</span>
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
              onChipClick={chipChat.onChipClick}
            />
          </div>
        </div>

        <StatusBar />
      </div>
    </div>
  );
}

