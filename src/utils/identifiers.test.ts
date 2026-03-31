import assert from "node:assert";
import { describe, it } from "node:test";
import { autoIncrement } from "./identifiers";

describe("autoIncrement", () => {
  it("should return 1 when no numbers are present", () => {
    assert.equal(autoIncrement([]), 1);
  });

  it("should increment correctly", () => {
    assert.equal(autoIncrement([1, 4, 2]), 5);
  });
});
