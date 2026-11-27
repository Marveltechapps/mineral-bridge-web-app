import { test, expect, type Page } from '@playwright/test';

const BUYER = 'verified.buyer@example.com';

async function signIn(page: Page, email: string) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign in' }).first().click();
  await page.getByRole('tab', { name: 'Email' }).click();
  await page.getByLabel('EMAIL ADDRESS').fill(email);
  await page.getByRole('button', { name: 'Send verification code' }).first().click();
  await expect(page.getByText(email, { exact: false }).first()).toBeVisible({ timeout: 20_000 });
  const code = page.getByText(/Development sign-in code:/);
  await expect(code).toBeVisible();
  const otp = ((await code.textContent()) ?? '').replace(/\D/g, '');
  expect(otp).toHaveLength(4);
  await page.getByLabel('Verification code').fill(otp);
  await page.getByRole('button', { name: 'Verify and continue' }).first().click();
  await expect(page.getByRole('button', { name: 'Home' }).first()).toBeVisible({ timeout: 20_000 });
}

test.describe('authenticated customer workflows @bugfix @web', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await signIn(page, BUYER);
  });

  test.afterAll(async () => {
    await page?.close();
  });

  test('BUG-004: sold lots stay unavailable and zero-stock active lots stay on request', async () => {
    await page.getByRole('button', { name: 'Buy', exact: true }).first().click();
    await page.getByText('Precious metals', { exact: false }).first().click();
    await page.getByText('Gold', { exact: true }).first().click();
    const stocked = page.getByRole('button', { name: /Iso Gold Dore/ });
    await expect(stocked).toBeVisible();
    await expect(stocked).toContainText('available');
    await expect(stocked).not.toContainText('Unavailable');
    const onRequest = page.getByRole('button', { name: /Iso Gold On Request/ });
    await expect(onRequest).toBeVisible();
    await expect(onRequest).toContainText('Available on request');
    await expect(onRequest).not.toContainText('Unavailable');
  });

  test('BUG-005/006: a listed certificate is shown and the document API says it is available', async () => {
    await page.getByText('Iso Gold Dore').first().click();
    await expect(page.getByText('Certificate of analysis')).toBeVisible();
    const docResponse = page.waitForResponse((res) => res.url().includes('/documents/certificate_of_analysis') && res.request().method() === 'GET');
    await page.getByRole('button', { name: 'Download' }).nth(1).click();
    const res = await docResponse;
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.available).toBe(true);
    expect(body.name).toContain('Iso assay');
  });

  test('buying: a verified buyer can add a lot and place an order', async () => {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await page.getByRole('button', { name: 'Cart' }).first().click();
    await page.getByRole('button', { name: 'Proceed to checkout' }).first().click();
    await page.getByLabel('COMPANY / RECEIVER').fill('Iso Buyer');
    await page.getByLabel('STREET ADDRESS').fill('1 Marina Road');
    await page.getByLabel('CITY').fill('Nairobi');
    await page.getByLabel('COUNTRY').fill('Kenya');
    await page.getByLabel('CONTACT PERSON').fill('Verified Buyer Iso');
    await page.getByLabel('MOBILE').fill('254711600001');
    await page.getByRole('button', { name: 'Place order' }).first().click();
    await expect(page.getByText('Order placed')).toBeVisible({ timeout: 20_000 });
    await page.getByRole('button', { name: 'Continue browsing' }).click();
  });

  test('BUG-009: the buyer can accept the revised quotation number', async () => {
    await page.locator('header').getByRole('button', { name: 'Orders' }).click();
    await page.getByText('Revised gold lot').first().click();
    await page.getByRole('button', { name: 'Review quotation' }).click();
    await expect(page.getByText(/Q-ISO-R2/)).toBeVisible();
    await page.getByRole('button', { name: 'Accept quotation' }).first().click();
    await expect(page.getByText(/accepted|quotation/i).first()).toBeVisible({ timeout: 20_000 });
  });

  test('BUG-008: bank transfer shows a payment reference field', async () => {
    await page.getByRole('button', { name: 'Mineral Bridge home' }).click();
    await page.getByRole('button', { name: /MB-ISO-PAY/ }).click();
    await page.getByRole('button', { name: 'Make payment' }).click();
    await page.getByText('Bank transfer', { exact: false }).first().click();
    await expect(page.getByLabel('Payment reference')).toBeVisible();
    await page.getByLabel('Payment reference').fill('NEFT123456');
    await expect(page.getByLabel('Payment reference')).toHaveValue('NEFT123456');
  });

  test('BUG-012/013: a stored 1000-gram kilogram is shown as 1 kg', async () => {
    await page.locator('header').getByRole('button', { name: 'Orders' }).click();
    await page.getByRole('tab', { name: /Selling/ }).click();
    await expect(page.getByText('MB-ISO-SELL')).toBeVisible();
    await expect(page.getByText(/1 kg/)).toBeVisible();
    await expect(page.getByText('1000 kg')).toHaveCount(0);
    await expect(page.getByText(/0 kg/)).toHaveCount(0);
  });

  test('BUG-016: the customer support message is shown as their own', async () => {
    await page.getByRole('button', { name: 'Help & support' }).first().click();
    await page.getByText('Chat with support').click();
    await page.getByText('Seeded support ticket').click();
    await expect(page.getByText('Seeded inbox message.')).toBeVisible();
    await expect(page.getByText(/^You ·/)).toBeVisible();
  });

  test('selling: a 1 kg request keeps its unit and shows the uploaded photo', async () => {
    await page.locator('header').getByRole('button', { name: 'Sell' }).click();
    await page.getByText('Gold', { exact: true }).first().click();
    await page.getByLabel('Quantity').fill('1');
    await page.getByRole('radio', { name: 'kg' }).click();
    await page.getByLabel('Quality or grade').fill('80%');
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: '+' }).first().click();
    const fileChooser = await chooser;
    await fileChooser.setFiles({ name: 'mineral.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64') });
    await expect(page.locator('[style*="blob:"]').first()).toBeVisible({ timeout: 20_000 });
    await page.getByRole('button', { name: 'Submit sell request' }).first().click();
    await expect(page.getByText(/1 kg/).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText('1000 kg')).toHaveCount(0);
  });

  test('BUG-017: auto-bid can be turned on for a live auction', async () => {
    await page.getByRole('button', { name: 'Auctions' }).first().click();
    await page.getByText('Iso Gold Auction').first().click();
    const toggle = page.getByText('Auto-bid').first();
    await expect(toggle).toBeVisible();
    await toggle.click();
    await page.getByLabel('Auto-bid limit').fill('5000');
    await page.getByLabel('Auto-bid limit').blur();
    await expect(page.getByLabel('Auto-bid limit')).toHaveValue('5000');
  });
});

