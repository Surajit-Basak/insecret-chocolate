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
import SignatureCollectionForm from "../_components/SignatureCollectionForm";

export default function NewSignatureCollectionPage() {
    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon" className="h-7 w-7">
                    <Link href="/admin/pages/home/signature-collections">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="text-lg font-semibold md:text-xl flex-1 shrink-0 whitespace-nowrap">
                    New Collection Item
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Create a New Collection Item</CardTitle>
                    <CardDescription>
                        Fill out the form to add a new item to the Signature Collections.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignatureCollectionForm />
                </CardContent>
            </Card>
        </div>
    );
}
