import { useState, useEffect } from "react";
import { ArrowLeft, Search, FileText, Download, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

interface NotesPageProps {
  onBackToHome: () => void;
}

export function NotesPage({ onBackToHome }: NotesPageProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, searchQuery]);

  const loadNotes = () => {
    const stored = localStorage.getItem("notes");
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  };

  const filterNotes = () => {
    let filtered = [...notes];

    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotes(filtered);
  };

  const handleDownload = (note: any) => {
    if (!user) {
      toast.error("ডাউনলোড করতে লগইন করুন");
      window.location.hash = "login";
      return;
    }

    if (note.isPremium && !user.isVerified) {
      toast.error("প্রিমিয়াম নোট ডাউনলোড করতে কোর্সে এনরোল করুন");
      return;
    }

    toast.success(`"${note.title}" ডাউনলোড হচ্ছে...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] via-white to-[#F7FAFC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white py-8">
        <div className="container mx-auto px-4">
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="mb-4 bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            হোমপেজ
          </Button>
          <h1 className="text-4xl mb-2">স্টাডি নোটস</h1>
          <p className="text-white/90">সকল বিষয়ের নোটস এবং স্টাডি ম্যাটেরিয়াল</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <Card className="p-6 mb-8 shadow-lg border-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="নোট খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 focus:border-[#285046]"
            />
          </div>
        </Card>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="p-6 border-2 hover:border-[#285046] hover:shadow-2xl transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-[#285046] to-[#2F6057] rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-[#1A202C] mb-1 line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-sm text-[#555555]">{note.subject}</p>
                </div>
              </div>

              <div className="space-y-3">
                {note.isPremium && (
                  <Badge className="bg-[#FFB703] text-white border-0">
                    <Lock className="w-3 h-3 mr-1" />
                    প্রিমিয়াম
                  </Badge>
                )}

                <div className="flex items-center gap-2 text-sm text-[#555555]">
                  <span>{note.class}</span>
                  <span>•</span>
                  <span>{note.fileType}</span>
                  {note.size && (
                    <>
                      <span>•</span>
                      <span>{note.size}</span>
                    </>
                  )}
                </div>

                <Button
                  onClick={() => handleDownload(note)}
                  className="w-full bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  ডাউনলোড করুন
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl text-[#555555]">কোনো নোট পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
}