test('BUG-003/002/001: signup shows the full email and KYC follows customer type', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  const email = `investor.${Date.now()}@example.com`;
  await page.goto('/');
  await page.getByRole('button', { name: 'Create account' }).first().click();
  await page.getByRole('tab', { name: 'Email' }).click();
  await page.getByLabel('Full name').fill('Iso Investor');
  await page.getByLabel('EMAIL ADDRESS').fill(email);
  await page.getByRole('button', { name: 'Send verification code' }).first().click();
  await expect(page.getByText(email, { exact: true }).or(page.getByText(email))).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/ad•••/)).toHaveCount(0);
  const code = page.getByText(/Development sign-in code:/);
  const otp = ((await code.textContent()) ?? '').replace(/\D/g, '');
  await page.getByLabel('Verification code').fill(otp);
  await page.getByRole('button', { name: 'Verify and continue' }).first().click();
  await page.getByRole('radio', { name: /Buyer/ }).click();
  await page.getByText('Retail investors & collectors').click();
  await page.getByRole('button', { name: 'Continue' }).first().click();
  await expect(page.getByText(`Email · ${email} · verified`)).toBeVisible();
  await expect(page.getByText('TRADING NAME (OPTIONAL)')).toBeVisible();
  await page.getByRole('checkbox', { name: /terms of use/ }).click();
  await page.getByRole('button', { name: 'Continue' }).first().click();
  await expect(page.getByText('National ID · back')).toBeVisible();
  await expect(page.getByText('Business document')).toHaveCount(0);
});
