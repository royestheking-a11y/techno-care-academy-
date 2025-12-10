import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  FileText,
  Image as ImageIcon,
  Presentation,
  Lock,
  Download,
  Eye,
  Search,
  Filter,
  BookOpen,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getNotes,
  getUserEnrollments,
  saveNoteToCollection,
  isNoteSaved,
  removeSavedNote,
  getUserSavedNotes,
  type Note,
  type SavedNote,
} from "../utils/localStorage";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

export function NotesSection() {
  const { user, isAuthenticated, isVerified } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "pdf" | "image" | "pptx">("all");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [savedNotesIds, setSavedNotesIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Load all notes
      const allNotes = await getNotes();
      setNotes(allNotes);

      // Load user enrollments if authenticated
      if (isAuthenticated && user) {
        const userEnrollments = await getUserEnrollments(user.id);
        const confirmedEnrollments = userEnrollments
          .filter(e => e.status === "confirmed")
          .map(e => Number(e.courseId));
        setEnrolledCourses(confirmedEnrollments);

        // Load saved notes
        const userSavedNotes = await getUserSavedNotes(user.id);
        setSavedNotesIds(userSavedNotes.map(sn => sn.noteId));
      }
    };
    fetchData();
  }, [user, isAuthenticated]);

  const hasAccess = (courseId: number): boolean => {
    if (!isAuthenticated) return false;
    if (isVerified) return true; // Global access for verified users
    return enrolledCourses.includes(courseId);
  };

  const handleSaveNote = async (note: Note) => {
    if (!isAuthenticated || !user) {
      setShowLoginPrompt(true);
      return;
    }

    if (!hasAccess(note.courseId)) {
      toast.error("এই নোট সেভ করতে কোর্সে ভর্তি হতে হবে", {
        description: "প্রথমে কোর্সে এনরোল করুন এবং অ্যাডমিন থেকে নিশ্চিতকরণ পান"
      });
      return;
    }

    const alreadySaved = savedNotesIds.includes(note.id);

    if (alreadySaved) {
      // Find and remove
      const userSavedNotes = await getUserSavedNotes(user.id);
      const savedNote = userSavedNotes.find(sn => sn.noteId === note.id);
      if (savedNote) {
        removeSavedNote(savedNote.id);
        setSavedNotesIds(savedNotesIds.filter(id => id !== note.id));
        toast.success("নোট সেভ তালিকা থেকে মুছে ফেলা হয়েছে");
      }
    } else {
      // Save new note
      const savedNote: SavedNote = {
        id: `saved-${Date.now()}`,
        userId: user.id,
        noteId: note.id,
        noteTitle: note.title,
        noteDescription: note.description,
        fileType: note.fileType,
        fileUrl: note.fileUrl,
        thumbnail: note.thumbnail,
        savedAt: new Date().toISOString(),
      };
      saveNoteToCollection(savedNote);
      setSavedNotesIds([...savedNotesIds, note.id]);
      toast.success("নোট সেভ করা হয়েছে", {
        description: "ড্যাশবোর্ডের 'সেভড নোট' ট্যাবে দেখুন"
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />;
      case "image":
        return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case "pptx":
        return <Presentation className="w-8 h-8 text-orange-500" />;
      default:
        return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  const getFileTypeBadge = (fileType: string) => {
    const colors = {
      pdf: "bg-red-100 text-red-700 border-red-200",
      image: "bg-blue-100 text-blue-700 border-blue-200",
      pptx: "bg-orange-100 text-orange-700 border-orange-200"
    };
    return colors[fileType as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const handleNoteAction = (note: Note, action: "view" | "download") => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (!hasAccess(note.courseId)) {
      toast.error("এই নোট অ্যাক্সেস করতে কোর্সে ভর্তি হতে হবে", {
        description: "প্রথমে কোর্সে এনরোল করুন এবং অ্যাডমিন থেকে নিশ্চিতকরণ পান"
      });
      return;
    }

    if (action === "view") {
      setSelectedNote(note);
    } else {
      toast.success("ডাউনলোড শুরু হয়েছে", {
        description: note.title
      });

      // Create temporary link to force download
      const link = document.createElement('a');
      link.href = note.fileUrl;
      link.target = '_blank';
      link.setAttribute('download', note.title); // Try to force download with filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || note.fileType === filterType;

    return matchesSearch && matchesType;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section id="notes" className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-[#F7FAFC] via-white to-[#F7FAFC]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#285046] to-[#2F6057] rounded-2xl shadow-lg mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-[#1A202C] mb-3 md:mb-4">স্টাডি ম্যাটেরিয়াল ও নোট</h2>
          <p className="text-[#555555] text-sm md:text-base max-w-2xl mx-auto">
            হাজারেরও বেশি প্রিমিয়াম স্টাডি নোট, পিডিএফ এবং প্রেজেন্টেশন - সম্পূর্ণ নিরাপদ এবং এনক্রিপ্টেড
          </p>
          <Button
            onClick={() => {
              window.location.hash = "notes";
            }}
            className="mt-4 bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white"
          >
            সকল নোটস দেখুন
          </Button>
        </div>

        {/* Security Badge */}
        {isAuthenticated ? (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-green-900">আপনি লগইন করা আছেন</p>
                <p className="text-xs text-green-700">এনরোল করা কোর্সের সব নোট অ্যাক্সেস করতে পারবেন</p>
              </div>
              <Badge className="bg-green-600 text-white border-0">
                <ShieldCheck className="w-3 h-3 mr-1" />
                নিরাপদ
              </Badge>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-amber-900">নোট ডাউনলোড করতে লগইন করুন</p>
                <p className="text-xs text-amber-700">শুধুমাত্র এনরোল করা শিক্ষার্থীরা নোট অ্যাক্সেস করতে পারবেন</p>
              </div>
              <Button
                onClick={() => setShowLoginPrompt(true)}
                size="sm"
                className="bg-[#285046] hover:bg-[#2F6057] text-white"
              >
                লগইন করুন
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="নোট খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl border-gray-300 focus:border-[#285046]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className={filterType === "all" ? "bg-[#285046] hover:bg-[#2F6057]" : ""}
              >
                সব
              </Button>
              <Button
                variant={filterType === "pdf" ? "default" : "outline"}
                onClick={() => setFilterType("pdf")}
                className={filterType === "pdf" ? "bg-[#285046] hover:bg-[#2F6057]" : ""}
              >
                PDF
              </Button>
              <Button
                variant={filterType === "image" ? "default" : "outline"}
                onClick={() => setFilterType("image")}
                className={filterType === "image" ? "bg-[#285046] hover:bg-[#2F6057]" : ""}
              >
                Image
              </Button>
              <Button
                variant={filterType === "pptx" ? "default" : "outline"}
                onClick={() => setFilterType("pptx")}
                className={filterType === "pptx" ? "bg-[#285046] hover:bg-[#2F6057]" : ""}
              >
                PPT
              </Button>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredNotes.map((note) => {
            const locked = !hasAccess(note.courseId);

            return (
              <Card
                key={note.id}
                className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-2 hover:border-[#285046]/30"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {note.thumbnail ? (
                    <img
                      src={note.thumbnail}
                      alt={note.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(note.fileType)}
                    </div>
                  )}

                  {/* Lock Overlay */}
                  {locked && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center text-white space-y-2">
                        <Lock className="w-12 h-12 mx-auto" />
                        <p className="text-sm">লক করা</p>
                      </div>
                    </div>
                  )}

                  {/* File Type Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getFileTypeBadge(note.fileType)} border uppercase text-xs`}>
                      {note.fileType}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-[#1A202C] line-clamp-2 group-hover:text-[#285046] transition-colors">
                      {note.title}
                    </h3>
                    <p className="text-sm text-[#555555] line-clamp-2">
                      {note.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#555555]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(note.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleNoteAction(note, "view")}
                      variant="outline"
                      size="sm"
                      className="flex-1 border-[#285046] text-[#285046] hover:bg-[#285046] hover:text-white"
                      disabled={!isAuthenticated}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      দেখুন
                    </Button>
                    <Button
                      onClick={() => handleNoteAction(note, "download")}
                      size="sm"
                      className="flex-1 bg-[#285046] hover:bg-[#2F6057] text-white"
                      disabled={!isAuthenticated}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      ডাউনলোড
                    </Button>
                  </div>

                  {/* Save Button */}
                  <Button
                    onClick={() => handleSaveNote(note)}
                    size="sm"
                    className={`w-full ${savedNotesIds.includes(note.id) ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600" : "bg-gradient-to-r from-[#FFB703] to-yellow-500 hover:from-yellow-500 hover:to-[#FFB703]"} text-white border-0`}
                    disabled={!isAuthenticated}
                  >
                    {savedNotesIds.includes(note.id) ? (
                      <>
                        <BookmarkCheck className="w-4 h-4 mr-1" />
                        সেভ করা আছে
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4 mr-1" />
                        সেভ করুন
                      </>
                    )}
                  </Button>

                  {locked && isAuthenticated && (
                    <p className="text-xs text-amber-600 text-center pt-2">
                      🔒 কোর্সে এনরোল করে অ্যাক্সেস পান
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-[#1A202C] mb-2">কোনো নোট পাওয়া যায়নি</h3>
            <p className="text-[#555555]">অন্য ফিল্টার বা সার্চ ব্যবহার করে দেখুন</p>
          </div>
        )}
      </div>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-[#285046]" />
              লগইন প্রয়োজন
            </DialogTitle>
            <DialogDescription>
              নোট অ্যাক্সেস করতে আপনার একাউন্টে লগইন করুন
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-[#F7FAFC] rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#285046] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#1A202C]">নিরাপদ এবং সুরক্ষিত</p>
                  <p className="text-xs text-[#555555]">আপনার তথ্য সম্পূর্ণ নিরাপদ থাকবে</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#285046] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#1A202C]">এক্সক্লুসিভ অ্যাক্সেস</p>
                  <p className="text-xs text-[#555555]">শুধুমাত্র এনরোল করা শিক্ষার্থীদের জন্য</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                setShowLoginPrompt(false);
                // Trigger login modal from navbar
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white"
            >
              লগইন করুন
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Note Preview Dialog */}
      {selectedNote && (
        <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getFileIcon(selectedNote.fileType)}
                {selectedNote.title}
              </DialogTitle>
              <DialogDescription>
                {selectedNote.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedNote.fileType === "image" ? (
                <img
                  src={selectedNote.fileUrl}
                  alt={selectedNote.title}
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="p-12 bg-[#F7FAFC] rounded-xl text-center">
                  {getFileIcon(selectedNote.fileType)}
                  <p className="mt-4 text-[#555555]">
                    {selectedNote.fileType === "pdf" ? "PDF প্রিভিউ উপলব্ধ নয়" : "PPT প্রিভিউ উপলব্ধ নয়"}
                  </p>
                  <Button
                    onClick={() => handleNoteAction(selectedNote, "download")}
                    className="mt-4 bg-[#285046] hover:bg-[#2F6057]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    ডাউনলোড করুন
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}