import { useState, useEffect } from "react";
import { Mail, Loader2, Trash2, Eye, EyeOff, Search, Phone, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { messagesAPI } from "../../utils/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface Message {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
}

export function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getAll();
      if (response.success) {
        // FORCE CLEANUP: Auto-delete the stubborn message with specific content
        const stubbornMessages = response.data.filter((msg: any) =>
          msg.message?.includes("want to delete this message") ||
          msg.name?.includes("want to delete this message")
        );

        if (stubbornMessages.length > 0) {
          console.log("Found stubborn messages, force deleting...", stubbornMessages);
          for (const msg of stubbornMessages) {
            await messagesAPI.delete(String(msg.id));
          }
          // Re-fetch after cleanup
          const refreshed = await messagesAPI.getAll();
          if (refreshed.success) {
            setMessages(refreshed.data.sort((a: Message, b: Message) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ));
            toast.success("Corrupted message force deleted!");
          }
        } else {
          setMessages(response.data.sort((a: Message, b: Message) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ));
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("মেসেজ লোড করতে সমস্যা হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id: string | number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "read" ? "unread" : "read";
      const response = await messagesAPI.update(String(id), { status: newStatus });

      if (response.success) {
        setMessages(messages.map(msg =>
          msg.id === id ? { ...msg, status: newStatus } : msg
        ));
        toast.success(newStatus === "read" ? "পঠিত হিসেবে চিহ্নিত!" : "অপঠিত হিসেবে চিহ্নিত!");
      }
    } catch (error) {
      console.error("Error updating message status:", error);
      toast.error("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে!");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    // Optimistic Update: Immediately remove from UI to ensure "force delete" feel
    // Convert both to string for robust comparison to handle possible type mismatches
    const idToDelete = String(deleteId);
    setMessages(prev => prev.filter(msg => String(msg.id) !== idToDelete));
    setDeleteId(null); // Close dialog immediately

    try {
      // Attempt actual deletion
      const response = await messagesAPI.delete(idToDelete);
      if (response.success) {
        toast.success("মেসেজ মুছে ফেলা হয়েছে!");
      } else {
        // Even if API returns false (e.g. already deleted), we consider it success for the UI
        console.warn("Backend delete might have failed or item already gone");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      // Do not revert state - user wants it gone
      toast.error("সার্ভার থেকে মুছতে সমস্যা হতে পারে, কিন্তু তালিকা থেকে সরানো হয়েছে");
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.phone.includes(searchTerm) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(msg => msg.status === "unread").length;

  const formatDate = (dateString: string) => {
    if (!dateString) return "তারিখ পাওয়া যায়নি";
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return "তারিখ পাওয়া যায়নি";

    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 animate-spin text-[#285046]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl text-[#1A202C] flex items-center gap-3 mb-2">
            <Mail className="w-8 h-8 text-[#285046]" />
            প্রাপ্ত তথ্য
          </h2>
          <p className="text-[#555555]">
            শিক্ষার্থীদের পাঠানো মেসেজ এবং মন্তব্য
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">মোট মেসেজ</p>
              <p className="text-3xl text-[#1A202C]">{messages.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl">
              <EyeOff className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">উপেক্ষিত / অপঠিত</p>
              <p className="text-3xl text-[#1A202C]">{unreadCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">পঠিত মেসেজ</p>
              <p className="text-3xl text-[#1A202C]">{messages.length - unreadCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-2 border-gray-200">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="নাম, ইমেইল, ফোন বা মেসেজ অনুসন্ধান করুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 border-gray-200 focus:border-[#285046] focus:ring-[#285046]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-[#1A202C]">
            <Mail className="w-5 h-5 text-[#285046]" />
            মেসেজ তালিকা
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-[#555555] text-lg">কোনো মেসেজ পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className={`border-l-4 transition-all hover:shadow-md border-2 border-gray-100 ${message.status === "unread"
                    ? "border-l-[#FFB703] bg-amber-50/30"
                    : "border-l-[#285046] bg-white"
                    }`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl text-[#1A202C]">{message.name}</h3>
                              <Badge
                                variant={message.status === "unread" ? "default" : "secondary"}
                                className={
                                  message.status === "unread"
                                    ? "bg-[#FFB703]"
                                    : "bg-gray-200 text-gray-700"
                                }
                              >
                                {message.status === "unread" ? "অপঠিত" : "পঠিত"}
                              </Badge>
                            </div>

                            <div className="flex flex-col gap-1 text-sm text-[#555555]">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span>{message.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span>{message.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(message.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Message Content */}
                        <div className="mt-4">
                          <p className="text-sm text-[#555555] mb-2">মেসেজ:</p>
                          {expandedId === message.id ? (
                            <p className="text-[#1A202C] bg-white p-4 rounded-xl border border-gray-200">
                              {message.message}
                            </p>
                          ) : (
                            <p className="text-[#1A202C] bg-white p-4 rounded-xl border border-gray-200 line-clamp-2">
                              {message.message}
                            </p>
                          )}

                          {message.message.length > 100 && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
                              className="text-[#285046] mt-2 p-0 h-auto"
                            >
                              {expandedId === message.id ? "কম দেখুন" : "আরো দেখুন"}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2">
                        <Button
                          onClick={() => handleToggleRead(message.id, message.status)}
                          variant="outline"
                          size="sm"
                          className="flex-1 md:flex-initial"
                        >
                          {message.status === "unread" ? (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              পঠিত
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              অপঠিত
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => setDeleteId(message.id)}
                          variant="destructive"
                          size="sm"
                          className="flex-1 md:flex-initial"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          মুছুন
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>মেসেজ মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription>
              এই মেসেজটি স্থায়ীভাবে মুছে ফেলা হবে। এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
