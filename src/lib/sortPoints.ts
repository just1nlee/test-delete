import type { DataPoint } from "./types";

/**
 * This function sorts an array of X/Y points by ascending X value. The
 * function only operates on data where the X value is numeric. In other
 * words, it won't work on bar chart data, where the X values are strings.
 *
 * @param points An array of x,y data points. Should have the following format:
 *   [
 *     { x: ..., y: ... },
 *     { x: ..., y: ... },
 *     { x: ..., y: ... },
 *     ...
 *   ]
 *
 * @return Returns a reference to the original `points` array, which is sorted
 *   in place.
 */

export function sortPoints(points: DataPoint[]): DataPoint[] {
  return points.sort((a, b) => {
    // If both are numbers, sort numerically
    if (typeof a.x === 'number' && typeof b.x === 'number') {
      return a.x - b.x;
    }
    // Convert to strings and use localeCompare for string comparison
    return String(a.x).localeCompare(String(b.x));
  });
}
