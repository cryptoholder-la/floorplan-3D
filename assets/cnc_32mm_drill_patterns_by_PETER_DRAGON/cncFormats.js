// CNC export helpers for common cabinet CNC ecosystems.
// These are lightweight text exports shaped after typical plugin/file formats
// so they can be used as starting points for real post-processors.

function formatNumber(v) {
  const n = Number(v) || 0;
  return n.toFixed(3).replace(/\.?0+$/, "");
}

function buildCabinetVisionCSV(payload) {
  const part = payload.part || {};
  const drills = payload.drilling_locations || [];

  const header = [
    "PartID",
    "PartType",
    "Length_mm",
    "Width_mm",
    "Thickness_mm",
    "Origin",
    "Face",
    "Seq",
    "X_mm",
    "Y_mm",
    "Dia_mm",
    "Depth_mm",
    "HardwareID",
    "FeatureType"
  ].join(",");

  const partId = drills[0]?.part_id || `${part.type || "part"}_${part.width_mm}x${part.length_mm}x${part.thickness_mm}_mm`;

  const rows = drills.map((d) =>
    [
      partId,
      part.type || "unknown",
      formatNumber(part.length_mm),
      formatNumber(part.width_mm),
      formatNumber(part.thickness_mm),
      part.origin || "bottomLeft",
      part.face || "front",
      d.seq || 0,
      formatNumber(d.x_mm),
      formatNumber(d.y_mm),
      formatNumber(d.diameter_mm),
      formatNumber(d.depth_mm),
      d.hardware_id || "",
      d.feature_type || ""
    ].join(",")
  );

  return [header, ...rows].join("\n");
}

function buildMicrovellumCSV(payload) {
  const part = payload.part || {};
  const drills = payload.drilling_locations || [];

  const header = [
    "PartName",
    "Material",
    "Thickness_mm",
    "Length_mm",
    "Width_mm",
    "OpType",
    "Seq",
    "X_mm",
    "Y_mm",
    "Dia_mm",
    "Depth_mm",
    "Notes"
  ].join(",");

  const partName = part.type || "PART";
  const material = `${formatNumber(part.thickness_mm)}mm board`;

  const rows = drills.map((d) =>
    [
      partName,
      material,
      formatNumber(part.thickness_mm),
      formatNumber(part.length_mm),
      formatNumber(part.width_mm),
      "DRILL",
      d.seq || 0,
      formatNumber(d.x_mm),
      formatNumber(d.y_mm),
      formatNumber(d.diameter_mm),
      formatNumber(d.depth_mm),
      d.feature_type || d.hardware_id || ""
    ].join(",")
  );

  return [header, ...rows].join("\n");
}

function buildWoodwopMPR(payload) {
  const part = payload.part || {};
  const drills = payload.drilling_locations || [];

  const lines = [];
  lines.push("BEGIN MPR");
  lines.push(`; Simple WoodWOP-style drill program`);
  lines.push(`; Part: ${part.type || "part"} ${formatNumber(part.length_mm)}x${formatNumber(part.width_mm)}x${formatNumber(part.thickness_mm)} mm`);
  lines.push("");

  drills.forEach((d, idx) => {
    // Extremely simplified BOAL-style drill op line
    lines.push(
      [
        "BO",
        idx + 1,
        formatNumber(d.x_mm),
        formatNumber(d.y_mm),
        formatNumber(d.diameter_mm),
        formatNumber(d.depth_mm),
        0, // angle
        0, // dir
        0, // tool
        (d.feature_type || "").toUpperCase()
      ].join(";")
    );
  });

  lines.push("");
  lines.push("END MPR");
  return lines.join("\n");
}

function buildBiesseCIX(payload) {
  const part = payload.part || {};
  const drills = payload.drilling_locations || [];

  const lines = [];
  lines.push("@BEGIN");
  lines.push("@PRJ    \"CNC_PART\"");
  lines.push(`@PANEL  "${part.type || "PART"}" 0.0,0.0,${formatNumber(part.length_mm)},${formatNumber(part.width_mm)},${formatNumber(part.thickness_mm)},0,0,0,0`);
  lines.push("");

  drills.forEach((d, idx) => {
    lines.push(
      [
        "@DRILL",
        `"D${idx + 1}"`,
        formatNumber(d.x_mm),
        formatNumber(d.y_mm),
        formatNumber(d.diameter_mm),
        formatNumber(d.depth_mm),
        "0", // dir
        "0", // tool
        `"${(d.feature_type || "").toUpperCase()}"`
      ].join(",")
    );
  });

  lines.push("");
  lines.push("@END");
  return lines.join("\n");
}

function buildGenericGCode(payload) {
  const part = payload.part || {};
  const drills = payload.drilling_locations || [];

  const thickness = Number(part.thickness_mm) || 0;
  const safeZ = 5; // mm
  const feed = 1500; // mm/min (example)
  const spindle = 18000; // rpm (example)

  const lines = [];
  lines.push("(Generic drilling G-code)");
  lines.push(`(Part: ${part.type || "part"}  L=${formatNumber(part.length_mm)} W=${formatNumber(part.width_mm)} T=${formatNumber(part.thickness_mm)})`);
  lines.push("G90 G21");
  lines.push(`G0 Z${safeZ}`);
  lines.push(`M3 S${spindle}`);

  drills.forEach((d, idx) => {
    const depth = -Math.min(Number(d.depth_mm) || 0, thickness);
    lines.push(`(Hole ${idx + 1} ${d.feature_type || ""})`);
    lines.push(`G0 X${formatNumber(d.x_mm)} Y${formatNumber(d.y_mm)}`);
    lines.push(`G1 Z${formatNumber(depth)} F${feed}`);
    lines.push(`G0 Z${safeZ}`);
  });

  lines.push("M5");
  lines.push("G0 X0 Y0");
  lines.push("M30");

  return lines.join("\n");
}

/**
 * Build a bundle of CNC export "plugin modes" for different ecosystems.
 * Each entry is a file-like object with id, label, filename, extension, and content.
 */
export function buildCncExportFiles(payload) {
  const files = [];

  files.push({
    id: "cabinet_vision_csv",
    label: "Cabinet Vision – drill pattern CSV",
    software: "Cabinet Vision",
    extension: "csv",
    filename: "cabinet_vision_drills.csv",
    mime: "text/csv",
    content: buildCabinetVisionCSV(payload)
  });

  files.push({
    id: "microvellum_csv",
    label: "Microvellum – operations CSV",
    software: "Microvellum",
    extension: "csv",
    filename: "microvellum_ops.csv",
    mime: "text/csv",
    content: buildMicrovellumCSV(payload)
  });

  files.push({
    id: "woodwop_mpr",
    label: "HOMAG WoodWOP – .mpr",
    software: "WoodWOP",
    extension: "mpr",
    filename: "part_drilling.mpr",
    mime: "text/plain",
    content: buildWoodwopMPR(payload)
  });

  files.push({
    id: "biesse_cix",
    label: "Biesseworks / bSolid – .cix",
    software: "Biesse",
    extension: "cix",
    filename: "part_drilling.cix",
    mime: "text/plain",
    content: buildBiesseCIX(payload)
  });

  files.push({
    id: "generic_gcode",
    label: "Generic nested router – G-code",
    software: "Generic CNC",
    extension: "nc",
    filename: "part_drilling.nc",
    mime: "text/x-gcode",
    content: buildGenericGCode(payload)
  });

  return files;
}