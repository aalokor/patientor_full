import { test, expect } from "@playwright/test";

test.describe("Home", () => {
  test("front page can be opened", async ({ page }) => {
    await page.goto("");
    await expect(page.getByText("Patient list")).toBeVisible();
  });
});
