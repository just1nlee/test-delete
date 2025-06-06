import { test, expect } from '@playwright/test';

test.skip('dummy test', async ({ page }) => {
    await page.goto('/');

});

test('Line Graph is plotted', async ({ page }) => {

    // Grab add button
    let add_button = page.getByRole('button', { name: '+' })

    // Nagivage to Line Chart
    await page.getByRole('link', { name: 'Line' }).click()
    await expect(page.getByRole('heading', { name: 'Line Chart Builder' })).toBeVisible();

    // Fill Chart Information
    await page.getByLabel('Chart title').fill('Total cookies eaten over time');
    await page.getByRole('textbox', { name: 'X label' }).fill('Time (s)');
    await page.getByRole('textbox', { name: 'Y label' }).fill('Total cookies eaten');


    // Insert Data
    await page.getByRole('spinbutton', { name: 'X' }).fill('0');
    await page.getByRole('spinbutton', { name: 'Y' }).fill('0');

    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(1).fill('10');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(1).fill('1');

    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(2).fill('20');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(2).fill('4');

    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(3).fill('30');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(3).fill('9')

    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(4).fill('40');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(4).fill('16')

    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(5).fill('50');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(5).fill('18')

    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(6).fill('60');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(6).fill('20')

    // Chart placeholder text is visible before chart
    await expect(page.getByText('Chart will appear here')).toBeVisible();

    // Click generate chart button
    await page.getByRole('button', { name: 'Generate Chart' }).click();

    // Chart is visible after click generate chart button
    await expect(page.getByRole('img', { name: 'Generated chart' })).toBeVisible();

    // Chart placeholder text is not visible before chart
    await expect(page.getByText('Chart will appear here')).not.toBeVisible();

});

test('Data remains after switching pages', async ({ page }) => {

    // Grab add button
    let add_button = page.getByRole('button', { name: '+' })

    // Nagivage to Line Chart
    await page.getByRole('link', { name: 'Line' }).click()
    await expect(page.getByRole('heading', { name: 'Line Chart Builder' })).toBeVisible();

    // Fill Chart Information
    await page.getByRole('textbox', { name:'Chart title' }).fill('Total cookies eaten over time');
    await page.getByRole('textbox', { name: 'X label' }).fill('Time (s)');
    await page.getByRole('textbox', { name: 'Y label' }).fill('Total cookies eaten');


    // Insert Data
    await page.getByRole('spinbutton', { name: 'X' }).fill('0');
    await page.getByRole('spinbutton', { name: 'Y' }).fill('0');

    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(1).fill('10');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(1).fill('1');

    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(2).fill('20');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(2).fill('4');


    // Assert data is visible before switching
    await expect(page.getByRole('textbox', { name:'Chart title' })).toHaveValue('Total cookies eaten over time')
    await expect(page.getByRole('textbox', { name: 'X label' })).toHaveValue('Time (s)')
    await expect(page.getByRole('textbox', { name: 'Y label' })).toHaveValue('Total cookies eaten')
    await expect(page.getByRole('spinbutton', { name: 'X' }).nth(0)).toHaveValue('0')
    await expect(page.getByRole('spinbutton', { name: 'Y' }).nth(0)).toHaveValue('0')
    await expect(page.getByRole('spinbutton', { name: 'X' }).nth(1)).toHaveValue('10')
    await expect(page.getByRole('spinbutton', { name: 'Y' }).nth(1)).toHaveValue('1')
    await expect(page.getByRole('spinbutton', { name: 'X' }).nth(2)).toHaveValue('20')
    await expect(page.getByRole('spinbutton', { name: 'Y' }).nth(2)).toHaveValue('4')


    // Nagivage to Scatter Chart
    await page.getByRole('link', { name: 'Scatter' }).click()
    await expect(page.getByRole('heading', { name: 'Scatter Chart Builder' })).toBeVisible();

    // Assert data is visible after switching
    await expect(page.getByRole('textbox', { name:'Chart title' })).toHaveValue('Total cookies eaten over time')
    await expect(page.getByRole('textbox', { name: 'X label' })).toHaveValue('Time (s)')
    await expect(page.getByRole('textbox', { name: 'Y label' })).toHaveValue('Total cookies eaten')
    await expect(page.getByRole('spinbutton', { name: 'X' }).nth(0)).toHaveValue('0')
    await expect(page.getByRole('spinbutton', { name: 'Y' }).nth(0)).toHaveValue('0')
    await expect(page.getByRole('spinbutton', { name: 'X' }).nth(1)).toHaveValue('10')
    await expect(page.getByRole('spinbutton', { name: 'Y' }).nth(1)).toHaveValue('1')
    await expect(page.getByRole('spinbutton', { name: 'X' }).nth(2)).toHaveValue('20')
    await expect(page.getByRole('spinbutton', { name: 'Y' }).nth(2)).toHaveValue('4')

});


