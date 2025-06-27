import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, ArrowUpDown } from "lucide-react";

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination: PaginationData;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearch?: (searchTerm: string) => void;
  onSort?: (column: keyof T, direction: "asc" | "desc") => void;
  rowActions?: (row: T) => React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pagination,
  loading = false,
  searchable = false,
  searchPlaceholder = "Search...",
  title,
  subtitle,
  actions,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onSort,
  rowActions,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleSort = (column: keyof T) => {
    if (!columns.find(col => col.key === column)?.sortable) return;
    
    const newDirection = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort?.(column, newDirection);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      onPageChange?.(page);
    }
  };

  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {(title || subtitle || searchable || actions) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                {title && <CardTitle className="text-2xl font-bold">{title}</CardTitle>}
                {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-4">
                {searchable && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder={searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                )}
                {actions}
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/20">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      style={{ width: column.width }}
                      className={`px-6 py-4 text-left text-sm font-medium text-muted-foreground ${
                        column.sortable ? "cursor-pointer hover:text-foreground transition-colors" : ""
                      }`}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                        {sortColumn === column.key && (
                          <Badge variant="outline" className="text-xs">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </Badge>
                        )}
                      </div>
                    </th>
                  ))}
                  {rowActions && (
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: pagination.itemsPerPage }).map((_, index) => (
                    <tr key={index} className="border-b border-border">
                      {columns.map((column) => (
                        <td key={String(column.key)} className="px-6 py-4">
                          <Skeleton className="h-6 w-full" />
                        </td>
                      ))}
                      {rowActions && (
                        <td className="px-6 py-4">
                          <Skeleton className="h-8 w-20" />
                        </td>
                      )}
                    </tr>
                  ))
                ) : data.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={columns.length + (rowActions ? 1 : 0)} className="px-6 py-12 text-center">
                      <div className="text-muted-foreground">
                        <p className="text-lg font-medium">No data found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Data rows
                  data.map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      {columns.map((column) => (
                        <td key={String(column.key)} className="px-6 py-4">
                          {column.render
                            ? column.render(row[column.key], row)
                            : String(row[column.key] || "-")}
                        </td>
                      ))}
                      {rowActions && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {rowActions(row)}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
                  {pagination.totalItems} results
                </p>
                
                {onPageSizeChange && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rows per page:</span>
                    <Select
                      value={pagination.itemsPerPage.toString()}
                      onValueChange={(value) => onPageSizeChange(parseInt(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={!pagination.hasPreviousPage}
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={page === pagination.currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="min-w-[2.5rem]"
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={!pagination.hasNextPage}
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}