-- Parts schema focusing on dimensional data (separate from drilling details).
-- This is intended to store cabinet parts with resolved measurements,
-- including their relationship back to a cabinet.

CREATE TABLE IF NOT EXISTS cabinet_parts (
  id                     TEXT PRIMARY KEY,
  cabinet_id             TEXT NOT NULL,        -- e.g. 'base_720_900w_560d'
  cabinet_type_id        TEXT NOT NULL,        -- e.g. 'base_720'
  cabinet_label          TEXT,
  role                   TEXT NOT NULL,        -- e.g. 'left_side', 'bottom'
  part_type              TEXT NOT NULL,        -- matches app partType: 'cabinetSide', 'backPanel', etc.
  length_mm              REAL NOT NULL,
  width_mm               REAL NOT NULL,
  thickness_mm           REAL NOT NULL,
  carcass_height_mm      REAL NOT NULL,
  carcass_width_mm       REAL NOT NULL,
  carcass_depth_mm       REAL NOT NULL,
  material_thickness_mm  REAL NOT NULL,
  system_pitch_mm        REAL NOT NULL,
  created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example: base cabinet 720h, 900w x 560d, 18mm material.
-- These numbers correspond to the expressions in cabinetData.js (buildCabinetParts).

INSERT INTO cabinet_parts (
  id, cabinet_id, cabinet_type_id, cabinet_label, role, part_type,
  length_mm, width_mm, thickness_mm,
  carcass_height_mm, carcass_width_mm, carcass_depth_mm,
  material_thickness_mm, system_pitch_mm
) VALUES
  -- Left side: 720h x 560d
  ('base_720_900w_560d_left_side',
   'base_720_900w_560d', 'base_720', 'Base cabinet 720h',
   'left_side', 'cabinetSide',
   720, 560, 18,
   720, 900, 560,
   18, 32
  ),
  -- Right side: 720h x 560d
  ('base_720_900w_560d_right_side',
   'base_720_900w_560d', 'base_720', 'Base cabinet 720h',
   'right_side', 'cabinetSide',
   720, 560, 18,
   720, 900, 560,
   18, 32
  ),
  -- Bottom: (900 - 2*18) x 560 = 864 x 560
  ('base_720_900w_560d_bottom',
   'base_720_900w_560d', 'base_720', 'Base cabinet 720h',
   'bottom', 'cabinetTopBottom',
   864, 560, 18,
   720, 900, 560,
   18, 32
  ),
  -- Top: same as bottom
  ('base_720_900w_560d_top',
   'base_720_900w_560d', 'base_720', 'Base cabinet 720h',
   'top', 'cabinetTopBottom',
   864, 560, 18,
   720, 900, 560,
   18, 32
  ),
  -- Fixed shelf: same width as bottom/top
  ('base_720_900w_560d_fixed_shelf',
   'base_720_900w_560d', 'base_720', 'Base cabinet 720h',
   'fixed_shelf', 'fixedShelf',
   864, 560, 18,
   720, 900, 560,
   18, 32
  ),
  -- Back panel: (720 - 18) x (900 - 18) = 702 x 882
  ('base_720_900w_560d_back_panel',
   'base_720_900w_560d', 'base_720', 'Base cabinet 720h',
   'back_panel', 'backPanel',
   702, 882, 3,         -- often 3mm backing; adjust per shop standard
   720, 900, 560,
   3, 32
  ),
  -- Top nailer: (900 - 2*18) x 100 = 864 x 100
  ('base_720_900w_560d_top_nailer',
   'base_720_900w_560d', 'base_720', 'Base cabinet 720h',
   'top_nailer', 'nailerStrip',
   864, 100, 18,
   720, 900, 560,
   18, 32
  ),
  -- Bottom nailer: same as top nailer
  ('base_720_900w_560d_bottom_nailer',
   'base_720_900w_560d', 'base_720', 'Base cabinet 720h',
   'bottom_nailer', 'nailerStrip',
   864, 100, 18,
   720, 900, 560,
   18, 32
  );

