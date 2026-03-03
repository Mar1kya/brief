import { auth, signOut } from "@/auth"; 
import Link from "next/link";
import { ShieldUser, LogOut } from "lucide-react"; 
import { Button } from "@/components/ui/button";

export default async function Header() {
    const session = await auth();

    return (
        <header className="w-full sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
            <div className="container p-4 mx-auto flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                        Football Core
                    </Link>

                    <nav className="flex gap-4">
                        <Link href="/brief" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                            Бриф
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    {session?.user && session.user.role === "ADMIN" && (
                        <>
                            <Link
                                href="/admin"
                                title="Адмін панель"
                                className="flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-secondary/80"
                            >
                                <ShieldUser className="w-5 h-5" />
                            </Link>
                            <form action={async () => {
                                "use server";
                                await signOut({ redirectTo: "/" });
                            }}>
                                <Button variant="ghost" size="icon" className="flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-secondary/80">
                                    <LogOut className="w-5 h-5" />
                                </Button>
                            </form>
                        </>
                    )}
                    {!session?.user && (
                        <Link
                            href="/login"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"                        >
                            Увійти
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}