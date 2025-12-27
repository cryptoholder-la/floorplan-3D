import { nanoid } from "nanoid";
import { SYSTEM_PITCH, getHardwareMeta } from "./blumData.js";
import { buildDrillingLocations } from "./drillingLocations.js";
import { buildSqlStatements } from "./sqlData.js";
import { buildCncExportFiles } from "./cncFormats.js";

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// Core pattern generators

function generateDoorHingeHoles(part, hardware) {
  const { length, width } = part;
  const { cupDiameter, cupDepth, cupFromEdge } = hardware;

  // Two hinges: 100mm from top/bottom edges along hinge-side
  const insetFromEnd = 100;
  const xFromHingeSide = cupFromEdge + cupDiameter / 2;

  const hingeSide = "widthLeft"; // assume left edge; origin interpretation handles mirroring

  const toXY = (xLocal, yFromBottom) => mapToOrigin(xLocal, yFromBottom, part);

  const bottomY = insetFromEnd;
  const topY = length - insetFromEnd;

  const holes = [];

  const yPositions = [bottomY, topY];
  yPositions.forEach((y) => {
    const [xMapped, yMapped] = hingeSideToPanel(hingeSide, xFromHingeSide, y, width);
    const [X, Y] = toXY(xMapped, yMapped);
    holes.push({
      id: nanoid(6),
      x: X,
      y: Y,
      diameter: cupDiameter,
      depth: cupDepth,
      meta: {
        type: "hinge_cup",
        hardwareId: hardware.id
      }
    });
  });

  return holes;
}

function generateSide32Row(part, hardware, rowConfig) {
  const { length, width } = part;
  const { refRowFromFront, rearHoleOffset } = hardware;

  const holes = [];

  // Single or double rows on cabinet side, 32mm pitch
  const rows = [];
  if (rowConfig === "single") {
    rows.push(refRowFromFront);
  } else {
    rows.push(refRowFromFront, width - refRowFromFront);
  }

  rows.forEach((xFromFront) => {
    // front hole
    const frontY = 37;
    const rearY = clamp(frontY + rearHoleOffset, 0, length);

    const [frontX, frontYMapped] = mapToOrigin(xFromFront, frontY, part);
    const [rearX, rearYMapped] = mapToOrigin(xFromFront, rearY, part);

    holes.push({
      id: nanoid(6),
      x: frontX,
      y: frontYMapped,
      diameter: 5,
      depth: 12,
      meta: {
        type: "drawer_front_fix",
        hardwareId: hardware.id
      }
    });

    holes.push({
      id: nanoid(6),
      x: rearX,
      y: rearYMapped,
      diameter: 5,
      depth: 12,
      meta: {
        type: "drawer_rear_fix",
        hardwareId: hardware.id
      }
    });
  });

  return holes;
}

function generateFull32Row(part, spec, rowConfig) {
  const { length, width } = part;
  const { firstHoleOffset, distanceFromEdge } = spec;
  const holes = [];

  const rows = [];
  if (rowConfig === "single") {
    rows.push(distanceFromEdge);
  } else {
    rows.push(distanceFromEdge, width - distanceFromEdge);
  }

  rows.forEach((xFromFront) => {
    for (let y = firstHoleOffset; y <= length - firstHoleOffset + 0.1; y += SYSTEM_PITCH) {
      const [X, Y] = mapToOrigin(xFromFront, y, part);
      holes.push({
        id: nanoid(6),
        x: X,
        y: Y,
        diameter: 5,
        depth: 12,
        meta: {
          type: "system32_shelf",
          hardwareId: spec.id
        }
      });
    }
  });

  return holes;
}

function generateSideDowelJointRows(part, spec) {
  const { length, width } = part;
  const { dowelDiameter, dowelDepth, edgeOffset, endOffset } = spec;
  const holes = [];

  const yPositions = [endOffset, length - endOffset];
  const xPositions = [edgeOffset, width - edgeOffset];

  xPositions.forEach((xFromFront) => {
    yPositions.forEach((yFromBottom) => {
      const [X, Y] = mapToOrigin(xFromFront, yFromBottom, part);
      holes.push({
        id: nanoid(6),
        x: X,
        y: Y,
        diameter: dowelDiameter,
        depth: dowelDepth,
        meta: {
          type: "dowel_joint",
          hardwareId: spec.id
        }
      });
    });
  });

  return holes;
}

