import { useState, useEffect } from "react";
import { ArrowLeft, Search, School, MapPin, Phone, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

interface InstitutesPageProps {
  onBackToHome: () => void;
}

export function InstitutesPage({ onBackToHome }: InstitutesPageProps) {
  const [institutes, setInstitutes] = useState<any[]>([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadInstitutes();
  }, []);

  useEffect(() => {
    filterInstitutes();
  }, [institutes, searchQuery]);

  const loadInstitutes = () => {
    const stored = localStorage.getItem("institutes");
    if (stored) {
      setInstitutes(JSON.parse(stored));
    }
  };

  const filterInstitutes = () => {
    let filtered = [...institutes];

    if (searchQuery) {
      filtered = filtered.filter(
        (institute) =>
          institute.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          institute.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredInstitutes(filtered);
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
          <h1 className="text-4xl mb-2">পলিটেকনিক ইনস্টিটিউট</h1>
          <p className="text-white/90">বাংলাদেশের সকল পলিটেকনিক ইনস্টিটিউটের তালিকা</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <Card className="p-6 mb-8 shadow-lg border-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutes.map((institute) => (
            <Card
              key={institute.id}
              className="p-6 border-2 hover:border-[#285046] hover:shadow-2xl transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#285046] to-[#2F6057] rounded-xl">
                    <School className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg text-[#1A202C] mb-1">
                      {institute.name}
                    </h3>
                    {institute.established && (
                      <Badge variant="outline" className="border-[#285046] text-[#285046]">
                        প্রতিষ্ঠিত: {institute.established}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[#555555]">
                    <MapPin className="w-4 h-4 text-[#285046]" />
                    <span>{institute.location}</span>
                  </div>
                  {institute.phone && (
                    <div className="flex items-center gap-2 text-[#555555]">
                      <Phone className="w-4 h-4 text-[#285046]" />
                      <span>{institute.phone}</span>
                    </div>
                  )}
                </div>

                {institute.departments && (
                  <div>
                    <p className="text-xs text-[#555555] mb-2">বিভাগসমূহ:</p>
                    <div className="flex flex-wrap gap-2">
                      {institute.departments.split(",").slice(0, 3).map((dept: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs border-gray-300"
                        >
                          {dept.trim()}
                        </Badge>
                      ))}
                      {institute.departments.split(",").length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-300">
                          +{institute.departments.split(",").length - 3} আরও
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => window.open(institute.website || "#", "_blank")}
                  className="w-full bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  বিস্তারিত দেখুন
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredInstitutes.length === 0 && (
          <div className="text-center py-20">
            <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl text-[#555555]">কোনো ইনস্টিটিউট পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
}
