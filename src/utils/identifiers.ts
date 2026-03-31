// Generates the next id based on the highest number in the list
export function autoIncrement(ids: number[]) {
  if (ids.length === 0) {
    return 1;
  }
  return Math.max(...ids) + 1;
}