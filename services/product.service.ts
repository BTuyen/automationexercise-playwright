import { ApiClient } from '../helpers/api-client';
import type { ProductsListResponse } from '../models/product.model';

export class ProductService {
  constructor(private readonly apiClient: ApiClient) {}

  async getAllProducts(): Promise<ProductsListResponse> {
    const res = await this.apiClient.get('/productsList');
    return res.json();
  }

  async searchProduct(name: string): Promise<ProductsListResponse> {
    const res = await this.apiClient.post('/searchProduct', { search_product: name });
    return res.json();
  }
}
