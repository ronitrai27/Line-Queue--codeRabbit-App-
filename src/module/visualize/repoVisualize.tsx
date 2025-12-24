"use client";

import { useEffect, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { generateRepoVisualization } from ".";

// 🔹 SUPER SIMPLE NODE - Just text boxes
function FolderNode({ data }: any) {
  console.log("🎨 Rendering node:", data);
  
  return (
    <div style={{
      padding: "10px",
      border: "2px solid black",
      borderRadius: "5px",
      background: "white",
      width: "200px",
    }}>
      <Handle type="target" position={Position.Top} />
      
      <div style={{ fontWeight: "bold", fontSize: "14px" }}>
        {data.label}
      </div>
      
      <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
        Files: {data.fileCount}
      </div>
      
      <div style={{ fontSize: "10px", color: "#999", marginTop: "5px" }}>
        {data.path}
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  custom: FolderNode,
};

interface RepoVisualizerProps {
  owner: string;
  repo: string;
}

export default function RepoVisualizer({ owner, repo }: RepoVisualizerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      console.log("🔄 Starting load for:", owner, repo);
      
      try {
        setLoading(true);
        setError(null);

        const data = await generateRepoVisualization(owner, repo);

        console.log("✅ Data received in component:");
        console.log("   Nodes:", data.nodes);
        console.log("   Edges:", data.edges);

        if (!data.nodes || data.nodes.length === 0) {
          console.warn("⚠️ No nodes received!");
        }

        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        
        console.log("✅ State updated successfully");
      } catch (err) {
        console.error("❌ Error loading visualization:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [owner, repo, setNodes, setEdges]);

  console.log("🎬 Render state:", { loading, error, nodesCount: nodes.length, edgesCount: edges.length });

  if (loading) {
    return (
      <div style={{ width: "100%", height: "600px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading repository structure...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: "100%", height: "600px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "red", fontWeight: "bold" }}>Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div style={{ width: "100%", height: "600px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>No nodes to display</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <h3 className="text-black">
        Showing {nodes.length} folders from {owner}/{repo}
      </h3>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.5,
        }}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}





  // <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
  //       <h3 className="font-bold mb-3 text-sm">How to Use</h3>
  //       <ul className="space-y-2 text-xs text-gray-600">
  //         <li className="flex items-start gap-2">
  //           <span>🖱️</span>
  //           <span>Click any folder to view on GitHub</span>
  //         </li>
  //         <li className="flex items-start gap-2">
  //           <span>🔍</span>
  //           <span>Use mouse wheel to zoom in/out</span>
  //         </li>
  //         <li className="flex items-start gap-2">
  //           <span>✋</span>
  //           <span>Drag to pan around the diagram</span>
  //         </li>
  //       </ul>
  //     </div>