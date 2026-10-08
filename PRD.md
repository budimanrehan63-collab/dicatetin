# PRD Dicatetin — Aplikasi Manajemen Keuangan
Oct 2, 2026 · @fauzy

## Asumsi & Keputusan
PRD ini mengikuti spesifikasi dari Fauzy. Empat poin yang belum dijawab diisi dengan asumsi di bawah; ubah di sini dulu sebelum mulai prompt Fase 1.

| Topik | Keputusan di PRD ini | Alasan |
|---|---|---|
| **Nama produk** | Dicatetin (produk terpisah, stack mengikuti rencana mencatat.id) | Nama disebut di brief; tinggal ganti satu kata kalau berubah |
| **Akses Basic ke Telegram & AI** | Basic tanpa Telegram & AI, sesuai brief. Semua fitur diatur lewat feature flag per paket di admin | Kalau nanti Basic mau dapat Telegram teks, cukup centang di admin tanpa coding ulang |
| **Reminder untuk Basic** | Lewat email + notifikasi in-app; Pro lewat Telegram + email | Basic tidak punya Telegram |
| **Aktivasi akun** | Dua mode yang bisa dipilih admin: Auto-aktif setelah bayar (Midtrans) dan ACC manual (transfer manual / daftar tanpa bayar). Default: ACC manual, sesuai brief | Admin bisa beralih ke auto kalau volume pendaftar sudah besar |
| **"Bernada"** | Dibaca sebagai Beranda (halaman utama user) | Kemungkinan salah ketik |
| **Koneksi Telegram** | 1 bot bersama; user hubungkan pakai kode/token unik dari dashboard | User awam tidak perlu bikin bot sendiri |
| **Mata uang & zona waktu** | Rupiah (IDR), Asia/Jakarta | Target pasar Indonesia |

---

## Ringkasan Produk
**Dicatetin** adalah web app langganan untuk mencatat pemasukan dan pengeluaran. User bisa mencatat lewat dashboard, atau cukup chat, kirim voice note, dan foto struk ke bot Telegram; AI yang mencatatkannya.

- **Masalah**: gaji lumayan tapi uang habis tanpa tahu ke mana. Penyebabnya, kebanyakan orang tidak mencatat, atau mencatat dengan cara manual yang berantakan.
- **Solusi**: pencatatan secepat kirim chat, lalu dashboard dan grafik yang langsung menjawab "uangku habis buat apa".
- **Target**: karyawan, ibu rumah tangga, dan semua kalangan yang punya penghasilan rutin.
- **Diferensiasi**: dibanding template sheet manual, input lewat Telegram (teks, VN, foto struk) otomatis masuk ke aplikasi; ada reminder dan budget; bisa export ke Excel/Google Sheets.
- **Bahasa**: seluruh UI, bot, dan email dalam Bahasa Indonesia.
- **Model bisnis**: langganan bulanan, paket Basic dan Pro, dikelola dari dashboard admin.
- **Metrik sukses MVP**: user aktif mencatat minimal 4 hari per minggu; persentase user yang lanjut berlangganan di bulan kedua; akurasi AI baca struk (dikoreksi user kurang dari 20% transaksi).

---

## Paket Langganan & Matriks Fitur
Ada dua paket bulanan: **Basic Rp59.000** dan **Pro Rp99.000**. Harga, durasi, dan fitur tiap paket disimpan di database dan bisa diubah admin, tidak di-hardcode.

| Fitur | Basic (Rp59rb) | Pro (Rp99rb) |
|---|:---:|:---:|
| Beranda / dashboard + grafik | Ya | Ya |
| Wallet (multi dompet/rekening) | Ya | Ya |
| Catat pemasukan & pengeluaran manual di web | Ya | Ya |
| Riwayat transaksi + filter | Ya | Ya |
| Budget per kategori | Ya | Ya |
| Export Excel (.xlsx) & CSV untuk Google Sheets | Ya | Ya |
| Reminder via email + in-app | Ya | Ya |
| Koneksi Telegram bot | Tidak | Ya |
| Catat via chat teks Telegram (AI) | Tidak | Ya |
| Catat via voice note (AI) | Tidak | Ya |
| Scan struk (upload web & Telegram, AI) | Tidak | Ya |
| Reminder via Telegram | Tidak | Ya |
| Ringkasan & insight AI (harian/mingguan) | Tidak | Ya |
| Tutorial & setting | Ya | Ya |

- **Aturan teknis**: setiap fitur punya kode unik (misal `telegram`, `ai_scan`, `ai_voice`, `ai_chat`, `ai_insight`, `export`, `budget`). Tabel `plan_features` menentukan paket mana yang dapat fitur apa. Di sisi user, menu fitur Pro tetap tampil tapi terkunci dengan tombol "Upgrade ke Pro". Pembatasan wajib dicek di server (API & webhook bot), bukan hanya disembunyikan di UI.
- **Fair use Pro (disarankan)**: maksimal 300 aksi AI per bulan (scan struk + VN + chat AI), bisa diatur admin, supaya biaya API terkendali.

---

