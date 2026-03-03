"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { businessGoalsOptions, matchCenterOptions, paymentMethodOptions, userCabinetOptions } from "@/lib/constants"
import { Controller, useForm } from "react-hook-form"
import { briefSchema, type BriefFormValues } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "../ui/switch"
import { useState } from "react"
import { addBrief } from "@/actions/brief"

export function BriefForm() {
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });
    const { control, register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<BriefFormValues>({
        resolver: zodResolver(briefSchema),
        defaultValues: {
            customerName: "",
            customerPosition: "",
            email: "",
            phone: "",
            companyName: "",
            preferredContactMethod: "EMAIL",
            targetAudience: "",
            currentProblems: "",
            matchCenterFeatures: [],
            userCabinetModules: [],
            ticketingSystem: "",
            shopCategories: "",
            paymentMethods: [],
            needsInventoryManagement: false,
            contentUpdateFrequency: "",
            matchResultsImport: "",
            hasBrandbook: false,
            designMood: "",
            expectsPeakLoads: false,
            estimatedDeadline: "",
        }
    });
    async function onSubmit(data: BriefFormValues) {
        setStatusMessage({ type: null, text: '' });

        const result = await addBrief(data);

        if (!result.success) {
            setStatusMessage({ type: 'error', text: result.error || 'Сталася невідома помилка' });
        } else {
            setStatusMessage({ type: 'success', text: result.message || 'Успіх!' });
            reset();
        }

    };
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="mb-12 space-y-4 text-center">
                <h1 className="text-2xl font-extrabold tracking-tight lg:text-5xl">
                    Бриф на розробку футбольного порталу
                </h1>
                <p className="text-md lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Ця анкета допоможе нам зібрати всі необхідні вимоги для проектування екосистеми вашого клубу.
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend><h2 className="text-xl font-semibold">Блок 1: Контактна інформація</h2></FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="customerName">ПІБ контактної особи</FieldLabel>
                                <Input
                                    id="customerName"
                                    {...register("customerName")}
                                    className={errors.customerName ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {errors.customerName && <p className="text-sm text-destructive mt-1">{errors.customerName.message}</p>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="customerPosition">Ваша посада</FieldLabel>
                                <FieldDescription>(необов'язково)</FieldDescription>
                                <Input
                                    id="customerPosition"
                                    {...register("customerPosition")}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Електронна пошта</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="phone">Номер телефону</FieldLabel>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+380XXXXXXXXX"
                                    {...register("phone")}
                                    className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="companyName">Назва організації</FieldLabel>
                                <Input
                                    id="companyName"
                                    {...register("companyName")}
                                    className={errors.companyName ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {errors.companyName && <p className="text-sm text-destructive mt-1">{errors.companyName.message}</p>}
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSet>
                        <FieldLegend variant="label">Спосіб зв'язку</FieldLegend>
                        <FieldDescription>Оберіть найзручніший спосіб комунікації для обговорення деталей проєкту.</FieldDescription>
                        <Controller
                            name="preferredContactMethod"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className={`gap-3 mt-3 p-2 rounded-md ${errors.preferredContactMethod ? "border border-destructive bg-destructive/5" : ""}`}
                                >
                                    <Field orientation="horizontal">
                                        <RadioGroupItem value="EMAIL" id="contact-email" />
                                        <FieldLabel htmlFor="contact-email" className="font-normal cursor-pointer">Електронна пошта (Email)</FieldLabel>
                                    </Field>
                                    <Field orientation="horizontal">
                                        <RadioGroupItem value="PHONE" id="contact-phone" />
                                        <FieldLabel htmlFor="contact-phone" className="font-normal cursor-pointer">Телефон</FieldLabel>
                                    </Field>
                                    <Field orientation="horizontal">
                                        <RadioGroupItem value="TELEGRAM" id="contact-telegram" />
                                        <FieldLabel htmlFor="contact-telegram" className="font-normal cursor-pointer">Telegram</FieldLabel>
                                    </Field>
                                </RadioGroup>
                            )}
                        />
                        {errors.preferredContactMethod && <p className="text-sm text-destructive mt-1">{errors.preferredContactMethod.message}</p>}
                    </FieldSet>
                    <FieldSeparator />
                    <FieldSet>
                        <FieldLegend><h2 className="text-xl font-semibold">Блок 2: Бізнес-аналітика</h2></FieldLegend>
                        <FieldDescription>Оберіть основні бізнес-цілі вашого майбутнього порталу (можна декілька).</FieldDescription>
                        <div className={`p-3 rounded-md transition-colors ${errors.businessGoals ? "border border-destructive bg-destructive/5" : ""}`}>
                            <FieldGroup className="gap-3">
                                <FieldLabel htmlFor="targetAudience">Бізнес-цілі</FieldLabel>
                                {businessGoalsOptions && businessGoalsOptions.length > 0 ? (
                                    businessGoalsOptions.map((option) => (
                                        <Field key={option.id} orientation="horizontal" className="items-center">
                                            <Controller
                                                name="businessGoals"
                                                control={control}
                                                render={({ field }) => (
                                                    <Checkbox
                                                        id={option.id}
                                                        checked={field.value?.includes(option.label)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), option.label])
                                                                : field.onChange(field.value?.filter((val: string) => val !== option.label));
                                                        }}
                                                    />
                                                )}
                                            />
                                            <FieldLabel htmlFor={option.id} className="font-normal cursor-pointer">{option.label}</FieldLabel>
                                        </Field>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">Завантаження цілей...</p>
                                )}
                            </FieldGroup>
                        </div>
                        {errors.businessGoals && (
                            <p className="text-sm text-destructive">
                                {errors.businessGoals.message?.toString() || "Оберіть хоча б одну бізнес-ціль"}
                            </p>
                        )}
                    </FieldSet>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="targetAudience">Цільова аудиторія</FieldLabel>
                                <Textarea
                                    id="targetAudience"
                                    placeholder="Напишіть короткий опис аудиторії"
                                    className={`resize-none ${errors.targetAudience ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                    {...register("targetAudience")}
                                />
                                {errors.targetAudience && <p className="text-sm text-destructive mt-1">{errors.targetAudience.message}</p>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="currentProblems">Поточні проблеми</FieldLabel>
                                <FieldDescription>(необов'язково)</FieldDescription>
                                <Textarea
                                    id="currentProblems"
                                    placeholder="Напишіть поточні проблеми"
                                    className="resize-none"
                                    {...register("currentProblems")}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <FieldSet>
                        <FieldLegend><h2 className="text-xl font-semibold">Блок 3: Специфіка футбольного порталу</h2></FieldLegend>
                        <FieldDescription>Профільні функції.</FieldDescription>
                        <FieldGroup>
                            <div>
                                <FieldLegend variant="label" className="mb-3">Функції Матч-центру</FieldLegend>
                                <FieldGroup className={`gap-3 p-2 rounded-md ${errors.matchCenterFeatures ? "border border-destructive bg-destructive/5" : ""}`}>
                                    {matchCenterOptions.map((option) => (
                                        <Field key={option.id} orientation="horizontal" className="items-center">
                                            <Controller
                                                name="matchCenterFeatures"
                                                control={control}
                                                render={({ field }) => (
                                                    <Checkbox
                                                        id={option.id}
                                                        checked={field.value?.includes(option.label)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), option.label])
                                                                : field.onChange(field.value?.filter((val: string) => val !== option.label));
                                                        }}
                                                    />
                                                )}
                                            />
                                            <FieldLabel htmlFor={option.id} className="font-normal cursor-pointer">{option.label}</FieldLabel>
                                        </Field>
                                    ))}
                                </FieldGroup>
                                {errors.matchCenterFeatures && <p className="text-sm text-destructive mt-1">{errors.matchCenterFeatures.message}</p>}
                            </div>
                            <div>
                                <FieldLegend variant="label" className="mb-3">Кабінет вболівальника</FieldLegend>
                                <FieldDescription className="mb-3">(необов'язково)</FieldDescription>
                                <FieldGroup className="gap-3">
                                    {userCabinetOptions.map((option) => (
                                        <Field key={option.id} orientation="horizontal" className="items-center">
                                            <Controller
                                                name="userCabinetModules"
                                                control={control}
                                                render={({ field }) => (
                                                    <Checkbox
                                                        id={option.id}
                                                        checked={field.value?.includes(option.label)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), option.label])
                                                                : field.onChange(field.value?.filter((val: string) => val !== option.label));
                                                        }}
                                                    />
                                                )}
                                            />
                                            <FieldLabel htmlFor={option.id} className="font-normal cursor-pointer">{option.label}</FieldLabel>
                                        </Field>
                                    ))}
                                </FieldGroup>
                            </div>
                            <div>
                                <FieldLegend variant="label" className="mb-3">Система квитків</FieldLegend>
                                <Controller
                                    name="ticketingSystem"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className={`gap-3 p-2 rounded-md ${errors.ticketingSystem ? "border border-destructive bg-destructive/5" : ""}`}
                                        >
                                            <Field orientation="horizontal">
                                                <RadioGroupItem value="Власна розробка" id="ticket-custom" />
                                                <FieldLabel htmlFor="ticket-custom" className="font-normal cursor-pointer">Власна розробка</FieldLabel>
                                            </Field>
                                            <Field orientation="horizontal">
                                                <RadioGroupItem value="Інтеграція зовні" id="ticket-integration" />
                                                <FieldLabel htmlFor="ticket-integration" className="font-normal cursor-pointer">Інтеграція зовні</FieldLabel>
                                            </Field>
                                        </RadioGroup>
                                    )}
                                />
                                {errors.ticketingSystem && <p className="text-sm text-destructive mt-1">{errors.ticketingSystem.message}</p>}
                            </div>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <FieldSet>
                        <FieldLegend><h2 className="text-xl font-semibold">Блок 4: Комерція (E-commerce)</h2></FieldLegend>
                        <FieldDescription>Функціонал фан-шопу та продажу товарів.</FieldDescription>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="shopCategories">Категорії товарів</FieldLabel>
                                <FieldDescription>(необов'язково)</FieldDescription>
                                <Textarea
                                    id="shopCategories"
                                    placeholder="Наприклад: ігрова форма, аксесуари, сувеніри..."
                                    className="resize-none"
                                    {...register("shopCategories")}
                                />
                            </Field>
                            <div>
                                <FieldLegend variant="label" className="mb-3">Методи оплати</FieldLegend>
                                <FieldGroup className={`gap-3 p-2 rounded-md ${errors.paymentMethods ? "border border-destructive bg-destructive/5" : ""}`}>
                                    {paymentMethodOptions.map((option) => (
                                        <Field key={option.id} orientation="horizontal" className="items-center">
                                            <Controller
                                                name="paymentMethods"
                                                control={control}
                                                render={({ field }) => (
                                                    <Checkbox
                                                        id={option.id}
                                                        checked={field.value?.includes(option.label)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...(field.value || []), option.label])
                                                                : field.onChange(field.value?.filter((val: string) => val !== option.label));
                                                        }}
                                                    />
                                                )}
                                            />
                                            <FieldLabel htmlFor={option.id} className="font-normal cursor-pointer">{option.label}</FieldLabel>
                                        </Field>
                                    ))}
                                </FieldGroup>
                                {errors.paymentMethods && <p className="text-sm text-destructive mt-1">{errors.paymentMethods.message}</p>}
                            </div>

                            <Field orientation="horizontal" className="flex flex-row items-center justify-between rounded-lg border p-4 mt-2">
                                <div className="space-y-0.5">
                                    <FieldLabel className="text-base">Облік складу</FieldLabel>
                                    <FieldDescription>Чи потрібен внутрішній складський облік та контроль залишків?</FieldDescription>
                                </div>
                                <Controller
                                    name="needsInventoryManagement"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <FieldSet>
                        <FieldLegend><h2 className="text-xl font-semibold">Блок 5: Контент та Технічні вимоги</h2></FieldLegend>
                        <FieldDescription>Як система буде жити після запуску.</FieldDescription>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="contentUpdateFrequency">Частота оновлень</FieldLabel>
                                <Controller
                                    name="contentUpdateFrequency"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger id="contentUpdateFrequency" className={errors.contentUpdateFrequency ? "border-destructive ring-1 ring-destructive" : ""}>
                                                <SelectValue placeholder="Оберіть частоту оновлень" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Щодня">Щодня</SelectItem>
                                                <SelectItem value="Щотижня">Щотижня</SelectItem>
                                                <SelectItem value="Після матчів">Після матчів</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.contentUpdateFrequency && <p className="text-sm text-destructive mt-1">{errors.contentUpdateFrequency.message}</p>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="matchResultsImport">Імпорт результатів</FieldLabel>
                                <Controller
                                    name="matchResultsImport"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger id="matchResultsImport" className={errors.matchResultsImport ? "border-destructive ring-1 ring-destructive" : ""}>
                                                <SelectValue placeholder="Оберіть спосіб імпорту" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Ручний ввід">Ручний ввід</SelectItem>
                                                <SelectItem value="API (автоматично)">API (автоматично)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.matchResultsImport && <p className="text-sm text-destructive mt-1">{errors.matchResultsImport.message}</p>}
                            </Field>

                            <Field orientation="horizontal" className="flex flex-row items-center justify-between rounded-lg border p-4 mt-2">
                                <div className="space-y-0.5">
                                    <FieldLabel className="text-base">Пікові навантаження</FieldLabel>
                                    <FieldDescription>Чи очікуємо наплив користувачів під час матчів?</FieldDescription>
                                </div>
                                <Controller
                                    name="expectsPeakLoads"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <FieldSet>
                        <FieldLegend><h2 className="text-xl font-semibold">Блок 6: Дизайн та Терміни</h2></FieldLegend>
                        <FieldDescription>Візуальна складова та менеджмент часу.</FieldDescription>
                        <FieldGroup>
                            <Field orientation="horizontal" className="flex flex-row items-center justify-between rounded-lg border p-4 mt-2">
                                <div className="space-y-0.5">
                                    <FieldLabel className="text-base">Наявність брендбука</FieldLabel>
                                    <FieldDescription>Чи є готові гайдлайни (логотип, фірмові кольори, шрифти)?</FieldDescription>
                                </div>
                                <Controller
                                    name="hasBrandbook"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    )}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="designMood">Візуальна стилістика</FieldLabel>
                                <Controller
                                    name="designMood"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger id="designMood" className={errors.designMood ? "border-destructive ring-1 ring-destructive" : ""}>
                                                <SelectValue placeholder="Оберіть бажаний стиль дизайну" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Мінімалізм">Мінімалізм (Чистий та сучасний)</SelectItem>
                                                <SelectItem value="Агресивний">Агресивний (Емоційний спортивний)</SelectItem>
                                                <SelectItem value="Класика">Класика (Традиційний клубний)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.designMood && <p className="text-sm text-destructive mt-1">{errors.designMood.message}</p>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="estimatedDeadline">Термін реалізації</FieldLabel>
                                <Input
                                    id="estimatedDeadline"
                                    placeholder="Наприклад: 3 місяці, або 'до початку сезону'"
                                    {...register("estimatedDeadline")}
                                    className={errors.estimatedDeadline ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {errors.estimatedDeadline && <p className="text-sm text-destructive mt-1">{errors.estimatedDeadline.message}</p>}
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal" className="mt-8 justify-center md:justify-end">
                        <Button variant="outline" type="button" onClick={() => reset()}>
                            Скасувати
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Відправка брифу...' : 'Відправити бриф'}</Button>
                    </Field>
                    {statusMessage.type === 'success' && (
                        <div className="p-4 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 text-center font-medium">
                            {statusMessage.text}
                        </div>
                    )}
                    {statusMessage.type === 'error' && (
                        <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20 text-center font-medium">
                            {statusMessage.text}
                        </div>
                    )}
                </FieldGroup>
            </form>
        </div>
    )
}