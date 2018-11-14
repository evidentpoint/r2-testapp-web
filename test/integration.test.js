describe('Launch page', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:4444');
  });

  it('should display the viewer on the page', async () => {
    await expect(page).toMatchElement("#viewer");
  });

  it('viewer should have a layout view', async () => {
    const selector = "#viewer #layout-view-root";
    await page.waitForSelector(selector);
    await expect(page).toMatchElement(selector);
  });

  it('layout view should have a spine item view', async () => {
    const selector = "#layout-view-root #spine-item-view-0";
    await page.waitForSelector(selector);
    await expect(page).toMatchElement(selector);
  });

  it('spine item view should have an iframe with content', async () => {
    const selector = "#spine-item-view-0 iframe";
    await page.waitForSelector(selector);
    await expect(page).toMatchElement(selector);
  });
});