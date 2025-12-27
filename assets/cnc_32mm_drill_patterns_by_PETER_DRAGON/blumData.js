// Basic Blum-related drilling specs in a 32mm system context.
// Values are simplified for layout assistance, not a full spec reference.

export const SYSTEM_PITCH = 32;

export const HINGE_TYPES = {
  blum_cliptop_hinge_100: {
    id: "blum_cliptop_hinge_100",
    label: "Blum ClipTop 110° hinge",
    cupDiameter: 35,
    cupDepth: 12.5,
    cupFromEdge: 3, // setback from front edge of door
    pattern: "door_hinge"
  },
  blum_cliptop_hinge_155: {
    id: "blum_cliptop_hinge_155",
    label: "Blum ClipTop 155° hinge",
    cupDiameter: 35,
    cupDepth: 13,
    cupFromEdge: 3,
    pattern: "door_hinge"
  },
  // Added other major brand hinges with comparable 32mm specs
  hettich_sensys_8645_110: {
    id: "hettich_sensys_8645_110",
    label: "Hettich Sensys 8645 110° hinge",
    cupDiameter: 35,
    cupDepth: 12.5,
    cupFromEdge: 3,
    pattern: "door_hinge"
  },
  hafele_hinge_110: {
    id: "hafele_hinge_110",
    label: "Häfele 110° concealed hinge",
    cupDiameter: 35,
    cupDepth: 12,
    cupFromEdge: 3,
    pattern: "door_hinge"
  },
  grass_tiomos_110: {
    id: "grass_tiomos_110",
    label: "Grass Tiomos 110° hinge",
    cupDiameter: 35,
    cupDepth: 12.5,
    cupFromEdge: 3,
    pattern: "door_hinge"
  },
  salice_silentia_110: {
    id: "salice_silentia_110",
    label: "Salice Silentia 110° hinge",
    cupDiameter: 35,
    cupDepth: 12.5,
    cupFromEdge: 3,
    pattern: "door_hinge"
  }
};

export const DRAWER_TYPES = {
  blum_tandem_box: {
    id: "blum_tandem_box",
    label: "Blum TANDEM drawer slide",
    pattern: "side_32_row",
    refRowFromFront: 37, // Blum typical front setback
    rearHoleOffset: 224 // mm between front and rear fixing (example)
  },
  blum_movento: {
    id: "blum_movento",
    label: "Blum MOVENTO drawer slide",
    pattern: "side_32_row",
    refRowFromFront: 37,
    rearHoleOffset: 224
  },
  // Added Hettich drawer slide with similar 32mm reference row
  hettich_innotech_atira: {
    id: "hettich_innotech_atira",
    label: "Hettich InnoTech Atira drawer slide",
    pattern: "side_32_row",
    refRowFromFront: 37,
    rearHoleOffset: 224
  }
};

export const SYSTEM32_ROW = {
  system32_row: {
    id: "system32_row",
    label: "32mm shelf row",
    pattern: "full_32_row",
    firstHoleOffset: 37, // from reference end
    distanceFromEdge: 37 // from front/rear edge
  }
};

export const DOWEL_TYPES = {
  dowel_side_joints: {
    id: "dowel_side_joints",
    label: "Side dowel joints (front/back)",
    pattern: "side_dowel_joint",
    dowelDiameter: 8,
    dowelDepth: 30,
    edgeOffset: 37,     // from front/back edge
    endOffset: 37       // from top/bottom ends
  },
  back_panel_nailer: {
    id: "back_panel_nailer",
    label: "Back panel + nailer dowels",
    pattern: "back_panel_nailer",
    dowelDiameter: 8,
    dowelDepth: 30,
    backOffset: 37,     // distance from back edge for back panel line
    nailerOffset: 76,   // distance in from back for nailer strip line
    endOffset: 37       // from top/bottom ends
  }
};

export function getHardwareMeta(id) {
  return (
    HINGE_TYPES[id] ||
    DRAWER_TYPES[id] ||
    SYSTEM32_ROW[id] ||
    DOWEL_TYPES[id] ||
    null
  );
}