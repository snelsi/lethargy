import { describe, it, expect } from "vitest";

import * as exports from "../index.js";

describe("exports", () => {
  describe("check", () => {
    it("exports `Lethargy` class", () => {
      expect(exports).toHaveProperty("Lethargy");
    });
  });
});
