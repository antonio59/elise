import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Users,
  Plus,
  X,
  Trash2,
  Save,
  User,
  Sparkles,
} from "lucide-react";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import { usePageAnnouncement } from "../components/AccessibleAnnouncer";
import { usePageMeta } from "../components/PageMeta";

type Character = Doc<"characters">;

const Characters: React.FC = () => {
  usePageAnnouncement("Characters");
  usePageMeta({ title: "Character Bible", description: "Your story characters" });

  const characters = useQuery((api as any).characters.getMyCharacters) ?? [];
  const createCharacter = useMutation((api as any).characters.create);
  const updateCharacter = useMutation((api as any).characters.update);
  const removeCharacter = useMutation((api as any).characters.remove);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"characters"> | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [personality, setPersonality] = useState("");
  const [appearance, setAppearance] = useState("");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPersonality("");
    setAppearance("");
    setRole("");
    setNotes("");
    setEditingId(null);
  };

  const startEdit = (char: Character) => {
    setName(char.name);
    setDescription(char.description);
    setPersonality(char.personality || "");
    setAppearance(char.appearance || "");
    setRole(char.role || "");
    setNotes(char.notes || "");
    setEditingId(char._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await updateCharacter({
          id: editingId,
          name: name.trim(),
          description: description.trim(),
          personality: personality.trim() || undefined,
          appearance: appearance.trim() || undefined,
          role: role.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      } else {
        await createCharacter({
          name: name.trim(),
          description: description.trim(),
          personality: personality.trim() || undefined,
          appearance: appearance.trim() || undefined,
          role: role.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      }
      resetForm();
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Character Bible</h1>
          <p className="text-slate-500 mt-1">Keep track of everyone in your stories</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
          className="btn btn-gradient"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? "Cancel" : "New Character"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="card p-6 space-y-4 overflow-hidden"
          >
            <h2 className="text-xl font-bold text-slate-800">
              {editingId ? "Edit Character" : "New Character"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Character name" className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Protagonist, villain, sidekick..." className="input" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Who are they?" className="input min-h-[80px] resize-y" rows={3} required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Personality</label>
                <textarea value={personality} onChange={(e) => setPersonality(e.target.value)} placeholder="Traits, quirks, flaws..." className="input min-h-[80px] resize-y" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Appearance</label>
                <textarea value={appearance} onChange={(e) => setAppearance(e.target.value)} placeholder="Hair, eyes, style..." className="input min-h-[80px] resize-y" rows={3} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Backstory, motivations, secrets..." className="input min-h-[80px] resize-y" rows={3} />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={submitting || !name.trim() || !description.trim()} className="btn btn-gradient flex-1">
                <Save className="w-4 h-4" />
                {submitting ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {characters.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">No characters yet</h3>
          <p className="text-slate-500 mb-6">Start building your story world!</p>
          <button onClick={() => setShowForm(true)} className="btn btn-gradient">
            <Plus className="w-5 h-5" />
            Create First Character
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <AnimatePresence>
            {characters.map((char: Character) => (
              <motion.div
                key={char._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card p-5 hover:border-violet-200 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800">{char.name}</h3>
                      {char.role && <span className="text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">{char.role}</span>}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{char.description}</p>
                    {(char.personality || char.appearance) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {char.personality && <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{char.personality}</span>}
                        {char.appearance && <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{char.appearance}</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => startEdit(char)} className="p-2 hover:bg-slate-100 rounded-lg" title="Edit">
                      <Sparkles className="w-4 h-4 text-slate-400" />
                    </button>
                    <button onClick={() => removeCharacter({ id: char._id })} className="p-2 hover:bg-red-50 rounded-lg" title="Delete">
                      <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
                {char.notes && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 italic">{char.notes}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Characters;
