import { useEffect, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

export interface DiagramData {
  vertices: Array<{ id: string; label: string; x?: number; y?: number }>;
  connections: Array<{ from: string; to: string; label?: string }>;
}

interface DiagramViewerProps {
  diagram: DiagramData | null;
}

export const DiagramViewer = ({ diagram }: DiagramViewerProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!diagram) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // Convert vertices to nodes
    const newNodes: Node[] = diagram.vertices.map((vertex, index) => ({
      id: vertex.id,
      data: { label: vertex.label },
      position: {
        x: vertex.x ?? (index % 3) * 250 + 100,
        y: vertex.y ?? Math.floor(index / 3) * 150 + 100,
      },
      type: "default",
      style: {
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        border: "2px solid hsl(var(--primary))",
        borderRadius: "8px",
        padding: "10px",
        fontSize: "14px",
        fontWeight: 500,
      },
    }));

    // Convert connections to edges
    const newEdges: Edge[] = diagram.connections.map((conn, index) => ({
      id: `edge-${index}`,
      source: conn.from,
      target: conn.to,
      label: conn.label,
      animated: true,
      style: { stroke: "hsl(var(--primary))" },
      labelStyle: { fill: "hsl(var(--foreground))", fontWeight: 500 },
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [diagram, setNodes, setEdges]);

  if (!diagram) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-diagram-bg text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">No diagram to display</p>
          <p className="text-sm mt-2">Send a message to generate a diagram</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-diagram-bg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-right"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => "hsl(var(--primary))"}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
};
