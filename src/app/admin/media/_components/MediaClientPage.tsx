
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ImageOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CopyToClipboardButton from "./CopyToClipboardButton";
import { type Media } from "@/lib/types";

export default function MediaClientPage({ mediaItems }: { mediaItems: Media[] }) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">Media Library</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/media/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Add Media</span>
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Media</CardTitle>
          <CardDescription>
            Manage your uploaded media files. Click an image to edit its details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mediaItems && mediaItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {mediaItems.map((item) => (
                <Card key={item.id} className="overflow-hidden group flex flex-col">
                  <Link href={`/admin/media/${item.id}`} className="group">
                    <div className="relative w-full aspect-square">
                      <Image
                        src={item.url}
                        alt={item.alt_text ?? 'Media item'}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 12.5vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </Link>
                  <div className="p-2 border-t bg-card flex-grow flex flex-col justify-between">
                    <p className="text-xs font-medium text-foreground truncate mb-2">{item.name}</p>
                    <CopyToClipboardButton textToCopy={item.url} />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
              <ImageOff className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-200">No media files</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new media file.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
