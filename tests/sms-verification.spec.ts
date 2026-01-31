import { test, expect } from "@playwright/test";
import { MailiskClient } from "mailisk";

const mailiskApiKey = process.env.MAILISK_API_KEY;
const smsNumber = process.env.MAILISK_SMS_NUMBER;

if (!mailiskApiKey) {
  throw new Error("MAILISK_API_KEY not configured");
}

const mailisk = new MailiskClient({ apiKey: mailiskApiKey });

test.describe("SMS verification", () => {
  test("logs a user in via OTP", async ({ page }) => {
    if (!smsNumber) {
      throw new Error("MAILISK_SMS_NUMBER not configured");
    }

    await page.goto("http://localhost:3000/login");

    const smsToggle = page.locator('button:has-text("Use SMS instead")');
    if (await smsToggle.isVisible()) {
      await smsToggle.click();
    }

    const searchStartIso = new Date().toISOString();
    await page.fill("#phone", smsNumber);
    await page.click('form button[type="submit"]');
    await expect(page).toHaveURL("http://localhost:3000/login/verify");

    const { data: messages } = await mailisk.searchSmsMessages(smsNumber, {
      body: "Your verification code is",
      from_date: searchStartIso,
    });

    expect(messages.length).toBeGreaterThan(0);
    const latest = messages[0];
    const otp = latest.body.match(/(\d{6})/)?.[1];
    expect(otp).toBeDefined();

    await page.fill("#code", otp ?? "");
    await page.click('form button[type="submit"]');
    await expect(page).toHaveURL("http://localhost:3000/dashboard");

    // At this point the demo pushes the user to /dashboard, which represents a
    // successful login within this example application.
  });
});
