import dotenv from 'dotenv';
import path from 'path';

export const TEST_ENV = process.env.TEST_ENV ?? 'staging'; // staging | uat | prod

dotenv.config({
  path: path.resolve(__dirname, '..', `.env.${TEST_ENV}`),
});

export const ENV = {
  BASE_URL: process.env.BASE_URL ?? 'https://automationexercise.com',
  API_BASE_URL: process.env.API_BASE_URL ?? '',
  USER_EMAIL: process.env.TEST_USER_EMAIL ?? '',
  USER_PASSWORD: process.env.TEST_USER_PASSWORD ?? '',
  RETRIES: Number(process.env.RETRIES ?? 1),
  WORKERS: Number(process.env.WORKERS ?? 4),
  TIMEOUT: Number(process.env.TIMEOUT ?? 30000),
};
