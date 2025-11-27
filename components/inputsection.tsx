"use client";
import React, { useState, ChangeEvent, DragEvent, FormEvent } from "react";
import { Download } from "lucide-react";
import { supabase } from "@/lib/supabaseclient"

interface FormData {
  releaseNumber: string;
  buildVersion: string;
  fixExplained: string;
  affectedModules: string;
  date: string;
  comments: string;
}

const InputSection: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    releaseNumber: "",
    buildVersion: "",
    fixExplained: "",
    affectedModules: "",
    date: "",
    comments: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) setFile(files[0]);
  };

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file first");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Upload file to Supabase Storage
      const filePath = `releases/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("apkreleases")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2️⃣ Get public file URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("apkreleases").getPublicUrl(filePath);

      // 3️⃣ Insert data into Supabase table
      const { error: insertError } = await supabase.from("releases").insert([
        {
          release_number: formData.releaseNumber,
          build_version: formData.buildVersion,
          fix_explained: formData.fixExplained,
          affected_modules: formData.affectedModules,
          date: formData.date,
          comments: formData.comments,
          file_url: publicUrl,
        },
      ]);

      if (insertError) throw insertError;

      alert("Release added successfully!");
      setFormData({
        releaseNumber: "",
        buildVersion: "",
        fixExplained: "",
        affectedModules: "",
        date: "",
        comments: "",
      });
      setFile(null);
    } catch (error: any) {
      console.error("Upload error:", error.message);
      alert("Something went wrong! Check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">
      {/* Upload Section */}
      <div className="h-36 flex items-center justify-center">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative w-[80%] max-w-3xl h-32 rounded-xl border border-black flex flex-col items-center justify-center transition-colors ${
            dragActive ? "bg-blue-50" : "bg-white"
          }`}
        >
          <Download size={48} className="text-black mb-2" />
          <p className="text-sm text-center">
            <span className="font-semibold cursor-pointer text-black hover:underline">
              Choose a file
            </span>{" "}
            or drag it here
          </p>
          <input
            type="file"
            onChange={handleChangeFile}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          {file && (
            <p className="text-xs text-gray-600 mt-2">
              Selected: {file.name}
            </p>
          )}
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-[80%] max-w-3xl mx-auto">
        <input
          type="text"
          name="releaseNumber"
          placeholder="Release Number"
          value={formData.releaseNumber}
          onChange={handleInputChange}
          className="border border-gray-400 placeholder-black rounded-lg px-3 py-2 w-full"
        />
        <input
          type="text"
          name="buildVersion"
          placeholder="Build Version"
          value={formData.buildVersion}
          onChange={handleInputChange}
          className="border border-gray-400 placeholder-black rounded-lg px-3 py-2 w-full"
        />
        <input
          type="text"
          name="affectedModules"
          placeholder="Affected Modules"
          value={formData.affectedModules}
          onChange={handleInputChange}
          className="border border-gray-400 placeholder-black rounded-lg px-3 py-2 w-full"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="border border-gray-400 placeholder-black rounded-lg px-3 py-2 w-full"
        />
        <textarea
          name="fixExplained"
          placeholder="Fix Explained"
          value={formData.fixExplained}
          onChange={handleInputChange}
          className="border border-gray-400 placeholder-black rounded-lg px-3 py-2 w-full col-span-2 min-h-20"
        />
        <textarea
          name="comments"
          placeholder="Comments"
          value={formData.comments}
          onChange={handleInputChange}
          className="border border-gray-400 placeholder-black rounded-lg px-3 py-2 w-full col-span-2 min-h-[60px]"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#007C36] text-white font-medium w-32 rounded-md py-2 hover:bg-[#00652c] transition"
        >
          {loading ? "Uploading..." : "Add Release"}
        </button>
      </div>
    </form>
  );
};

export default InputSection;
