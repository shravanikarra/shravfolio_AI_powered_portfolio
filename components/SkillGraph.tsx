import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Project, GraphNode } from '../types';

interface SkillGraphProps {
  projects: Project[];
  onProjectClick: (projectId: string) => void;
}

const SkillGraph: React.FC<SkillGraphProps> = ({ projects, onProjectClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle Resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    // Initial delay to ensure container has size
    setTimeout(updateDimensions, 100);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || projects.length === 0) return;

    // --- Configuration ---
    const isMobile = dimensions.width < 768;
    const nodeRadius = isMobile ? 40 : 65; // Slightly larger for better visibility
    
    // Define Category Centers (Foci)
    const categories = ['The End-to-End', 'The Business Value', 'The Deep Dive'];
    const categoryColors: Record<string, string> = {
      'The End-to-End': '#38bdf8',   // Blue
      'The Business Value': '#2dd4bf', // Teal
      'The Deep Dive': '#f472b6'     // Pink
    };

    const getFocus = (category: string) => {
      const index = categories.indexOf(category);
      if (index === -1) return { x: dimensions.width / 2, y: dimensions.height / 2 };

      if (isMobile) {
        // Vertical Stack
        return {
          x: dimensions.width / 2,
          y: (dimensions.height / 4) * (index + 1)
        };
      } else {
        // Horizontal Spread
        return {
          x: (dimensions.width / 4) * (index + 1),
          y: dimensions.height / 2
        };
      }
    };

    // --- Prepare Data ---
    const nodes: GraphNode[] = projects.map(p => ({
      id: p.id,
      group: 'project',
      radius: nodeRadius,
      label: p.title,
      originalColor: categoryColors[p.category] || '#94a3b8',
      projectId: p.id,
      // Random start position near center to explode outwards
      x: dimensions.width / 2 + (Math.random() - 0.5) * 50,
      y: dimensions.height / 2 + (Math.random() - 0.5) * 50,
      category: p.category // Add category for force positioning
    } as any));

    // --- D3 Setup ---
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // 1. Defs for Images (Circular clipping)
    const defs = svg.append("defs");
    
    nodes.forEach(node => {
      const p = projects.find(proj => proj.id === node.id);
      if (p) {
        defs.append("pattern")
          .attr("id", `img-${node.id}`)
          .attr("height", "100%")
          .attr("width", "100%")
          .attr("patternContentUnits", "objectBoundingBox")
          .append("image")
          .attr("height", 1)
          .attr("width", 1)
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("href", p.imageUrl);
      }
    });

    // 2. Background Category Labels
    const labelGroup = svg.append("g").attr("class", "category-labels");
    
    categories.forEach(cat => {
      const focus = getFocus(cat);
      labelGroup.append("text")
        .attr("x", focus.x)
        .attr("y", isMobile ? focus.y : dimensions.height * 0.15) // Top on desktop, centered on mobile clusters
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(cat.replace('The ', '').toUpperCase())
        .attr("fill", categoryColors[cat])
        .attr("opacity", 0.08)
        .attr("font-size", isMobile ? "24px" : "48px")
        .attr("font-weight", "900")
        .style("pointer-events", "none")
        .style("user-select", "none");
    });

    // 3. Simulation
    const simulation = d3.forceSimulation(nodes)
      .force("x", d3.forceX((d: any) => getFocus(d.category).x).strength(isMobile ? 0.3 : 0.15))
      .force("y", d3.forceY((d: any) => getFocus(d.category).y).strength(isMobile ? 0.3 : 0.15))
      .force("collide", d3.forceCollide().radius((d: any) => d.radius + 10).iterations(2))
      .force("charge", d3.forceManyBody().strength(-30));

    // Drag state tracking to distinguish click from drag
    let isDragging = false;

    // 4. Draw Nodes
    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Node Circle (Border/Background)
    nodeGroup.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => d.originalColor)
      .attr("stroke", d => d.originalColor)
      .attr("stroke-width", 2)
      .attr("opacity", 0.9);

    // Node Image
    nodeGroup.append("circle")
      .attr("r", d => d.radius - 4) // Slightly smaller to show border
      .attr("fill", d => `url(#img-${d.id})`)
      .attr("stroke", "none");

    // Title Label (Hidden by default, shown on hover)
    const textGroup = nodeGroup.append("g")
      .attr("class", "node-label")
      .attr("opacity", 0)
      .style("pointer-events", "none");
      
    textGroup.append("rect")
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("fill", "rgba(15, 23, 42, 0.9)")
        .attr("stroke", "#38bdf8")
        .attr("stroke-width", 1)
        .attr("width", 160)
        .attr("height", 55)
        .attr("x", -80)
        .attr("y", -27.5);

    textGroup.append("text")
      .text(d => d.label.length > 18 ? d.label.substring(0, 16) + '...' : d.label)
      .attr("text-anchor", "middle")
      .attr("dy", "-0.3em")
      .attr("fill", "#fff")
      .attr("font-size", "13px")
      .attr("font-family", "monospace")
      .attr("font-weight", "bold");

    textGroup.append("text")
      .text("Click to view project ↗")
      .attr("text-anchor", "middle")
      .attr("dy", "1.1em")
      .attr("fill", "#38bdf8")
      .attr("font-size", "11px")
      .attr("font-family", "monospace");


    // 5. Interactions
    nodeGroup
      .on("click", (event, d) => {
        // Prevent click trigger if we just dragged
        if (isDragging) return;
        event.stopPropagation();
        
        const p = projects.find(proj => proj.id === d.projectId);
        if (p) {
            // Highlight in grid
            onProjectClick(p.id);
            // Open Link
            if (p.githubUrl) {
                // Use a slight timeout to ensure UI updates first
                setTimeout(() => {
                    window.open(p.githubUrl, '_blank', 'noopener,noreferrer');
                }, 50);
            }
        }
      })
      .on("mouseover", function(event, d) {
        if (isDragging) return;
        // Scale Up
        d3.select(this).raise().transition().duration(200).attr("transform", `translate(${d.x},${d.y}) scale(1.15)`);
        d3.select(this).select(".node-label").transition().duration(200).attr("opacity", 1);
        d3.select(this).select("circle").attr("stroke", "#fff").attr("stroke-width", 4);
      })
      .on("mouseout", function(event, d) {
        if (isDragging) return;
        // Scale Down
        d3.select(this).transition().duration(200).attr("transform", `translate(${d.x},${d.y}) scale(1)`);
        d3.select(this).select(".node-label").transition().duration(200).attr("opacity", 0);
        d3.select(this).select("circle").attr("stroke", d.originalColor).attr("stroke-width", 2);
      });

    // 6. Tick
    simulation.on("tick", () => {
      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      isDragging = false;
    }

    function dragged(event: any, d: GraphNode) {
      // Threshold to consider it a drag
      isDragging = true;
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
      
      // We rely on the 'click' event handler for the click action.
      // D3 fires 'click' after 'dragend' if it wasn't suppressed.
      // Our isDragging flag filters out actual drags.
      setTimeout(() => { isDragging = false; }, 100); 
    }

  }, [projects, dimensions, onProjectClick]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[500px] bg-brand-dark/30 rounded-xl border border-slate-800 overflow-hidden relative shadow-inner">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md p-2 rounded border border-slate-700/50">
            <p className="text-xs text-slate-400 font-mono">
              <span className="text-brand-primary">●</span> End-to-End
              <span className="mx-2">|</span>
              <span className="text-[#2dd4bf]">●</span> Business
              <span className="mx-2">|</span>
              <span className="text-brand-accent">●</span> Research
            </p>
        </div>
      </div>
      <svg ref={svgRef} className="w-full h-full" width={dimensions.width} height={dimensions.height} style={{cursor: 'crosshair'}}></svg>
    </div>
  );
};

export default SkillGraph;