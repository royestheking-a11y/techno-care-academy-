import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Search,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";
import {
  getInstitutes,
  saveInstitute,
  updateInstitute,
  deleteInstitute,
  Institute
} from "../../utils/localStorage";

export function InstitutesManager() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState<Institute[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    website: "",
    image: "",
  });

  useEffect(() => {
    loadInstitutes();
  }, []);

  useEffect(() => {
    filterInstitutes();
  }, [institutes, searchQuery]);

  const loadInstitutes = async () => {
    try {
      const data = await getInstitutes();
      setInstitutes(data);
    } catch (error) {
      console.error("Failed to load institutes:", error);
      toast.error("Failed to load institutes");
    }
  };

  const filterInstitutes = () => {
    let filtered = [...institutes];

    if (searchQuery) {
      filtered = filtered.filter(
        (inst) =>
          inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inst.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (inst.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredInstitutes(filtered);
  };

  const handleAdd = async () => {
    try {
      const newInstitute: Institute = {
        id: `inst-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
      };

      await saveInstitute(newInstitute);
      setInstitutes([...institutes, newInstitute]);
      setShowAddModal(false);
      resetForm();
      toast.success("ইনস্টিটিউট যোগ করা হয়েছে");
    } catch (error) {
      console.error("Error adding institute:", error);
      toast.error("Error adding institute");
    }
  };

  const handleEdit = async () => {
    if (!selectedInstitute) return;

    try {
      await updateInstitute(selectedInstitute.id, formData);
      setInstitutes(institutes.map(i => i.id === selectedInstitute.id ? { ...i, ...formData } : i));
      setShowEditModal(false);
      setSelectedInstitute(null);
      resetForm();
      toast.success("ইনস্টিটিউট আপডেট করা হয়েছে");
    } catch (error) {
      console.error("Error updating institute:", error);
      toast.error("Error updating institute");
    }
  };

  const handleDelete = async () => {
    if (!selectedInstitute) return;

    try {
      await deleteInstitute(selectedInstitute.id);
      setInstitutes(institutes.filter(i => i.id !== selectedInstitute.id));
      setShowDeleteModal(false);
      setSelectedInstitute(null);
      toast.success("ইনস্টিটিউট মুছে ফেলা হয়েছে");
    } catch (error) {
      console.error("Error deleting institute:", error);
      toast.error("Error deleting institute");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      phone: "",
      website: "",
      image: "",
    });
  };

  const openEditModal = (inst: Institute) => {
    setSelectedInstitute(inst);
    setFormData({
      name: inst.name,
      location: inst.location,
      phone: inst.phone || "",
      website: inst.website || "",
      image: inst.image || "",
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl text-[#1A202C] flex items-center gap-3">
            <Building2 className="w-8 h-8 text-[#285046]" />
            ইনস্টিটিউট ব্যবস্থাপনা
          </h2>
          <p className="text-[#555555] mt-1">পলিটেকনিক ইনস্টিটিউট পরিচালনা করুন</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          নতুন ইনস্টিটিউট যোগ করুন
        </Button>
      </div>

      {/* Stats Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">মোট ইনস্টিটিউট</p>
            <p className="text-3xl text-[#1A202C]">{institutes.length}</p>
          </div>
        </div>
      </Card>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="ইনস্টিটিউট খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-2 focus:border-[#285046]"
          />
        </div>
      </Card>

      {/* Institutes Grid */}
      {filteredInstitutes.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl text-[#1A202C] mb-2">কোনো ইনস্টিটিউট পাওয়া যায়নি</h3>
          <p className="text-[#555555]">নতুন ইনস্টিটিউট যোগ করুন</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutes.map((inst) => (
            <Card
              key={inst.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#285046]/30"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {inst.image ? (
                  <img
                    src={inst.image}
                    alt={inst.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div>
                  <h4 className="text-[#1A202C] line-clamp-2">{inst.name}</h4>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[#555555]">
                    <MapPin className="w-4 h-4 text-[#285046] flex-shrink-0" />
                    <span className="line-clamp-1">{inst.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#555555]">
                    <Phone className="w-4 h-4 text-[#285046] flex-shrink-0" />
                    <span>{inst.phone}</span>
                  </div>
                  {inst.website && (
                    <div className="flex items-center gap-2 text-[#555555]">
                      <Globe className="w-4 h-4 text-[#285046] flex-shrink-0" />
                      <a
                        href={inst.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="line-clamp-1 hover:text-[#285046] transition-colors"
                      >
                        {inst.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    onClick={() => openEditModal(inst)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-[#285046] text-[#285046] hover:bg-[#285046] hover:text-white"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    সম্পাদনা
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedInstitute(inst);
                      setShowDeleteModal(true);
                    }}
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={showAddModal || showEditModal} onOpenChange={showAddModal ? setShowAddModal : setShowEditModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {showAddModal ? <Plus className="w-5 h-5 text-[#285046]" /> : <Edit2 className="w-5 h-5 text-[#285046]" />}
              {showAddModal ? "নতুন ইনস্টিটিউট যোগ করুন" : "ইনস্টিটিউট সম্পাদনা করুন"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>প্রতিষ্ঠান/নাম *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="যেমন: Dhaka Polytechnic Institute"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label>অবস্থান *</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="যেমন: Dhaka"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label>ফোন *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+880-xxx-xxxxxx"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label>ওয়েবসাইট</Label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.institute.edu.bd"
                className="border-2"
              />
            </div>

            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="ইনস্টিটিউটের ছবি (Optional)"
              placeholder="ইনস্টিটিউটের ছবি আপলোড করুন"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }}
            >
              বাতিল
            </Button>
            <Button
              onClick={showAddModal ? handleAdd : handleEdit}
              disabled={
                !formData.name ||
                !formData.location ||
                !formData.phone
              }
              className="bg-gradient-to-r from-[#285046] to-[#2F6057]"
            >
              {showAddModal ? (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  যোগ করুন
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  আপডেট করুন
                </>
              )}
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
            আপনি কি নিশ্চিত যে এই ইনস্টিটিউটটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
          </p>
          {selectedInstitute && (
            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <p className="text-sm text-red-900">{selectedInstitute.name}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              বাতিল
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              মুছে ফেলুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}