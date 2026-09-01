"use client";

import { useId, useState } from "react";

import { knowledgeEdges, knowledgeNodes } from "@/content/home";
import { cn } from "@/lib/cn";
import type { StageId } from "@/types/home";

/**
 * The hero knowledge network.
 *
 * Inline SVG, per the handoff's explicit recommendation: five nodes and eight
 * edges is a trivially small scene, and real DOM nodes mean each node is a
 * focusable, labelled button with no parallel accessibility tree to maintain.
 * Canvas would force a hidden DOM mirror; WebGL would add a renderer and a
 * battery cost for a graphic that never exceeds a few dozen primitives.
 *
 * Geometry — edges and node dots alike — is drawn by the SVG so the two can
 * never drift apart. The buttons layered over it carry only the hit area and
 * the label.
 *
 * The map keeps a fixed 5:4 box so the SVG scales uniformly. That matters:
 * stroke dashes are measured in user space, so a non-uniformly stretched
 * viewBox renders the draw-on animation as disconnected fragments. For the
 * same reason the edges cannot use non-scaling-stroke: it measures the dash
 * in screen pixels, which defeats the pathLength normalisation the draw
 * depends on.
 *
 * Composed in its final state and animated second, so the reduced-motion
 * rendering is the design rather than a degraded copy.
 */
const ASPECT = 1.25; // viewBox is 125 × 100, matching the 5:4 box
export function HeroNetwork({ className }: { className?: string }) {
  const [active, setActive] = useState<StageId>("learn");
  const titleId = useId();

  const byId = new Map(knowledgeNodes.map((node) => [node.id, node]));
  const activeNode = byId.get(active) ?? knowledgeNodes[0];

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="relative aspect-[5/4] w-full">
        <svg
          viewBox={`0 0 ${100 * ASPECT} 100`}
          aria-hidden="true"
          focusable="false"
          className="absolute inset-0 h-full w-full"
        >
          {knowledgeEdges.map(([from, to], i) => {
            const a = byId.get(from);
            const b = byId.get(to);
            if (!a || !b) return null;
            const live = from === active || to === active;

            return (
              <line
                key={`${from}-${to}`}
                x1={a.x * ASPECT}
                y1={a.y}
                x2={b.x * ASPECT}
                y2={b.y}
                strokeWidth={0.2}
                pathLength={1}
                stroke={live ? "var(--srs-lime)" : "var(--srs-network-line)"}
                opacity={live ? 0.5 : 1}
                className={cn(
                  "kos-line-draw",
                  "transition-[stroke,opacity] duration-[var(--srs-duration-fast)] ease-standard",
                )}
                style={{ animationDelay: `${i * 70}ms` }}
              />
            );
          })}
        </svg>

        {/* Node dots, in a second SVG so they are never distorted by the
            non-uniform scaling the edge layer needs. */}
        {knowledgeNodes.map((node) => {
          const isActive = node.id === active;
          return (
            <span
              key={`dot-${node.id}`}
              aria-hidden="true"
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
                "transition-all duration-[var(--srs-duration-base)] ease-entrance",
                isActive ? "size-[11px] bg-lime" : "size-[7px] bg-lime/45",
              )}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            />
          );
        })}

        {/*
          The node list is the accessible representation of the graphic: real
          list items with real buttons, labelled and keyboard-operable.
        */}
        <h2 id={titleId} className="sr-only-srs">
          Knowledge OS system map
        </h2>
        <ul aria-labelledby={titleId} className="absolute inset-0">
          {knowledgeNodes.map((node) => {
            const isActive = node.id === active;

            return (
              <li
                key={node.id}
                className="absolute"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(node.id)}
                  onFocus={() => setActive(node.id)}
                  onPointerEnter={() => {
                    // Pointer reactivity is a desktop-only affordance in the
                    // responsive spec; below 1280 selection is explicit.
                    if (window.matchMedia("(min-width: 80rem)").matches) {
                      setActive(node.id);
                    }
                  }}
                  className={cn(
                    "absolute -translate-y-1/2 pl-4 pr-3",
                    "flex min-h-11 items-center rounded-[var(--srs-radius-full)]",
                    "transition-colors duration-[var(--srs-duration-fast)] ease-standard",
                    isActive ? "text-primary" : "text-muted hover:text-secondary",
                  )}
                >
                  <span className="type-index whitespace-nowrap text-current">
                    {node.short}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/*
        Active-node detail sits below the map rather than inside it, so it can
        never collide with a node. aria-live keeps pointer- and keyboard-driven
        changes perceivable without moving focus.
      */}
      <div
        aria-live="polite"
        className="mt-8 max-w-[38ch] border-l border-line-active pl-4"
      >
        <p className="type-index text-lime">Active / {activeNode.short}</p>
        <p className="type-body-s mt-2 text-secondary">{activeNode.blurb}</p>
        <p className="type-index mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {activeNode.links.map((link) => (
            <span key={link}>{link}</span>
          ))}
        </p>
      </div>
    </div>
  );
}
