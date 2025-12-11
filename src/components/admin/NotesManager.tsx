import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
  DialogDescription,
} from "../ui/dialog";
import {
  FileText,
  Image as ImageIcon,
  Presentation,
  Plus,
  Search,
  Eye,
  Download,
  Trash2,
  Edit2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";
import { FileUpload } from "./FileUpload";
import {
  getNotes,
  saveNote,
  updateNote,
  deleteNote,
  Note
} from "../../utils/localStorage";
import { isCloudinaryUrl } from "../../utils/cloudinary";
import api from "../../services/api";

export function NotesManager() {
  const [activeTab, setActiveTab] = useState("pdf");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [inputType, setInputType] = useState<'url' | 'upload'>('url');

  // Form Data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    thumbnail: "",
    courseId: "", // Input as string, convert to number
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error("Error loading notes:", error);
      toast.error("নোটস লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      fileUrl: "",
      thumbnail: "",
      courseId: "",
    });
  };

  const handleAdd = async () => {
    try {
      if (!formData.title || !formData.courseId) {
        toast.error("আবশ্যক তথ্য পূরণ করুন");
        return;
      }

      if (inputType === 'url' && !formData.fileUrl) {
        toast.error("URL প্রদান করুন");
        return;
      }

      if (inputType === 'upload' && !selectedFile) {
        toast.error("ফাইল নির্বাচন করুন");
        return;
      }

      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('courseId', formData.courseId);
      uploadData.append('fileType', activeTab);
      uploadData.append('thumbnail', formData.thumbnail || (activeTab === 'pdf' ? "https://placehold.co/150x200/png/white?text=PDF" : ""));

      if (inputType === 'upload' && selectedFile) {
        uploadData.append('file', selectedFile);
      } else {
        uploadData.append('fileUrl', formData.fileUrl);
      }

      setLoading(true);
      await api.post('/notes/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("নোট যোগ করা হয়েছে");
      setShowAddModal(false);
      resetForm();
      setSelectedFile(null);
      loadNotes();
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("নোট যোগ করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedNote) return;

    try {
      const updateData = new FormData();
      updateData.append('title', formData.title);
      updateData.append('description', formData.description);
      updateData.append('courseId', formData.courseId);
      updateData.append('thumbnail', formData.thumbnail);

      if (inputType === 'upload' && selectedFile) {
        updateData.append('file', selectedFile);
      } else if (inputType === 'url') {
        updateData.append('fileUrl', formData.fileUrl);
      }

      setLoading(true);
      await api.put(`/notes/${selectedNote.id}`, updateData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("নোট আপডেট করা হয়েছে");
      setShowEditModal(false);
      setSelectedNote(null);
      resetForm();
      setSelectedFile(null);
      loadNotes();
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("নোট আপডেট করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNote) return;

    try {
      await deleteNote(selectedNote.id);
      toast.success("নোট মুছে ফেলা হয়েছে");
      setShowDeleteModal(false);
      setSelectedNote(null);
      loadNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("নোট মুছতে সমস্যা হয়েছে");
    }
  };

  const openEditModal = (note: Note) => {
    setSelectedNote(note);
    setFormData({
      title: note.title,
      description: note.description,
      fileUrl: note.fileUrl,
      thumbnail: note.thumbnail || "",
      courseId: note.courseId.toString(),
    });
    setInputType(isCloudinaryUrl(note.fileUrl) ? 'upload' : 'url');
    setShowEditModal(true);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.fileType === activeTab &&
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = () => {
    switch (activeTab) {
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "image":
        return <ImageIcon className="w-5 h-5" />;
      case "pptx":
        return <Presentation className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl text-[#1A202C] flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#285046]" />
            নোটস এবং রিসোর্স
          </h2>
          <p className="text-[#555555] mt-1">
            স্টাডি মেটেরিয়ালস আপলোড এবং ম্যানেজ করুন
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setInputType('url');
            setShowAddModal(true);
          }}
          className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          নতুন নোট যোগ করুন
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">মোট PDF</p>
              <p className="text-3xl text-[#1A202C]">
                {notes.filter((n) => n.fileType === "pdf").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">মোট ছবি</p>
              <p className="text-3xl text-[#1A202C]">
                {notes.filter((n) => n.fileType === "image").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl">
              <Presentation className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">মোট স্লাইড</p>
              <p className="text-3xl text-[#1A202C]">
                {notes.filter((n) => n.fileType === "pptx").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-2 border-gray-200">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <TabsList className="bg-gray-100 p-1">
                <TabsTrigger
                  value="pdf"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#285046] data-[state=active]:shadow-sm"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  PDF নোটস
                </TabsTrigger>
                <TabsTrigger
                  value="image"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#285046] data-[state=active]:shadow-sm"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  লেকচার শিট
                </TabsTrigger>
                <TabsTrigger
                  value="pptx"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#285046] data-[state=active]:shadow-sm"
                >
                  <Presentation className="w-4 h-4 mr-2" />
                  প্রেজেন্টেশন
                </TabsTrigger>
              </TabsList>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-200 focus:border-[#285046] focus:ring-[#285046]"
                />
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {getIcon()}
                  </div>
                  <h3 className="text-lg text-[#1A202C] mb-1">
                    কোনো নোট পাওয়া যায়নি
                  </h3>
                  <p className="text-[#555555]">
                    নতুন নোট বা রিসোর্স যোগ করুন
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredNotes.map((note) => (
                    <Card
                      key={note.id}
                      className="group hover:shadow-lg transition-all duration-300 border-2 border-gray-100 overflow-hidden"
                    >
                      <div className="flex items-start gap-4 p-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#285046] group-hover:text-white transition-colors">
                          {activeTab === "pdf" && <FileText className="w-6 h-6" />}
                          {activeTab === "image" && (
                            note.thumbnail ? (
                              <img src={note.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />
                            ) : <ImageIcon className="w-6 h-6" />
                          )}
                          {activeTab === "pptx" && <Presentation className="w-6 h-6" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-semibold text-[#1A202C] truncate mb-1">
                            {note.title}
                          </h4>
                          <p className="text-xs text-[#555555] line-clamp-2 mb-2">
                            {note.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>
                              Course ID: {note.courseId}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#285046]">
                          <Download className="w-4 h-4 mr-2" />
                          ডাউনলোড
                        </Button>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-[#285046]"
                            onClick={() => openEditModal(note)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                            onClick={() => {
                              setSelectedNote(note);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog
        open={showAddModal || showEditModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddModal(false);
            setShowEditModal(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {showAddModal ? (
                <>
                  <Plus className="w-5 h-5 text-[#285046]" />
                  নতুন নোট যোগ করুন
                </>
              ) : (
                <>
                  <Edit2 className="w-5 h-5 text-[#285046]" />
                  নোট সম্পাদনা করুন
                </>
              )}
            </DialogTitle>
            <div className="sr-only">
              <DialogDescription>
                {showAddModal ? "নতুন নোট তৈরির ফর্ম" : "নোট সম্পাদনার ফর্ম"}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>শিরোনাম *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="নোটের শিরোনাম"
              />
            </div>

            <div className="space-y-2">
              <Label>কোর্স ID *</Label>
              <Input
                type="number"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                placeholder="কোর্সের আইডি"
              />
            </div>

            <div className="space-y-2">
              <Label>বিবরণ</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="নোট সম্পর্কে বিস্তারিত..."
              />
            </div>

            <div className="space-y-3">
              <Label>ফাইল সোর্স *</Label>
              <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setInputType('url')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${inputType === 'url'
                    ? 'bg-white text-[#285046] shadow-sm'
                    : 'text-gray-500 hover:text-[#285046]'
                    }`}
                >
                  লিংক / URL
                </button>
                <button
                  type="button"
                  onClick={() => setInputType('upload')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${inputType === 'upload'
                    ? 'bg-white text-[#285046] shadow-sm'
                    : 'text-gray-500 hover:text-[#285046]'
                    }`}
                >
                  ফাইল আপলোড
                </button>
              </div>

              {inputType === 'url' ? (
                <div className="space-y-2">
                  <Input
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    placeholder={activeTab === 'pptx' ? "Google Slides link..." : "Drive link / URL..."}
                  />
                  <p className="text-xs text-gray-500">
                    Direct download link বা view link ব্যবহার করুন
                  </p>
                </div>
              ) : (
                <FileUpload
                  value={formData.fileUrl}
                  onChange={(url) => setFormData({ ...formData, fileUrl: url })}
                  onFileSelect={setSelectedFile}
                  fileType={activeTab as 'pdf' | 'image' | 'pptx'}
                  label="ফাইল আপলোড করুন"
                />
              )}
            </div>

            {activeTab === 'image' && (
              <ImageUpload
                value={formData.thumbnail}
                onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                label="থাম্বনেইল / ছবি"
              />
            )}
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
              className="bg-gradient-to-r from-[#285046] to-[#2F6057]"
              disabled={!formData.title || !formData.fileUrl || !formData.courseId}
            >
              {showAddModal ? "যোগ করুন" : "আপডেট করুন"}
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
            <DialogDescription>
              নোট মুছে ফেলার নিশ্চিতকরণ
            </DialogDescription>
          </DialogHeader>
          <p className="text-[#555555]">
            আপনি কি নিশ্চিত যে এই নোটটি মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।
          </p>
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