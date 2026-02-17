"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { toast } from "sonner";
import { Book } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RockRatingInput } from "@/components/rock-rating-input";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

const GENRES = [
  "AlltimeFav",
  "Biografie",
  "Empfehlung",
  "English",
  "Kreativ",
  "Kunst",
  "Sachbuch",
  "Unterhaltung",
  "Sport",
] as const;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

const bookFormSchema = z.object({
  title: z.string().min(1, "Titel ist ein Pflichtfeld"),
  author: z.string().min(1, "Autor ist ein Pflichtfeld"),
  description: z.string().optional(),
  genre: z.string().optional(),
  rating: z.number().int().min(0).max(5),
  image_url: z.string().optional(),
  amazon_link: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

interface BookFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
  onSuccess: () => void;
}

export function BookFormSheet({
  open,
  onOpenChange,
  book,
  onSuccess,
}: BookFormSheetProps) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [useUpload, setUseUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!book;

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      genre: "",
      rating: 0,
      image_url: "",
      amazon_link: "",
    },
  });

  // Reset form when book changes or sheet opens
  useEffect(() => {
    if (open) {
      if (book) {
        form.reset({
          title: book.title,
          author: book.author,
          description: book.description ?? "",
          genre: book.genre ?? "",
          rating: book.rating,
          image_url: book.image_url ?? "",
          amazon_link: book.amazon_link ?? "",
        });
        setImagePreview(book.image_url ?? null);
        setUseUpload(false);
      } else {
        form.reset({
          title: "",
          author: "",
          description: "",
          genre: "",
          rating: 0,
          image_url: "",
          amazon_link: "",
        });
        setImagePreview(null);
        setUseUpload(false);
      }
    }
  }, [open, book, form]);

  async function handleImageUpload(file: File): Promise<string | null> {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Nur JPG, PNG und WebP Dateien sind erlaubt.");
      return null;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Das Bild darf maximal 2MB gross sein.");
      return null;
    }

    setUploading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("book-covers")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        toast.error(`Upload fehlgeschlagen: ${uploadError.message}`);
        return null;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("book-covers").getPublicUrl(fileName);

      return publicUrl;
    } catch {
      toast.error("Ein Fehler ist beim Upload aufgetreten.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    const publicUrl = await handleImageUpload(file);
    if (publicUrl) {
      form.setValue("image_url", publicUrl);
      setImagePreview(publicUrl);
      toast.success("Bild erfolgreich hochgeladen.");
    } else {
      setImagePreview(book?.image_url ?? null);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removeImage() {
    form.setValue("image_url", "");
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(values: BookFormValues) {
    setSaving(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const bookData = {
        title: values.title,
        author: values.author,
        description: values.description || null,
        genre: values.genre || null,
        rating: values.rating,
        image_url: values.image_url || null,
        amazon_link: values.amazon_link || null,
      };

      if (isEditing && book) {
        const { error } = await supabase
          .from("books")
          .update(bookData)
          .eq("id", book.id);

        if (error) {
          toast.error(`Fehler beim Speichern: ${error.message}`);
          return;
        }

        toast.success(`"${values.title}" wurde aktualisiert.`);
      } else {
        const { error } = await supabase.from("books").insert(bookData);

        if (error) {
          toast.error(`Fehler beim Erstellen: ${error.message}`);
          return;
        }

        toast.success(`"${values.title}" wurde hinzugefuegt.`);
      }

      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Buch bearbeiten" : "Neues Buch hinzufuegen"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Aendere die Buchdaten und speichere."
              : "Fuege ein neues Buch zu deiner Sammlung hinzu."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mt-6"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Titel <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z.B. Atomic Habits"
                      {...field}
                      disabled={saving}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Author */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Autor <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z.B. James Clear"
                      {...field}
                      disabled={saving}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschreibung</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Worum geht es in dem Buch?"
                      rows={3}
                      {...field}
                      disabled={saving}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Genre */}
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={saving}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Genre auswaehlen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENRES.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bewertung</FormLabel>
                  <FormControl>
                    <RockRatingInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={saving}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image */}
            <div className="space-y-3">
              <FormLabel>Cover-Bild</FormLabel>

              {/* Toggle between upload and URL */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={useUpload ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseUpload(true)}
                  disabled={saving}
                >
                  <Upload className="mr-1 h-3.5 w-3.5" />
                  Hochladen
                </Button>
                <Button
                  type="button"
                  variant={!useUpload ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseUpload(false)}
                  disabled={saving}
                >
                  <ImageIcon className="mr-1 h-3.5 w-3.5" />
                  URL eingeben
                </Button>
              </div>

              {useUpload ? (
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={onFileChange}
                    className="hidden"
                    disabled={saving || uploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving || uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Wird hochgeladen...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Bild auswaehlen (max. 2MB)
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG oder WebP. Maximal 2MB.
                  </p>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/cover.jpg"
                          {...field}
                          disabled={saving}
                          onChange={(e) => {
                            field.onChange(e);
                            setImagePreview(e.target.value || null);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative inline-block">
                  <div className="relative w-20 h-28 rounded border overflow-hidden bg-muted">
                    <Image
                      src={imagePreview}
                      alt="Cover-Vorschau"
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:bg-destructive/90"
                    aria-label="Bild entfernen"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Amazon Link */}
            <FormField
              control={form.control}
              name="amazon_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amazon-Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://amazon.de/..."
                      {...field}
                      disabled={saving}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Abbrechen
              </Button>
              <Button type="submit" className="flex-1" disabled={saving || uploading}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Speichern...
                  </>
                ) : isEditing ? (
                  "Speichern"
                ) : (
                  "Hinzufuegen"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
