// Visual classification of holes for SVG preview.
// Different feature types get different colors to make the pattern easier to read.

const TYPE_STYLES = {
  hinge_cup: {
    fill: "#ffb347",
    fillOpacity: 0.95,
    stroke: "#ffe2a6",
    strokeWidth: 0.5
  },
  drawer_front_fix: {
    fill: "#5ad1ff",
    fillOpacity: 0.9,
    stroke: "#c0ecff",
    strokeWidth: 0.4
  },
  drawer_rear_fix: {
    fill: "#2aa0ff",
    fillOpacity: 0.9,
    stroke: "#a6d4ff",
    strokeWidth: 0.4
  },
  system32_shelf: {
    fill: "#7dffb3",
    fillOpacity: 0.9,
    stroke: "#d7ffe8",
    strokeWidth: 0.4
  },
  dowel_joint: {
    fill: "#ffa3d0",
    fillOpacity: 0.95,
    stroke: "#ffd4ea",
    strokeWidth: 0.4
  },
  back_panel_dowel: {
    fill: "#ffcf66",
    fillOpacity: 0.95,
    stroke: "#ffe9b3",
    strokeWidth: 0.4
  },
  back_nailer_dowel: {
    fill: "#ffc266",
    fillOpacity: 0.95,
    stroke: "#ffe0a6",
    strokeWidth: 0.4
  }
};

const DEFAULT_STYLE = {
  fill: "#f7a600",
  fillOpacity: 0.9,
  stroke: "#ffe2a6",
  strokeWidth: 0.4
};

export function getHoleVisualStyle(hole) {
  if (!hole || !hole.meta || !hole.meta.type) return DEFAULT_STYLE;
  return TYPE_STYLES[hole.meta.type] || DEFAULT_STYLE;
}

