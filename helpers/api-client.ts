import type { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  constructor(
    private readonly context: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  async get(endpoint: string, params?: Record<string, string>): Promise<APIResponse> {
    return this.context.get(`${this.baseUrl}${endpoint}`, { params });
  }

  // API của automationexercise.com nhận form-urlencoded, không phải JSON
  // -> phải dùng option `form`, dùng `data` sẽ gửi sai content-type và bị site từ chối
  async post(endpoint: string, form?: Record<string, string>): Promise<APIResponse> {
    return this.context.post(`${this.baseUrl}${endpoint}`, { form });
  }

  async delete(endpoint: string, form?: Record<string, string>): Promise<APIResponse> {
    return this.context.delete(`${this.baseUrl}${endpoint}`, { form });
  }
}
