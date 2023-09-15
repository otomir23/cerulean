import {cookies} from "next/headers";
import {createToken, decodeExpiredToken, decodeToken, JWTProfile} from "@/auth/token";
import {sessions} from "@/db/schema";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {redirect} from "next/navigation";
import {generateSalt} from "@/auth/secrets";

export const AUTH_COOKIE_NAME = 'token'

/**
 * Retrieves the user profile information stored inside JWT cookie.
 *
 * @returns {Promise<JWTProfile|null>} - A Promise that resolves to the user profile information or
 * if the user is not authenticated or the JWT is invalid, it resolves to null.
 */
export async function getProfile(): Promise<JWTProfile | null> {
    const token = cookies().get(AUTH_COOKIE_NAME)
    if (!token) return null
    const profile = await decodeToken(token.value)
    if (profile === null) {
        const refreshToken = await decodeExpiredToken(token.value)
        if (!refreshToken) return null
        return await refresh(refreshToken)
    }
    return profile
}

/**
 * Retrieves the profile or redirects to the login page if the profile is not available.
 *
 * @returns {Promise<JWTProfile>} - A promise that resolves to the profile.
 */
export async function getProfileOrRedirect(): Promise<JWTProfile> {
    return getProfileRedirecting('/auth', false)
}

/**
 * Retrieves the user profile and redirects to the specified target based on the redirect state.
 *
 * @param {string} redirectTarget - The target to redirect to if the redirect state matches the
 * result of profile lookup.
 * @param {boolean} redirectState - The state used to determine if the redirect should occur.
 * @return {Promise<null|JWTProfile>} - A promise that resolves to null if the redirect state is
 * true, or the user profile otherwise.
 */
export async function getProfileRedirecting<B extends boolean>(redirectTarget: string, redirectState: B): Promise<B extends true ? null : JWTProfile> {
    const profile = await getProfile()
    if (!!profile === redirectState) redirect(redirectTarget)
    // typescript is stupid here and doesn't understand that profile is now in expected state
    // @ts-expect-error
    return profile
}

/**
 * Refreshes a JWT token using the provided refresh token.
 *
 * @param {string} refreshToken - The refresh token used to refresh the JWT token.
 * @return {Promise<JWTProfile | null>} - A Promise that resolves to the refreshed JWT profile or
 * null if the session is expired or not found.
 */
export async function refresh(refreshToken: string): Promise<JWTProfile | null> {
    const session = await db.query.sessions.findFirst({
        where: eq(sessions.sessionToken, refreshToken),
        with: {
            owner: true
        }
    })
    if (!session || session.expires < new Date()) return null
    const { id, username, email, avatar } = session.owner
    const profile = {
        refreshToken,
        id,
        username,
        email,
        avatar
    }
    await updateToken(profile)
    return profile
}

/**
 * Starts a new session for the given user.
 *
 * @param {Omit<JWTProfile, 'refreshToken'>} data - The user data to start the session with.
 * @returns {Promise<JWTProfile>} - A Promise that resolves to the JWT profile for the session.
 */
export async function startSession(data: Omit<JWTProfile, 'refreshToken'>): Promise<JWTProfile> {
    const token = generateSalt()
    await db.insert(sessions).values({
        sessionToken: token,
        userId: data.id,
        expires: new Date()
    })
    const profile: JWTProfile = {
        refreshToken: token,
        ...data
    }
    await updateToken(profile)
    return profile
}

/**
 * Updates the authentication token for the given user profile.
 *
 * @param {JWTProfile} profile - The user profile containing the necessary information for creating the token.
 */
export async function updateToken(profile: JWTProfile) {
    cookies().set(AUTH_COOKIE_NAME, await createToken(profile))
}

/**
 * Ends a session by deleting it from the database.
 *
 * @param {string} sessionToken - The session token identifying the session to end.
 */
export async function endSession(sessionToken: string) {
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken))
}

/**
 * Ends the current session by deleting the authentication cookie and revoking the refresh token.
 */
export async function endCurrentSession() {
    const profile = await getProfile()
    if (!profile) return
    await endSession(profile.refreshToken)
    cookies().delete(AUTH_COOKIE_NAME)
}