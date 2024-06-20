const { test, describe } = require("node:test");
const assert = require("node:assert");
const dummy = require("../utils/list_helper").dummy;

describe("dummy returns one", () => {
  const blogs = [];

  test("dummy test in action", () => {
    assert.strictEqual(dummy(blogs), 1);
  });
});
