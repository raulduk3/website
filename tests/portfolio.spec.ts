import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("introduces Richard and links only the three approved websites", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Richard Álvarez",
  );
  await expect(
    page.getByText("Web Developer & AI Engineer", { exact: true }),
  ).toBeVisible();
  const websites = page.getByRole("region", { name: "Selected websites" });
  await expect(websites.getByRole("article")).toHaveCount(3);
  await expect(
    websites.getByRole("link", { name: /Jonah White/ }),
  ).toHaveAttribute("href", "https://www.jonahwhitepxp.com/");
  await expect(
    websites.getByRole("link", { name: /Joaquín Morales/ }),
  ).toHaveAttribute("href", "https://www.joaquinmoralesdp.com/");
  await expect(
    websites.getByRole("link", { name: /AirLogic/ }),
  ).toHaveAttribute("href", "https://airlogicchi.com/");
  await expect(
    websites.getByText("Coming soon", { exact: true }),
  ).toBeVisible();
  await expect(page.locator('a[href^="https://"]')).toHaveCount(3);
  await expect(
    page.locator('a[href="mailto:rawalvarez731@gmail.com"]'),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("project previews open and close with the keyboard", async ({ page }) => {
  await page.goto("/");
  const project = page.getByRole("article", { name: "Jonah White" });
  const preview = project.getByText("Preview website", { exact: true });
  const image = project.getByRole("img");
  await expect(image).toBeHidden();
  await preview.focus();
  await page.keyboard.press("Enter");
  await expect(image).toBeVisible();
  await expect(image).toHaveJSProperty("complete", true);
  expect(
    await image.evaluate(
      (element: HTMLImageElement) =>
        element.naturalWidth > 0 && element.naturalHeight > 0,
    ),
  ).toBe(true);
  await page.keyboard.press("Enter");
  await expect(image).toBeHidden();
});

test("the page and native previews work without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Richard Álvarez", exact: true }),
    ).toBeVisible();
    const projects = page.getByRole("region", { name: "Selected websites" });
    await expect(projects.getByRole("link")).toHaveCount(3);
    const project = page.getByRole("article", { name: "Joaquín Morales" });
    await project.getByText("Preview website", { exact: true }).click();
    await expect(project.getByRole("img")).toBeVisible();
    await expect(
      page.locator('a[href="/Richard_Alvarez_Resume.pdf"]'),
    ).toBeVisible();
    await expect(
      page.locator('a[href="/Richard_Alvarez_CV.pdf"]'),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Copy email address", exact: true }),
    ).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test("copies the email address and confirms the result", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page
    .getByRole("button", { name: "Copy email address", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Email address copied" }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "rawalvarez731@gmail.com",
  );
});

test("clipboard refusal preserves a usable email fallback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new DOMException("Permission denied", "NotAllowedError");
        },
      },
    });
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Copy email address", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: /Copy is unavailable/ }),
  ).toBeVisible();
  await expect(
    page.locator('a[href="mailto:rawalvarez731@gmail.com"]'),
  ).toBeVisible();
});

test("paper animates behind stationary text without a pause control", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const main = page.getByRole("main");
  await expect(main).toBeVisible();
  const sample = () =>
    page.screenshot({ clip: { x: 36, y: 150, width: 256, height: 320 } });
  const initial = await sample();
  await expect
    .poll(async () => !(await sample()).equals(initial), { timeout: 10_000 })
    .toBe(true);
  const animated = await sample();
  await expect
    .poll(async () => !(await sample()).equals(animated), { timeout: 10_000 })
    .toBe(true);
  await page.mouse.move(5, 5);
  await page.waitForTimeout(500);
  const before = await main.boundingBox();
  await page.mouse.move(1200, 700);
  await page.waitForTimeout(500);
  const after = await main.boundingBox();
  if (!before || !after)
    throw new Error("The main content must have a visible bounding box.");
  expect({ x: after.x, y: after.y }).toEqual({ x: before.x, y: before.y });
  await expect(
    page.getByRole("button", { name: "Copy email address", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("canvas")).toBeHidden();
  const staticPaper = await sample();
  await page.waitForTimeout(350);
  expect((await sample()).equals(staticPaper)).toBe(true);
});

test("reduced motion keeps the background static", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Richard Álvarez", exact: true }),
  ).toBeVisible();
  await expect(page.locator("canvas")).toBeHidden();
});

for (const width of [320, 390, 768, 1440]) {
  test(`remains readable and accessible at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page.getByRole("region", { name: "Selected websites" }),
    ).toBeVisible();
    const size = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(size.content).toBe(size.viewport);
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(accessibility.violations).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`portfolio-${width}.png`),
      fullPage: true,
    });
  });
}

test("serves the existing documents and correct portfolio metadata", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(
    /Richard Álvarez.*Web Developer.*AI Engineer/i,
  );
  expect(
    await page
      .locator('link[rel="canonical"]')
      .evaluate((element: HTMLLinkElement) => element.href),
  ).toBe("https://richardalvarez.info/");
  for (const path of [
    "/Richard_Alvarez_Resume.pdf",
    "/Richard_Alvarez_CV.pdf",
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  }
  const icon = await request.get("/favicon-32x32.png");
  expect(icon.status()).toBe(200);
  expect(icon.headers()["content-type"]).toBe("image/png");
});
