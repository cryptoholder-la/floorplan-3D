// High-level cabinet templates describing typical parts for cutting and drilling.
// These are data-only; the main app still works per-part, but you can use these
// templates to drive batch generation of parts and drilling programs.

export const CABINET_TYPES = {
  base_720: {
    id: "base_720",
    label: "Base cabinet 720h",
    description: "Typical 720mm high base cabinet carcass, 18mm material, 32mm system.",
    params: {
      material_thickness_mm: 18,
      system_pitch_mm: 32
    },
    parts: [
      {
        role: "left_side",
        partType: "cabinetSide",
        lengthExpr: "carcass_height_mm",
        widthExpr: "carcass_depth_mm",
        drilling: [
          { hardwareType: "system32_row", rowConfig: "double" },
          { hardwareType: "dowel_side_joints", rowConfig: "single" },
          { hardwareType: "back_panel_nailer", rowConfig: "single" }
        ]
      },
      {
        role: "right_side",
        partType: "cabinetSide",
        lengthExpr: "carcass_height_mm",
        widthExpr: "carcass_depth_mm",
        drilling: [
          { hardwareType: "system32_row", rowConfig: "double" },
          { hardwareType: "dowel_side_joints", rowConfig: "single" },
          { hardwareType: "back_panel_nailer", rowConfig: "single" }
        ]
      },
      {
        role: "bottom",
        partType: "cabinetTopBottom",
        lengthExpr: "carcass_width_mm - 2 * material_thickness_mm",
        widthExpr: "carcass_depth_mm",
        drilling: [
          { hardwareType: "dowel_side_joints", rowConfig: "single" },
          { hardwareType: "back_panel_nailer", rowConfig: "single" }
        ]
      },
      {
        role: "top",
        partType: "cabinetTopBottom",
        lengthExpr: "carcass_width_mm - 2 * material_thickness_mm",
        widthExpr: "carcass_depth_mm",
        drilling: [
          { hardwareType: "dowel_side_joints", rowConfig: "single" },
          { hardwareType: "back_panel_nailer", rowConfig: "single" }
        ]
      },
      {
        role: "fixed_shelf",
        partType: "fixedShelf",
        lengthExpr: "carcass_width_mm - 2 * material_thickness_mm",
        widthExpr: "carcass_depth_mm",
        drilling: [
          { hardwareType: "dowel_side_joints", rowConfig: "single" },
          { hardwareType: "system32_row", rowConfig: "single" }
        ]
      },
      {
        role: "back_panel",
        partType: "backPanel",
        lengthExpr: "carcass_height_mm - material_thickness_mm",
        widthExpr: "carcass_width_mm - material_thickness_mm",
        drilling: []
      },
      {
        role: "top_nailer",
        partType: "nailerStrip",
        lengthExpr: "carcass_width_mm - 2 * material_thickness_mm",
        widthExpr: "100",
        drilling: [
          { hardwareType: "back_panel_nailer", rowConfig: "single" }
        ]
      },
      {
        role: "bottom_nailer",
        partType: "nailerStrip",
        lengthExpr: "carcass_width_mm - 2 * material_thickness_mm",
        widthExpr: "100",
        drilling: [
          { hardwareType: "back_panel_nailer", rowConfig: "single" }
        ]
      }
    ]
  },
  wall_720: {
    id: "wall_720",
    label: "Wall cabinet 720h",
    description: "Typical 720mm wall cabinet with full 32mm rows and back panel.",
    params: {
      material_thickness_mm: 18,
      system_pitch_mm: 32
    },
    parts: [
      {
        role: "left_side",
        partType: "cabinetSide",
        lengthExpr: "carcass_height_mm",
        widthExpr: "carcass_depth_mm",
        drilling: [
          { hardwareType: "system32_row", rowConfig: "double" },
          { hardwareType: "back_panel_nailer", rowConfig: "single" }
        ]
      },
      {
        role: "right_side",
        partType: "cabinetSide",
        lengthExpr: "carcass_height_mm",
        widthExpr: "carcass_depth_mm",
        drilling: [
          { hardwareType: "system32_row", rowConfig: "double" },
          { hardwareType: "back_panel_nailer", rowConfig: "single" }
        ]
      },
      {
        role: "bottom",
        partType: "cabinetTopBottom",
        lengthExpr: "carcass_width_mm - 2 * material_thickness_mm",
        widthExpr: "carcass_depth_mm",
        drilling: [
          { hardwareType: "dowel_side_joints", rowConfig: "single" },
          { hardwareType: "back_panel_nailer", rowConfig: "single" }
        ]
      },
      {
        role: "top",
        partType: "cabinetTopBottom",
        lengthExpr: "carcass_width_mm - 2 * material_thickness_mm",
        widthExpr: "carcass_depth_mm",
        drilling: [
          { hardwareType: "dowel_side_joints", rowConfig: "single" },
          { hardwareType: "back_panel_nailer", rowConfig: "single" }
        ]
      },
      {
        role: "adjustable_shelf",
        partType: "adjustableShelf",
        lengthExpr: "carcass_width_mm - 2 * material_thickness_mm",
        widthExpr: "carcass_depth_mm",
        drilling: [
          { hardwareType: "system32_row", rowConfig: "single" }
        ]
      },
      {
        role: "back_panel",
        partType: "backPanel",
        lengthExpr: "carcass_height_mm - material_thickness_mm",
        widthExpr: "carcass_width_mm - material_thickness_mm",
        drilling: []
      }
    ]
  }
};

