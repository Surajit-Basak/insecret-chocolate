
import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Package, MessageSquareQuote, Mails } from 'lucide-react'
import ClearDataButton from './_components/ClearDataButton'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default async function AdminDashboard() {
  const supabase = createSupabaseServerClient()

  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: blogPostCount } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true });
  const { count: testimonialCount } = await supabase.from('testimonials').select('*', { count: 'exact', head: true });
  const { count: contactSubmissionCount } = await supabase.from('contact_submissions').select('*', { count: 'exact', head: true });

  const { data: recentSubmissions } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5);
  const { data: recentProducts } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(5);

  return (
    <div className="flex flex-col gap-4 py-4">
        <h1 className="text-lg font-semibold md:text-xl">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{productCount ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                Total products available
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
                <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{testimonialCount ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                Total testimonials
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Contact Submissions
                </CardTitle>
                <Mails className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{contactSubmissionCount ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                Total form submissions
                </p>
            </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Contact Submissions</CardTitle>
                        <CardDescription>The latest messages from your visitors.</CardDescription>
                    </div>
                    <Button asChild size="sm">
                        <Link href="/admin/contact">View All</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden sm:table-cell">Message</TableHead>
                                <TableHead className="text-right hidden sm:table-cell">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentSubmissions?.map(submission => (
                                <TableRow key={submission.id}>
                                    <TableCell>
                                        <div className="font-medium">{submission.name}</div>
                                        <div className="text-sm text-muted-foreground sm:hidden">{submission.message}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell truncate max-w-[200px]">{submission.message}</TableCell>
                                    <TableCell className="text-right text-xs text-muted-foreground hidden sm:table-cell">{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card>
              <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>
                      This action will permanently delete all sample data.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <ClearDataButton />
              </CardContent>
          </Card>
        </div>
        
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Products</CardTitle>
                    <CardDescription>Your latest and greatest creations.</CardDescription>
                </div>
                <Button asChild size="sm">
                    <Link href="/admin/products">View All</Link>
                </Button>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="hidden md:table-cell">Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentProducts?.map(product => (
                            <TableRow key={product.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image
                                        alt={product.title}
                                        className="aspect-square rounded-md object-cover"
                                        height="64"
                                        src={product.image_url || "https://placehold.co/64x64.png"}
                                        width="64"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{product.title}</TableCell>
                                <TableCell className="hidden md:table-cell">₹{product.price}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/admin/products/${product.slug}`}>Edit</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  )
}
