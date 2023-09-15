import { jwtVerify, SignJWT } from 'jose'

export type JWTProfile = {
    refreshToken: string,
    id: number,
    username: string,
    email: string,
    avatar: string | null
}

const JWT_ALGORITHM = 'HS256'
const MAX_TOKEN_AGE = '1 day'
const MAX_TOKEN_AGE_FOR_REFRESH = '1 month'

/**
 * Retrieves the secret key used for encoding and decoding JWT tokens.
 *
 * @returns {Uint8Array} - The secret key as a Uint8Array.
 * @throws {Error} - If the JWT_SECRET is missing in production environment.
 */
function getJWTSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET
    if (process.env.NODE_ENV === 'production' && !secret)
        throw new Error("Missing JWT_SECRET in production")
    return new TextEncoder().encode(secret)
}

/**
 * Creates a JWT token based on the provided profile.
 *
 * @param {JWTProfile} profile - The profile to be included in the token.
 * @returns {Promise<string>} - A Promise that resolves to the generated JWT token.
 */
export async function createToken(profile: JWTProfile): Promise<string> {
    return await new SignJWT(profile)
        .setProtectedHeader({ alg: JWT_ALGORITHM })
        .setIssuedAt()
        .sign(getJWTSecret())
}

/**
 * Decodes and verifies the provided access token with the given maximum token age.
 *
 * @param {string} accessToken - The access token to be decoded and verified.
 * @param {string} maxTokenAge - The maximum allowed age of the token in seconds.
 *
 * @return {Promise<JWTProfile | null>} - A promise that resolves to the decoded JWT profile
 * if the token is valid and its age is within the maximum allowed age, or null otherwise.
 *
 * @internal INTERNAL FUNCTION, USE RESPONSIBLY
 */
async function internal_decodeTokenWithTokenAge(accessToken: string, maxTokenAge: string): Promise<JWTProfile | null> {
    return jwtVerify(accessToken, getJWTSecret(), { maxTokenAge })
        .then(s => s.payload as JWTProfile, () => null)
}

/**
 * Decodes a JWT access token.
 *
 * @param {string} accessToken - The access token to decode.
 * @return {Promise<JWTProfile | null>} - A promise that resolves with the decoded token as a
 * JWTProfile object, or null if the token is invalid or expired.
 */
export async function decodeToken(accessToken: string): Promise<JWTProfile | null> {
    return internal_decodeTokenWithTokenAge(accessToken, MAX_TOKEN_AGE)
}

/**
 * Decodes an expired access token and retrieves the refresh token.
 *
 * @param {string} accessToken - The expired access token to decode.
 *
 * @return {Promise<string|null>} - A promise that resolves to the refresh token if it
 * exists in the decoded token, otherwise null.
 */
export async function decodeExpiredToken(accessToken: string): Promise<string | null> {
    const data = await internal_decodeTokenWithTokenAge(accessToken, MAX_TOKEN_AGE_FOR_REFRESH)
    return data?.refreshToken || null
}
