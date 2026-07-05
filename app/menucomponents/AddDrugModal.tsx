"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/config";

interface AddDrugForm {
  name: string;
  genericName: string;
  category: string;
  commonDosages: string;
  description: string;
  sideEffects: string;
  contraindications: string;
  manufacturer: string;
}

interface AddDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddDrugModal({
  isOpen,
  onClose,
  onSuccess,
}: AddDrugModalProps) {
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState<AddDrugForm>({
    name: "",
    genericName: "",
    category: "",
    commonDosages: "",
    description: "",
    sideEffects: "",
    contraindications: "",
    manufacturer: "",
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      genericName: "",
      category: "",
      commonDosages: "",
      description: "",
      sideEffects: "",
      contraindications: "",
      manufacturer: "",
    });
    setAddError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddDrug = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.genericName || !formData.category) {
      setAddError("Please fill in all required fields");
      return;
    }

    try {
      setAddLoading(true);
      setAddError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setAddError("Authentication required. Please log in.");
        return;
      }

      const payload = {
        name: formData.name,
        genericName: formData.genericName,
        category: formData.category,
        commonDosages: formData.commonDosages
          .split(",")
          .map((d) => d.trim())
          .filter((d) => d.length > 0),
        description: formData.description || undefined,
        sideEffects: formData.sideEffects || undefined,
        contraindications: formData.contraindications || undefined,
        manufacturer: formData.manufacturer || undefined,
      };

      const response = await fetch(API_ENDPOINTS.ADD_DRUG, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to add drug: ${response.statusText}`
        );
      }

      resetForm();
      onSuccess();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add drug");
      console.error("Error adding drug:", err);
    } finally {
      setAddLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[10001] p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Add New Drug</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleAddDrug}>
          <div className="p-6">
            {addError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {addError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                  placeholder="e.g., Lisinopril"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generic Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="genericName"
                  value={formData.genericName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                  placeholder="e.g., Lisinopril"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                  placeholder="e.g., ACE Inhibitor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Common Dosages
                </label>
                <input
                  type="text"
                  name="commonDosages"
                  value={formData.commonDosages}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                  placeholder="e.g., 5mg, 10mg, 20mg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                  placeholder="e.g., Zeeza Pharma"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                  placeholder="e.g., Used to treat high blood pressure"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Side Effects
                </label>
                <textarea
                  name="sideEffects"
                  value={formData.sideEffects}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                  placeholder="e.g., Dizziness, dry cough, headache"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraindications
                </label>
                <textarea
                  name="contraindications"
                  value={formData.contraindications}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-white"
                  placeholder="e.g., Pregnancy, history of angioedema"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              disabled={addLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addLoading}
              className="flex-1 px-4 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {addLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </>
              ) : (
                "Add Drug"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
