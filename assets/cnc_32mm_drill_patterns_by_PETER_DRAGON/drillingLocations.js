// Utilities for deriving drilling locations from the current part + holes
// This is designed to be easy to feed into databases or CNC post-processors.

export function buildDrillingLocations(input, holes) {
  if (!input || !holes || !holes.length) return [];

  const partId = createPartIdentifier(input);

  return holes.map((h, index) => ({
    part_id: partId,
    seq: index + 1,
    x_mm: round(h.x),
    y_mm: round(h.y),
    diameter_mm: round(h.diameter),
    depth_mm: round(h.depth),
    hardware_id: h.meta?.hardwareId || null,
    feature_type: h.meta?.type || null,
    face: input.face,
    origin: input.origin
  }));
}

function createPartIdentifier(input) {
  const { partType, length, width, thickness } = input;
  return [
    partType || "part",
    `${Number(width) || 0}x${Number(length) || 0}x${Number(thickness) || 0}`,
    "mm"
  ].join("_");
}

function round(v) {
  return Math.round((Number(v) || 0) * 1000) / 1000;
}