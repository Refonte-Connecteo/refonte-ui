"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const DOC_EXTENSIONS = [".pdf", ".doc", ".docx"];

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  /** Accepte aussi les documents (pdf/doc/docx) en plus des images. */
  acceptDocuments?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  acceptDocuments = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptedExtensions = acceptDocuments
    ? [...IMAGE_EXTENSIONS, ...DOC_EXTENSIONS]
    : IMAGE_EXTENSIONS;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    const ext = file.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] ?? "";
    if (!acceptedExtensions.includes(ext)) {
      setError(
        `Format non supporté (${acceptedExtensions.join(", ")} uniquement).`,
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError("Le fichier ne doit pas dépasser 10 Mo.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const result = await api.uploadFile(file);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {uploading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Upload...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Choisir un fichier
            </>
          )}
        </button>
        <input ref={inputRef} type="file" accept={acceptDocuments ? acceptedExtensions.join(",") : "image/*"} onChange={handleFile} className="hidden" />
        {value && (
          <span className="text-xs text-green-600">Fichier chargé</span>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2 items-center">
        <span className="text-xs text-gray-400 shrink-0">ou URL :</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          placeholder="https://... ou /images/mon-image.png"
        />
      </div>

      {value && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={value.startsWith("http") ? value : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3000"}${value}`}
            alt="Aperçu"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}
