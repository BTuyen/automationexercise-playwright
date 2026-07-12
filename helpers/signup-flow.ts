import { LoginPage } from '../pages/auth/login.page';
import { SignupPage } from '../pages/auth/signup.page';
import { generateUser } from '../utils/data-generator';

export async function completeSignupForm(signupPage: SignupPage, user: ReturnType<typeof generateUser>) {
  await signupPage.fillAccountInfo({
    title: user.title,
    password: user.password,
    day: user.day,
    month: user.month,
    year: user.year,
    newsletter: user.newsletter,
    optin: user.optin
  });
  await signupPage.fillAddressInfo({
    firstName: user.firstName,
    lastName: user.lastName,
    company: user.company,
    address1: user.address1,
    address2: user.address2,
    country: user.country,
    state: user.state,
    city: user.city,
    zipcode: user.zipcode,
    mobileNumber: user.mobileNumber
  });
  await signupPage.createAccount();
}

export async function signupNewUser(loginPage: LoginPage, signupPage: SignupPage, user: ReturnType<typeof generateUser>) {
  await loginPage.goto();
  await loginPage.signup(user.name, user.email);
  await completeSignupForm(signupPage, user);
}
