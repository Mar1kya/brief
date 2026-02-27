"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import z from "zod"
import { signInSchema } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { login } from "@/actions/auth"


type FormFields = z.infer<typeof signInSchema>;


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [serverError, setServerError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setError } = useForm<FormFields>({
    resolver: zodResolver(signInSchema)
  })
  async function onSubmit(data: FormFields) {
    setServerError(null);
    const result = await login(data);
    if (result && result.error) {
      setServerError(result.error as string)
    }

  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Увійдіть до адмін панелі</CardTitle>
          <CardDescription>
            Введіть свою електронну адресу нижче, щоб увійти до адмін панелі
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Пошта</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Пароль</FieldLabel>
                </div>
                <Input id="password" type="password" {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </Field>
              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}
              <Field>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Вхід..." : "Увійти"}</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
