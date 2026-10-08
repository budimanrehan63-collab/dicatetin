import * as XLSX from "xlsx";

interface TransactionExportData {
  Tanggal: string;
  Jenis: string;
  Kategori: string;
  Wallet: string;
  Nominal: number;
  Catatan: string;
  Sumber: string;
}

interface CategorySummaryData {
  Kategori: string;
  Total_Pengeluaran: number;
  Persentase: string;
}

/**
 * Generates an .xlsx file with two sheets: Transaksi and Ringkasan Kategori
 */
export function exportToExcel(
  transactions: TransactionExportData[],
  categorySummary: CategorySummaryData[],
  fileName = "Laporan_Keuangan_Dicatetin"
) {
  // 1. Create workbook
  const wb = XLSX.utils.book_new();

  // 2. Transaksi Sheet
  const wsTransactions = XLSX.utils.json_to_sheet(transactions);
  XLSX.utils.book_append_sheet(wb, wsTransactions, "Daftar Transaksi");

  // 3. Ringkasan Kategori Sheet
  const wsSummary = XLSX.utils.json_to_sheet(categorySummary);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan Pos Pengeluaran");

  // 4. Download file in browser
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

/**
 * Generates a .csv file ready for Google Sheets import
 */
export function exportToCSV(
  transactions: TransactionExportData[],
  fileName = "Transaksi_Dicatetin"
) {
  const ws = XLSX.utils.json_to_sheet(transactions);
  const csvOutput = XLSX.utils.sheet_to_csv(ws);

  const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
