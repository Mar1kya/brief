import * as z from "zod";

const phoneRegex = /^(?:\+380|0)\d{9}$/;

export const briefSchema = z.object({
  customerName: z.string().min(2, "Ім'я повинно містити мінімум 2 символи").max(50),
  customerPosition: z.string().optional(), 
  email: z.string().email("Введіть коректний email"),
  phone: z.string().regex(phoneRegex, "Некоректний номер. Формат: +380XXXXXXXXX або 0XXXXXXXXX"),
  companyName: z.string().default("ФК Полісся"),
  preferredContactMethod: z.enum(["EMAIL", "PHONE", "TELEGRAM"]).refine(val => val !== undefined, {
    message: "Оберіть зручний спосіб зв'язку",
  }),
  businessGoals: z.array(z.string()).min(1, "Оберіть хоча б одну бізнес-ціль"),
  targetAudience: z.string().min(10, "Опишіть аудиторію детальніше (мінімум 10 символів)"),
  currentProblems: z.string().optional().default(""),
  matchCenterFeatures: z.array(z.string()).min(1, "Оберіть хоча б одну функцію Матч-центру"),
  userCabinetModules: z.array(z.string()).default([]),
  ticketingSystem: z.string().min(1, "Оберіть варіант системи квитків"),
  shopCategories: z.string().optional().default(""),
  paymentMethods: z.array(z.string()).min(1, "Оберіть хоча б один метод оплати"),
  needsInventoryManagement: z.boolean().default(false),
  contentUpdateFrequency: z.string().min(1, "Оберіть частоту оновлень контенту"),
  matchResultsImport: z.string().min(1, "Оберіть спосіб імпорту результатів"),
  hasBrandbook: z.boolean().default(false),
  designMood: z.string().min(1, "Оберіть бажаний стиль дизайну"),
  expectsPeakLoads: z.boolean().default(false),
  estimatedDeadline: z.string().min(1, "Вкажіть орієнтовні терміни запуску"),
});


export type BriefFormValues = z.infer<typeof briefSchema>;

export const signInSchema = z.object({
  email: z.string().email("Некоректний формат email"),
  password: z.string().min(1, "Пароль обов'язковий"),
});