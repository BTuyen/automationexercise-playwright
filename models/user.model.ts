export interface AccountDetails {
  password: string;
  title?: "Mr" | "Mrs";
  day?: string;
  month?: string;
  year?: string;
  newsletter?: boolean;
  optin?: boolean;
}

export interface AddressInfo {
  firstName: string;
  lastName: string;
  address1: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
  company?: string;
  address2?: string;
}

export interface User extends AccountDetails, AddressInfo {
  name: string;
  email: string;
}

// createAccount / verifyLogin / deleteAccount của API automationexercise đều trả cùng 1 shape
export interface ApiMessageResponse {
  responseCode: number;
  message: string;
}
