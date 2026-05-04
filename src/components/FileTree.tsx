"use client";

import { useMemo } from "react";

export type TreeNode =
  | { type: "file"; id: string; name: string }
  | { type: "folder"; id: string; name: string; children: TreeNode[] };

type FlatNode = {
  node: TreeNode;
  depth: number;
  parentFolderNames: string[];
};

function flatten(nodes: TreeNode[], depth = 0, parents: string[] = []): FlatNode[] {
  const out: FlatNode[] = [];
  for (const n of nodes) {
    out.push({ node: n, depth, parentFolderNames: parents });
    if (n.type === "folder") {
      out.push(...flatten(n.children, depth + 1, [...parents, n.name]));
    }
  }
  return out;
}

export function FileTree({
  nodes,
  activeId,
  onSelect,
}: {
  nodes: TreeNode[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const flat = useMemo(() => flatten(nodes), [nodes]);
  const fileIds = useMemo(
    () => flat.filter((f) => f.node.type === "file").map((f) => (f.node as any).id as string),
    [flat],
  );

  return (
    <div className="fileTree" role="tree" aria-label="Project files">
      {flat.map(({ node, depth }) => {
        if (node.type === "folder") {
          return (
            <div
              key={node.id}
              className="treeRow folderRow"
              role="treeitem"
              aria-level={depth + 1}
              aria-expanded="true"
              aria-selected="false"
            >
              <span className="treeIndent" style={{ width: depth * 12 }} aria-hidden="true" />
              <span className="treeTwisty" aria-hidden="true">
                ▾
              </span>
              <span className="treeIcon" aria-hidden="true">
                🗀
              </span>
              <span className="treeLabel">{node.name}</span>
            </div>
          );
        }

        const isActive = node.id === activeId;
        return (
          <button
            key={node.id}
            type="button"
            className={`treeRow fileRow ${isActive ? "active" : ""}`}
            role="treeitem"
            aria-level={depth + 1}
            aria-selected={isActive}
            onClick={() => onSelect(node.id)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
              e.preventDefault();
              const curIdx = fileIds.indexOf(node.id);
              const delta = e.key === "ArrowDown" ? 1 : -1;
              const next = fileIds[Math.max(0, Math.min(fileIds.length - 1, curIdx + delta))];
              if (next) onSelect(next);
            }}
          >
            <span className="treeIndent" style={{ width: depth * 12 }} aria-hidden="true" />
            <span className="treeTwisty" aria-hidden="true">
              ·
            </span>
            <span className="treeIcon" aria-hidden="true">
              ⌘
            </span>
            <span className="treeLabel">{node.name}</span>
          </button>
        );
      })}
    </div>
  );
}

