import { expect, test } from '../../fixtures/pages.fixture';

test.describe('Product API', () => {
  test('getAllProducts trả responseCode 200 và list không rỗng', async ({ productService }) => {
    const res = await productService.getAllProducts();

    expect(res.responseCode).toBe(200);
    expect(res.products.length).toBeGreaterThan(0);
  });

  test('searchProduct("top") trả responseCode 200 và có kết quả liên quan', async ({ productService }) => {
    const res = await productService.searchProduct('top');

    expect(res.responseCode).toBe(200);
    expect(res.products.length).toBeGreaterThan(0);
    // Không phải mọi kết quả đều chứa "top" trong tên (search không strict substring-match),
    // nên chỉ assert có ít nhất 1 sản phẩm liên quan, không assert toàn bộ danh sách.
    const hasRelevantMatch = res.products.some((p) => p.name.toLowerCase().includes('top'));
    expect(hasRelevantMatch).toBe(true);
  });
});
