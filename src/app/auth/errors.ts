export const MIN_PASSWORD_LENGTH = 8
export const authErrors = new Map([
    ["missing", "One or few of the required fields are missing."],
    ["credentials", "Invalid credentials for this account."],
    ["invalid_email", "Invalid email. Please use an actual one."],
    ["invalid_username", "Invalid username. It can only contain latin letters, numbers and underscores."],
    ["username_taken", "This username is taken. Please try another one."],
    ["password_too_short", `Password must be at least ${8} characters long.`],
    ["unknown", "Unknown error. Contact support."]
] as const)
export type AuthErrorKey = Parameters<typeof authErrors['get']>[0]