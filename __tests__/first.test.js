test("2+2 = 4", () => {
  expect(2 + 2).toBe(4);
});

test("6-2 = 4", () => {
  expect(6 - 2).toBe(4);
});

// Purposefully wrtiing wring test case to check the CI/CD pipeline for failure
test("6-2 = 4", () => {
  expect(3 - 2).toBe(1);
});

test("6-2 = 4", () => {
  expect(4 - 2).toBe(1);
});
