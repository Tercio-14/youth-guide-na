import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Share2, Bookmark, MapPin, Building2, ExternalLink, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/utils/api";
import { toast } from "sonner";

interface SavedOpportunity {
  id: string;
  title: string;
  type: string;
  description?: string;
  organization?: string;
  location?: string;
  date_posted?: string;
  source?: string;
  url?: string;
  savedAt?: string;
}

const Saved = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [savedOpps, setSavedOpps] = useState<SavedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSavedOpportunities = async () => {
      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get('/saved', token);
        setSavedOpps(response.opportunities || []);
      } catch (error) {
        console.error('Failed to fetch saved opportunities:', error);
        toast.error("Failed to load saved opportunities");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedOpportunities();
  }, [token, navigate]);

  const handleDelete = async (opportunityId: string) => {
    if (!token) return;

    setDeletingIds(prev => new Set(prev).add(opportunityId));

    try {
      await apiClient.delete(`/saved/${opportunityId}`, token);
      setSavedOpps(prev => prev.filter(opp => opp.id !== opportunityId));
      toast.success("Opportunity removed");
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error("Failed to remove opportunity");
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(opportunityId);
        return next;
      });
    }
  };

  const handleShare = async (opportunity: SavedOpportunity) => {
    const text = `Check out this opportunity: ${opportunity.title}${opportunity.url ? `\n${opportunity.url}` : ''}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: opportunity.title,
          text: text,
          url: opportunity.url || window.location.href
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  const handleOpenURL = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border bg-card px-4 py-3 shadow-soft"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/chat")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Saved Opportunities</h1>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="container mx-auto max-w-3xl p-4">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading saved opportunities...</p>
          </motion.div>
        ) : savedOpps.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 text-center shadow-soft">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Bookmark className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              </motion.div>
              <p className="text-muted-foreground">
                You haven't saved any opportunities yet. Start chatting to find some!
              </p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button className="mt-4 bg-gradient-warm" onClick={() => navigate("/chat")}>
                  Go to Chat
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {savedOpps.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                >
                  <Card className="overflow-hidden shadow-soft transition-all duration-200 hover:shadow-medium">
                    <div className="border-l-4 border-primary p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="font-medium">
                              {item.type}
                            </Badge>
                            {item.location && (
                              <Badge variant="outline">📍 {item.location}</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {item.description && (
                        <p className="mb-3 text-sm text-muted-foreground line-clamp-3">
                          {item.description}
                        </p>
                      )}

                      <div className="mb-3 space-y-2 text-sm text-muted-foreground">
                        {item.organization && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span className="font-medium">Organization:</span> {item.organization}
                          </div>
                        )}
                        {item.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">Location:</span> {item.location}
                          </div>
                        )}
                        {item.date_posted && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">Posted:</span>{" "}
                            {new Date(item.date_posted).toLocaleDateString()}
                          </div>
                        )}
                        {item.savedAt && (
                          <p className="pt-1 text-xs">
                            Saved {new Date(item.savedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {item.url && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1"
                          >
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full"
                              onClick={() => handleOpenURL(item.url!)}
                            >
                              <ExternalLink className="mr-1 h-3 w-3" /> View Details
                            </Button>
                          </motion.div>
                        )}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShare(item)}
                          >
                            <Share2 className="h-3 w-3" />
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingIds.has(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Saved;
