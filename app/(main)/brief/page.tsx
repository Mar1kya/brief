import { BriefForm } from "@/components/brief/brief-form";

export const metadata = {
    title: "Сторінка Бриф",
    description: "Сторінка Брифу на розробку футбольного порталу"
}

export default function BriefPage() {
    return <div className="flex justify-center">
        <BriefForm />
    </div>
}