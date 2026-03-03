"use server";

import { prisma } from "@/lib/prisma";
import {
  briefSchema,
  BriefUpdateFormValues,
  briefUpdateSchema,
  type BriefFormValues,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

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
      data: prismaData,
    });
    return {
      success: true,
      message:
        "Бриф успішно відправлено! Ми зв'яжемося з вами найближчим часом.",
    };
  } catch {
    return {
      success: false,
      error:
        "Не вдалося зберегти бриф. Спробуйте пізніше або напишіть нам напряму.",
    };
  }
}

export async function updateBrief(id: string, data: BriefUpdateFormValues) {
  const validatedFields = briefUpdateSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.issues[0].message,
    };
  }
  try {
    await prisma.brief.update({
      where: { id },
      data: validatedFields.data,
    });
    revalidatePath(`/admin/briefs/${id}`);
    revalidatePath(`/admin/briefs`);

    return { success: true };
  } catch {
    return { success: false, error: "Не вдалося зберегти зміни в базу" };
  }
}
