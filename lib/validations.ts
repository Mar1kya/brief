import * as z from "zod";
import { BriefStatus } from "./generated/prisma";

const phoneRegex = /^(?:\+380|0)\d{9}$/;

export const briefSchema = z.object({
  customerName: z
    .string()
    .min(2, "Ім'я повинно містити мінімум 2 символи")
    .max(50),
  customerPosition: z.string().optional(),
  email: z
    .string()
    .min(1, "Email обов'язковий")
    .email("Введіть коректний email"),
  phone: z
    .string()
    .min(1, "Телефон обов'язковий")
    .regex(phoneRegex, "Формат: +380XXXXXXXXX або 0XXXXXXXXX"),
  companyName: z.string().min(1, "Назва організації обов'язкова"),
  preferredContactMethod: z.enum(["EMAIL", "PHONE", "TELEGRAM"], {
    message: "Оберіть зручний спосіб зв'язку",
  }),
  businessGoals: z.array(z.string()).min(1, "Оберіть хоча б одну бізнес-ціль"),
  targetAudience: z
    .string()
    .min(10, "Опишіть аудиторію детальніше (мінімум 10 символів)"),
  currentProblems: z.string().optional(),
  matchCenterFeatures: z
    .array(z.string())
    .min(1, "Оберіть хоча б одну функцію Матч-центру"),
  userCabinetModules: z.array(z.string()),
  ticketingSystem: z.string().min(1, "Оберіть варіант системи квитків"),
  shopCategories: z.string().optional(),
  paymentMethods: z
    .array(z.string())
    .min(1, "Оберіть хоча б один метод оплати"),
  needsInventoryManagement: z.boolean(),
  contentUpdateFrequency: z.string().min(1, "Оберіть частоту оновлень"),
  matchResultsImport: z.string().min(1, "Оберіть спосіб імпорту результатів"),
  hasBrandbook: z.boolean(),
  designMood: z.string().min(1, "Оберіть бажаний стиль дизайну"),
  expectsPeakLoads: z.boolean(),
  estimatedDeadline: z.string().min(1, "Вкажіть орієнтовні терміни запуску"),
});

export type BriefFormValues = z.infer<typeof briefSchema>;

export const signInSchema = z.object({
  email: z.string().email("Некоректний формат email"),
  password: z.string().min(1, "Пароль обов'язковий"),
});

export type ActionResponse = {
  success?: boolean;
  message?: string;
  error?: string | Record<string, string[]>;
};

export const briefUpdateSchema = z.object({
  status: z.nativeEnum(BriefStatus),
  customerName: z.string().min(2, "Ім'я занадто коротке"),
  email: z.string().email("Введіть коректний email"),
  phone: z.string().min(9, "Введіть коректний номер телефону"),
});

export type BriefUpdateFormValues = z.infer<typeof briefUpdateSchema>;

export const formUpdateSchema = z.object({
  status: z.enum(["NEW", "IN_REVIEW", "ACCEPTED", "REJECTED"]),
  customerName: z.string().min(2, "Ім'я занадто коротке"),
  email: z.string().email("Введіть коректний email"),
  phone: z
    .string()
    .min(1, "Телефон обов'язковий")
    .regex(phoneRegex, "Формат: +380XXXXXXXXX або 0XXXXXXXXX"),
});
