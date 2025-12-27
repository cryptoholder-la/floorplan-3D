// Simple AI CNC expert helper using Websim's LLM API.
// It reads the current part, hardware, and drilling locations, and returns concise advice.

export async function runCncAdvisor(payload) {
  try {
    const messages = [
      {
        role: "system",
        content:
          "You are a CNC machining and cabinetmaking expert. " +
          "You speak concisely, in bullet points, with metric units. " +
          "You see 32mm system drill coordinates, Blum-style hardware, and SQL inserts, " +
          "and you suggest practical improvements for manufacturability and compatibility."
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "Analyze this part and drilling pattern for cabinet CNC fabrication. " +
              "Check: 32mm grid alignment, typical Blum distances, dowel depths vs 18mm material, " +
              "and whether the pattern is realistic to run on a typical CNC nested router.\n\n" +
              "Return:\n- 'OK for CNC' or 'Needs attention'\n- 3–6 short bullet points with the main observations.\n\n" +
              "Here is the JSON payload including SQL-style inserts:"
          },
          {
            type: "text",
            text: JSON.stringify(payload, null, 2)
          }
        ]
      }
    ];

    const completion = await window.websim.chat.completions.create({
      messages
    });

    return completion.content || "";
  } catch (err) {
    console.error("CNC AI helper error", err);
    throw err;
  }
}