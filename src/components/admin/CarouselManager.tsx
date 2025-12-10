import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";
import {
  getSlides,
  saveSlide,
  updateSlide,
  deleteSlide,
  saveAllSlides,
  Slide
} from "../../utils/localStorage";

export function CarouselManager() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    buttonText: "",
    buttonLink: "",
    isActive: true,
  });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      setLoading(true);
      const loadedSlides = await getSlides();
      const sortedSlides = loadedSlides.sort((a, b) => (a.order || 0) - (b.order || 0));
      setSlides(sortedSlides);
    } catch (error) {
      console.error("Error loading slides:", error);
      toast.error("স্লাইড লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const dispatchUpdate = () => {
    window.dispatchEvent(new Event("carousel-update"));
  };

  const handleAdd = async () => {
    try {
      const newSlide: Slide = {
        id: `slide-${Date.now()}`,
        ...formData,
        institute: formData.subtitle,
        order: slides.length + 1,
        createdAt: new Date().toISOString(),
      };

      await saveSlide(newSlide);

      toast.success("স্লাইড যোগ করা হয়েছে");
      setShowAddModal(false);
      resetForm();
      await loadSlides();
      dispatchUpdate();
    } catch (error) {
      console.error("Error adding slide:", error);
      toast.error("স্লাইড যোগ করতে সমস্যা হয়েছে");
    }
  };

  const handleEdit = async () => {
    if (!selectedSlide) return;

    try {
      await updateSlide(selectedSlide.id, {
        ...formData,
        institute: formData.subtitle
      });

      toast.success("স্লাইড আপডেট করা হয়েছে");
      setShowEditModal(false);
      setSelectedSlide(null);
      resetForm();
      await loadSlides();
      dispatchUpdate();
    } catch (error) {
      console.error("Error updating slide:", error);
      toast.error("স্লাইড আপডেট করতে সমস্যা হয়েছে");
    }
  };

  const handleDelete = async () => {
    if (!selectedSlide) return;

    try {
      await deleteSlide(selectedSlide.id);

      // Reorder locally then save all? No, just reload and maybe re-index if needed.
      // But preserving order logic:
      const remaining = slides.filter(s => s.id !== selectedSlide.id);
      const reordered = remaining.map((s, idx) => ({ ...s, order: idx + 1 }));
      await saveAllSlides(reordered);

      toast.success("স্লাইড মুছে ফেলা হয়েছে");
      setShowDeleteModal(false);
      setSelectedSlide(null);
      await loadSlides();
      dispatchUpdate();
    } catch (error) {
      console.error("Error deleting slide:", error);
      toast.error("স্লাইড মুছতে সমস্যা হয়েছে");
    }
  };

  const handleToggleActive = async (slideId: string) => {
    const slide = slides.find(s => s.id === slideId);
    if (slide) {
      try {
        await updateSlide(slideId, { isActive: !slide.isActive });
        toast.success("স্ট্যাটাস আপডেট হয়েছে");
        await loadSlides();
        dispatchUpdate();
      } catch (error) {
        console.error("Error toggling status:", error);
        toast.error("স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে");
      }
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    try {
      const newSlides = [...slides];
      // Swap
      const temp = newSlides[index];
      newSlides[index] = newSlides[index - 1];
      newSlides[index - 1] = temp;

      // Update orders
      const reorderedSlides = newSlides.map((slide, idx) => ({
        ...slide,
        order: idx + 1,
      }));

      // Optimistic update
      setSlides(reorderedSlides);

      await saveAllSlides(reorderedSlides);
      dispatchUpdate();
      toast.success("অর্ডার আপডেট হয়েছে");
    } catch (error) {
      console.error("Error reordering:", error);
      toast.error("ক্রম পরিবর্তন করতে সমস্যা হয়েছে");
      loadSlides(); // Revert on error
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === slides.length - 1) return;

    try {
      const newSlides = [...slides];
      // Swap
      const temp = newSlides[index];
      newSlides[index] = newSlides[index + 1];
      newSlides[index + 1] = temp;

      // Update orders
      const reorderedSlides = newSlides.map((slide, idx) => ({
        ...slide,
        order: idx + 1,
      }));

      // Optimistic update
      setSlides(reorderedSlides);

      await saveAllSlides(reorderedSlides);
      dispatchUpdate();
      toast.success("অর্ডার আপডেট হয়েছে");
    } catch (error) {
      console.error("Error reordering:", error);
      toast.error("ক্রম পরিবর্তন করতে সমস্যা হয়েছে");
      loadSlides(); // Revert on error
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image: "",
      buttonText: "",
      buttonLink: "",
      isActive: true,
    });
  };

  const openEditModal = (slide: Slide) => {
    setSelectedSlide(slide);
    setFormData({
      title: slide.title || "",
      subtitle: slide.subtitle || slide.institute || "",
      description: slide.description || "",
      image: slide.image,
      buttonText: slide.buttonText || "",
      buttonLink: slide.buttonLink || "",
      isActive: slide.isActive ?? true,
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex bg-gray-50 items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#285046]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl text-[#1A202C] flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-[#285046]" />
            হিরো ক্যারোসেল ব্যবস্থাপনা
          </h2>
          <p className="text-[#555555] mt-1">
            হোমপেজের স্লাইডার পরিচালনা করুন
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          নতুন স্লাইড যোগ করুন
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">মোট স্লাইড</p>
              <p className="text-3xl text-[#1A202C]">{slides.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">সক্রিয়</p>
              <p className="text-3xl text-[#1A202C]">
                {slides.filter((s) => s.isActive).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl">
              <EyeOff className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">নিষ্ক্রিয়</p>
              <p className="text-3xl text-[#1A202C]">
                {slides.filter((s) => !s.isActive).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Slides List */}
      {slides.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl text-[#1A202C] mb-2">কোনো স্লাইড নেই</h3>
          <p className="text-[#555555]">নতুন স্লাইড যোগ করুন</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <Card
              key={slide.id}
              className={`overflow-hidden transition-all duration-300 border-2 ${slide.isActive
                ? "border-green-200 bg-white"
                : "border-gray-200 bg-gray-50 opacity-75"
                }`}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Preview */}
                <div className="md:w-80 h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {slide.image ? (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          className={`${slide.isActive
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : "bg-gray-500"
                            } text-white border-0`}
                        >
                          {slide.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </Badge>
                        <Badge variant="outline">অর্ডার: {slide.order}</Badge>
                      </div>
                      <h3 className="text-xl text-[#1A202C] mb-1">
                        {slide.title}
                      </h3>
                      <p className="text-[#285046] mb-2">{slide.subtitle}</p>
                      <p className="text-sm text-[#555555] line-clamp-2">
                        {slide.description}
                      </p>
                    </div>

                    {/* Order Controls */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="border-[#285046] text-[#285046]"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === slides.length - 1}
                        className="border-[#285046] text-[#285046]"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${slide.id}`} className="text-sm">
                        সক্রিয় স্ট্যাটাস
                      </Label>
                      <Switch
                        id={`active-${slide.id}`}
                        checked={slide.isActive}
                        onCheckedChange={() => handleToggleActive(slide.id)}
                      />
                    </div>

                    <div className="flex-1"></div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => openEditModal(slide)}
                        size="sm"
                        variant="outline"
                        className="border-[#285046] text-[#285046] hover:bg-[#285046] hover:text-white"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        সম্পাদনা
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedSlide(slide);
                          setShowDeleteModal(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        মুছুন
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#285046]" />
              নতুন স্লাইড যোগ করুন
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>শিরোনাম *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="স্লাইডের শিরোনাম"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label>সাবটাইটেল *</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                placeholder="সাবটাইটেল"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label>বাটন অ্যাকশন *</Label>
              <Select
                value={formData.buttonLink}
                onValueChange={(value: string) => {
                  let text = "";
                  switch (value) {
                    case "#courses":
                      text = "কোর্স দেখুন";
                      break;
                    case "#live-classes":
                      text = "লাইভ ক্লাস দেখুন";
                      break;
                    case "#notes":
                      text = "নোটস দেখুন";
                      break;
                    case "#books":
                      text = "বই দেখুন";
                      break;
                    case "#signup":
                      text = "জয়েন করুন";
                      break;
                    default:
                      text = "বিস্তারিত দেখুন";
                  }
                  setFormData({ ...formData, buttonLink: value, buttonText: text });
                }}
              >
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="বাটন সিলেক্ট করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="#courses">কোর্স (Courses)</SelectItem>
                  <SelectItem value="#live-classes">লাইভ ক্লাস (Live Classes)</SelectItem>
                  <SelectItem value="#notes">নোটস (Notes)</SelectItem>
                  <SelectItem value="#books">বই (Books)</SelectItem>
                  <SelectItem value="#signup">জয়েন (Join/Login)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="স্লাইড ইমেজ *"
              aspectRatio={16 / 9}
              placeholder="স্লাইডের জন্য ছবি আপলোড করুন"
            />

            <div className="flex items-center gap-2">
              <Switch
                id="add-active"
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="add-active">সক্রিয় করুন</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              বাতিল
            </Button>
            <Button
              onClick={handleAdd}
              disabled={
                !formData.title ||
                !formData.subtitle ||
                !formData.image ||
                !formData.buttonText ||
                !formData.buttonLink
              }
              className="bg-gradient-to-r from-[#285046] to-[#2F6057]"
            >
              যোগ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-[#285046]" />
              স্লাইড সম্পাদনা করুন
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>শিরোনাম *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="স্লাইডের শিরোনাম"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label>সাবটাইটেল *</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                placeholder="সাবটাইটেল"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label>বাটন অ্যাকশন *</Label>
              <Select
                value={formData.buttonLink}
                onValueChange={(value: string) => {
                  let text = "";
                  switch (value) {
                    case "#courses":
                      text = "কোর্স দেখুন";
                      break;
                    case "#live-classes":
                      text = "লাইভ ক্লাস দেখুন";
                      break;
                    case "#notes":
                      text = "নোটস দেখুন";
                      break;
                    case "#books":
                      text = "বই দেখুন";
                      break;
                    case "#signup":
                      text = "জয়েন করুন";
                      break;
                    default:
                      text = "বিস্তারিত দেখুন";
                  }
                  setFormData({ ...formData, buttonLink: value, buttonText: text });
                }}
              >
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="বাটন সিলেক্ট করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="#courses">কোর্স (Courses)</SelectItem>
                  <SelectItem value="#live-classes">লাইভ ক্লাস (Live Classes)</SelectItem>
                  <SelectItem value="#notes">নোটস (Notes)</SelectItem>
                  <SelectItem value="#books">বই (Books)</SelectItem>
                  <SelectItem value="#signup">জয়েন (Join/Login)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="স্লাইড ইমেজ *"
              aspectRatio={16 / 9}
              placeholder="স্লাইডের জন্য ছবি আপলোড করুন"
            />

            <div className="flex items-center gap-2">
              <Switch
                id="edit-active"
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="edit-active">সক্রিয় করুন</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              বাতিল
            </Button>
            <Button
              onClick={handleEdit}
              disabled={
                !formData.title ||
                !formData.subtitle ||
                !formData.image ||
                !formData.buttonText ||
                !formData.buttonLink
              }
              className="bg-gradient-to-r from-[#285046] to-[#2F6057]"
            >
              আপডেট করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              নিশ্চিত করুন
            </DialogTitle>
          </DialogHeader>
          <p className="text-[#555555]">
            আপনি কি নিশ্চিত যে এই স্লাইডটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায়
            ফেরানো যাবে না।
          </p>
          {selectedSlide && (
            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <p className="text-sm text-red-900">{selectedSlide.title}</p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              বাতিল
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              মুছে ফেলুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
