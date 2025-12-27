-- Cabinet-level schema capturing carcass dimensions and type.
-- This sits "above" cabinet_parts and drilling tables.

CREATE TABLE IF NOT EXISTS cabinets (
  id                     TEXT PRIMARY KEY,      -- e.g. 'base_720_900w_560d'
  cabinet_type_id        TEXT NOT NULL,         -- e.g. 'base_720'
  label                  TEXT NOT NULL,         -- human-readable
  carcass_height_mm      REAL NOT NULL,
  carcass_width_mm       REAL NOT NULL,
  carcass_depth_mm       REAL NOT NULL,
  material_thickness_mm  REAL NOT NULL,
  system_pitch_mm        REAL NOT NULL,
  notes                  TEXT,
  created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example cabinet records that match the sample parts in partsSchema.sql.

INSERT INTO cabinets (
  id, cabinet_type_id, label,
  carcass_height_mm, carcass_width_mm, carcass_depth_mm,
  material_thickness_mm, system_pitch_mm, notes
) VALUES
  ('base_720_900w_560d',
   'base_720',
   'Base cabinet 720h, 900w x 560d, 18mm carcass',
   720, 900, 560,
   18, 32,
   'Standard base cabinet with full 32mm rows and back panel'
  ),
  ('wall_720_900w_340d',
   'wall_720',
   'Wall cabinet 720h, 900w x 340d, 18mm carcass',
   720, 900, 340,
   18, 32,
   'Standard wall cabinet with full 32mm rows and back panel'
  );

