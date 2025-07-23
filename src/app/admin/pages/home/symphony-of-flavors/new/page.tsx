import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SymphonyOfFlavorsForm from "../_components/SymphonyOfFlavorsForm";

export default function NewSymphonyOfFlavorsPage() {
    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon" className="h-7 w-7">
                    <Link href="/admin/pages/home/symphony-of-flavors">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="text-lg font-semibold md:text-xl flex-1 shrink-0 whitespace-nowrap">
                    New Flavor Item
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Create a New Flavor Item</CardTitle>
                    <CardDescription>
                        Fill out the form to add a new item to the Symphony of Flavors section.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SymphonyOfFlavorsForm />
                </CardContent>
            </Card>
        </div>
    );
}
