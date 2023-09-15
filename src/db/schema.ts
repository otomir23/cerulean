import {
    timestamp,
    pgTable,
    text, serial,
} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").unique().notNull(),
    email: text("email").unique().notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    passwordHash: text("passwordHash").notNull(),
    passwordSalt: text("passwordSalt").notNull(),
    avatar: text("avatar"),
});

export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
}));

export const sessions = pgTable("sessions", {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: serial("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
    owner: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));