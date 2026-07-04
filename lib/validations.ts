import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const recoverPasswordSchema = z.object({
  email: z.string().email(),
});

export const imageSchema = z.object({
  url: z.string().min(1),
  publicId: z.string().min(1),
});

export const createHotelSchema = z
  .object({
    name: z.string().min(2, "Indica o nome do hotel."),
    description: z.string().optional(),
    address: z.string().min(5, "Indica a morada."),
    city: z.string().min(2, "Indica a cidade."),
    country: z.string().min(2, "Indica o país."),
    email: z.string().email("Email inválido."),
    phone: z.string().optional(),
    images: z.array(imageSchema).default([]),

    singleRoomTotal: z.number().int().min(0, "Quantidade inválida").default(0),
    singleRoomPrice: z.number().positive("Preço deve ser positivo").optional(),
    singleRoomDescription: z.string().optional(),

    doubleRoomTotal: z.number().int().min(0, "Quantidade inválida").default(0),
    doubleRoomPrice: z.number().positive("Preço deve ser positivo").optional(),
    doubleRoomDescription: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.singleRoomTotal > 0 || data.doubleRoomTotal > 0;
    },
    {
      message: "É obrigatório configurar pelo menos um tipo de quarto",
      path: ["singleRoomTotal"],
    },
  )
  .refine(
    (data) => {
      return !(data.singleRoomTotal > 0 && !data.singleRoomPrice);
    },
    {
      message: "Preço é obrigatório quando há quartos single configurados",
      path: ["singleRoomPrice"],
    },
  )
  .refine(
    (data) => {
      return !(data.doubleRoomTotal > 0 && !data.doubleRoomPrice);
    },
    {
      message: "Preço é obrigatório quando há quartos double configurados",
      path: ["doubleRoomPrice"],
    },
  );
