import { useMemo, useState } from "react";
import {
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from '@mui/icons-material/Close';

import HideColumns from "./Addons/VisibleColumnsFilter/visibleColumnsFilter";
import FilterColumns from "./Addons/ColumnFilters/columnFilters";

import "./baseReactTableV8.scss";

import {
  useReactTable,
  createColumnHelper,
  flexRender, ColumnDef,
  RowData,
  ColumnFiltersState,
  ColumnOrderState,
  getCoreRowModel,
  SortingState,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from "@tanstack/react-table";
import { makeData } from "./makeData";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "string" | "number" | "boolean";
  }
}

type rowDataType = {
  subRows?: rowDataType[];
  [key: string]: any;
};

type FilterVariantType = "string" | "number" | "boolean";

export type columnDataType = {
  columns?: columnDataType[];
  [key: string]: any;
};

type SubHeaderType = {
  key?: string;
  label: string;
  size?: number;
  filterVariant?: FilterVariantType;
  sub_headers?: SubHeaderType[];
  [key: string]: any;
};


const row_header: any = [
  {
    label: "Name",
    sub_headers: [
      {
        key: "firstName",
        label: "First Name",
        filterVariant: "string",
        size: 200,
      },
      {
        key: "lastName",
        label: "Last Name",
        filterVariant: "string",
        size: 200,
      },
    ],
  },
  {
    label: "Info",
    sub_headers: [
      {
        key: "age",
        label: "Age",
        size: 200,
        filterVariant: "number",
      },
      {
        label: "More Info",
        sub_headers: [
          {
            key: "visits",
            label: "Visits",
            size: 200,
            filterVariant: "number",
          },
          {
            key: "status",
            label: "Status",
            size: 200,
            filterVariant: "string",
          },
          {
            key: "progress",
            label: "Profile Progress",
            size: 200,
            filterVariant: "number",
          },
        ],
      },
    ],
  },
  {
    key: "bool",
    label: "Boolean",
    size: 200,
    filterVariant: "boolean",
  },
];

export const columnHelper = createColumnHelper<rowDataType>();

// const defaultColumns: ColumnDef<columnDataType>[] = [
//   {
//     header: "Name",
//     columns: [
//       {
//         accessorKey: "firstName",
//         header: "First Name",
//       },
//       {
//         accessorKey: "lastName",
//         header: () => <span>Last Name</span>,
//       },
//     ],
//   },
//   {
//     header: "Info",
//     columns: [
//       {
//         accessorKey: "age",
//         header: "Age",
//       },
//       {
//         header: "More Info",
//         columns: [
//           {
//             accessorKey: "visits",
//             header: () => <span>Visits</span>,
//           },
//           {
//             accessorKey: "status",
//             header: "Status",
//           },
//           {
//             accessorKey: "progress",
//             header: "Profile Progress",
//           },
//         ],
//       },
//     ],
//   },
// ];

const defaultColumns2: ColumnDef<columnDataType>[] = [
  columnHelper.group({
    header: "Name",
    footer: (props) => props.column.id,
    columns: [
      columnHelper.accessor("firstName", {
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        header: "First Name",
        filterFn: "includesString",
        size: 200,
        enableSorting:false
      }),
      columnHelper.accessor("lastName", {
        cell: (info) => info.getValue(),
        header: "Last Name",
        footer: (props) => props.column.id,
        meta: {
          filterVariant: "string",
        },
        size: 200,
      }),
    ],
  }),
  columnHelper.group({
    header: "Info",
    footer: (props) => props.column.id,
    columns: [
      columnHelper.accessor("age", {
        header: "Age",
        footer: (props) => props.column.id,
        size: 200,
        meta: {
          filterVariant: "number",
        },
        // enableColumnFilter: false
      }),
      columnHelper.group({
        header: "More Info",
        footer: (props) => props.column.id,
        columns: [
          columnHelper.accessor("visits", {
            header: "Visits",
            footer: (props) => props.column.id,
            size: 200,
            meta: {
              filterVariant: "number",
            },
            // enableColumnFilter: false
          }),
          columnHelper.accessor("status", {
            header: "Status",
            footer: (props) => props.column.id,
            size: 200,
            meta: {
              filterVariant: "string",
            },
          }),
          columnHelper.accessor("progress", {
            header: "Profile Progress",
            footer: (props) => props.column.id,
            size: 200,
            meta: {
              filterVariant: "number",
            },
          }),
        ],
      }),
    ],
  }),
  columnHelper.accessor("bool", {
    header: "Boolean",
    footer: (props) => props.column.id,
    size: 200,
    meta: {
      filterVariant: "boolean",
    },
    // cell:(props) => <Checkbox checked={props.getValue() as boolean}/>  Just used for testing Boolean sorting capability
  }),
];

