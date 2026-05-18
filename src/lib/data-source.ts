// Temporary mock data mode for UI/UX client preview. Replace with database queries later.

/**
 * When true, cars and categories use in-memory mock data (no MongoDB required).
 * Set to false (or NEXT_PUBLIC_USE_MOCK_DATA=false) when reconnecting the database.
 */
export const USE_MOCK_DATA =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_USE_MOCK_DATA === "false"
    ? false
    : true;
