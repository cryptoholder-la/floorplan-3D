// Simple sheet + nesting model for cabinet parts.
// This focuses on a single rectangular part type and packs as many as possible on a sheet.

export const DEFAULT_SHEET = {
  width_mm: 2440,
  height_mm: 1220,
  margin_mm: 10,
  gap_mm: 6
};

/**
 * Build a very simple grid-based nesting layout for one rectangular part.
 * No rotation for now; just rows and columns within a sheet.
 */
export function buildSimpleNesting(part, sheet = DEFAULT_SHEET) {
  const partWidth = Number(part.width_mm) || 0;
  const partHeight = Number(part.length_mm) || 0;

  if (partWidth <= 0 || partHeight <= 0) {
    return {
      sheet,
      part,
      placements: [],
      count: 0
    };
  }

  const margin = sheet.margin_mm;
  const gap = sheet.gap_mm;

  const usableWidth = sheet.width_mm - margin * 2;
  const usableHeight = sheet.height_mm - margin * 2;

  const cols = Math.max(
    0,
    Math.floor((usableWidth + gap) / (partWidth + gap))
  );
  const rows = Math.max(
    0,
    Math.floor((usableHeight + gap) / (partHeight + gap))
  );

  const placements = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = margin + c * (partWidth + gap);
      const y = margin + r * (partHeight + gap);
      placements.push({
        x_mm: x,
        y_mm: y,
        width_mm: partWidth,
        height_mm: partHeight,
        index: placements.length + 1
      });
    }
  }

  return {
    sheet,
    part,
    placements,
    count: placements.length
  };
}