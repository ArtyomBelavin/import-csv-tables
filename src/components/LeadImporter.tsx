import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";
import { mapColumns } from "../utils/mapColumns";
import type { LeadColumnInfo } from "../types";
import { REQUIRED_FIELDS } from "../utils/requiredFields";
import ColumnsTable from "./ColumnsTable";

type FormValues = {
  file: FileList;
};

export default function LeadImporter() {
  const [columns, setColumns] = useState<LeadColumnInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<FormValues>();

  // Конвертируем файл в Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1]; // убираем префикс data:...
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFile = (file: File | null) => {
    if (!file) return;

    setSelectedFile(file); // сохраняем файл

    const ext = file.name.split(".").pop()!.toLowerCase();
    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          const rows = res.data as any[];
          const heads = Object.keys(rows[0] || {});
          setColumns(mapColumns(heads));
        },
      });
    } else if (["xls", "xlsx"].includes(ext)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target!.result, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        const heads = Object.keys(rows[0] || {});
        setColumns(mapColumns(heads));
      };
      reader.readAsBinaryString(file);
    } else {
      setError("Unsupported file format");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files ? e.target.files[0] : null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
      setValue("file", e.dataTransfer.files as any);
    }
  };

  const onSubmit = handleSubmit(async () => {
    const missing = REQUIRED_FIELDS.filter(
      (f) => !columns.some((c) => c.mappedField === f)
    );
    if (missing.length) {
      setError(`Missing required fields: ${missing.join(", ")}`);
      return;
    }

    if (!selectedFile) {
      setError("No file selected");
      return;
    }

    try {
      const base64File = await fileToBase64(selectedFile);

      console.log(base64File);
      // Отправка на бекенд
      // const response = await fetch("YOUR_BACKEND_URL", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ ImportFile: base64File }),
      // });

      // if (!response.ok) throw new Error("Failed to upload");

      setSuccess(true);
      setError(null);
      setColumns([]);
      setSelectedFile(null);
      reset();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to import");
    }
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Import CSV/Excel File</h1>
        <p className="text-gray-600 mb-4">
          First row must contain column names in English.
        </p>
        <p className="text-blue-600 flex items-center gap-1 mb-6">
          Download sample
        </p>

        {columns.length > 0 && <ColumnsTable columns={columns} />}

        <form
          onDragEnter={handleDrag}
          onSubmit={onSubmit}
          className={`mt-6 border-2 border-dashed rounded-xl p-8 text-center transition ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
        >
          <input
            id="file"
            type="file"
            accept=".csv,.xls,.xlsx"
            {...register("file")}
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="file"
            className="cursor-pointer flex flex-col items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-500 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <div className="text-blue-600 font-medium">
              Select CSV/Excel file
            </div>
            <div className="text-sm text-gray-500">or drag and drop here</div>
          </label>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={!columns.length}
              className={`px-6 py-3 rounded-xl shadow transition ${
                columns.length
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Import
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-600 font-semibold mt-4">{error}</div>
        )}
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg"
          >
            Lead import succeed ✅
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