test('Chart is saved to Gallery', async ({ page }) => {

    // Grab add button
    let add_button = page.getByRole('button', { name: '+' })

    // Nagivage to Line Chart
    await page.getByRole('link', { name: 'Line' }).click()
    await expect(page.getByText('Line Chart Builder')).toBeVisible();

    // Generate chart
    await page.getByLabel('Chart title').fill('Total cookies eaten over time');
    await page.getByRole('textbox', { name: 'X label' }).fill('Time (s)');
    await page.getByRole('textbox', { name: 'Y label' }).fill('Total cookies eaten');
    await page.getByRole('spinbutton', { name: 'X' }).fill('0');
    await page.getByRole('spinbutton', { name: 'Y' }).fill('0');
    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(1).fill('10');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(1).fill('1');
    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(2).fill('20');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(2).fill('4');
    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(3).fill('30');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(3).fill('9')
    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(4).fill('40');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(4).fill('16')
    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(5).fill('50');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(5).fill('18')
    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(6).fill('60');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(6).fill('20')

    // Generate and save chart
    await page.getByRole('button', { name: 'Generate Chart' }).click();
    await page.getByRole('button', { name: 'Save Chart' }).click();

    // Nagivage to Line Chart
    await page.getByRole('link', { name: 'Gallery' }).click()
    await expect(page.getByRole('heading', { name: 'Gallery' })).toBeVisible();

    // Assert saved chart shows up in gallery
    await expect(page.locator('#gallery').getByText('Total cookies eaten over time')).toBeVisible()
    await expect(page.locator('#gallery').getByText('Type: line')).toBeVisible()
});


test('Re-opening saved chart loads data and displays chart', async ({ page }) => {

    // Grab add button
    let add_button = page.getByRole('button', { name: '+' })

    // Nagivage to Line Chart
    await page.getByRole('link', { name: 'Line' }).click()

    // Fill Chart Information
    await page.getByRole('textbox', { name:'Chart title' }).fill('Total cookies eaten over time');
    await page.getByRole('textbox', { name: 'X label' }).fill('Time (s)');
    await page.getByRole('textbox', { name: 'Y label' }).fill('Total cookies eaten');


    // Insert Data
    await page.getByRole('spinbutton', { name: 'X' }).fill('0');
    await page.getByRole('spinbutton', { name: 'Y' }).fill('0');

    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(1).fill('10');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(1).fill('1');

    await add_button.click();
    await page.getByRole('spinbutton', { name: 'X' }).nth(2).fill('20');
    await page.getByRole('spinbutton', { name: 'Y' }).nth(2).fill('4');


    // Assert data is visible before switching
    await expect(page.getByRole('textbox', { name:'Chart title' })).toHaveValue('Total cookies eaten over time')
    await expect(page.getByRole('textbox', { name: 'X label' })).toHaveValue('Time (s)')
    await expect(page.getByRole('textbox', { name: 'Y label' })).toHaveValue('Total cookies eaten')
    await expect(page.getByRole('spinbutton', { name: 'X' }).nth(0)).toHaveValue('0')
    await expect(page.getByRole('spinbutton', { name: 'Y' }).nth(0)).toHaveValue('0')
    await expect(page.getByRole('spinbutton', { name: 'X' }).nth(1)).toHaveValue('10')
    await expect(page.getByRole('spinbutton', { name: 'Y' }).nth(1)).toHaveValue('1')
    await expect(page.getByRole('spinbutton', { name: 'X' }).nth(2)).toHaveValue('20')
    await expect(page.getByRole('spinbutton', { name: 'Y' }).nth(2)).toHaveValue('4')


    // Generate and save chart
    await page.getByRole('button', { name: 'Generate Chart' }).click();
    await page.getByRole('button', { name: 'Save Chart' }).click();
    
    // Nagivage to Line Chart
    await page.getByRole('link', { name: 'Gallery' }).click()
    await page.getByRole('button', { name: 'Open'}).click()

    // Assert chart is visible after re-opening
    await expect(page.getByRole('img', { name: 'Generated chart' })).toBeVisible();
    await expect(page.getByText('Chart will appear here')).not.toBeVisible();

    // Assert data is visible after re-opening
    await expect(page.getByRole('textbox', { name:'Chart title' })).toHaveValue('Total cookies eaten over time')
    await expect(page.getByRole('textbox', { name: 'X label' })).toHaveValue('Time (s)')
    await expect(page.getByRole('textbox', { name: 'Y label' })).toHaveValue('Total cookies eaten')
    await expect(page.getByRole('spinbutton', { name: 'X' }).nth(0)).toHaveValue('0')
    await expect(page.getByRole('spinbutton', { name: 'Y' }).nth(0)).toHaveValue('0')
    await expect(page.getByRole('spinbutton', { name: 'X' }).nth(1)).toHaveValue('10')
    await expect(page.getByRole('spinbutton', { name: 'Y' }).nth(1)).toHaveValue('1')
    await expect(page.getByRole('spinbutton', { name: 'X' }).nth(2)).toHaveValue('20')
    await expect(page.getByRole('spinbutton', { name: 'Y' }).nth(2)).toHaveValue('4')

});
