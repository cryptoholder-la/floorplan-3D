// High-level workflow model for the CNC cabinet drilling pipeline.
// This turns the current input + computed data into logical steps.

export function buildWorkflowModel({ input, holes, nestingModel }) {
  const hasPartDims =
    !!input &&
    Number(input.length) > 0 &&
    Number(input.width) > 0 &&
    Number(input.thickness) > 0;

  const hasHardware = !!input?.hardwareType;
  const hasDrilling = Array.isArray(holes) && holes.length > 0;
  const hasNesting =
    !!nestingModel &&
    Array.isArray(nestingModel.placements) &&
    nestingModel.placements.length > 0;

  const steps = [
    {
      id: "design",
      label: "1. Part + hardware",
      detail: hasPartDims
        ? `${Math.round(input.length)} × ${Math.round(
            input.width
          )} × ${Math.round(input.thickness)} mm`
        : "Set part size + type",
      status: hasPartDims && hasHardware ? "done" : hasPartDims ? "active" : "pending"
    },
    {
      id: "drilling",
      label: "2. Drill pattern",
      detail: hasDrilling ? `${holes.length} holes generated` : "Pick hardware pattern",
      status: hasDrilling ? "done" : hasHardware ? "active" : "pending"
    },
    {
      id: "nesting",
      label: "3. Sheet nesting",
      detail: hasNesting
        ? `${nestingModel.placements.length} parts / sheet`
        : "Auto layout on sheet",
      status: hasNesting ? "done" : hasDrilling ? "active" : "pending"
    },
    {
      id: "export",
      label: "4. SQL / CNC export",
      detail: "Use JSON + SQL block on the right",
      status: hasNesting ? "active" : "pending"
    }
  ];

  return {
    hasPartDims,
    hasHardware,
    hasDrilling,
    hasNesting,
    steps
  };
}