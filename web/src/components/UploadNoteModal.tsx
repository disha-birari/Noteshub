"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import { uploadFile } from '@/lib/storage';
import { Button } from './ui/button';

interface UploadNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  userData: any;
  onUploadSuccess: () => void;
}

const UploadNoteModal: React.FC<UploadNoteModalProps> = ({ isOpen, onClose, user, userData, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !subject || !user) return;

    setLoading(true);
    setStatus('idle');

    try {
      await uploadFile(file, {
        title,
        subject,
        description,
        branch: userData?.branch || 'general',
        semester: userData?.semester || '1',
        userId: user.uid,
      });
      
      setStatus('success');
      setTimeout(() => {
        onUploadSuccess();
        onClose();
        // Reset form
        setFile(null);
        setTitle('');
        setSubject('');
        setDescription('');
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Upload failed:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Upload size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Upload New Note</h2>
                    <p className="text-sm text-slate-500 font-medium">Add to your {userData?.branch?.toUpperCase()} library</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Note Title</label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Data Structures - Unit 1"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Subject</label>
                  <input
                    required
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Mathematics II"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">File (PDF or Image)</label>
                  <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer ${file ? 'border-green-500 bg-green-50/30' : 'border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-slate-100/50'}`}>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {file ? (
                      <>
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                          <FileText size={24} />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-green-700 truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-green-600">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-slate-200 text-slate-500 rounded-xl flex items-center justify-center">
                          <Upload size={24} />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-slate-700">Click or drag to upload</p>
                          <p className="text-xs text-slate-500 font-medium">Supports PDF, PNG, JPG (up to 10MB)</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading || !file || !title || !subject}
                    className={`w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 text-white shadow-lg transition-all ${status === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-900 hover:bg-slate-800'}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Uploading to Storage...
                      </>
                    ) : status === 'success' ? (
                      <>
                        <Check size={20} />
                        Note Saved Successfully!
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        Confirm Upload
                      </>
                    )}
                  </Button>
                </div>

                {status === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100"
                  >
                    <AlertCircle size={18} />
                    Failed to upload. Please check your storage bucket policies.
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UploadNoteModal;
