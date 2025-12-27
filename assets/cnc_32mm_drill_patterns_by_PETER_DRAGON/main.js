import { nanoid } from "nanoid";
import { SYSTEM_PITCH, getHardwareMeta } from "./blumData.js";
import { getInputs, onInputsChange, renderHolesTable, renderPreview, setupCopyButton } from "./ui.js";
import { buildDrillingLocations } from "./drillingLocations.js";
import { buildSqlStatements } from "./sqlData.js";
import { runCncAdvisor } from "./cncAgent.js";
import { CABINET_TYPES, buildCabinetParts, SAMPLE_CABINETS } from "./cabinetData.js";
import { DEFAULT_SHEET, buildSimpleNesting } from "./nestingData.js";
import { renderNestingPreview } from "./nestingVisualization.js";
import { renderWorkflowDashboard } from "./workflowVisualization.js";
import { buildCncExportFiles } from "./cncFormats.js";
import { computeHoles, buildPayload } from "./patternEngine.js";

// REMOVE the duplicate local implementations starting here:
// function clamp(v, min, max) {
//   return Math.max(min, Math.min(max, v));
// }
// 
// // Core pattern generators
// 
// function generateDoorHingeHoles(part, hardware) {
//   const { length, width, origin } = part;
//   const { cupDiameter, cupDepth, cupFromEdge } = hardware;
// 
//   // Two hinges: 100mm from top/bottom edges along hinge-side
//   const insetFromEnd = 100;
//   const xFromHingeSide = cupFromEdge + cupDiameter / 2;
// 
//   const hingeSide = "widthLeft"; // assume left edge; origin interpretation handles mirroring
// 
//   const toXY = (xLocal, yFromBottom) => mapToOrigin(xLocal, yFromBottom, part);
// 
//   const bottomY = insetFromEnd;
//   const topY = length - insetFromEnd;
// 
//   const holes = [];
// 
//   const yPositions = [bottomY, topY];
//   yPositions.forEach((y) => {
//     const [xMapped, yMapped] = hingeSideToPanel(hingeSide, xFromHingeSide, y, width);
//     const [X, Y] = toXY(xMapped, yMapped);
//     holes.push({
//       id: nanoid(6),
//       x: X,
//       y: Y,
//       diameter: cupDiameter,
//       depth: cupDepth,
//       meta: {
//         type: "hinge_cup",
//         hardwareId: hardware.id
//       }
//     });
//   });
// 
//   return holes;
// }
// 
// function generateSide32Row(part, hardware, rowConfig) {
//   const { length, width } = part;
//   const { refRowFromFront, rearHoleOffset } = hardware;
// 
//   const holes = [];
// 
//   // Single or double rows on cabinet side, 32mm pitch
//   const rows = [];
//   if (rowConfig === "single") {
//     rows.push(refRowFromFront);
//   } else {
//     rows.push(refRowFromFront, width - refRowFromFront);
//   }
// 
//   rows.forEach((xFromFront) => {
//     // front hole
//     const frontY = 37;
//     const rearY = clamp(frontY + rearHoleOffset, 0, length);
// 
//     const [frontX, frontYMapped] = mapToOrigin(xFromFront, frontY, part);
//     const [rearX, rearYMapped] = mapToOrigin(xFromFront, rearY, part);
// 
//     holes.push({
//       id: nanoid(6),
//       x: frontX,
//       y: frontYMapped,
//       diameter: 5,
//       depth: 12,
//       meta: {
//         type: "drawer_front_fix",
//         hardwareId: hardware.id
//       }
//     });
// 
//     holes.push({
//       id: nanoid(6),
//       x: rearX,
//       y: rearYMapped,
//       diameter: 5,
//       depth: 12,
//       meta: {
//         type: "drawer_rear_fix",
//         hardwareId: hardware.id
//       }
//     });
//   });
// 
//   return holes;
// }
// 
// function generateFull32Row(part, spec, rowConfig) {
//   const { length, width } = part;
//   const { firstHoleOffset, distanceFromEdge } = spec;
//   const holes = [];
// 
//   const rows = [];
//   if (rowConfig === "single") {
//     rows.push(distanceFromEdge);
//   } else {
//     rows.push(distanceFromEdge, width - distanceFromEdge);
//   }
// 
//   rows.forEach((xFromFront) => {
//     for (let y = firstHoleOffset; y <= length - firstHoleOffset + 0.1; y += SYSTEM_PITCH) {
//       const [X, Y] = mapToOrigin(xFromFront, y, part);
//       holes.push({
//         id: nanoid(6),
//         x: X,
//         y: Y,
//         diameter: 5,
//         depth: 12,
//         meta: {
//           type: "system32_shelf",
//           hardwareId: spec.id
//         }
//       });
//     }
//   });
// 
//   return holes;
// }
// 
// function generateSideDowelJointRows(part, spec) {
//   const { length, width } = part;
//   const { dowelDiameter, dowelDepth, edgeOffset, endOffset } = spec;
//   const holes = [];
// 
//   const yPositions = [endOffset, length - endOffset];
//   const xPositions = [edgeOffset, width - edgeOffset];
// 
//   xPositions.forEach((xFromFront) => {
//     yPositions.forEach((yFromBottom) => {
//       const [X, Y] = mapToOrigin(xFromFront, yFromBottom, part);
//       holes.push({
//         id: nanoid(6),
//         x: X,
//         y: Y,
//         diameter: dowelDiameter,
//         depth: dowelDepth,
//         meta: {
//           type: "dowel_joint",
//           hardwareId: spec.id
//         }
//       });
//     });
//   });
// 
//   return holes;
// }
// 
// function generateBackPanelNailerDowels(part, spec) {
//   const { length, width } = part;
//   const { dowelDiameter, dowelDepth, backOffset, nailerOffset, endOffset } = spec;
//   const holes = [];
// 
//   const yPositions = [endOffset, length - endOffset];
// 
//   // Line near back edge for inset back panel
//   const backLineX = width - backOffset;
//   // Line forward for top/bottom nailer strips
//   const nailerLineX = width - nailerOffset;
// 
//   [backLineX, nailerLineX].forEach((xFromFront, idx) => {
//     yPositions.forEach((yFromBottom) => {
//       const [X, Y] = mapToOrigin(xFromFront, yFromBottom, part);
//       holes.push({
//         id: nanoid(6),
//         x: X,
//         y: Y,
//         diameter: dowelDiameter,
//         depth: dowelDepth,
//         meta: {
//           type: idx === 0 ? "back_panel_dowel" : "back_nailer_dowel",
//           hardwareId: spec.id
//         }
//       });
//     });
//   });
// 
//   return holes;
// }
// 
// // Coordinate helpers
// 
// function mapToOrigin(xFromFront, yFromBottom, part) {
//   const { width, length, origin } = part;
// 
//   // origin is which corner is (0,0) in machine coordinates.
//   // Our logical coords assume (front, bottom-left) as reference.
//   let x = xFromFront;
//   let y = yFromBottom;
// 
//   switch (origin) {
//     case "bottomLeft":
//       // front-left-bottom: no change
//       break;
//     case "bottomRight":
//       x = width - x;
//       break;
//     case "topLeft":
//       y = length - y;
//       break;
//     case "topRight":
//       x = width - x;
//       y = length - y;
//       break;
//   }
//   return [x, y];
// }
// 
// function hingeSideToPanel(side, xFromHingeSide, yFromBottom, width) {
//   // For now only "widthLeft" side is used (hinge on left)
//   if (side === "widthLeft") {
//     return [xFromHingeSide, yFromBottom];
//   }
//   if (side === "widthRight") {
//     return [width - xFromHingeSide, yFromBottom];
//   }
//   return [xFromHingeSide, yFromBottom];
// }
// 
// // Dispatch
// 
// function computeHoles(input) {
//   const { partType, hardwareType, length, width, thickness, origin, face, rowConfig } = input;
// 
//   const hardware = getHardwareMeta(hardwareType);
//   if (!hardware || length <= 0 || width <= 0) return [];
// 
//   const part = { partType, length, width, thickness, origin, face };
// 
//   if (hardware.pattern === "door_hinge" && partType === "door") {
//     return generateDoorHingeHoles(part, hardware);
//   }
// 
//   if (hardware.pattern === "side_32_row" && (partType === "cabinetSide" || partType === "cabinetTopBottom")) {
//     return generateSide32Row(part, hardware, rowConfig);
//   }
// 
//   if (hardware.pattern === "full_32_row" && (partType === "cabinetSide" || partType === "fixedShelf" || partType === "adjustableShelf")) {
//     return generateFull32Row(part, hardware, rowConfig);
//   }
// 
//   if (hardware.pattern === "side_dowel_joint" && (partType === "cabinetSide" || partType === "cabinetTopBottom" || partType === "fixedShelf")) {
//     return generateSideDowelJointRows(part, hardware);
//   }
// 
//   if (hardware.pattern === "back_panel_nailer" && (partType === "cabinetSide" || partType === "cabinetTopBottom" || partType === "nailerStrip")) {
//     return generateBackPanelNailerDowels(part, hardware);
//   }
// 
//   // Fallback: system32 rows for any part
//   if (hardware.pattern === "full_32_row") {
//     return generateFull32Row(part, hardware, rowConfig);
//   }
// 
//   return [];
// }
// 
// function buildPayload(input, holes) {
//   const hardware = getHardwareMeta(input.hardwareType);
//   const drilling_locations = buildDrillingLocations(input, holes);
//   const sql = buildSqlStatements({
//     part: {
//       type: input.partType,
//       length_mm: input.length,
//       width_mm: input.width,
//       thickness_mm: input.thickness,
//       origin: input.origin,
//       face: input.face
//     },
//     hardware,
//     drilling_locations
//   });
// 
//   const basePayload = {
//     part: {
//       type: input.partType,
//       length_mm: input.length,
//       width_mm: input.width,
//       thickness_mm: input.thickness,
//       origin: input.origin,
//       face: input.face
//     },
//     system: {
//       grid_pitch_mm: SYSTEM_PITCH,
//       reference: "front,bottom edge; origin corner per selection"
//     },
//     hardware,
//     holes: holes.map((h, idx) => ({
//       index: idx + 1,
//       id: h.id,
//       x_mm: h.x,
//       y_mm: h.y,
//       diameter_mm: h.diameter,
//       depth_mm: h.depth,
//       meta: h.meta
//     })),
//     drilling_locations,
//     sql
//   };
// 
//   const cnc_files = buildCncExportFiles({
//     part: basePayload.part,
//     hardware: basePayload.hardware,
//     drilling_locations: basePayload.drilling_locations
//   });
// 
//   return {
//     ...basePayload,
//     cnc_files
//   };
// }
// END of removed duplicate code.

