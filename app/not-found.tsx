import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4">
            <h1 className="text-6xl font-extrabold tracking-tight mb-2 text-primary">
                404
            </h1>
            <h2 className="text-2xl font-semibold tracking-tight mb-4">
                Сторінку не знайдено
            </h2>
            <p className="text-muted-foreground max-w-125 mb-8 text-lg">
                Вибачте, але сторінка, яку ви шукаєте, не існує, була видалена або ви ввели неправильну адресу.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                    <Link href="/">
                        <Home className="mr-2 w-4 h-4" />
                        На головну
                    </Link>
                </Button>
            </div>
        </div>
    )
}