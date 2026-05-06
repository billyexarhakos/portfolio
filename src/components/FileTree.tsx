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
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                  style={{ display: "block", color: "currentColor" }}
                >
                  <path
                    d="M3.75 6.75C3.75 5.50736 4.75736 4.5 6 4.5H10.1716C10.6419 4.5 11.0929 4.68683 11.425 5.01893L12.1561 5.75H18C19.2426 5.75 20.25 6.75736 20.25 8V17.25C20.25 18.4926 19.2426 19.5 18 19.5H6C4.75736 19.5 3.75 18.4926 3.75 17.25V6.75Z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinejoin="round"
                  />
                </svg>
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
            {/* No twisty for files; only an icon based on file type */}
            <span className="treeIcon" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
                style={{ display: "block", color: "currentColor" }}
              >
                <path
                  d="M8 3.75H14.25L18.25 7.75V20.25H8C6.75736 20.25 5.75 19.2426 5.75 18V6C5.75 4.75736 6.75736 3.75 8 3.75Z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.25 3.75V7.75H18.25"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="treeLabel">{node.name}</span>
          </button>
        );
      })}
    </div>
  );
}

