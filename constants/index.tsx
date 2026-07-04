import { z } from "zod";

export const FIELD_NAMES = {
  fullName: "Nome Completo",
  email: "E-mail",
  password: "Palavra-passe",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  password: "password",
};

export const partnerApplicationSchema = z.object({
  hotelName: z
    .string()
    .min(3, "O nome do hotel deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres"),
});
