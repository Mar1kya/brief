"use server";

import { prisma } from "@/lib/prisma";
import { briefSchema, type BriefFormValues } from "@/lib/validations";

export async function addBrief(data: BriefFormValues) {
  const validatedFields = briefSchema.safeParse(data);
  
  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.issues[0].message,
    };
  }
  const prismaData = {
    ...validatedFields.data,
    customerPosition: validatedFields.data.customerPosition || "",
    currentProblems: validatedFields.data.currentProblems || "",
    shopCategories: validatedFields.data.shopCategories || "",
  };
  try {
    await prisma.brief.create({
        data: prismaData 
    });
    return {
      success: true,
      message: "Бриф успішно відправлено! Ми зв'яжемося з вами найближчим часом.",
    };
  } catch (error) {
    console.error("Помилка збереження брифу:", error);
    return {
      success: false,
      error: "Не вдалося зберегти бриф. Спробуйте пізніше або напишіть нам напряму.",
    };
  }
}