// Main

function renderCurrentView() {
  const svg = document.getElementById("previewSvg");
  if (!svg || !currentState.input) return;

  const input = currentState.input;
  const holes = currentState.holes || [];

  if (currentState.view === "nesting") {
    const nestingModel = buildSimpleNesting(
      {
        width_mm: input.width,
        length_mm: input.length
      },
      DEFAULT_SHEET
    );
    renderNestingPreview(nestingModel);
  } else if (currentState.view === "workflow") {
    const nestingModel = buildSimpleNesting(
      {
        width_mm: input.width,
        length_mm: input.length
      },
      DEFAULT_SHEET
    );
    renderWorkflowDashboard({
      input,
      holes,
      nestingModel
    });
  } else {
    renderPreview(
      {
        length: input.length,
        width: input.width,
        origin: input.origin
      },
      holes
    );
  }
}

function rerender() {
  const input = getInputs();
  const holes = computeHoles(input);
  renderHolesTable(holes);
  currentState.input = input;
  currentState.holes = holes;
  renderCurrentView();
}

const currentState = {
  input: null,
  holes: [],
  view: "part" // 'part' | 'nesting' | 'workflow'
};

// Initialize cabinet part viewing from sample data
function initCabinetPartViewer() {
  const presetSelect = document.getElementById("cabinetPreset");
  const roleSelect = document.getElementById("cabinetPartRole");
  const partTypeSelect = document.getElementById("partType");
  const lengthInput = document.getElementById("length");
  const widthInput = document.getElementById("width");
  const thicknessInput = document.getElementById("thickness");

  if (!presetSelect || !roleSelect || !partTypeSelect || !lengthInput || !widthInput || !thicknessInput) {
    return;
  }

  // Populate cabinet presets
  SAMPLE_CABINETS.forEach((cab) => {
    const opt = document.createElement("option");
    opt.value = cab.id;
    opt.textContent = cab.label;
    presetSelect.appendChild(opt);
  });

  function updateRolesForPreset() {
    const presetId = presetSelect.value;
    roleSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select part";
    roleSelect.appendChild(placeholder);

    if (!presetId) {
      return;
    }

    const preset = SAMPLE_CABINETS.find((c) => c.id === presetId);
    if (!preset) return;

    const parts = buildCabinetParts(preset.cabinet_type_id, preset.size);
    roleSelect.dataset.cabinetParts = JSON.stringify(
      parts.map((p) => ({
        role: p.role,
        partType: p.partType,
        length_mm: p.length_mm,
        width_mm: p.width_mm,
        thickness_mm: p.thickness_mm
      }))
    );

    parts.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.role;
      opt.textContent = `${p.role.replace(/_/g, " ")} – ${Math.round(p.length_mm)}×${Math.round(
        p.width_mm
      )}×${Math.round(p.thickness_mm)}mm`;
      roleSelect.appendChild(opt);
    });
  }

  function applySelectedCabinetPart() {
    const dataRaw = roleSelect.dataset.cabinetParts;
    if (!dataRaw) return;
    const parts = JSON.parse(dataRaw);
    const role = roleSelect.value;
    const part = parts.find((p) => p.role === role);
    if (!part) return;

    // Apply to inputs so all existing logic (holes, nesting, workflow) stays consistent
    partTypeSelect.value = part.partType || partTypeSelect.value;
    lengthInput.value = String(part.length_mm || "");
    widthInput.value = String(part.width_mm || "");
    thicknessInput.value = String(part.thickness_mm || "");

    rerender();
  }

  presetSelect.addEventListener("change", () => {
    updateRolesForPreset();
  });

  roleSelect.addEventListener("change", () => {
    applySelectedCabinetPart();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  onInputsChange(rerender);
  setupCopyButton(() => buildPayload(currentState.input, currentState.holes));
  rerender();

  // expose cabinet templates for external use (cutting/drilling sets per cabinet)
  window.cabinetTemplates = CABINET_TYPES;

  // initialize cabinet part viewing UI
  initCabinetPartViewer();

  const aiBtn = document.getElementById("aiHelperBtn");
  const aiOutputEl = document.getElementById("aiOutput");

  if (aiBtn && aiOutputEl) {
    aiBtn.addEventListener("click", async () => {
      if (!currentState.input) return;
      const payload = buildPayload(currentState.input, currentState.holes);
      aiOutputEl.textContent = "Analyzing pattern with CNC expert...";
      aiBtn.disabled = true;
      aiBtn.textContent = "Thinking...";
      try {
        const advice = await runCncAdvisor(payload);
        const sql = payload.sql?.combined || "";
        aiOutputEl.textContent = `${sql}\n\n-- AI CNC notes --\n${advice}`;
      } catch (e) {
        console.error(e);
        aiOutputEl.textContent = "Error contacting CNC AI helper. Please try again.";
      } finally {
        aiBtn.disabled = false;
        aiBtn.textContent = "AI CNC help";
      }
    });
  }

  // Preview view toggle buttons
  const viewPartBtn = document.getElementById("viewPartBtn");
  const viewNestingBtn = document.getElementById("viewNestingBtn");
  const viewWorkflowBtn = document.getElementById("viewWorkflowBtn");

  if (viewPartBtn && viewNestingBtn && viewWorkflowBtn) {
    viewPartBtn.addEventListener("click", () => {
      if (currentState.view === "part") return;
      currentState.view = "part";
      viewPartBtn.classList.add("active");
      viewNestingBtn.classList.remove("active");
      viewWorkflowBtn.classList.remove("active");
      renderCurrentView();
    });

    viewNestingBtn.addEventListener("click", () => {
      if (currentState.view === "nesting") return;
      currentState.view = "nesting";
      viewNestingBtn.classList.add("active");
      viewPartBtn.classList.remove("active");
      viewWorkflowBtn.classList.remove("active");
      renderCurrentView();
    });

    viewWorkflowBtn.addEventListener("click", () => {
      if (currentState.view === "workflow") return;
      currentState.view = "workflow";
      viewWorkflowBtn.classList.add("active");
      viewPartBtn.classList.remove("active");
      viewNestingBtn.classList.remove("active");
      renderCurrentView();
    });
  }
});