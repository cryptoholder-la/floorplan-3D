// SVG rendering for sheet nesting visualization.

import { DEFAULT_SHEET } from "./nestingData.js";

export function renderNestingPreview(model) {
  const svg = document.getElementById("previewSvg");
  if (!svg) return;

  svg.innerHTML = "";

  const sheet = model?.sheet || DEFAULT_SHEET;
  const placements = model?.placements || [];
  const part = model?.part || {};

  const sheetW = sheet.width_mm;
  const sheetH = sheet.height_mm;

  if (sheetW <= 0 || sheetH <= 0) return;

  // Fit sheet into 100x100 viewBox with padding
  const pad = 5;
  const maxDim = Math.max(sheetW, sheetH);
  const scale = (100 - pad * 2) / maxDim;

  const toSvgX = (x) => pad + x * scale;
  const toSvgY = (y) => 100 - (pad + y * scale);

  // Define gradient for sheet
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  grad.setAttribute("id", "sheetFill");
  grad.setAttribute("x1", "0%");
  grad.setAttribute("x2", "100%");
  grad.setAttribute("y1", "0%");
  grad.setAttribute("y2", "100%");
  const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "#222629");
  const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute("offset", "100%");
  stop2.setAttribute("stop-color", "#141618");
  grad.appendChild(stop1);
  grad.appendChild(stop2);
  defs.appendChild(grad);
  svg.appendChild(defs);

  // Sheet rectangle
  const sheetRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  sheetRect.setAttribute("x", toSvgX(0));
  sheetRect.setAttribute("y", toSvgY(sheetH));
  sheetRect.setAttribute("width", sheetW * scale);
  sheetRect.setAttribute("height", sheetH * scale);
  sheetRect.setAttribute("rx", 1.5);
  sheetRect.setAttribute("fill", "url(#sheetFill)");
  sheetRect.setAttribute("stroke", "#3b434a");
  sheetRect.setAttribute("stroke-width", "0.6");
  svg.appendChild(sheetRect);

  // Parts on sheet
  placements.forEach((p) => {
    const x = toSvgX(p.x_mm);
    const y = toSvgY(p.y_mm + p.height_mm);
    const w = p.width_mm * scale;
    const h = p.height_mm * scale;

    const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    r.setAttribute("x", x);
    r.setAttribute("y", y);
    r.setAttribute("width", w);
    r.setAttribute("height", h);
    r.setAttribute("rx", 1.2);
    r.setAttribute("fill", "rgba(247,166,0,0.22)");
    r.setAttribute("stroke", "#f7a600");
    r.setAttribute("stroke-width", "0.4");
    svg.appendChild(r);
  });

  // Small label with summary
  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("x", 6);
  label.setAttribute("y", 96);
  label.setAttribute("fill", "#c3c7cc");
  label.setAttribute("font-size", "5");
  label.setAttribute("font-family", "system-ui, -apple-system, BlinkMacSystemFont, sans-serif");
  label.textContent = `${placements.length} parts on ${sheet.width_mm}×${sheet.height_mm} sheet`;
  svg.appendChild(label);
}