import { Node, Edge } from "@xyflow/react";

interface FolderNode {
  path: string;
  name: string;
  fileCount: number;
  githubUrl: string;
  children: FolderNode[];
}

interface ReactFlowData {
  nodes: Node[];
  edges: Edge[];
}

// Main function: Convert tree to React Flow format
export function folderTreeToReactFlow(
  tree: FolderNode,
  owner: string,
  repo: string
): ReactFlowData {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let nodeIdCounter = 0;

  // Simple positioning
  const HORIZONTAL_SPACING = 300;
  const VERTICAL_SPACING = 100;

  function traverse(
    folder: FolderNode,
    parentId: string | null,
    level: number,
    indexAtLevel: number
  ) {
    const nodeId = `node-${nodeIdCounter++}`;

    console.log(`📦 Creating node: ${folder.name} (Level ${level}, Index ${indexAtLevel})`);

    // Simple positioning
    const x = indexAtLevel * HORIZONTAL_SPACING;
    const y = level * VERTICAL_SPACING;


    const node: Node = {
      id: nodeId,
      type: "custom",
      position: { x, y },
      data: {
        label: folder.name,
        fileCount: folder.fileCount,
        githubUrl: folder.githubUrl,
        path: folder.path || "root",
      },
    };

    nodes.push(node);

    // Create edge if has parent
    if (parentId) {
      // console.log(`   🔗 Creating edge: ${parentId} -> ${nodeId}`);
      edges.push({
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: "smoothstep",
      });
    }

    // Process children
    if (folder.children && folder.children.length > 0) {
      // console.log(`   👶 Has ${folder.children.length} children`);
      folder.children.forEach((child, childIndex) => {
        traverse(child, nodeId, level + 1, childIndex);
      });
    }
  }

  console.log("🚀 Starting tree traversal...");
  traverse(tree, null, 0, 0);

  console.log(`✅ Generated ${nodes.length} nodes and ${edges.length} edges`);
  console.log("📊 Final nodes:", nodes);
  console.log("📊 Final edges:", edges);

  return { nodes, edges };
}



// import {
//   LuBringToFront,
//   LuBraces,
//   LuBrackets,
//   LuCable,
//   LuCommand,
//   LuCog,
//   LuFiles,
//   LuFolderCode,
//   LuFolderRoot,
// } from "react-icons/lu";