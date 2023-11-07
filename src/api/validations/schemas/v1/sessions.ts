export const create = {
  type: 'Object',
  required: true,
  properties: {
    email: { type: 'string', required: true, format: 'email', maxLength: 80 },
    password: { type: 'string', required: true, minLength: 8, maxLength: 80 },
  },
}

export const refresh = {
  type: 'Object',
  required: true,
  properties: {
    token: { type: 'string', required: true },
  },
}