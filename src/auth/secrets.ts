import {createHmac, randomBytes} from "crypto";

const SALT_LENGTH = 128

/**
 * Hashes a password using the sha256 algorithm and provided salt.
 *
 * @param {string} password - The password to be hashed.
 * @param {string} salt - The salt used for hashing.
 * @return {string} - The hashed password.
 */
export function hashPassword(password: string, salt: string): string {
    const hash = createHmac('sha256', salt);
    hash.update(password);
    return hash.digest('hex');
}

/**
 * Generates a random salt value.
 *
 * @returns {string} - The generated salt value as a hexadecimal string.
 */
export function generateSalt(): string {
    return randomBytes(SALT_LENGTH).toString('hex');
}