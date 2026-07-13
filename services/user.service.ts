import { ApiClient } from '../helpers/api-client';
import type { ApiMessageResponse, User } from '../models/user.model';

export class UserService {
  constructor(private readonly apiClient: ApiClient) {}

  async createAccount(user: User): Promise<ApiMessageResponse> {
    const res = await this.apiClient.post('/createAccount', {
      name: user.name,
      email: user.email,
      password: user.password,
      title: user.title ?? '',
      birth_date: user.day ?? '',
      birth_month: user.month ?? '',
      birth_year: user.year ?? '',
      firstname: user.firstName,
      lastname: user.lastName,
      company: user.company ?? '',
      address1: user.address1,
      address2: user.address2 ?? '',
      country: user.country,
      zipcode: user.zipcode,
      state: user.state,
      city: user.city,
      mobile_number: user.mobileNumber
    });
    return res.json();
  }

  async verifyLogin(email: string, password: string): Promise<ApiMessageResponse> {
    const res = await this.apiClient.post('/verifyLogin', { email, password });
    return res.json();
  }

  async deleteAccount(email: string, password: string): Promise<ApiMessageResponse> {
    const res = await this.apiClient.delete('/deleteAccount', { email, password });
    return res.json();
  }
}
