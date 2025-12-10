import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { BookOrderDialog } from "./BookOrderDialog";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { getBooks, Book } from "../utils/localStorage";

export function BooksSection() {
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    getBooks().then(setBooks);

    const handleStorageChange = () => {
      getBooks().then(setBooks);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('books-update', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('books-update', handleStorageChange);
    };
  }, []);

  const featuredBooks = books.slice(0, 4);
  const allBooks = books;

  const handleBuyNow = (book: any) => {
    setSelectedBook(book);
    setShowOrderDialog(true);
  };

  return (
    <>
      <section className="py-12 md:py-16 bg-[#F7FAFC]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl text-[#1A202C] mb-3">গুরুত্বপূর্ণ পাঠ্যবই</h2>
            <p className="text-[#555555] text-lg">এক জায়গায় সকল প্রয়োজনীয় বই</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden rounded-2xl border-none shadow-lg hover:shadow-2xl transition-all group">
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                      {book.discount && Number(book.discount) > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                          {book.discount}% ছাড়
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full shadow-sm ${book.inStock ? 'bg-emerald-600 text-white' : 'bg-gray-500 text-white'}`}>
                        {book.inStock ? 'স্টকে আছে' : 'স্টক আউট'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg text-[#1A202C] mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-[#555555] mb-3">{book.author}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-bold text-[#285046]">৳{book.price}</span>
                        {book.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">৳{book.originalPrice}</span>
                        )}
                      </div>
                      <Button
                        onClick={() => handleBuyNow(book)}
                        size="sm"
                        className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-xl"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              onClick={() => setShowAllBooks(true)}
              className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-xl px-8 py-6 text-lg shadow-lg hover:shadow-2xl transition-all"
            >
              আরো পাঠ্যবই
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* All Books Dialog */}
      <Dialog open={showAllBooks} onOpenChange={setShowAllBooks}>
        <DialogContent className="max-w-[95vw] lg:max-w-[1400px] max-h-[90vh] overflow-y-auto rounded-2xl p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-3xl md:text-4xl">সকল পাঠ্যবই</DialogTitle>
            <DialogDescription className="text-lg">আপনার পছন্দের বই খুঁজে নিন এবং অর্ডার করুন</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden rounded-2xl border-none shadow-lg hover:shadow-2xl transition-all group h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                      {book.discount && Number(book.discount) > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                          {book.discount}% ছাড়
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full shadow-sm ${book.inStock ? 'bg-emerald-600 text-white' : 'bg-gray-500 text-white'}`}>
                        {book.inStock ? 'স্টকে আছে' : 'স্টক আউট'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg text-[#1A202C] mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-[#555555] mb-4">{book.author}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-bold text-[#285046]">৳{book.price}</span>
                        {book.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">৳{book.originalPrice}</span>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          setShowAllBooks(false);
                          handleBuyNow(book);
                        }}
                        size="sm"
                        className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-xl"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <BookOrderDialog
        open={showOrderDialog}
        onOpenChange={setShowOrderDialog}
        book={selectedBook}
      />
    </>
  );
}