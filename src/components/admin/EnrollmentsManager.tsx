import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Trash2, Eye, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  getEnrollments,
  updateEnrollment,
  deleteEnrollment,
  Enrollment
} from "../../utils/localStorage";

export function EnrollmentsManager() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await getEnrollments();
      // Sort by newest first
      const sorted = data.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setEnrollments(sorted);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast.error("Failed to fetch enrollments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: "pending" | "confirmed" | "rejected") => {
    try {
      await updateEnrollment(id, { status });
      toast.success(`Enrollment status updated to ${status}`);

      // Update local state
      setEnrollments(enrollments.map(e => e.id === id ? { ...e, status } : e));
      if (selectedEnrollment && selectedEnrollment.id === id) {
        setSelectedEnrollment({ ...selectedEnrollment, status });
      }
    } catch (error) {
      console.error("Error updating enrollment:", error);
      toast.error("Failed to update enrollment");
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteEnrollment(deleteId);
      toast.success("Enrollment deleted successfully");

      setEnrollments(enrollments.filter(e => e.id !== deleteId));

      if (selectedEnrollment && selectedEnrollment.id === deleteId) {
        setViewDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      toast.error("Failed to delete enrollment");
    } finally {
      setDeleteId(null);
    }
  };

  const handleView = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    const studentName = enrollment.studentName || 'Learner';
    const courseTitle = enrollment.courseTitle || enrollment.courseName || 'Course';
    const phone = enrollment.studentPhone || '';

    setConfirmationMessage(
      `প্রিয় ${studentName},\n\nআপনার "${courseTitle}" কোর্সে ভর্তির আবেদন গৃহীত হয়েছে। অনুগ্রহ করে নিম্নলিখিত তথ্য অনুযায়ী আমাদের অফিসে আসুন:\n\nঠিকানা: Techno Care Academy\nসময়: সকাল ১০টা থেকে বিকাল ৫টা\nপ্রয়োজনীয় কাগজপত্র: শিক্ষার্থীর ছবি, NID/জন্ম সনদ\n\nযোগাযোগ: ${phone}\n\nধন্যবাদ\nTechno Care Academy`
    );
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="w-3 h-3 mr-1" />Processing</Badge>;
    }
  };

  if (loading && enrollments.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#285046]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#1A202C]">Course Enrollments</h2>
          <p className="text-[#555555]">Manage student course enrollments</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-4 py-2">
            Total: {enrollments.length}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 bg-yellow-50">
            Processing: {enrollments.filter(e => e.status === "pending").length}
          </Badge>
        </div>
      </div>

      <Card className="rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-[#555555] py-8">
                  No enrollments found
                </TableCell>
              </TableRow>
            ) : (
              enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>
                    {enrollment.createdAt && !isNaN(new Date(enrollment.createdAt).getTime())
                      ? new Date(enrollment.createdAt).toLocaleDateString('en-GB')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{enrollment.studentName || 'N/A'}</TableCell>
                  <TableCell>{enrollment.studentPhone || 'N/A'}</TableCell>
                  <TableCell className="max-w-xs truncate">{enrollment.courseTitle || enrollment.courseName || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(enrollment)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => confirmDelete(enrollment.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enrollment Details</DialogTitle>
            <DialogDescription>
              Review and manage this enrollment
            </DialogDescription>
          </DialogHeader>

          {selectedEnrollment && (
            <div className="space-y-4">
              <Card className="p-4 bg-gradient-to-r from-[#285046] to-[#2F6057] text-white">
                <h3 className="text-xl mb-2">{selectedEnrollment.courseTitle || selectedEnrollment.courseName}</h3>
                <p className="text-sm opacity-90">Duration: {selectedEnrollment.courseDuration || 'N/A'}</p>
                <p className="text-sm opacity-90">Price: {selectedEnrollment.coursePrice || 'N/A'}</p>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Student Name</Label>
                  <p className="text-[#1A202C] mt-1">{selectedEnrollment.studentName || 'N/A'}</p>
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <p className="text-[#1A202C] mt-1">{selectedEnrollment.studentPhone || 'N/A'}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedEnrollment.status)}</div>
                </div>
                <div className="col-span-2">
                  <Label>Enrollment Date</Label>
                  <p className="text-[#1A202C] mt-1">
                    {selectedEnrollment.createdAt && !isNaN(new Date(selectedEnrollment.createdAt).getTime())
                      ? new Date(selectedEnrollment.createdAt).toLocaleString('en-GB')
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confirmation Message (Manual - Copy & Send via WhatsApp/SMS)</Label>
                <Textarea
                  value={confirmationMessage}
                  onChange={(e) => setConfirmationMessage(e.target.value)}
                  rows={4}
                  className="font-bengali"
                />
                <p className="text-sm text-[#555555]">
                  Copy this message and send it to the student via WhatsApp or SMS
                </p>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between items-center bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                  Change Status:
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedEnrollment.status === "pending" ? "default" : "outline"}
                    onClick={() => handleStatusUpdate(selectedEnrollment.id, "pending")}
                    className={selectedEnrollment.status === "pending" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}
                    disabled={selectedEnrollment.status === "pending"}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Pending
                  </Button>
                  <Button
                    variant={selectedEnrollment.status === "rejected" ? "default" : "outline"}
                    onClick={() => handleStatusUpdate(selectedEnrollment.id, "rejected")}
                    className={selectedEnrollment.status === "rejected" ? "bg-red-500 hover:bg-red-600 text-white" : "text-red-600 border-red-600 hover:bg-red-50"}
                    disabled={selectedEnrollment.status === "rejected"}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    variant={selectedEnrollment.status === "confirmed" ? "default" : "outline"}
                    onClick={() => handleStatusUpdate(selectedEnrollment.id, "confirmed")}
                    className={selectedEnrollment.status === "confirmed" ? "bg-green-500 hover:bg-green-600 text-white" : "text-green-600 border-green-600 hover:bg-green-50"}
                    disabled={selectedEnrollment.status === "confirmed"}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Enrollment?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the enrollment record.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
