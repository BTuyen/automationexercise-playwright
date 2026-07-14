import Ajv, { type ErrorObject } from 'ajv';

const ajv = new Ajv({ allErrors: true });

export function validateSchema(schema: object, data: unknown): { valid: boolean; errors: ErrorObject[] | null } {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return { valid, errors: validate.errors ?? null };
}
