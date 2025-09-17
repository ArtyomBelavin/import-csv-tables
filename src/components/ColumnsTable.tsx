import type { LeadColumnInfo } from "../types";

interface Props {
  columns: LeadColumnInfo[];
}

export default function ColumnsTable({ columns }: Props) {
  return (
    <table className="mt-6 table-auto w-full rounded-lg overflow-hidden shadow-md">
      <thead className="bg-gray-100 text-sm text-gray-700">
        <tr>
          <th className="px-6 py-3 text-left">Name</th>
          <th className="px-6 py-3 text-left">Type</th>
          <th className="px-6 py-3 text-left">Status</th>
          <th className="px-6 py-3 text-left">Description</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 text-sm">
        {columns.map((c, i) => (
          <tr key={i} className="hover:bg-gray-50 transition">
            <td className="px-6 py-3 font-medium">
              {c.columnName}
              {c.required && <span className="text-red-500">*</span>}
            </td>
            <td className="px-6 py-3">{c.type}</td>
            <td className="px-6 py-3">
              {c.status === "Detected" ? (
                <span className="text-green-600 font-semibold">{c.status}</span>
              ) : (
                <span className="text-red-500">{c.status}</span>
              )}
            </td>
            <td className="px-6 py-3 text-gray-600">{c.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
