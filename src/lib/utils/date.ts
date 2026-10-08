/**
 * Date formatting utilities for Indonesian Locale and Asia/Jakarta timezone
 */

const ID_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const ID_MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

const ID_DAYS = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
];

export function formatDateID(
  date: string | Date | null | undefined,
  format: "full" | "short" | "time" | "datetime" | "month_year" | "iso_date" = "short"
): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";

  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const dayName = ID_DAYS[d.getDay()];

  switch (format) {
    case "full":
      return `${dayName}, ${day} ${ID_MONTHS[month]} ${year}`;
    case "short":
      return `${day} ${ID_MONTHS_SHORT[month]} ${year}`;
    case "time":
      return `${hours}:${minutes} WIB`;
    case "datetime":
      return `${day} ${ID_MONTHS_SHORT[month]} ${year} ${hours}:${minutes}`;
    case "month_year":
      return `${ID_MONTHS[month]} ${year}`;
    case "iso_date":
      return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    default:
      return `${day} ${ID_MONTHS_SHORT[month]} ${year}`;
  }
}

export function getCurrentMonthISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}
