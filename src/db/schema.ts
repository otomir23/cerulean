import {
    timestamp,
    pgTable,
    text, serial,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").unique().notNull(),
    email: text("email").unique().notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    passwordHash: text("passwordHash").notNull(),
    passwordSalt: text("passwordSalt").notNull(),
    avatar: text("avatar"),
});