function generateBackPanelNailerDowels(part, spec) {
  const { length, width } = part;
  const { dowelDiameter, dowelDepth, backOffset, nailerOffset, endOffset } = spec;
  const holes = [];

  const yPositions = [endOffset, length - endOffset];

  // Line near back edge for inset back panel
  const backLineX = width - backOffset;
  // Line forward for top/bottom nailer strips
  const nailerLineX = width - nailerOffset;

  [backLineX, nailerLineX].forEach((xFromFront, idx) => {
    yPositions.forEach((yFromBottom) => {
      const [X, Y] = mapToOrigin(xFromFront, yFromBottom, part);
      holes.push({
        id: nanoid(6),
        x: X,
        y: Y,
        diameter: dowelDiameter,
        depth: dowelDepth,
        meta: {
          type: idx === 0 ? "back_panel_dowel" : "back_nailer_dowel",
          hardwareId: spec.id
        }
      });
    });
  });

  return holes;
}

// Coordinate helpers

function mapToOrigin(xFromFront, yFromBottom, part) {
  const { width, length, origin } = part;

  // origin is which corner is (0,0) in machine coordinates.
  // Our logical coords assume (front, bottom-left) as reference.
  let x = xFromFront;
  let y = yFromBottom;

  switch (origin) {
    case "bottomLeft":
      // front-left-bottom: no change
      break;
    case "bottomRight":
      x = width - x;
      break;
    case "topLeft":
      y = length - y;
      break;
    case "topRight":
      x = width - x;
      y = length - y;
      break;
  }
  return [x, y];
}

function hingeSideToPanel(side, xFromHingeSide, yFromBottom, width) {
  // For now only "widthLeft" side is used (hinge on left)
  if (side === "widthLeft") {
    return [xFromHingeSide, yFromBottom];
  }
  if (side === "widthRight") {
    return [width - xFromHingeSide, yFromBottom];
  }
  return [xFromHingeSide, yFromBottom];
}

// Dispatch

export function computeHoles(input) {
  const { partType, hardwareType, length, width, thickness, origin, face, rowConfig } = input;

  const hardware = getHardwareMeta(hardwareType);
  if (!hardware || length <= 0 || width <= 0) return [];

  const part = { partType, length, width, thickness, origin, face };

  if (hardware.pattern === "door_hinge" && partType === "door") {
    return generateDoorHingeHoles(part, hardware);
  }

  if (hardware.pattern === "side_32_row" && (partType === "cabinetSide" || partType === "cabinetTopBottom")) {
    return generateSide32Row(part, hardware, rowConfig);
  }

  if (hardware.pattern === "full_32_row" && (partType === "cabinetSide" || partType === "fixedShelf" || partType === "adjustableShelf")) {
    return generateFull32Row(part, hardware, rowConfig);
  }

  if (hardware.pattern === "side_dowel_joint" && (partType === "cabinetSide" || partType === "cabinetTopBottom" || partType === "fixedShelf")) {
    return generateSideDowelJointRows(part, hardware);
  }

  if (hardware.pattern === "back_panel_nailer" && (partType === "cabinetSide" || partType === "cabinetTopBottom" || partType === "nailerStrip")) {
    return generateBackPanelNailerDowels(part, hardware);
  }

  // Fallback: system32 rows for any part
  if (hardware.pattern === "full_32_row") {
    return generateFull32Row(part, hardware, rowConfig);
  }

  return [];
}

export function buildPayload(input, holes) {
  const hardware = getHardwareMeta(input.hardwareType);
  const drilling_locations = buildDrillingLocations(input, holes);
  const sql = buildSqlStatements({
    part: {
      type: input.partType,
      length_mm: input.length,
      width_mm: input.width,
      thickness_mm: input.thickness,
      origin: input.origin,
      face: input.face
    },
    hardware,
    drilling_locations
  });

  const basePayload = {
    part: {
      type: input.partType,
      length_mm: input.length,
      width_mm: input.width,
      thickness_mm: input.thickness,
      origin: input.origin,
      face: input.face
    },
    system: {
      grid_pitch_mm: SYSTEM_PITCH,
      reference: "front,bottom edge; origin corner per selection"
    },
    hardware,
    holes: holes.map((h, idx) => ({
      index: idx + 1,
      id: h.id,
      x_mm: h.x,
      y_mm: h.y,
      diameter_mm: h.diameter,
      depth_mm: h.depth,
      meta: h.meta
    })),
    drilling_locations,
    sql
  };

  const cnc_files = buildCncExportFiles({
    part: basePayload.part,
    hardware: basePayload.hardware,
    drilling_locations: basePayload.drilling_locations
  });

  return {
    ...basePayload,
    cnc_files
  };
}