import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";
import detectColumnType from "../utils/detectColumnType";
import getDescription from "../utils/columnDescriptions";
import LeadTable from "./LeadTable";
import { LeadColumnInfo } from "../types";

const REQUIRED_FIELDS = ["Name"];

export default function LeadImporter() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [columnsInfo, setColumnsInfo] = useState<LeadColumnInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File | null) => {
    if (!file) return;
    const ext = file.name.split(".").pop()!.toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          const rows = res.data as any[];
          setData(rows);
          const heads = Object.keys(rows[0] || {});
          setHeaders(heads);
          buildColumnsInfo(heads, rows);
        },
      });
    } else if (["xls", "xlsx"].includes(ext)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target!.result, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        setData(rows);
        const heads = Object.keys(rows[0] || {});
        setHeaders(heads);
        buildColumnsInfo(heads, rows);
      };
      reader.readAsBinaryString(file);
    } else {
      setError("Unsupported file format");
    }
  };

  const buildColumnsInfo = (heads: string[], rows: any[]) => {
    const info: LeadColumnInfo[] = heads.map((h) => {
      const values = rows.map((r) => r[h]);
      const type = detectColumnType(values);
      const required = REQUIRED_FIELDS.includes(h);
      return {
        name: h,
        type,
        status: required ? "Detected" : "Optional",
        description: getDescription(h),
      };
    });
    setColumnsInfo(info);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      handleFile(e.dataTransfer.files[0]);
  };

  const handleImport = async () => {
    const missing = REQUIRED_FIELDS.filter((f) => !headers.includes(f));
    if (missing.length) {
      setError(`Missing required fields: ${missing.join(", ")}`);
      return;
    }

    // Здесь замените на реальный POST к бэку (FormData или JSON) с обработкой 400/200
    try {
      // Симуляция загрузки
      await new Promise((r) => setTimeout(r, 800));
      setSuccess(true);
      setError(null);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError("Failed to import");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Import Leads (CSV / Excel)</h1>
        <p className="text-gray-600 mb-4">
          Drop a CSV or Excel file here or click to select.
        </p>

        <form
          onDragEnter={handleDrag}
          onSubmit={(e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
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
              Select file or drag and drop
            </div>
            <div className="text-sm text-gray-500">
              We accept CSV, XLS, XLSX
            </div>
          </label>
        </form>

        <div className="flex justify-between items-center gap-4 mt-6">
          <div />
          <div>
            <button
              onClick={handleImport}
              disabled={!data.length}
              className={`px-6 py-3 rounded-xl shadow transition ${
                data.length
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Import to system
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-600 font-semibold mt-4">{error}</div>
        )}

        {columnsInfo.length > 0 && <LeadTable columnsInfo={columnsInfo} />}
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
