"use client";

import React, { useState, useEffect } from "react";
import { User, Key, Save, AlertCircle, CheckCircle2, Target, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/admin/profile");
      if (res.ok) {
        const data = await res.json();
        setUser({ name: data.name || "", email: data.email });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);

    if (passwords.new && passwords.new !== passwords.confirm) {
      setStatus({ type: "error", message: "New passwords do not match" });
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Profile updated successfully" });
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        setStatus({ type: "error", message: data.message || "Failed to update profile" });
      }
    } catch (error) {
      setStatus({ type: "error", message: "An error occurred. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Admin Profile
        </h1>
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {status && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              status.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {status.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-sm font-medium">{status.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Info */}
          <Card className="p-6 bg-slate-900/50 backdrop-blur-xl border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <User className="h-5 w-5" />
              <h2 className="font-semibold">General Information</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                <Input
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white focus:ring-indigo-500"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-slate-800/50 border-slate-700 text-slate-500 opacity-70"
                />
                <p className="text-[10px] text-slate-500 italic">Email cannot be changed.</p>
              </div>
            </div>
          </Card>

          {/* Change Password */}
          <Card className="p-6 bg-slate-900/50 backdrop-blur-xl border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Key className="h-5 w-5" />
              <h2 className="font-semibold">Security / Change Password</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current" className="text-slate-300">Current Password</Label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500/50" />
                  <Input
                    id="current"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white focus:ring-indigo-500 pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new" className="text-slate-300">New Password</Label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500/50" />
                  <Input
                    id="new"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white focus:ring-indigo-500 pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-slate-300">Confirm New Password</Label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500/50" />
                  <Input
                    id="confirm"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white focus:ring-indigo-500 pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 h-11 rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
