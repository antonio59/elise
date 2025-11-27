import { useState } from "react";
import { useStore } from "@/lib/store";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock Schema for Book
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  rating: z.coerce.number().min(1).max(5),
  review: z.string().min(10, "Review must be at least 10 characters"),
  cover: z.string().url("Must be a valid URL").or(z.string().min(1, "Cover is required")), // Allowing simple strings for our mock data paths
});

// Mock Schema for Art
const artSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Must be a valid URL").or(z.string().min(1, "Image is required")),
});

export default function Admin() {
  const store = useStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("books");

  // Forms
  const bookForm = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      rating: 5,
      review: "",
      cover: "https://placehold.co/400x600/e2e8f0/475569?text=Book+Cover", // Default placeholder
    },
  });

  const artForm = useForm({
    resolver: zodResolver(artSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "https://placehold.co/400x400/e2e8f0/475569?text=Art", // Default placeholder
    },
  });

  const onAddBook = (data: any) => {
    store.addBook({
      ...data,
      dateRead: new Date().toISOString().split('T')[0],
    });
    toast({ title: "Book added!", description: "Your bookshelf has been updated." });
    bookForm.reset();
  };

  const onAddArt = (data: any) => {
    store.addArt({
      ...data,
      dateCreated: new Date().toISOString().split('T')[0],
    });
    toast({ title: "Art added!", description: "Your gallery has been updated." });
    artForm.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold">Admin Dashboard ⚙️</h1>
          <p className="text-muted-foreground">Manage your content</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-white p-1 rounded-xl shadow-sm">
            <TabsTrigger value="books" className="rounded-lg data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-bold">
              Manage Books
            </TabsTrigger>
            <TabsTrigger value="art" className="rounded-lg data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-bold">
              Manage Art
            </TabsTrigger>
          </TabsList>

          <TabsContent value="books">
            <div className="grid gap-8 md:grid-cols-[1fr,1.5fr]">
              {/* Add Book Form */}
              <Card className="border-none shadow-md h-fit">
                <CardHeader>
                  <CardTitle>Add New Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={bookForm.handleSubmit(onAddBook)} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input {...bookForm.register("title")} placeholder="Book Title" />
                      {bookForm.formState.errors.title && <p className="text-xs text-red-500">{String(bookForm.formState.errors.title.message)}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Author</Label>
                      <Input {...bookForm.register("author")} placeholder="Author Name" />
                      {bookForm.formState.errors.author && <p className="text-xs text-red-500">{String(bookForm.formState.errors.author.message)}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Rating (1-5)</Label>
                      <Input type="number" {...bookForm.register("rating")} min={1} max={5} />
                    </div>

                    <div className="space-y-2">
                      <Label>Review</Label>
                      <Textarea {...bookForm.register("review")} placeholder="What did you think?" />
                      {bookForm.formState.errors.review && <p className="text-xs text-red-500">{String(bookForm.formState.errors.review.message)}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Cover URL</Label>
                      <Input {...bookForm.register("cover")} placeholder="https://..." />
                    </div>

                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <Plus className="w-4 h-4 mr-2" /> Add Book
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* List of Books */}
              <div className="space-y-4">
                {store.books.map((book) => (
                  <Card key={book.id} className="border-none shadow-sm flex overflow-hidden items-center p-2">
                    <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded-md bg-gray-100" />
                    <div className="flex-1 px-4">
                      <h4 className="font-bold font-display">{book.title}</h4>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <div className="flex text-yellow-400 text-xs mt-1">
                        {"★".repeat(book.rating)}{"☆".repeat(5 - book.rating)}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => store.removeBook(book.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </Card>
                ))}
                {store.books.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground bg-white rounded-xl border-2 border-dashed">
                    No books yet. Add one!
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="art">
            <div className="grid gap-8 md:grid-cols-[1fr,1.5fr]">
              {/* Add Art Form */}
              <Card className="border-none shadow-md h-fit">
                <CardHeader>
                  <CardTitle>Add Artwork</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={artForm.handleSubmit(onAddArt)} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input {...artForm.register("title")} placeholder="Art Title" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea {...artForm.register("description")} placeholder="About this piece..." />
                    </div>

                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input {...artForm.register("image")} placeholder="https://..." />
                    </div>

                    <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                      <Plus className="w-4 h-4 mr-2" /> Add Art
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* List of Art */}
              <div className="grid grid-cols-2 gap-4">
                {store.artworks.map((art) => (
                  <Card key={art.id} className="border-none shadow-sm overflow-hidden group relative">
                    <img src={art.image} alt={art.title} className="w-full aspect-square object-cover bg-gray-100" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => store.removeArt(art.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="p-3 bg-white">
                      <h4 className="font-bold font-display text-sm truncate">{art.title}</h4>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
