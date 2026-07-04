import {
  uuid,
  text,
  pgTable,
  varchar,
  timestamp,
  pgEnum,
  integer,
  decimal,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const ROLE_ENUM = pgEnum("role", [
  "Admin",
  "Partner",
  "Pending",
  "User",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "Pending",
  "Approved",
  "Rejected",
]);

export const ROOM_TYPE_ENUM = pgEnum("room_type", ["Single", "Double"]);

export const BOOKING_STATUS_ENUM = pgEnum("booking_status", [
  "Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: ROLE_ENUM("role").notNull().default("User"),
  emailVerified: boolean("email_verified").notNull().default(true),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const verificationTokens = pgTable("verification_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),

  fullName: varchar("full_name", { length: 255 }),
  passwordHash: text("password_hash"),

  tokenHash: text("token_hash").notNull().unique(),
  tokenType: text("token_type").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  nextEmailAt: timestamp("next_email_at").defaultNow(),
});

export const hotels = pgTable("hotels", {
  id: uuid("id").primaryKey().defaultRandom(),

  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  address: text("address").notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  country: varchar("country", { length: 120 }).default("Portugal"),
  email: text("email").notNull(),
  phone: varchar("phone", { length: 40 }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hotelImages = pgTable("hotel_images", {
  id: uuid("id").primaryKey().defaultRandom(),

  hotelId: uuid("hotel_id")
    .notNull()
    .references(() => hotels.id, { onDelete: "cascade" }),

  url: text("url").notNull(),
  publicId: text("public_id").notNull(),
  order: integer("order").notNull().default(0),

  createdAt: timestamp("created_at").defaultNow(),
});

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),

  hotelId: uuid("hotel_id")
    .notNull()
    .references(() => hotels.id, { onDelete: "cascade" }),

  roomType: ROOM_TYPE_ENUM("room_type").notNull(),
  pricePerNight: decimal("price_per_night", {
    precision: 10,
    scale: 2,
  }).notNull(),
  totalRooms: integer("total_rooms").notNull().default(0),
  description: text("description"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  hotelId: uuid("hotel_id")
    .notNull()
    .references(() => hotels.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  roomId: uuid("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  checkInDate: date("check_in_date").notNull(),
  checkOutDate: date("check_out_date").notNull(),
  totalPrice: decimal("total_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  status: BOOKING_STATUS_ENUM("status").notNull().default("Pending"),
  checkedIn: boolean("checked_in").notNull().default(false),
  specialRequests: text("special_requests"),

  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paidAt: timestamp("paid_at"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const partnerApplications = pgTable("partner_applications", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),

  hotelName: varchar("hotel_name", { length: 255 }).notNull(),
  description: text("description").notNull(),

  status: applicationStatusEnum("status").notNull().default("Pending"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  hotels: many(hotels),
  bookings: many(bookings),
  partnerApplication: one(partnerApplications),
  favorites: many(favorites),
}));

export const hotelsRelations = relations(hotels, ({ one, many }) => ({
  owner: one(users, {
    fields: [hotels.ownerId],
    references: [users.id],
  }),
  rooms: many(rooms),
  images: many(hotelImages),
  favorites: many(favorites),
}));
export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  hotel: one(hotels, {
    fields: [favorites.hotelId],
    references: [hotels.id],
  }),
}));

export const hotelImagesRelations = relations(hotelImages, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelImages.hotelId],
    references: [hotels.id],
  }),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  hotel: one(hotels, {
    fields: [rooms.hotelId],
    references: [hotels.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [bookings.roomId],
    references: [rooms.id],
  }),
}));

export const partnerApplicationsRelations = relations(
  partnerApplications,
  ({ one }) => ({
    user: one(users, {
      fields: [partnerApplications.userId],
      references: [users.id],
    }),
  }),
);
