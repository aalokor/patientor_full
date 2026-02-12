import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

test.describe("Home", () => {
  test("front page can be opened", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.getByText("Patient list")).toBeVisible();
  });
});