## Role & Alur User
User hanya bisa masuk ke dashboard kalau statusnya aktif dan langganannya belum habis. Semua jalur pendaftaran berujung ke dua kondisi ini.

### Role:
1. **Superadmin**: semua akses, termasuk kelola admin lain dan pengaturan API.
2. **Admin**: kelola user, langganan, pembayaran; tidak bisa mengubah API key.
3. **User**: akses dashboard user sesuai paket.

### Status akun:
`pending` (menunggu ACC/pembayaran) → `active` → `suspended` (dibekukan admin) atau `expired` (langganan habis).

### Alur daftar mandiri:
1. User klik CTA di landing page, pilih paket Basic atau Pro.
2. Isi form daftar: nama, email, nomor WhatsApp, password. Verifikasi email lewat link.
3. Pilih cara bayar: Midtrans (otomatis) atau transfer manual dengan upload bukti.
4. Midtrans sukses + mode auto-aktif menyala → status `active`, langsung diarahkan ke Beranda.
5. Transfer manual, atau mode ACC manual menyala → status `pending`; user melihat halaman "Menunggu persetujuan admin".
6. Admin klik ACC → status `active`, user dapat email (dan notifikasi Telegram kalau sudah terhubung), lalu bisa login ke dashboard.

### Alur invite admin:
Admin isi email, nama, paket, dan durasi → sistem kirim email undangan berisi link buat password → akun langsung `active` tanpa perlu ACC.

### Login:
Email + password, dengan opsi Login Google. Ada lupa password lewat email, dan logout dari semua perangkat.

### Langganan habis:
H-3 dan H-1 dikirim pengingat perpanjang. Saat habis, status menjadi `expired` dan user hanya bisa membuka halaman perpanjang serta export data (data tidak dihapus).

---

## Dashboard User
Dashboard user punya 10 menu di sidebar (bottom nav di HP). Semua angka dalam Rupiah dengan format `Rp1.250.000`.

1. **Beranda**:
   - Kartu ringkasan bulan ini: total saldo semua wallet, pemasukan, pengeluaran, selisih (surplus/defisit).
   - Grafik garis arus kas harian 30 hari (pemasukan vs pengeluaran).
   - Grafik donut pengeluaran per kategori, dengan kategori terbesar disorot ("Paling boros: Makan & Minum 32%").
   - Progress budget bulan ini, 5 transaksi terakhir, dan status streak mencatat ("Sudah mencatat 6 hari berturut-turut").
   - Filter periode: minggu ini, bulan ini, bulan lalu, custom.
2. **Transaksi**:
   - Tabel/list semua transaksi: tanggal, jam, jenis, kategori, wallet, nominal, catatan, sumber (Web/Telegram/VN/Struk).
   - Filter: periode, jenis, kategori, wallet, sumber; pencarian catatan.
   - Tambah, edit, hapus transaksi. Transaksi dari struk bisa dibuka untuk melihat rincian item dan foto struk.
   - Transfer antar wallet (tidak dihitung sebagai pemasukan/pengeluaran).
3. **Catat (tombol + mengambang di semua halaman)**:
   - Form cepat: jenis, nominal (keypad angka besar), kategori (ikon grid), wallet, tanggal, catatan.
4. **Scan Struk (Pro)**:
   - Upload/foto struk → AI baca toko, tanggal, item, total → tampil halaman review yang bisa diedit → Simpan.
5. **Wallet**:
   - Daftar dompet: Tunai, rekening bank, e-wallet. Nama, jenis, saldo awal, ikon/warna. Saldo berjalan dihitung otomatis.
6. **Budget**:
   - Atur limit per kategori per bulan. Progress bar hijau → kuning (80%) → merah (100%), dengan notifikasi saat mencapai 80% dan 100%.
7. **Laporan & Export**:
   - Ringkasan bulanan, perbandingan bulan ke bulan, grafik batang 6 bulan.
   - Export .xlsx dan .csv (siap diimpor ke Google Sheets) per periode.
8. **Telegram (Pro)**:
   - Tombol "Hubungkan Telegram" menghasilkan kode 6 digit + tombol buka bot. Tampilkan status terhubung, username Telegram, tombol putuskan.
9. **Pengaturan**:
   - Profil, ganti password, kategori custom, jadwal reminder (maks. 2 per hari, pilih jam), mode terang/gelap/ikuti sistem, info langganan + tombol perpanjang/upgrade, riwayat pembayaran.
10. **Tutorial**:
    - Panduan langkah demi langkah dengan gambar/video: mulai mencatat, hubungkan Telegram, scan struk, budget, export.
    - Onboarding pertama kali: buat wallet pertama (default "Tunai"), isi saldo awal, pilih jam reminder, lalu (Pro) hubungkan Telegram.

---

## Dashboard Admin
Dashboard admin ada di `/admin`, terpisah dari dashboard user, dan hanya bisa diakses role admin/superadmin.

1. **Overview**:
   - Kartu: total user, user aktif, pending ACC, langganan habis 7 hari ke depan, pendapatan bulan ini (MRR), jumlah Basic vs Pro.
   - Grafik pendaftar dan pendapatan 6 bulan; pemakaian AI hari ini.