const constructColumns = (
  headerArray: SubHeaderType[]
): ColumnDef<rowDataType, any>[] => {
  return headerArray.map((header) => {
    const { sub_headers, label, key, filterVariant, ...rest } = header;
    if (sub_headers && sub_headers.length > 0) {
      return columnHelper.group({
        header: label,
        footer: (props) => props.column.id,
        columns: constructColumns(sub_headers),
        ...rest,
      });
    } else {
      return columnHelper.accessor(key!, {
        header: label,
        footer: (props) => props.column.id,
        size: header.size,
        meta: {
          filterVariant: filterVariant,
        },
        ...rest,
      });
    }
  });
};

// console.log("--dc2", defaultColumns2);
// console.log("--cc2", constructColumns(row_header));

type TablePropsType = {
  isColumnFooterVisible?: boolean;
  isColumnHidingVisible?: boolean;
  isGlobalFilter?: boolean;
  paginatedTable?: boolean;
  flexiblePageSize?: boolean;
  sortingTable?: boolean;
  multiSort?: boolean;
  maxMultiSortColCount?: number;
  columnFilters?: boolean;
  initialState?: any;
};

export default function BaseTable(props: TablePropsType) {
  const [data, setData] = useState(() => makeData(500));
  const columns = useMemo<ColumnDef<columnDataType, any>[]>(
    () => [...constructColumns(row_header)],
    []
  );
  const [columnVisibility, setColumnVisibility] = useState(
    props.initialState?.columnVisibility
      ? props.initialState?.columnVisibility
      : {}
  );
  const [columnPinning, setColumnPinning] = useState(
    props.initialState?.columnPinning ? props.initialState?.columnPinning : {}
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [sorting, setSorting] = useState<SortingState>(
    props.initialState?.sorting ? props.initialState?.sorting : []
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [globalFilterInput, setGlobalFilterInput] = useState("");
  const [paginationIndex, setPaginationIndex] = useState(10);

  const isColumnFooterVisible = props.isColumnFooterVisible
    ? props.isColumnFooterVisible
    : false;

  const isColumnHidingVisible = props.isColumnHidingVisible
    ? props.isColumnHidingVisible
    : false;

  const isGlobalFilter = props.isGlobalFilter ? props.isGlobalFilter : false;
  const isPageSizeFlexible = props.flexiblePageSize
    ? props.flexiblePageSize
    : false;

    const isTablePaginated = (props.paginatedTable === false) ? props.paginatedTable : true;
    const isTableSorted = (props.sortingTable === false) ? props.sortingTable : true ;

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      minSize: 50,
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getPaginationRowModel: props.paginatedTable
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel:
    (props.sortingTable === false || props.sortingTable === undefined) ? undefined : getSortedRowModel(),
    isMultiSortEvent: (e) => ((props.multiSort === false) ? props.multiSort : true),
    maxMultiSortColCount: props.maxMultiSortColCount
      ? props.maxMultiSortColCount
      : 5,
    enableColumnResizing: true,
    columnResizeDirection: "ltr",
    columnResizeMode: "onChange",
    enableColumnFilters:
      props.columnFilters === false ? props.columnFilters : true,
    state: {
      columnVisibility,
      columnOrder,
      columnPinning,
      columnFilters,
      globalFilter,
      sorting,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
  });


  //Column Data Sorting.
  const isColumnSortable = (column: columnDataType): boolean => {
    const columnLeafArrs = column.getLeafColumns();
    if (columnLeafArrs.length === 1) {
      return column.getCanSort();
    } else return false;
  };

  //Column Data Filtering.
  const isColumnFilterable = (column: columnDataType): boolean => {
    const columnLeafArrs = column.getLeafColumns();
    if (columnLeafArrs.length === 1) {
      return column.getCanFilter() && column.columnDef?.meta?.filterVariant;
    } else return false;
  };


  const buildPaginationList = () => {
    const currentPage = table.getState().pagination.pageIndex + 1;
    const numPages = table.getPageCount();
    const paginationRange = [];

    if (numPages > 1) {
      paginationRange.push(0, 1);
    }

    if (currentPage > 4) {
      paginationRange.push("...");
    }

    for (
      let i = Math.max(currentPage - 1, 3);
      i <= Math.min(currentPage + 1, numPages - 2);
      i++
    ) {
      paginationRange.push(i - 1);
    }

    if (currentPage < numPages - 3) {
      paginationRange.push("...");
    }

    if (numPages > 2) {
      paginationRange.push(numPages - 2, numPages - 1);
    }

    return (
      <>
        {paginationRange.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              className={`pagination-button ${
                page === currentPage - 1 ? "active" : ""
              }`}
              onClick={() => table.setPageIndex(page)}
            >
              {page + 1}
            </button>
          ) : (
            <span key={index} className="pagination-ellipsis">
              {page}
            </span>
          )
        )}
      </>
    );
  };


  return (
    <div className="table-region">
      <div className="table-top-region">
        <div className="table-top-left">
          {isGlobalFilter && (
            <div>
              <FormControl
                variant="outlined"
                size="small"
                style={{ minWidth: "250px" }}
              >
                <InputLabel>Search Table</InputLabel>
                <OutlinedInput
                  value={globalFilterInput}
                  onChange={(e) => setGlobalFilterInput(e.target.value)}
                  sx={{ paddingRight: "0" }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setGlobalFilter(globalFilterInput)}
                      >
                        <SearchIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setGlobalFilterInput('')
                          setGlobalFilter('')}}
                      >
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Table Search"
                  placeholder="Search All Columns"
                />
              </FormControl>
            </div>
          )}
        </div>
        <div className="table-top-right">
          {isColumnHidingVisible && <HideColumns table={table} />}
        </div>
      </div>
      <div className="table-wrapper">
        <div className="table-container">
          <table style={{ width: table.getTotalSize() }}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const { column } = header;
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          width: header.getSize(),
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height:'37px'
                              }}
                            >
                              {flexRender(
                                column.columnDef.header,
                                header.getContext()
                              )}
                              {/* Sorting Icons Placement */}
                              {(isColumnSortable(column) && isTableSorted) && (
                                <IconButton
                                  onClick={column.getToggleSortingHandler()}
                                >
                                  {column.getIsSorted() ? (
                                    (column.getIsSorted() as string) ===
                                    "desc" ? (
                                      <TrendingFlatIcon
                                        className="cursor-pointer sort-active"
                                        style={{
                                          transform: `rotate(90deg) scaleX(0.8)`,
                                        }}
                                      />
                                    ) : (
                                      <TrendingFlatIcon
                                        className="cursor-pointer sort-active"
                                        style={{
                                          transform: `rotate(-90deg) scaleX(0.8)`,
                                        }}
                                      />
                                    )
                                  ) : (
                                    <SyncAltIcon
                                      className="cursor-pointer sort-inactive"
                                      style={{
                                        transform: `rotate(90deg) scaleX(0.8)`,
                                      }}
                                    />
                                  )}
                                </IconButton>
                              )}
                              {/* Filter Icon Placement */}
                              {isColumnFilterable(column) && (
                                <FilterColumns column={column} />
                              )}
                            </div>
                            <div
                              {...{
                                onDoubleClick: () => header.column.resetSize(),
                                onMouseDown: header.getResizeHandler(),
                                onTouchStart: header.getResizeHandler(),
                                className: `resizer ${
                                  table.options.columnResizeDirection
                                } ${
                                  header.column.getIsResizing()
                                    ? "isResizing"
                                    : ""
                                }`,
                              }}
                            />
                          </>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            {/* Body */}
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            {/* Footer */}
            {isColumnFooterVisible && (
              <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                  <tr key={footerGroup.id}>
                    {footerGroup.headers.map((header) => (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.footer,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </tfoot>
            )}
          </table>
        </div>
        {isTablePaginated && (
          <div className="rt-pagination-container flex items-center gap-2">
            <div className="rt-pagination">
              <div className="rt-pagination-left">
                <button
                  className="pagination-button"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {"Previous"}
                </button>
                {buildPaginationList()}

                <button
                  className="pagination-button"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {"Next"}
                </button>
              </div>
              <span className="go-to-container">
                <span style={{ margin: "0 5px" }}>Go to page:</span>
                <input
                  type="number"
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    setPaginationIndex(page);
                  }}
                  className="border p-1 rounded w-16 number-input"
                />
                <IconButton
                  className="pagination-send"
                  onClick={() => {
                    paginationIndex !== undefined &&
                      table.setPageIndex(paginationIndex);
                  }}
                >
                  <SendIcon />
                </IconButton>
              </span>

              <span className="page-names">
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}{" "}
                -{" "}
                {(table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize}{" "}
                of {table.getRowCount()} items
              </span>
              {isPageSizeFlexible && (
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  className="rows-selector"
                  style={{ marginLeft: "10px" }}
                >
                  {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize} rows per page
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}
      </div>
      {/* <div>
        <pre>{JSON.stringify(table.getState(), null, 1)}</pre>
      </div> */}
    </div>
  );
}
