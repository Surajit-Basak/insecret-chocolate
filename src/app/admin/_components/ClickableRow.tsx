'use client'

import { useRouter } from "next/navigation"
import { TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface ClickableRowProps {
    children: React.ReactNode;
    href: string;
    className?: string;
}

export default function ClickableRow({ children, href, className }: ClickableRowProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(href);
    };

    return (
        <TableRow onClick={handleClick} className={cn("cursor-pointer", className)}>
            {children}
        </TableRow>
    );
}
