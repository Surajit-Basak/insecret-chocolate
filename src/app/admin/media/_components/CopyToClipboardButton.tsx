'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

export default function CopyToClipboardButton({ textToCopy }: { textToCopy: string }) {
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            toast({ title: "Copied!", description: "The link has been copied to your clipboard." });
        }).catch(err => {
            toast({ variant: "destructive", title: "Failed to copy", description: "Could not copy link to clipboard." });
        });
    };

    return (
        <Button variant="outline" size="sm" onClick={handleCopy} className="w-full">
            <Copy className="mr-2 h-3 w-3" />
            Copy Link
        </Button>
    );
}
