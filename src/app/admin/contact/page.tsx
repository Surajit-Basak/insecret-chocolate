import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function ContactSubmissionsPage() {
    const supabase = createSupabaseServerClient();
    const { data: submissions } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });

    return (
        <div className="flex flex-col gap-4 py-4">
            <h1 className="text-lg font-semibold md:text-xl">Contact & Enquiry Submissions</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Inbox</CardTitle>
                    <CardDescription>Messages from your website visitors and product enquiries.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Source / Message</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead className="hidden md:table-cell text-right">Submitted At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions?.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell>
                                            <div className="font-medium">{submission.name}</div>
                                            <div className="text-sm text-muted-foreground">{submission.email}</div>
                                            <div className="text-sm text-muted-foreground">{submission.whatsapp_number || submission.phone}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{submission.source}</div>
                                            <div className="text-sm text-muted-foreground">{submission.message}</div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {submission.quantity && <div><strong>Qty:</strong> {submission.quantity}</div>}
                                            {submission.occasion && <div><strong>Occasion:</strong> {submission.occasion}</div>}
                                            {submission.delivery_date && <div><strong>Date:</strong> {format(new Date(submission.delivery_date), "PPP")}</div>}
                                            {submission.instructions && <div className="text-muted-foreground whitespace-pre-wrap"><strong>Instr:</strong> {submission.instructions}</div>}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-right">
                                            {new Date(submission.created_at).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {submissions?.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No submissions yet.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