/**
 * Evaluate a simple arithmetic expression using cabinet parameters.
 * Supported variables (all in mm):
 * - carcass_height_mm
 * - carcass_width_mm
 * - carcass_depth_mm
 * - material_thickness_mm
 * - system_pitch_mm
 */
function evalDimensionExpr(expr, context) {
  if (!expr) return 0;
  try {
    // Use a tiny expression evaluator with the context injected.
    // This is only fed with our own template strings, not user input.
    const fn = new Function(
      "params",
      "with (params) { return " + String(expr) + "; }"
    );
    const val = Number(fn(context));
    if (!isFinite(val)) return 0;
    return val;
  } catch (e) {
    console.warn("Failed to eval dimension expr:", expr, e);
    return 0;
  }
}

/**
 * Build all cabinet parts with real measurements from a cabinet template.
 *
 * @param {string} cabinetTypeId - e.g. "base_720"
 * @param {Object} size - { carcass_height_mm, carcass_width_mm, carcass_depth_mm, material_thickness_mm? }
 * @returns {Array} parts with resolved dimensions and drilling configs
 */
export function buildCabinetParts(cabinetTypeId, size) {
  const template = CABINET_TYPES[cabinetTypeId];
  if (!template) return [];

  const defaults = template.params || {};
  const context = {
    carcass_height_mm: Number(size.carcass_height_mm ?? size.height_mm ?? 0),
    carcass_width_mm: Number(size.carcass_width_mm ?? size.width_mm ?? 0),
    carcass_depth_mm: Number(size.carcass_depth_mm ?? size.depth_mm ?? 0),
    material_thickness_mm: Number(
      size.material_thickness_mm ?? defaults.material_thickness_mm ?? 18
    ),
    system_pitch_mm: Number(
      size.system_pitch_mm ?? defaults.system_pitch_mm ?? 32
    )
  };

  return (template.parts || []).map((p, index) => {
    const length_mm = evalDimensionExpr(p.lengthExpr, context);
    const width_mm = evalDimensionExpr(p.widthExpr, context);

    return {
      index,
      role: p.role,
      partType: p.partType,
      length_mm,
      width_mm,
      thickness_mm: context.material_thickness_mm,
      cabinetTypeId: template.id,
      cabinet_label: template.label,
      drilling: p.drilling || [],
      // Useful cabinet-level sizes baked into each part for SQL/exports
      carcass_height_mm: context.carcass_height_mm,
      carcass_width_mm: context.carcass_width_mm,
      carcass_depth_mm: context.carcass_depth_mm,
      system_pitch_mm: context.system_pitch_mm
    };
  });
}

// Sample cabinet instances used for quick part viewing in the UI.
// These correspond to the example records in cabinetSchema.sql / partsSchema.sql.
export const SAMPLE_CABINETS = [
  {
    id: "base_720_900w_560d",
    cabinet_type_id: "base_720",
    label: "Base 720 – 900w × 560d",
    size: {
      carcass_height_mm: 720,
      carcass_width_mm: 900,
      carcass_depth_mm: 560,
      material_thickness_mm: 18,
      system_pitch_mm: 32
    }
  },
  {
    id: "wall_720_900w_340d",
    cabinet_type_id: "wall_720",
    label: "Wall 720 – 900w × 340d",
    size: {
      carcass_height_mm: 720,
      carcass_width_mm: 900,
      carcass_depth_mm: 340,
      material_thickness_mm: 18,
      system_pitch_mm: 32
    }
  }
];