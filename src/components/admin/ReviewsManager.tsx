import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import {
  Star,
  Plus,
  Edit2, // Keep Edit2 if needed for future
  Trash2,
  Search,
  CheckCircle,
  Clock,
  User,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";
import {
  Review,
  getReviews,
  saveReview,
  updateReviewStatus,
  deleteReview
} from "../../utils/localStorage";

export function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Form state for Manual Add (Admin)
  const [formData, setFormData] = useState({
    userName: "",
    userAvatar: "",
    targetName: "",
    targetType: "course" as "course" | "teacher" | "class",
    rating: 5,
    comment: "",
    status: "approved" as "approved" | "pending" | "hidden",
  });

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchQuery, filterStatus]);

  const loadReviews = async () => {
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      toast.error("Failed to load reviews");
    }
  };

  const filterReviews = () => {
    let filtered = [...reviews];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.userName.toLowerCase().includes(query) ||
          review.targetName.toLowerCase().includes(query) ||
          review.comment.toLowerCase().includes(query)
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((review) => review.status === filterStatus);
    }

    setFilteredReviews(filtered);
  };

  const handleStatusUpdate = async (id: string, status: "approved" | "hidden") => {
    try {
      const success = await updateReviewStatus(id, status);
      if (success) {
        toast.success(status === "approved" ? "রিভিউ অনুমোদন করা হয়েছে" : "রিভিউ হাইড করা হয়েছে");
        // Update local state
        setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
      } else {
        toast.error("আপডেট করতে ব্যর্থ হয়েছে");
      }
    } catch (error) {
      console.error("Error updating review status:", error);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!selectedReview) return;
    try {
      const success = await deleteReview(selectedReview.id);
      if (success) {
        toast.success("রিভিউ ডিলিট করা হয়েছে");
        setReviews(reviews.filter(r => r.id !== selectedReview.id));
        setShowDeleteModal(false);
        setSelectedReview(null);
      } else {
        toast.error("ডিলিট করতে ব্যর্থ হয়েছে");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Something went wrong");
    }
  };

  const handleAdd = async () => {
    try {
      const newReviewData = {
        userId: `admin-added-${Date.now()}`,
        userName: formData.userName,
        userAvatar: formData.userAvatar,
        targetId: `manual-${Date.now()}`,
        targetType: formData.targetType,
        targetName: formData.targetName,
        rating: formData.rating,
        comment: formData.comment,
      };

      const newReview = await saveReview(newReviewData);

      // If admin selected "approved" or "hidden", update it immediately because saveReview defaults to "pending"
      if (formData.status !== "pending") {
        await updateReviewStatus(newReview.id, formData.status as "approved" | "hidden");
        newReview.status = formData.status;
      }

      setReviews([newReview, ...reviews]);
      setShowAddModal(false);
      resetForm();
      toast.success("রিভিউ সফলভাবে যোগ করা হয়েছে");
    } catch (e) {
      console.error("Error adding review:", e);
      toast.error("Error creating review");
    }
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      userAvatar: "",
      targetName: "",
      targetType: "course",
      rating: 5,
      comment: "",
      status: "approved",
    });
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl text-[#1A202C] flex items-center gap-3">
            <Star className="w-8 h-8 text-[#285046]" />
            রিভিউ ব্যবস্থাপনা
          </h2>
          <p className="text-[#555555] mt-1">সমস্ত ব্যবহারকারীর রিভিউ পরিচালনা করুন</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            নতুন রিভিউ যোগ করুন (Admin)
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><Star className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-600">মোট রিভিউ</p>
              <h3 className="text-2xl font-bold text-gray-800">{reviews.length}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-yellow-50 border-yellow-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg"><Clock className="w-5 h-5 text-yellow-600" /></div>
            <div>
              <p className="text-sm text-gray-600">অপেক্ষমান</p>
              <h3 className="text-2xl font-bold text-gray-800">{reviews.filter(r => r.status === 'pending').length}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-green-50 border-green-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-600">অনুমোদিত</p>
              <h3 className="text-2xl font-bold text-gray-800">{reviews.filter(r => r.status === 'approved').length}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-[200px] bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">সব (All)</SelectItem>
            <SelectItem value="pending">অপেক্ষমান (Pending)</SelectItem>
            <SelectItem value="approved">অনুমোদিত (Approved)</SelectItem>
            <SelectItem value="hidden">লুকানো (Hidden)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Review List */}
      <div className="grid gap-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
            কোনো রিভিউ পাওয়া যায়নি
          </div>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="p-4 flex flex-col md:flex-row gap-4 items-start">
              {/* User Info */}
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  {review.userAvatar ? <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-gray-500" />}
                </div>
                <div>
                  <h4 className="font-medium text-[#1A202C]">{review.userName}</h4>
                  <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {renderStars(review.rating)}
                  <Badge variant="outline" className="text-xs">
                    {review.targetType === 'course' ? 'কোর্স' : review.targetType === 'teacher' ? 'শিক্ষক' : 'ক্লাস'}: {review.targetName}
                  </Badge>
                  <Badge className={`${review.status === 'approved' ? 'bg-green-500' : review.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'} text-white border-0`}>
                    {review.status === 'approved' ? 'Approved' : review.status === 'pending' ? 'Pending' : 'Hidden'}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-start md:self-center">
                {review.status === 'pending' && (
                  <Button size="sm" onClick={() => handleStatusUpdate(review.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white" title="Approve">
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                )}
                {review.status !== 'hidden' ? (
                  <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(review.id, 'hidden')} title="Hide">
                    <EyeOff className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(review.id, 'approved')} title="Unhide">
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={() => { setSelectedReview(review); setShowDeleteModal(true); }} title="Delete">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>নতুন রিভিউ যোগ করুন</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>ব্যবহারকারীর নাম</Label>
              <Input value={formData.userName} onChange={e => setFormData({ ...formData, userName: e.target.value })} placeholder="নাম" />
            </div>
            <div className="space-y-2">
              <Label>বিষয় (Target Name)</Label>
              <Input value={formData.targetName} onChange={e => setFormData({ ...formData, targetName: e.target.value })} placeholder="কোর্স বা শিক্ষকের নাম" />
            </div>
            <div className="space-y-2">
              <Label>ধরণ</Label>
              <Select value={formData.targetType} onValueChange={(v: any) => setFormData({ ...formData, targetType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="course">কোর্স</SelectItem>
                  <SelectItem value="teacher">শিক্ষক</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>রেটিং</Label>
              <Select value={String(formData.rating)} onValueChange={(v: string) => setFormData({ ...formData, rating: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Star</SelectItem>
                  <SelectItem value="4">4 Star</SelectItem>
                  <SelectItem value="3">3 Star</SelectItem>
                  <SelectItem value="2">2 Star</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>মন্তব্য</Label>
              <Textarea value={formData.comment} onChange={e => setFormData({ ...formData, comment: e.target.value })} placeholder="Write a review..." />
            </div>

            <Button onClick={handleAdd} className="w-full bg-[#285046]">যোগ করুন</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Review?</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete this review? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
