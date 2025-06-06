import { test, expect } from '@playwright/test';

test.skip('dummy test', async ({ page }) => {
    await page.goto('/');
});