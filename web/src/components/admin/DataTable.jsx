export default function DataTable({
  columns, data, loading, emptyMessage = 'Hech nima topilmadi',
  onRowClick, pagination, onPageChange,
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left font-bold uppercase tracking-widest text-[10px] text-on-surface-variant px-4 py-3"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-on-surface-variant">Yuklanmoqda…</td>
              </tr>
            )}
            {!loading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-on-surface-variant">{emptyMessage}</td>
              </tr>
            )}
            {!loading && data.map((row) => (
              <tr
                key={row.id ?? row.key ?? JSON.stringify(row)}
                className={`border-b border-outline-variant/50 last:border-b-0 ${onRowClick ? 'hover:bg-surface-container-low cursor-pointer' : ''}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-on-surface">
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.total > pagination.limit && (
        <div className="border-t border-outline-variant px-4 py-2 flex items-center justify-between text-sm text-on-surface-variant">
          <span>
            {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} / {pagination.total}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1 rounded border border-outline-variant disabled:opacity-40 hover:bg-surface-container"
            >
              ‹
            </button>
            <span className="px-3 py-1">{pagination.page}</span>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page * pagination.limit >= pagination.total}
              className="px-3 py-1 rounded border border-outline-variant disabled:opacity-40 hover:bg-surface-container"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
