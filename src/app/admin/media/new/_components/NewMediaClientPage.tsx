'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import MediaForm from "../../../_components/MediaForm";

export default function NewMediaClientPage() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <div className="flex flex-col sm:gap-4 sm:py-4">
                <div className="flex items-center gap-4 mb-4">
                    <Button asChild variant="outline" size="icon" className="h-7 w-7">
                        <Link href="/admin/media">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        New Media Item
                    </h1>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Create a New Media Item</CardTitle>
                        <CardDescription>
                            Upload an image and provide details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MediaForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
