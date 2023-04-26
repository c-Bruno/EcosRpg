export function toggleSanity(module, lesson) {
    return {
      type: "TOGGLE_SANITY",
      module,
      lesson,
    };
  }