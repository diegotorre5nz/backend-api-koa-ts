import config from 'config'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

export function peperify(string: string) {
  return crypto.createHmac('sha1', config.get('auth.secret'))
    .update(string)
    .digest('hex')
}

export function hashString(string: string) {
  return bcrypt.hash(peperify(string), config.get('auth.saltRounds'))
}

export function compareHashedStrings(plaintext: string, ciphertext: string) {
  return bcrypt.compare(peperify(plaintext), ciphertext)
}
