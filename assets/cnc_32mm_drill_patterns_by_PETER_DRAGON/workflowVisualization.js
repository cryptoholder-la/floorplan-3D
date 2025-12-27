// SVG rendering for the logical workflow dashboard.
// Shows a simple step flow with active/completed states.

import { buildWorkflowModel } from "./workflowLogic.js";

export function renderWorkflowDashboard({ input, holes, nestingModel }) {
  const svg = document.getElementById("previewSvg");
  if (!svg) return;

  svg.innerHTML = "";

  const model = buildWorkflowModel({ input, holes, nestingModel });

  const viewBoxWidth = 100;
  const viewBoxHeight = 100;

  const stepWidth = 80;
  const stepHeight = 14;
  const gapY = 6;
  const startY = 16;
  const startX = (viewBoxWidth - stepWidth) / 2;

  // Background subtle grid
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const pattern = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern"
  );
  pattern.setAttribute("id", "workflowGrid");
  pattern.setAttribute("x", "0");
  pattern.setAttribute("y", "0");
  pattern.setAttribute("width", "4");
  pattern.setAttribute("height", "4");
  pattern.setAttribute("patternUnits", "userSpaceOnUse");

  const gridLine = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  gridLine.setAttribute("d", "M 4 0 L 0 0 0 4");
  gridLine.setAttribute("fill", "none");
  gridLine.setAttribute("stroke", "rgba(255,255,255,0.04)");
  gridLine.setAttribute("stroke-width", "0.4");
  pattern.appendChild(gridLine);
  defs.appendChild(pattern);
  svg.appendChild(defs);

  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("x", 0);
  bg.setAttribute("y", 0);
  bg.setAttribute("width", viewBoxWidth);
  bg.setAttribute("height", viewBoxHeight);
  bg.setAttribute("fill", "url(#workflowGrid)");
  svg.appendChild(bg);

  model.steps.forEach((step, index) => {
    const y = startY + index * (stepHeight + gapY);

    const status = step.status;
    let fill = "#1b1e21";
    let stroke = "#3a3f45";
    let textColor = "#c3c7cc";

    if (status === "done") {
      fill = "rgba(247,166,0,0.24)";
      stroke = "#f7a600";
      textColor = "#ffe3a4";
    } else if (status === "active") {
      fill = "rgba(247,166,0,0.16)";
      stroke = "#f7a600";
      textColor = "#f7a600";
    }

    const rect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    rect.setAttribute("x", startX);
    rect.setAttribute("y", y);
    rect.setAttribute("width", stepWidth);
    rect.setAttribute("height", stepHeight);
    rect.setAttribute("rx", 4);
    rect.setAttribute("fill", fill);
    rect.setAttribute("stroke", stroke);
    rect.setAttribute("stroke-width", "0.6");
    svg.appendChild(rect);

    // Icon circle
    const iconCx = startX + 7;
    const iconCy = y + stepHeight / 2;
    const icon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    icon.setAttribute("cx", iconCx);
    icon.setAttribute("cy", iconCy);
    icon.setAttribute("r", 2.6);
    icon.setAttribute(
      "fill",
      status === "done"
        ? "#7dffb3"
        : status === "active"
        ? "#f7a600"
        : "#3a3f45"
    );
    svg.appendChild(icon);

    // Label
    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    label.setAttribute("x", startX + 14);
    label.setAttribute("y", y + 6.8);
    label.setAttribute("fill", textColor);
    label.setAttribute("font-size", "4");
    label.setAttribute(
      "font-family",
      "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    );
    label.textContent = step.label;
    svg.appendChild(label);

    // Detail
    const detail = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    detail.setAttribute("x", startX + 14);
    detail.setAttribute("y", y + 11.3);
    detail.setAttribute("fill", "#8b9096");
    detail.setAttribute("font-size", "3.1");
    detail.setAttribute(
      "font-family",
      "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
    );
    detail.textContent = step.detail;
    svg.appendChild(detail);

    // Connector arrow to next step
    if (index < model.steps.length - 1) {
      const arrowY = y + stepHeight;
      const arrowStartX = startX + stepWidth / 2;
      const arrowEndY = arrowY + gapY - 2;

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", arrowStartX);
      line.setAttribute("y1", arrowY + 1);
      line.setAttribute("x2", arrowStartX);
      line.setAttribute("y2", arrowEndY - 1.5);
      line.setAttribute("stroke", "#3a3f45");
      line.setAttribute("stroke-width", "0.7");
      svg.appendChild(line);

      const arrowHead = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      const ahY = arrowEndY;
      const ahX = arrowStartX;
      arrowHead.setAttribute(
        "d",
        `M ${ahX - 1.8} ${ahY - 1.5} L ${ahX} ${ahY} L ${ahX + 1.8} ${ahY - 1.5}`
      );
      arrowHead.setAttribute("fill", "none");
      arrowHead.setAttribute("stroke", "#3a3f45");
      arrowHead.setAttribute("stroke-width", "0.7");
      arrowHead.setAttribute("stroke-linecap", "round");
      svg.appendChild(arrowHead);
    }
  });

  // Small caption
  const caption = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );
  caption.setAttribute("x", 6);
  caption.setAttribute("y", 96);
  caption.setAttribute("fill", "#8b9096");
  caption.setAttribute("font-size", "3.2");
  caption.setAttribute(
    "font-family",
    "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
  );
  caption.textContent = "Live CNC workflow from part → SQL";
  svg.appendChild(caption);
}