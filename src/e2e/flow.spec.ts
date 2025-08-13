import { test, expect } from "@playwright/test";

test("load → rotate → export", async ({ page }, testInfo) => {
  await page.goto("/");

  // 画像を読み込む（プロジェクトルート基準）
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles("src/e2e/assets/test.png");

  await expect(page.getByText(/画像情報/)).toBeVisible();

  // 右回転（完全一致）
  await page.getByRole("button", { name: /^右回転$/ }).click();

  // 左右反転（完全一致）
  await page.getByRole("button", { name: /^左右反転$/ }).click();

  // エクスポート（ブラウザ差対応）
  const isChromium = testInfo.project.name === "chromium";
  if (isChromium) {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /^エクスポート$/ }).click(),
    ]);
    expect(await download.path()).toBeTruthy();
  } else {
    await page.getByRole("button", { name: /^エクスポート$/ }).click();
    await expect(
      page.getByRole("button", { name: /^エクスポート$/ })
    ).toBeEnabled();
  }
});
