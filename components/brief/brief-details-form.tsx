"use client"

import { useState, useTransition, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Brief } from "@/lib/generated/prisma"
import { updateBrief } from "@/actions/brief"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { formUpdateSchema } from "@/lib/validations"

function BadgeList({ items, emptyText = "Не вказано" }: { items?: string[] | string | null, emptyText?: string }) {
    let parsedItems: string[] = [];
    if (Array.isArray(items)) parsedItems = items;
    else if (typeof items === 'string') {
        try { parsedItems = JSON.parse(items); } catch { parsedItems = [items]; }
    }
    if (!parsedItems || parsedItems.length === 0) {
        return <p className="text-sm text-muted-foreground">{emptyText}</p>;
    }
    return (
        <div className="flex flex-wrap gap-2 mt-1">
            {parsedItems.map((item, i) => (
                <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                    {item}
                </span>
            ))}
        </div>
    )
}
export default function BriefDetailsForm({ brief }: { brief: Brief }) {
    const [isMounted, setIsMounted] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    const form = useForm<z.infer<typeof formUpdateSchema>>({
        resolver: zodResolver(formUpdateSchema),
        defaultValues: {
            status: (brief.status as "NEW" | "IN_REVIEW" | "ACCEPTED" | "REJECTED") || "NEW",
            customerName: brief.customerName || "",
            email: brief.email || "",
            phone: brief.phone || "",
        },
    })
    async function onSubmit(values: z.infer<typeof formUpdateSchema>) {
        setStatusMessage(null)
        startTransition(async () => {
            const result = await updateBrief(brief.id, values)
            if (result.success) {
                setStatusMessage({ type: "success", text: "Зміни успішно збережено!" })
            } else {
                setStatusMessage({ type: "error", text: `${result.error}` })
            }
        })
    }
    return (
        <div className="space-y-8 pb-10">
            <Button variant="outline" asChild>
                <Link href="/admin/briefs">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Назад до списку
                </Link>
            </Button>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card className="border-primary/20 shadow-sm">
                        <CardHeader>
                            <CardTitle className="leading-normal flex justify-between items-center">
                                <span>Операційне управління: {brief.companyName}</span>
                                {statusMessage?.type === 'success' && <CheckCircle2 className="text-emerald-500 h-6 w-6" />}
                            </CardTitle>
                            <CardDescription>
                                Дата подачі: {isMounted ? new Date(brief.createdAt).toLocaleDateString("uk-UA", {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : "завантаження..."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="w-full md:w-72">
                                        <FormLabel className="font-bold">Статус заявки</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-background">
                                                    <SelectValue placeholder="Оберіть статус" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="NEW">Новий</SelectItem>
                                                <SelectItem value="IN_REVIEW">В обробці</SelectItem>
                                                <SelectItem value="ACCEPTED">Укладено</SelectItem>
                                                <SelectItem value="REJECTED">Відхилено</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="customerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ім'я замовника</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Телефон</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Електронна пошта</FormLabel>
                                            <FormControl>
                                                <Input type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t">
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Збереження..." : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" /> Зберегти зміни
                                        </>
                                    )}
                                </Button>
                                {statusMessage && (
                                    <span className={`text-sm font-medium ${statusMessage.type === 'error' ? 'text-destructive' : 'text-emerald-500'}`}>
                                        {statusMessage.text}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Form>
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4 mt-8">Деталі анкети</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Клієнт та Компанія</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Назва організації</p>
                                <p className="text-sm font-semibold">{brief.companyName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Посада контактної особи</p>
                                <p className="text-sm">{brief.customerPosition || "Не вказано"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Бажаний спосіб зв'язку</p>
                                <p className="text-sm font-semibold">{brief.preferredContactMethod === 'EMAIL' ? "Електронна пошта" : brief.preferredContactMethod === 'PHONE' ? "Телефон" : brief.preferredContactMethod === 'TELEGRAM' ? "Telegram" : brief.preferredContactMethod}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Бізнес-аналітика</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Бізнес-цілі</p>
                                <BadgeList items={brief.businessGoals} emptyText="Цілі не обрано" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Цільова аудиторія</p>
                                <Textarea readOnly value={brief.targetAudience || ""} className="bg-muted resize-none h-20 text-sm" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Поточні проблеми</p>
                                <Textarea readOnly value={brief.currentProblems || ""} className="bg-muted resize-none h-20 text-sm" placeholder="Не вказано" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Функціональні вимоги</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Функції Матч-центру</p>
                                <BadgeList items={brief.matchCenterFeatures} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Кабінет вболівальника</p>
                                <BadgeList items={brief.userCabinetModules} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Система квитків</p>
                                <p className="text-sm">{brief.ticketingSystem || "Не вказано"}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Комерція (E-commerce)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Категорії товарів</p>
                                <p className="text-sm">{brief.shopCategories || "Не вказано"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Методи оплати</p>
                                <BadgeList items={brief.paymentMethods} />
                            </div>
                            <div className="flex items-center justify-between border rounded-md p-3 bg-muted/30">
                                <span className="text-sm font-medium">Облік складу (внутрішній)</span>
                                <Switch checked={brief.needsInventoryManagement || false} disabled />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Контент, Технічні вимоги та Дизайн</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Частота оновлень</p>
                                        <p className="text-sm font-medium">{brief.contentUpdateFrequency || "Не вказано"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Імпорт результатів</p>
                                        <p className="text-sm font-medium">{brief.matchResultsImport || "Не вказано"}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Стилістика дизайну</p>
                                        <p className="text-sm font-medium">{brief.designMood || "Не вказано"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Очікуваний термін (Дедлайн)</p>
                                        <p className="text-sm font-medium text-primary">{brief.estimatedDeadline || "Не вказано"}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between border rounded-md p-3 bg-muted/30">
                                        <span className="text-sm font-medium">Очікуються пікові навантаження</span>
                                        <Switch checked={brief.expectsPeakLoads || false} disabled />
                                    </div>
                                    <div className="flex items-center justify-between border rounded-md p-3 bg-muted/30">
                                        <span className="text-sm font-medium">Є брендбук / гайдлайни</span>
                                        <Switch checked={brief.hasBrandbook || false} disabled />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}