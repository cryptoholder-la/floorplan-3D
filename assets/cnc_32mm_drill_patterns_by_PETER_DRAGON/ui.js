import { getHoleVisualStyle } from "./visualization.js";

export function getInputs() {
  const partType = document.getElementById("partType").value;
  const hardwareType = document.getElementById("hardwareType").value;
  const length = Number(document.getElementById("length").value || 0);
  const width = Number(document.getElementById("width").value || 0);
  const thickness = Number(document.getElementById("thickness").value || 0);
  const origin = document.getElementById("origin").value;
  const face = document.getElementById("face").value;
  const rowConfig = document.getElementById("rowConfig").value;

  return {
    partType,
    hardwareType,
    length,
    width,
    thickness,
    origin,
    face,
    rowConfig
  };
}

export function onInputsChange(cb) {
  const ids = [
    "partType",
    "hardwareType",
    "length",
    "width",
    "thickness",
    "origin",
    "face",
    "rowConfig"
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", cb);
    el.addEventListener("change", cb);
  });
}

export function renderHolesTable(holes) {
  const body = document.getElementById("holesBody");
  body.innerHTML = "";
  holes.forEach((h, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${h.x.toFixed(1)}</td>
      <td>${h.y.toFixed(1)}</td>
      <td>${h.diameter.toFixed(1)}</td>
      <td>${h.depth.toFixed(1)}</td>
    `;
    body.appendChild(tr);
  });
}

export function renderPreview(part, holes) {
  const svg = document.getElementById("previewSvg");
  svg.innerHTML = "";

  const { length, width } = part;
  if (length <= 0 || width <= 0) return;

  const maxDim = Math.max(length, width);
  const pad = 5;
  const scaleX = (100 - pad * 2) / width;
  const scaleY = (100 - pad * 2) / length;
  const s = Math.min(scaleX, scaleY);

  const toSvgX = (x) => pad + x * s;
  const toSvgY = (y) => 100 - (pad + y * s); // bottom origin

  // Panel rectangle
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", toSvgX(0));
  rect.setAttribute("y", toSvgY(length));
  rect.setAttribute("width", width * s);
  rect.setAttribute("height", length * s);
  rect.setAttribute("rx", 2);
  rect.setAttribute("fill", "url(#panelFill)");
  rect.setAttribute("stroke", "#3b434a");
  rect.setAttribute("stroke-width", "0.6");
  svg.appendChild(rect);

  // Gradient fill
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  grad.setAttribute("id", "panelFill");
  grad.setAttribute("x1", "0%");
  grad.setAttribute("x2", "100%");
  grad.setAttribute("y1", "0%");
  grad.setAttribute("y2", "100%");
  const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "#24282e");
  const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute("offset", "100%");
  stop2.setAttribute("stop-color", "#15171b");
  grad.appendChild(stop1);
  grad.appendChild(stop2);
  defs.appendChild(grad);
  svg.appendChild(defs);

  // Holes with visual styles
  holes.forEach((h) => {
    const style = getHoleVisualStyle(h);
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", toSvgX(h.x));
    circle.setAttribute("cy", toSvgY(h.y));
    circle.setAttribute("r", Math.max(0.7, (h.diameter / maxDim) * 12));
    circle.setAttribute("fill", style.fill);
    circle.setAttribute("fill-opacity", style.fillOpacity);
    circle.setAttribute("stroke", style.stroke);
    circle.setAttribute("stroke-width", style.strokeWidth);
    svg.appendChild(circle);
  });
}

export function setupCopyButton(getPayload) {
  const btn = document.getElementById("copyJsonBtn");
  btn.addEventListener("click", async () => {
    const payload = getPayload();
    const text = JSON.stringify(payload, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add("copied");
      btn.textContent = "Copied";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.textContent = "Copy JSON";
      }, 1200);
    } catch (e) {
      btn.classList.add("copied");
      btn.textContent = "Error";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.textContent = "Copy JSON";
      }, 1200);
    }
  });
}