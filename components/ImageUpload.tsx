"use client";

import { useState, useRef } from "react";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { api } from "@/lib/api";
import { Input } from "@/app/admin/components/ui";

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
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50/60 px-4 py-3.5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-sm font-semibold hover:border-brand-300 hover:text-brand-700 disabled:opacity-50 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Upload...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Choisir un fichier
            </>
          )}
        </button>
        <input ref={inputRef} type="file" accept={acceptDocuments ? acceptedExtensions.join(",") : "image/*"} onChange={handleFile} className="hidden" />
        {value ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Fichier chargé
          </span>
        ) : (
          <span className="text-xs text-gray-500">10 Mo maximum</span>
        )}
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}

      <div className="flex gap-2 items-center">
        <span className="text-xs text-gray-500 shrink-0">ou URL :</span>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... ou /images/mon-image.png"
          className="flex-1"
        />
      </div>

      {value && (
        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
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
