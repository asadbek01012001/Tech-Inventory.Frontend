import "./assets/table.scss";
import { useMemo, useCallback, useState, useEffect } from "react";
import { useTable, useBlockLayout, useResizeColumns, useSortBy } from "react-table";

interface TableProps {
  readonly data: any[];
  readonly columns: any;
  readonly loading?: boolean;
  readonly selectRowCheckbox?: (select: any[]) => void;
}

function withMinWidth(style: React.CSSProperties | undefined): React.CSSProperties {
  return { ...style, minWidth: "100%" };
}

export default function Table({ columns, data = [], loading, selectRowCheckbox }: TableProps) {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 10,
      width: 150,
      maxWidth: 1000,
    }),
    [],
  );

  const [dataTable, setDataTable] = useState<any[]>([]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout,
    useResizeColumns,
    useSortBy,
  );

  useEffect(() => {
    setDataTable(rows);
  }, [rows]);

  const setIds = useCallback(
    (value: any) => {
      let arr = value.map((item: any) => {
        if (item.isChecked) {
          console.log(item?.values);
          return item?.values?.id;
        }
      });
      let arrr = arr.filter((item: any) => item);
      selectRowCheckbox && selectRowCheckbox(arrr);
    },
    [selectRowCheckbox],
  );

  const handleChange = useCallback(
    (value: any) => {
      const { name, checked } = value.target;
      if (name === "allSelect") {
        var newData = [...dataTable];
        newData = newData?.map((item: any) => {
          return { ...item, isChecked: checked };
        });
        setIds(newData);
        setDataTable(newData);
      } else {
        var newData = [...dataTable];
        newData = newData?.map((item: any, index: any) =>
          index.toString() === name ? { ...item, isChecked: checked } : item,
        );
        setIds(newData);
        setDataTable(newData);
      }
    },
    [setIds, dataTable],
  );

  const { style: tableStyle, ...tableRest } = getTableProps();

  return (
    <div className="table-wrapper">
      <table
        {...tableRest}
        style={withMinWidth(tableStyle)}
        className="table table-bordered table-striped"
      >
        <thead>
          {headerGroups.map((headerGroup: any, i: any) => {
            const { style: hgStyle, ...hgRest } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={i} {...hgRest} style={withMinWidth(hgStyle)}>
                {selectRowCheckbox ? (
                  <th>
                    <input
                      type="checkbox"
                      name="allSelect"
                      width={100}
                      checked={
                        dataTable?.length > 0
                          ? !dataTable?.some((user: any) => user?.isChecked !== true)
                          : false
                      }
                      onChange={handleChange}
                    />
                  </th>
                ) : (
                  <span style={{ display: "inline-block", width: "40px", textAlign: "center", flexShrink: 0 }}>#</span>
                )}
                {headerGroup.headers.map((column: any, index: any) => (
                  <th
                    key={index}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="d-flex align-items-center justify-content-center"
                  >
                    {column.render("Header")}
                    <div
                      style={{ width: column.width }}
                      {...column.getResizerProps()}
                      className="resizer"
                    />
                  </th>
                ))}
              </tr>
            );
          })}
        </thead>

        {data.length > 0 && !loading ? (
          <tbody {...getTableBodyProps()}>
            {dataTable.map((row: any, index: any) => {
              prepareRow(row);
              const { style: rowStyle, ...rowRest } = row.getRowProps();
              return (
                <tr key={index} {...rowRest} style={withMinWidth(rowStyle)} className="tr">
                  {selectRowCheckbox ? (
                    <td>
                      <input
                        type="checkbox"
                        name={index.toString()}
                        checked={row.isChecked || false}
                        onChange={handleChange}
                      />
                    </td>
                  ) : (
                    <span style={{ display: "inline-block", width: "40px", textAlign: "center", flexShrink: 0 }}>{index + 1}.</span>
                  )}
                  {row.cells.map((cell: any, cellIndex: number) => {
                    return (
                      <td key={cellIndex} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        ) : data.length === 0 && loading ? (
          <div className="d-flex justify-content-center mt-4">
            <h5 className="fw-bold">Yuklanmoqda...</h5>
          </div>
        ) : (
          <div className="d-flex justify-content-center mt-4">
            <h5 className="fw-bold">Hech nars yo'q</h5>
          </div>
        )}
      </table>
    </div>
  );
}
