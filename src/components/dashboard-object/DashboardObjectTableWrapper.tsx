import { useCallback, useEffect, useState } from "react";
import { useObyektApiContext } from "../../api/obyekt/ObyektApiContext";
import { showError } from "../../utils/NotificationUtils";
import DashboardObjectTable from "./DashboardObjectTable";
import LeftIcon from "../icons/LeftIcon";
import RightIcon from "../icons/RightIcon";

interface Props {
  readonly userId: number;
  readonly userName: string;
}

const PAGE_SIZE_OPTIONS = [20, 40, 60, 100];

const btnStyle = (disabled: boolean): React.CSSProperties => ({
  width: "34px",
  height: "34px",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  background: "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.4 : 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: 500,
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
});

export default function DashboardObjectTableWrapper({ userId, userName }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { ObyektApi } = useObyektApiContext();

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    ObyektApi.getObyekts({ createdBy: userId, searchValue, pageNumber, pageSize })
      .then((r) => {
        setData(r?.data?.data || []);
        setTotalPageCount(r?.data?.totalPageCount || 0);
        setTotalRowCount(r?.data?.totalRowCount || 0);
      })
      .catch(showError)
      .finally(() => setLoading(false));
  }, [ObyektApi, userId, searchValue, pageNumber, pageSize]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setPageNumber(1);
  }, []);

  const handlePageSize = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPageNumber(1);
  }, []);

  return (
    <div className="d-flex flex-column h-100">
      {/* Header: title + search */}
      <div
        className="d-flex align-items-center justify-content-between px-3 py-2"
        style={{ borderBottom: "1px solid #e2e8f0", flexShrink: 0 }}
      >
        <span className="fw-semibold" style={{ fontSize: "0.95rem" }}>
          {userName} — yaratgan obyektlar
        </span>
        <input
          type="text"
          value={searchValue}
          onChange={handleSearch}
          placeholder="Qidirish..."
          style={{
            height: "34px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "0 12px",
            fontSize: "13px",
            outline: "none",
            width: "220px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        />
      </div>

      {/* Table */}
      <div className="flex-grow-1" style={{ overflow: "auto" }}>
        <DashboardObjectTable data={data} loading={loading} />
      </div>

      {/* Pagination — o'ng tomonda */}
      <div
        className="d-flex align-items-center justify-content-end gap-3 px-3 py-2"
        style={{ borderTop: "1px solid #e2e8f0", flexShrink: 0 }}
      >
        <span style={{ fontSize: "13px", color: "#64748b" }}>Jami: {totalRowCount}</span>

        <select
          value={pageSize}
          onChange={handlePageSize}
          style={{
            width: "68px",
            height: "34px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "0 6px",
            fontSize: "13px",
            outline: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            cursor: "pointer",
          }}
        >
          {PAGE_SIZE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="d-flex align-items-center gap-1">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => p - 1)}
            style={btnStyle(pageNumber <= 1)}
          >
            <LeftIcon color="#000" />
          </button>
          <button style={btnStyle(false)}>{pageNumber}</button>
          <button
            disabled={pageNumber >= totalPageCount}
            onClick={() => setPageNumber((p) => p + 1)}
            style={btnStyle(pageNumber >= totalPageCount)}
          >
            <RightIcon color="#000" />
          </button>
        </div>

        <span style={{ fontSize: "13px", color: "#64748b" }}>
          {pageNumber} / {totalPageCount || 1}
        </span>
      </div>
    </div>
  );
}
