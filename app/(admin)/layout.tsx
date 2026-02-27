import Header from "@/components/layout/header";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="grow container mx-auto px-4">
                {children}
            </main>
        </div>
    );
}