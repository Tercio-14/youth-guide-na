import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Shield, ShieldOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/utils/api";

interface AdminUser {
  uid: string;
  email?: string;
  firstName?: string;
  isAdmin?: boolean;
  createdAt?: string;
}

interface Stats {
  users: { total: number };
  opportunities: { total: number; byCategory: Record<string, number>; recentlyAdded: number };
  chats: { totalConversations: number };
}

const EMPTY_FORM = {
  title: "",
  category: "",
  description: "",
  skillsRequired: "",
  cost: "",
  location: "",
  contact: "",
  source: "",
};

const Admin = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (!token) return;

    apiClient.get('/admin/stats', token)
      .then((res: any) => setStats(res.stats))
      .catch((err: any) => console.error('Failed to load stats:', err))
      .finally(() => setLoadingStats(false));

    apiClient.get('/admin/users', token)
      .then((res: any) => setAdminUsers(res.users || []))
      .catch((err: any) => console.error('Failed to load users:', err))
      .finally(() => setLoadingUsers(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await apiClient.post('/opportunities', formData, token);
      toast.success("Opportunity added! Embedding computing in background.");
      setFormData(EMPTY_FORM);
    } catch (err: any) {
      toast.error(`Failed to add opportunity: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    if (!token) return;
    try {
      await apiClient.put(`/admin/users/${userId}`, { isAdmin: !currentIsAdmin }, token);
      setAdminUsers((prev) =>
        prev.map((u) => (u.uid === userId ? { ...u, isAdmin: !currentIsAdmin } : u))
      );
      toast.success(`Admin status ${!currentIsAdmin ? 'granted' : 'revoked'}. User must re-login.`);
    } catch (err: any) {
      toast.error(`Failed to update user: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!token) return;
    const reason = window.prompt('Enter deletion reason (required):');
    if (!reason) return;
    try {
      await apiClient.delete(`/admin/users/${userId}`, token, { reason });
      setAdminUsers((prev) => prev.filter((u) => u.uid !== userId));
      toast.success('User deleted.');
    } catch (err: any) {
      toast.error(`Failed to delete user: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 shadow-soft">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/chat")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1">Admin Panel</h1>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto max-w-3xl p-4 space-y-4">

        {/* Stats */}
        <Card className="p-4 shadow-soft">
          <h2 className="mb-3 font-semibold">System Stats</h2>
          {loadingStats ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : stats ? (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{stats.users.total}</div>
                <div className="text-xs text-muted-foreground">Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.opportunities.total}</div>
                <div className="text-xs text-muted-foreground">Opportunities</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.chats.totalConversations}</div>
                <div className="text-xs text-muted-foreground">Conversations</div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Failed to load stats.</p>
          )}
        </Card>

        {/* Add Opportunity Form */}
        <Card className="p-6 shadow-medium">
          <div className="mb-6">
            <h2 className="mb-2 text-xl font-bold">Add New Opportunity</h2>
            <p className="text-sm text-muted-foreground">
              Add verified opportunities from trusted sources. These will be searchable by users.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Plumbing Apprenticeship"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  placeholder="job/training/education/volunteer"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Short description of the opportunity"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="skillsRequired">Skills Required</Label>
                <Input
                  id="skillsRequired"
                  placeholder="Comma-separated: plumbing, basic math"
                  value={formData.skillsRequired}
                  onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Cost *</Label>
                <Input
                  id="cost"
                  placeholder="free/paid/N$100"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Havana, Windhoek"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact *</Label>
                <Input
                  id="contact"
                  placeholder="Phone/email/link"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source Organization *</Label>
              <Input
                id="source"
                placeholder="e.g., City Youth Desk, NUST Outreach"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-warm" disabled={submitting}>
              <Plus className="mr-2 h-4 w-4" />
              {submitting ? "Adding..." : "Add Opportunity"}
            </Button>
          </form>
        </Card>

        {/* User Management */}
        <Card className="p-4 shadow-soft">
          <h2 className="mb-3 font-semibold">User Management</h2>
          {loadingUsers ? (
            <p className="text-sm text-muted-foreground">Loading users...</p>
          ) : adminUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found.</p>
          ) : (
            <div className="space-y-2">
              {adminUsers.map((u) => (
                <div key={u.uid} className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <div>
                    <div className="font-medium">{u.firstName || '(no name)'}</div>
                    <div className="text-xs text-muted-foreground">{u.email || u.uid}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title={u.isAdmin ? "Revoke admin" : "Grant admin"}
                      onClick={() => handleToggleAdmin(u.uid, !!u.isAdmin)}
                    >
                      {u.isAdmin ? <Shield className="h-4 w-4 text-primary" /> : <ShieldOff className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete user"
                      onClick={() => handleDeleteUser(u.uid)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};

export default Admin;
