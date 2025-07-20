'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

interface EditButtonProps {
    href: string;
}

export default function EditButton({ href }: EditButtonProps) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.stopPropagation();
    }
    
    return (
        <Button asChild variant="outline" size="sm" onClick={(e: any) => e.stopPropagation()}>
            <Link href={href} onClick={handleClick}>Edit</Link>
        </Button>
    )
}
