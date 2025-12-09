"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Reply } from "lucide-react";
import { WorkRequest } from "@/types/request";
import { useToast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api";

export default function AdminRequestsPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [requests, setRequests] = useState<WorkRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState<WorkRequest | null>(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [sendingReply, setSendingReply] = useState(false);

    useEffect(() => {
        // Basic Client-side protection (Server API also verifies)
        if (!isAuthenticated) {
            // Allow time for auth check to resolve
            const timer = setTimeout(() => {
                if (!isAuthenticated) router.push("/admin/login");
            }, 1000);
            return () => clearTimeout(timer);
        }

        fetchRequests();
    }, [isAuthenticated, router]);

    async function fetchRequests() {
        try {
            const res = await apiFetch("/api/admin/requests");
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleReply() {
        if (!replyingTo || !replyMessage.trim()) return;

        setSendingReply(true);
        try {
            const res = await apiFetch("/api/admin/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestId: replyingTo.id,
                    userEmail: replyingTo.email,
                    userName: replyingTo.name,
                    replyMessage,
                    originalTitle: replyingTo.title,
                }),
            });

            if (!res.ok) throw new Error("Failed to send reply");

            toast({ title: "Reply Sent", description: "Email sent successfully." });
            setReplyingTo(null);
            setReplyMessage("");
            fetchRequests(); // Refresh list to update status
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "Could not send reply." });
        } finally {
            setSendingReply(false);
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 pt-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold">Work Requests</h1>
                <Badge variant="outline" className="text-lg px-4 py-1">
                    Total: {requests.length}
                </Badge>
            </div>

            <div className="rounded-md border bg-card/50 backdrop-blur-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell>
                                        {req.status === "pending" ? (
                                            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Pending</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Replied</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{format(new Date(req.createdAt), "MMM d, yyyy")}</TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <div className="font-medium">{req.title}</div>
                                        <div className="text-sm text-muted-foreground truncate">{req.description}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{req.name}</div>
                                        <div className="text-xs text-muted-foreground">{req.email}</div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setReplyingTo(req)}
                                            className="gap-2"
                                        >
                                            <Reply className="h-4 w-4" /> Reply
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Reply Dialog - Moved outside the table for better performance and z-index handling */}
            <Dialog open={!!replyingTo} onOpenChange={(open) => !open && setReplyingTo(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Reply to {replyingTo?.email}</DialogTitle>
                        <DialogDescription>
                            Write a response to &quot;{replyingTo?.title}&quot;. This will be emailed to the user.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="bg-muted p-3 rounded-md text-sm italic border-l-2 border-primary max-h-[100px] overflow-y-auto">
                            &quot;{replyingTo?.description}&quot;
                        </div>
                        <Textarea
                            id="reply"
                            placeholder="Type your reply here..."
                            className="min-h-[150px]"
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReplyingTo(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleReply} disabled={sendingReply}>
                            {sendingReply && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
