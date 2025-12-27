-- Basic SQL schema for storing parts, hardware, and drilling locations
-- Compatible with SQLite / PostgreSQL-style types.

CREATE TABLE hardware (
  id               TEXT PRIMARY KEY,
  label            TEXT NOT NULL,
  category         TEXT,          -- e.g. 'hinge', 'drawer_slide', 'system32'
  pattern          TEXT,          -- e.g. 'door_hinge', 'side_32_row', 'full_32_row'
  metadata_json    TEXT           -- optional raw JSON from app
);

CREATE TABLE parts (
  id               TEXT PRIMARY KEY,
  type             TEXT NOT NULL, -- e.g. 'cabinetSide', 'door', 'drawerFront'
  length_mm        REAL NOT NULL,
  width_mm         REAL NOT NULL,
  thickness_mm     REAL NOT NULL,
  origin           TEXT NOT NULL, -- 'bottomLeft', 'bottomRight', etc.
  face             TEXT NOT NULL, -- 'front' or 'back'
  system_pitch_mm  REAL NOT NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE drilling_locations (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  part_id          TEXT NOT NULL REFERENCES parts(id) ON DELETE CASCADE,
  seq              INTEGER NOT NULL,  -- sequence number along the program
  x_mm             REAL NOT NULL,
  y_mm             REAL NOT NULL,
  diameter_mm      REAL NOT NULL,
  depth_mm         REAL NOT NULL,
  hardware_id      TEXT REFERENCES hardware(id),
  feature_type     TEXT,             -- e.g. 'hinge_cup', 'system32_shelf'
  face             TEXT NOT NULL,    -- from part
  origin           TEXT NOT NULL,    -- from part
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example insert using the JSON exported from the app (pseudo-code, adjust per DB):
-- INSERT INTO parts (id, type, length_mm, width_mm, thickness_mm, origin, face, system_pitch_mm)
-- VALUES ('cabinetSide_300x720x18_mm', 'cabinetSide', 720, 300, 18, 'bottomLeft', 'front', 32);
--
-- Then insert rows into drilling_locations using the "drilling_locations" array from the JSON payload.

-- Seed hardware data that matches the IDs and patterns used by the app (blumData.js).
-- This lets the generated INSERTs from the app immediately reference existing records.

INSERT INTO hardware (id, label, category, pattern, metadata_json) VALUES
  -- Blum ClipTop 110° hinge
  (
    'blum_cliptop_hinge_100',
    'Blum ClipTop 110° hinge',
    'hinge',
    'door_hinge',
    '{"cupDiameter":35,"cupDepth":12.5,"cupFromEdge":3,"system_pitch_mm":32}'
  ),
  -- Blum ClipTop 155° hinge
  (
    'blum_cliptop_hinge_155',
    'Blum ClipTop 155° hinge',
    'hinge',
    'door_hinge',
    '{"cupDiameter":35,"cupDepth":13,"cupFromEdge":3,"system_pitch_mm":32}'
  ),
  -- Blum TANDEM drawer slide (side 32mm reference row)
  (
    'blum_tandem_box',
    'Blum TANDEM drawer slide',
    'drawer_slide',
    'side_32_row',
    '{"refRowFromFront":37,"rearHoleOffset":224,"system_pitch_mm":32}'
  ),
  -- Blum MOVENTO drawer slide
  (
    'blum_movento',
    'Blum MOVENTO drawer slide',
    'drawer_slide',
    'side_32_row',
    '{"refRowFromFront":37,"rearHoleOffset":224,"system_pitch_mm":32}'
  ),
  -- 32mm shelf row for sides / shelves
  (
    'system32_row',
    '32mm shelf row',
    'system32',
    'full_32_row',
    '{"firstHoleOffset":37,"distanceFromEdge":37,"system_pitch_mm":32}'
  ),
  -- Side dowel joints for carcass connection
  (
    'dowel_side_joints',
    'Side dowel joints (front/back)',
    'dowel',
    'side_dowel_joint',
    '{"dowelDiameter":8,"dowelDepth":30,"edgeOffset":37,"endOffset":37}'
  ),
  -- Back panel + nailer dowels / fixing
  (
    'back_panel_nailer',
    'Back panel + nailer dowels',
    'dowel',
    'back_panel_nailer',
    '{"dowelDiameter":8,"dowelDepth":30,"backOffset":37,"nailerOffset":76,"endOffset":37}'
  ),
  -- Hettich Sensys 8645 hinge (110°)
  (
    'hettich_sensys_8645_110',
    'Hettich Sensys 8645 110° hinge',
    'hinge',
    'door_hinge',
    '{"cupDiameter":35,"cupDepth":12.5,"cupFromEdge":3,"system_pitch_mm":32}'
  ),
  -- Hettich InnoTech Atira drawer slide
  (
    'hettich_innotech_atira',
    'Hettich InnoTech Atira drawer slide',
    'drawer_slide',
    'side_32_row',
    '{"refRowFromFront":37,"rearHoleOffset":224,"system_pitch_mm":32}'
  ),
  -- Häfele 110° concealed hinge
  (
    'hafele_hinge_110',
    'Häfele 110° concealed hinge',
    'hinge',
    'door_hinge',
    '{"cupDiameter":35,"cupDepth":12,"cupFromEdge":3,"system_pitch_mm":32}'
  ),
  -- Grass Tiomos 110° hinge
  (
    'grass_tiomos_110',
    'Grass Tiomos 110° hinge',
    'hinge',
    'door_hinge',
    '{"cupDiameter":35,"cupDepth":12.5,"cupFromEdge":3,"system_pitch_mm":32}'
  ),
  -- Salice Silentia 110° hinge
  (
    'salice_silentia_110',
    'Salice Silentia 110° hinge',
    'hinge',
    'door_hinge',
    '{"cupDiameter":35,"cupDepth":12.5,"cupFromEdge":3,"system_pitch_mm":32}'
  )
ON CONFLICT(id) DO NOTHING;

-- Example realistic part + drilling pattern that you can import directly.
-- This matches a 720h x 560d cabinet side in an 18mm carcass with:
-- - double 32mm shelf rows
-- - back panel dowels and nailer dowels at 37mm / 76mm from the back.

INSERT INTO parts (
  id, type, length_mm, width_mm, thickness_mm,
  origin, face, system_pitch_mm
) VALUES (
  'cabinetSide_560x720x18_mm',
  'cabinetSide',
  720,        -- length_mm (height)
  560,        -- width_mm  (depth)
  18,         -- thickness
  'bottomLeft',
  'front',
  32
)
ON CONFLICT(id) DO NOTHING;

-- 32mm shelf rows (double row, 37mm in from front and back)
INSERT INTO drilling_locations (
  part_id, seq, x_mm, y_mm, diameter_mm, depth_mm,
  hardware_id, feature_type, face, origin
) VALUES
  -- first few holes of the left row
  ('cabinetSide_560x720x18_mm', 1, 37, 37, 5, 12, 'system32_row', 'system32_shelf', 'front', 'bottomLeft'),
  ('cabinetSide_560x720x18_mm', 2, 37, 69, 5, 12, 'system32_row', 'system32_shelf', 'front', 'bottomLeft'),
  ('cabinetSide_560x720x18_mm', 3, 37, 101, 5, 12, 'system32_row', 'system32_shelf', 'front', 'bottomLeft'),
  -- matching right row (560 - 37 = 523mm from front)
  ('cabinetSide_560x720x18_mm', 4, 523, 37, 5, 12, 'system32_row', 'system32_shelf', 'front', 'bottomLeft'),
  ('cabinetSide_560x720x18_mm', 5, 523, 69, 5, 12, 'system32_row', 'system32_shelf', 'front', 'bottomLeft'),
  ('cabinetSide_560x720x18_mm', 6, 523, 101, 5, 12, 'system32_row', 'system32_shelf', 'front', 'bottomLeft');

-- Back panel and top/bottom nailer dowels at 37mm and 76mm from the back edge
INSERT INTO drilling_locations (
  part_id, seq, x_mm, y_mm, diameter_mm, depth_mm,
  hardware_id, feature_type, face, origin
) VALUES
  -- back panel dowels (width 560, back offset 37 => x = 560 - 37 = 523)
  ('cabinetSide_560x720x18_mm', 7, 523, 37, 8, 30, 'back_panel_nailer', 'back_panel_dowel', 'front', 'bottomLeft'),
  ('cabinetSide_560x720x18_mm', 8, 523, 683, 8, 30, 'back_panel_nailer', 'back_panel_dowel', 'front', 'bottomLeft'),
  -- nailer strip dowels (width 560, nailer offset 76 => x = 560 - 76 = 484)
  ('cabinetSide_560x720x18_mm', 9, 484, 37, 8, 30, 'back_panel_nailer', 'back_nailer_dowel', 'front', 'bottomLeft'),
  ('cabinetSide_560x720x18_mm', 10, 484, 683, 8, 30, 'back_panel_nailer', 'back_nailer_dowel', 'front', 'bottomLeft');

