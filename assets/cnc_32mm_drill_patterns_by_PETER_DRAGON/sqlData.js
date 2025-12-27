// Build SQL-style insert statements that match drillingSchema.sql
// This is meant to be copy-paste ready for SQLite/Postgres.

function escapeString(value) {
  if (value == null) return "NULL";
  return "'" + String(value).replace(/'/g, "''") + "'";
}

function createPartIdentifierFromPayload(part) {
  if (!part) return "part_0x0x0_mm";
  const { type, width_mm, length_mm, thickness_mm } = part;
  const w = Number(width_mm) || 0;
  const l = Number(length_mm) || 0;
  const t = Number(thickness_mm) || 0;
  return `${type || "part"}_${w}x${l}x${t}_mm`;
}

export function buildSqlStatements(payload) {
  const part = payload.part || {};
  const hardware = payload.hardware || null;
  const drilling_locations = payload.drilling_locations || [];

  const partId =
    drilling_locations[0]?.part_id || createPartIdentifierFromPayload(part);
  const hardwareId = hardware?.id || null;

  const partInsert = `
INSERT INTO parts (id, type, length_mm, width_mm, thickness_mm, origin, face, system_pitch_mm)
VALUES (
  ${escapeString(partId)},
  ${escapeString(part.type || "unknown")},
  ${Number(part.length_mm) || 0},
  ${Number(part.width_mm) || 0},
  ${Number(part.thickness_mm) || 0},
  ${escapeString(part.origin || "bottomLeft")},
  ${escapeString(part.face || "front")},
  32
);`.trim();

  let hardwareInsert = "";
  if (hardwareId) {
    const metadata = {
      label: hardware.label,
      pattern: hardware.pattern,
    };
    hardwareInsert = `
INSERT INTO hardware (id, label, category, pattern, metadata_json)
VALUES (
  ${escapeString(hardwareId)},
  ${escapeString(hardware.label || hardwareId)},
  ${escapeString(hardware.category || null)},
  ${escapeString(hardware.pattern || null)},
  ${escapeString(JSON.stringify(metadata))}
)
ON CONFLICT(id) DO NOTHING;`.trim();
  }

  const drillingInserts = drilling_locations
    .map((d) => {
      return `INSERT INTO drilling_locations (part_id, seq, x_mm, y_mm, diameter_mm, depth_mm, hardware_id, feature_type, face, origin)
VALUES (
  ${escapeString(d.part_id || partId)},
  ${d.seq || 0},
  ${Number(d.x_mm) || 0},
  ${Number(d.y_mm) || 0},
  ${Number(d.diameter_mm) || 0},
  ${Number(d.depth_mm) || 0},
  ${escapeString(d.hardware_id || hardwareId)},
  ${escapeString(d.feature_type || null)},
  ${escapeString(d.face || part.face || "front")},
  ${escapeString(d.origin || part.origin || "bottomLeft")}
);`;
    })
    .join("\n");

  const combined = [partInsert, hardwareInsert, drillingInserts]
    .filter(Boolean)
    .join("\n\n");

  return {
    partInsert,
    hardwareInsert,
    drillingInserts,
    combined,
  };
}