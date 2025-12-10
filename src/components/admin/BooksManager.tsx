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
import { Search, Plus, Edit2, Trash2, BookOpen, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";
import {
  getBooks,
  saveBook,
  updateBook,
  deleteBook,
  Book
} from "../../utils/localStorage";

export function BooksManager() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    originalPrice: "",
    discount: "20",
    image: "",
    inStock: true,
    description: "",
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error("Error loading books:", error);
      toast.error("বই লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      if (!formData.title || !formData.author || !formData.price || !formData.image) {
        toast.error("অনুগ্রহ করে সব তথ্য পূরণ করুন");
        return;
      }

      await saveBook({
        ...formData,
        id: Date.now(), // This might be ignored by backend if it generates IDs
      });

      toast.success("বই যোগ করা হয়েছে");
      setShowAddModal(false);
      resetForm();
      loadBooks();
    } catch (error) {
      console.error("Error adding book:", error);
      toast.error("বই যোগ করতে সমস্যা হয়েছে");
    }
  };

  const handleEdit = async () => {
    if (!selectedBook) return;

    try {
      await updateBook(selectedBook.id, formData);
      toast.success("বই আপডেট করা হয়েছে");
      setShowEditModal(false);
      setSelectedBook(null);
      resetForm();
      loadBooks();
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("বই আপডেট করতে সমস্যা হয়েছে");
    }
  };

  const handleDelete = async () => {
    if (!selectedBook) return;

    try {
      await deleteBook(selectedBook.id);
      toast.success("বই মুছে ফেলা হয়েছে");
      setShowDeleteModal(false);
      setSelectedBook(null);
      loadBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("বই মুছতে সমস্যা হয়েছে");
    }
  };

  const handleStatusToggle = async (book: Book) => {
    try {
      await updateBook(book.id, { inStock: !book.inStock });
      toast.success("স্ট্যাটাস পরিবর্তন করা হয়েছে");
      loadBooks();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      price: "",
      originalPrice: "",
      discount: "20",
      image: "",
      inStock: true,
      description: "",
    });
  };

  const openEditModal = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price.toString(),
      originalPrice: book.originalPrice?.toString() || "",
      discount: book.discount.toString(),
      image: book.image,
      inStock: book.inStock,
      description: book.description || "",
    });
    setShowEditModal(true);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
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
            <BookOpen className="w-8 h-8 text-[#285046]" />
            বই ব্যবস্থাপনা
          </h2>
          <p className="text-[#555555] mt-1">
            সমস্ত বইয়ের তালিকা এবং স্টক ম্যানেজমেন্ট
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
          নতুন বই যোগ করুন
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">মোট বই</p>
              <p className="text-3xl text-[#1A202C]">{books.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">স্টকে আছে</p>
              <p className="text-3xl text-[#1A202C]">
                {books.filter((b) => b.inStock).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">স্টক আউট</p>
              <p className="text-3xl text-[#1A202C]">
                {books.filter((b) => !b.inStock).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 border-2 border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="বই বা লেখকের নাম দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-lg py-6"
          />
        </div>
      </Card>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl text-[#1A202C] mb-2">কোনো বই পাওয়া যায়নি</h3>
          <p className="text-[#555555]">নতুন বই যোগ করুন</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className={`overflow-hidden transition-all duration-300 hover:shadow-xl border-2 ${book.inStock ? "border-green-100" : "border-red-100 opacity-75"
                }`}
            >
              <div className="flex flex-col h-full">
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  {!book.inStock && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg px-4 py-1">
                        স্টক আউট
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/90 text-[#285046] hover:bg-white">
                      ৳{book.price}
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 p-4">
                  <h3 className="text-xl font-bold text-[#1A202C] mb-1 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-[#555555] mb-2">{book.author}</p>

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                      {book.discount}% ছাড়
                    </p>
                    {book.originalPrice && (
                      <p className="text-sm text-gray-400 line-through">
                        ৳{book.originalPrice}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {book.description}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border-t flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`stock-${book.id}`} className="text-xs cursor-pointer">
                      স্টক স্ট্যাটাস
                    </Label>
                    <Switch
                      id={`stock-${book.id}`}
                      checked={book.inStock}
                      onCheckedChange={() => handleStatusToggle(book)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(book)}
                      className="text-[#285046] border-[#285046] hover:bg-[#285046] hover:text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedBook(book);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
              নতুন বই যোগ করুন
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>বইয়ের নাম *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="বইয়ের নাম"
                />
              </div>
              <div className="space-y-2">
                <Label>লেখক *</Label>
                <Input
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="লেখকের নাম"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>মূল্য (টাকা) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>অরিজিনাল মূল্য</Label>
                <Input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, originalPrice: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>ছাড় (%)</Label>
              <Input
                type="number"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                placeholder="20"
              />
            </div>

            <div className="space-y-2">
              <Label>বিবরণ</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="বই সম্পর্কে বিস্তারিত..."
              />
            </div>

            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="বইয়ের ছবি *"
              placeholder="বইয়ের কভার ফটো আপলোড করুন"
            />

            <div className="flex items-center gap-2">
              <Switch
                id="add-stock"
                checked={formData.inStock}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, inStock: checked })
                }
              />
              <Label htmlFor="add-stock">স্টকে আছে</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              বাতিল
            </Button>
            <Button
              onClick={handleAdd}
              className="bg-gradient-to-r from-[#285046] to-[#2F6057]"
              disabled={!formData.title || !formData.author || !formData.price}
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
              বই সম্পাদনা করুন
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>বইয়ের নাম *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="বইয়ের নাম"
                />
              </div>
              <div className="space-y-2">
                <Label>লেখক *</Label>
                <Input
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="লেখকের নাম"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>মূল্য (টাকা) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>অরিজিনাল মূল্য</Label>
                <Input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, originalPrice: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>ছাড় (%)</Label>
              <Input
                type="number"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                placeholder="20"
              />
            </div>

            <div className="space-y-2">
              <Label>বিবরণ</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="বই সম্পর্কে বিস্তারিত..."
              />
            </div>

            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="বইয়ের ছবি *"
              placeholder="বইয়ের কভার ফটো আপলোড করুন"
            />

            <div className="flex items-center gap-2">
              <Switch
                id="edit-stock"
                checked={formData.inStock}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, inStock: checked })
                }
              />
              <Label htmlFor="edit-stock">স্টকে আছে</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              বাতিল
            </Button>
            <Button
              onClick={handleEdit}
              className="bg-gradient-to-r from-[#285046] to-[#2F6057]"
              disabled={!formData.title || !formData.author || !formData.price}
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
            আপনি কি নিশ্চিত যে এই বইটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায়
            ফেরানো যাবে না।
          </p>
          {selectedBook && (
            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <p className="text-sm text-red-900">{selectedBook.title}</p>
              <p className="text-xs text-red-700">{selectedBook.author}</p>
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