2. **Kelola User**:
   - Tabel user: nama, email, WA, paket, status, tanggal berakhir, Telegram terhubung, terakhir aktif. Cari dan filter.
   - Aksi: ACC / tolak pendaftar pending, tambah user manual, invite via email, edit, ganti paket, perpanjang manual, suspend/aktifkan, reset password, hapus user (soft delete dulu, hapus permanen dengan konfirmasi ketik nama).
   - Masuk sebagai user (impersonate) untuk bantu troubleshooting, dengan banner "Mode admin" dan tombol kembali; tercatat di log.
3. **Persetujuan & Pembayaran**:
   - Antrian pendaftar pending dan bukti transfer manual (lihat gambar → ACC/tolak + alasan).
   - Riwayat semua pembayaran Midtrans & manual, status, export.
4. **Kelola Langganan & Paket**:
   - CRUD paket: nama, harga, durasi (hari), deskripsi, aktif/nonaktif, centang fitur yang didapat (feature flags), kuota AI per bulan.
5. **Pengaturan API (superadmin)**:
   - Provider AI (Gemini, OpenAI, DeepSeek, dll): nama, API key (disimpan terenkripsi, tampil tersamar), model, prioritas, aktif/nonaktif.
   - Mode: satu provider, atau failover otomatis berurutan.
   - Tombol "Tes koneksi" per provider.
   - Token bot Telegram + tombol set webhook; server key Midtrans; SMTP/email provider.
6. **Pengaturan Sistem**:
   - Mode aktivasi: ACC manual / auto-aktif setelah bayar.
   - Pendaftaran mandiri: buka/tutup.
   - Template pesan reminder dan email.
   - Info rekening untuk transfer manual.
7. **Log**:
   - Log pemakaian AI (user, jenis, provider, token/biaya, sukses/gagal), log aktivitas admin, log webhook Telegram & Midtrans.

---

## Integrasi Telegram & AI
Semua user Pro memakai satu bot Telegram bersama. Bot terhubung ke server lewat webhook, mengenali user dari `telegram_chat_id`, lalu menyimpan transaksi ke database yang sama dengan dashboard.

- **Menghubungkan akun**:
  - Di menu Telegram, user klik "Hubungkan" → server membuat kode 6 digit, berlaku 10 menit.
  - User buka bot (`link t.me/<bot>?start=<kode>`) atau kirim `/start <kode>`.
  - Server mencocokkan kode, menyimpan `telegram_chat_id` ke user, bot membalas "Akun terhubung, halo <nama>!".
  - Pesan dari chat yang tidak terhubung, atau dari user Basic/expired, dibalas ajakan login/upgrade dan tidak diproses AI.

- **Jenis input**:
  - **Teks**: `"makan siang 25rb pakai gopay" / "gajian 5jt"` → AI ekstrak jenis, nominal, kategori, wallet, tanggal.
  - **Voice note**: rekaman audio `"tadi isi bensin lima puluh ribu"` → Audio transkripsi → sama seperti teks.
  - **Foto struk**: foto nota minimarket → AI vision baca toko, tanggal, item, total → 1 transaksi + rincian item.

- **Aturan respons bot**:
  - Konfirmasi: `"Tercatat: Pengeluaran Rp25.000 · Makan & Minum · GoPay · 2 Okt 12:30"` + tombol inline `Ubah kategori`, `Ubah wallet`, `Hapus`.
  - Multi-transaksi dalam 1 pesan ("parkir 5rb, kopi 18rb") dicatat terpisah.
  - Nominal tidak terbaca/ragu → bot bertanya balik.
  - Wallet tidak disebut → gunakan wallet default.
  - Perintah bot: `/saldo`, `/hariini`, `/bulanini`, `/budget`, `/batal`, `/bantuan`.

- **Lapisan AI (`aiService`)**:
  - Single/failover mode lewat `ai_providers`.
  - Failover prioritas otomatis jika error/timeout 20 detik.
  - Output JSON terstruktur divalidasi dengan Zod.
  - Kuota AI bulanan dicek sebelum pemanggilan.

---

## Reminder & Notifikasi
- Reminder hanya dikirim jika belum ada transaksi hari ini (cron 15 menit).
- Notifikasi budget 80% / 100% secara real-time.
- Ringkasan harian (21.00 WIB) / mingguan (Minggu malam) + AI Insight untuk Pro.
- Langganan H-3 & H-1 via Email & Telegram.
- In-app notification badge.

---

## Database & Tech Stack
- **Database**: PostgreSQL (Supabase) + Row Level Security.
- **Frontend / Backend**: Next.js 14+ App Router, TypeScript.
- **Styling**: Tailwind CSS, shadcn/ui tokens, next-themes.
- **Charts**: Recharts.
- **Bot**: grammY webhook (`/api/telegram/webhook`).
- **AI**: Gemini default (Multimodal) + OpenAI/DeepSeek fallback.
- **Payment**: Midtrans Snap + Manual transfer upload.
- **Email**: Resend.
- **Export**: SheetJS (.xlsx) + CSV.
