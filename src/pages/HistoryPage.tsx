import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getTranslations,
  deleteTranslation,
  searchTranslations,
} from "@/db/api";
import type { Translation } from "@/types";
import {
  Type,
  Image,
  Music,
  Mic,
  Trash2,
  Search,
  FileText,
  RotateCcw,
  Download,
  Filter,
  SortAsc,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function HistoryPage() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [filteredTranslations, setFilteredTranslations] = useState<
    Translation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterMethod, setFilterMethod] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const { toast } = useToast();

  const loadTranslations = async () => {
    setIsLoading(true);
    const data = await getTranslations(100);
    setTranslations(data);
    setFilteredTranslations(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTranslations();
  }, []);

  useEffect(() => {
    let filtered = [...translations];

    // Apply method filter
    if (filterMethod !== "all") {
      filtered = filtered.filter((t) => (t.translation_type || t.input_method) === filterMethod);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.input_text.toLowerCase().includes(query) ||
          t.braille_output.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "date-asc":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "length-desc":
          return b.input_text.length - a.input_text.length;
        case "length-asc":
          return a.input_text.length - b.input_text.length;
        default:
          return 0;
      }
    });

    setFilteredTranslations(filtered);
  }, [translations, filterMethod, searchQuery, sortBy]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadTranslations();
      return;
    }

    setIsLoading(true);
    const results = await searchTranslations(searchQuery);
    setTranslations(results);
    setIsLoading(false);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    for (const id of selectedIds) {
      await deleteTranslation(id);
    }

    setTranslations(translations.filter((t) => !selectedIds.has(t.id)));
    setSelectedIds(new Set());
    toast({
      title: "Deleted",
      description: `${selectedIds.size} translations deleted successfully`,
    });
  };

  const handleExportCSV = () => {
    const toExport =
      selectedIds.size > 0
        ? filteredTranslations.filter((t) => selectedIds.has(t.id))
        : filteredTranslations;

    const csv = [
      ["Date", "Method", "Input", "Braille Output"],
      ...toExport.map((t) => [
        new Date(t.created_at).toLocaleString(),
        t.input_method,
        t.input_text.replace(/"/g, '""'),
        t.braille_output.replace(/"/g, '""'),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `braille-history-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: `${toExport.length} translations exported to CSV`,
    });
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTranslations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTranslations.map((t) => t.id)));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const success = await deleteTranslation(deleteId);
    if (success) {
      setTranslations(translations.filter((t) => t.id !== deleteId));
      toast({
        title: "Deleted",
        description: "Translation deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete translation",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const methodIcons: Record<string, any> = {
    text: Type,
    image: Image,
    audio: Music,
    microphone: Mic,
    file: FileText,
    braille: RotateCcw,
  };

  const methodLabels = {
    text: "Text Input",
    image: "Image Upload",
    file: "File Upload",
    braille: "Reverse Translation",
    audio: "Audio Upload",
    microphone: "Microphone",
  };

  return (
    <div className="min-h-screen gradient-mesh relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 py-10 relative z-10 slide-up">
        <div className="mb-10 fade-in">
          <h1 className="text-5xl font-bold mb-3">
            <span className="gradient-text text-shadow-soft">
              Translation History
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            View and manage your previous translations
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="grid gap-6 mb-8">
          <Card className="glass-card border-2 hover:border-primary/30 transition-all">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Search className="w-6 h-6 text-primary" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Search translations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 h-12 text-base border-2 focus:border-primary/40 transition-all"
                />
                <Button
                  onClick={handleSearch}
                  className="btn-gradient h-12 px-8 shadow-medium hover:shadow-strong"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={filterMethod} onValueChange={setFilterMethod}>
                  <SelectTrigger className="h-12 border-2 focus:border-primary/40">
                    <Filter className="w-5 h-5 mr-2 text-primary" />
                    <SelectValue placeholder="Filter by method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="text">Text Input</SelectItem>
                    <SelectItem value="image">Image Upload</SelectItem>
                    <SelectItem value="audio">Audio Upload</SelectItem>
                    <SelectItem value="microphone">Microphone</SelectItem>
                    <SelectItem value="file">File Upload</SelectItem>
                    <SelectItem value="braille">Reverse Translation</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12 border-2 focus:border-primary/40">
                    <SortAsc className="w-5 h-5 mr-2 text-primary" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="length-desc">Longest First</SelectItem>
                    <SelectItem value="length-asc">Shortest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {filteredTranslations.length > 0 && (
            <Card className="glass-card border-2 hover:border-primary/30 transition-all">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedIds.size === filteredTranslations.length}
                      onCheckedChange={toggleSelectAll}
                      className="w-5 h-5"
                    />
                    <span className="text-base text-muted-foreground font-medium">
                      {selectedIds.size} of {filteredTranslations.length}{" "}
                      selected
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportCSV}
                      disabled={filteredTranslations.length === 0}
                      className="h-11 px-6 border-2 hover:border-primary/40 hover:shadow-medium transition-all"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Export {selectedIds.size > 0 ? "Selected" : "All"}
                    </Button>
                    {selectedIds.size > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleBulkDelete}
                        className="h-11 px-6 shadow-medium hover:shadow-strong transition-all"
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Delete Selected
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg skeleton"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-32 skeleton rounded"></div>
                      <div className="space-y-2">
                        <div className="h-3 w-full skeleton rounded"></div>
                        <div className="h-3 w-3/4 skeleton rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-full skeleton rounded"></div>
                        <div className="h-6 w-2/3 skeleton rounded"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTranslations.length === 0 ? (
          <Card className="glass-card border-2">
            <CardContent className="py-20">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/5 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-primary/40" />
                </div>
                <p className="text-xl text-muted-foreground mb-2">
                  {searchQuery || filterMethod !== "all"
                    ? "No translations found"
                    : "No translation history yet"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || filterMethod !== "all"
                    ? "Try adjusting your filters or search query"
                    : "Start creating translations to see them here"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {filteredTranslations.map((translation, index) => {
              const method = translation.translation_type || translation.input_method || "text";
              const Icon = methodIcons[method as keyof typeof methodIcons];
              const isSelected = selectedIds.has(translation.id);
              return (
                <Card
                  key={translation.id}
                  className={`group hover:shadow-strong transition-all duration-300 border-2 ${
                    isSelected
                      ? "border-primary shadow-medium"
                      : "hover:border-primary/40"
                  } glass-card slide-in-left`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-5">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelection(translation.id)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 shadow-soft group-hover:shadow-medium group-hover:scale-110 transition-all">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-base font-semibold text-muted-foreground">
                            {methodLabels[method as keyof typeof methodLabels]}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(translation.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Input:</p>
                          <p className="text-sm text-muted-foreground break-words">
                            {translation.input_text}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Braille:</p>
                          <p className="text-2xl font-mono break-all">
                            {translation.braille_output}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(translation.id)}
                        className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive transition-all w-11 h-11"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Translation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this translation? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
