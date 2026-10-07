import { formatCompactNumber } from "./compact-number";

describe("formatCompactNumber", () => {
  it.each([
    [0, "0"],
    [999, "999"],
    [1234, "1.2K"],
    [98_765, "98.8K"],
    [1_500_000, "1.5M"],
  ])("formats %d as %s", (input, expected) => {
    expect(formatCompactNumber(input)).toBe(expected);
  });
});
