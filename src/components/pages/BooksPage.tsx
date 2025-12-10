import { useState, useEffect } from "react";
import { ArrowLeft, Search, BookOpen, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { toast } from "sonner";

interface BooksPageProps {
  onBackToHome: () => void;
}

export function BooksPage({ onBackToHome }: BooksPageProps) {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery]);

  const loadBooks = () => {
    const stored = localStorage.getItem("books");
    if (stored) {
      setBooks(JSON.parse(stored));
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  };

  const handleOrder = (book: any) => {
    toast.success(`"${book.title}" অর্ডার করা হয়েছে!`);
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
          <h1 className="text-4xl mb-2">বইয়ের দোকান</h1>
          <p className="text-white/90">সকল শিক্ষামূলক বই এক জায়গায়</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <Card className="p-6 mb-8 shadow-lg border-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="বই খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 focus:border-[#285046]"
            />
          </div>
        </Card>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className={`overflow-hidden transition-all duration-300 border-2 hover:shadow-2xl ${
                book.inStock
                  ? "border-green-200 hover:border-[#285046]"
                  : "border-gray-200 opacity-75"
              }`}
            >
              <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {parseInt(book.discount) > 0 && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-red-500 text-white border-0">
                      {book.discount}% ছাড়
                    </Badge>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Badge
                    className={`${
                      book.inStock ? "bg-green-500" : "bg-gray-500"
                    } text-white border-0`}
                  >
                    {book.inStock ? "স্টকে আছে" : "স্টক শেষ"}
                  </Badge>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h4 className="text-[#1A202C] line-clamp-2">{book.title}</h4>
                  <p className="text-sm text-[#555555] mt-1">{book.author}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-2xl text-[#285046]">৳{book.price}</span>
                  {book.originalPrice && parseInt(book.discount) > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      ৳{book.originalPrice}
                    </span>
                  )}
                </div>

                <Button
                  onClick={() => handleOrder(book)}
                  disabled={!book.inStock}
                  className="w-full bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {book.inStock ? "অর্ডার করুন" : "স্টক শেষ"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl text-[#555555]">কোনো বই পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
}
