import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

function validateChileanRUT(rut: string): boolean {
  const cleanRUT = rut.replace(/[.-]/g, '');
  if (cleanRUT.length < 2) return false;
  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1).toUpperCase();
  if (!/^\d+$/.test(body)) return false;
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const expectedDV = 11 - (sum % 11);
  const calculatedDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : expectedDV.toString();
  return dv === calculatedDV;
}

function validateChileanPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[\s-()]/g, '');
  return /^(\+?56)?9\d{8}$/.test(cleanPhone);
}

export const registrations = pgTable("registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  rut: text("rut").notNull(),
  rutEmpresa: text("rut_empresa"),
  telefono: text("telefono").notNull(),
  email: text("email").notNull(),
  nivelVentas: text("nivel_ventas").notNull(),
  servicioMentorias: text("servicio_mentorias").notNull(),
  servicioJugarActivacion: text("servicio_jugar_activacion").notNull(),
  categoriaMentoria: text("categoria_mentoria"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({
  id: true,
  createdAt: true,
}).extend({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  rut: z.string().refine(validateChileanRUT, {
    message: "El RUT no es válido",
  }),
  rutEmpresa: z.string().optional().refine((val) => !val || validateChileanRUT(val), {
    message: "El RUT de empresa no es válido",
  }),
  telefono: z.string().refine(validateChileanPhone, {
    message: "El teléfono debe ser un número chileno válido (+569XXXXXXXX)",
  }),
  email: z.string().email("El email debe ser válido"),
  nivelVentas: z.enum([
    "0 - 2.400 UF",
    "2.400 - 5.000 UF",
    "5.000 - 25.000 UF",
    "25.000 - 100.000 UF"
  ], {
    errorMap: () => ({ message: "Debes seleccionar un nivel de ventas" })
  }),
  servicioMentorias: z.enum(["si", "no"]),
  servicioJugarActivacion: z.enum(["si", "no"]),
  categoriaMentoria: z.enum([
    "Servicios Financieros",
    "Marketing y Ventas",
    "Gestión y Productividad",
    "Innovación y Talento",
    ""
  ]).optional(),
});

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
