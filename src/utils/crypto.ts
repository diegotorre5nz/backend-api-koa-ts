import config from 'config'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

export function peperify(password: string) {
  return crypto.createHmac('sha1', config.get('auth.secret'))
    .update(password)
    .digest('hex')
}

export function hashPassword(string: string) {
  return bcrypt.hash(peperify(string), config.get('auth.saltRounds'))
}

export function comparePasswords(plaintext: string, ciphertext: string) {
  return bcrypt.compare(peperify(plaintext), ciphertext)
}
