# Sistem Informasi Spasial Interaktif Berbasis Web untuk Pemetaan dan Informasi Ruangan Kampus Universitas Bahaudin Mudhary Madura (UNIBA Madura)

Sistem Informasi Spasial (GIS) berbasis Web ini dikembangkan untuk memfasilitasi mahasiswa, calon mahasiswa baru, dosen, tenaga kependidikan, serta pengunjung umum dalam menjelajahi dan menemukan lokasi gedung, denah lantai 2D, serta informasi terperinci ruangan dan fasilitas di lingkungan **Universitas Bahaudin Mudhary Madura (UNIBA Madura)**, Desa Batuan, Kecamatan Batuan, Kabupaten Sumenep.

---

## 🏛️ Identitas Proyek & Skripsi

- **Nama Peneliti / Pengembang**: R. AJ GITA DWI APRILIA
- **NIM**: 2302510011
- **Program Studi**: S1 Sistem Informasi
- **Fakultas**: Sains dan Teknologi (FST)
- **Perguruan Tinggi**: Universitas Bahaudin Mudhary Madura (Sumenep, Madura)
- **Tahun**: 2026

---

## 🌟 Fitur Utama Sistem

1. **Header Konsisten & Global Search**:
   - Logo resmi UNIBA MADURA & identitas perguruan tinggi.
   - Kolom pencarian global (*search bar*) multi-kriteria (mencari nama gedung, nama ruangan, nomor ruangan, atau fasilitas).
   - Indikator notifikasi pembaruan fasilitas dan akses cepat login/profil.

2. **Sidebar Navigation Interaktif**:
   - Menu utama: **Beranda**, **Peta Kampus**, **Informasi Ruangan**, **Fasilitas**, **Berita & Pengumuman**, **Pencarian Ruangan**.
   - Indikator status halaman aktif (*active state*).
   - Akses pintu masuk **Login Admin** tersemat rapi di bagian bawah.
   - Responsif: Sidebar penuh di Desktop, ringkas di Tablet, dan laci geser (*hamburger offcanvas*) di Mobile.

3. **Halaman Beranda (Home)**:
   - Banner Hero fotorealistik kampus UNIBA Madura dengan overlay emerald modern.
   - 4 Card Fitur Cepat (*Peta Kampus*, *Informasi Ruangan*, *Pencarian*, *Fasilitas Kampus*).
   - Ringkasan profil website & data statistik kampus (Gedung, Lantai, Ruangan, Fasilitas).
   - Widget mini-map interaktif preview kawasan kampus Batuan, Sumenep.

4. **Peta Kampus (Spasial Map Kawasan - Leaflet.js & GeoJSON)**:
   - Deliniasi batas kawasan kampus UNIBA Madura.
   - Poligon spasial setiap gedung perkuliahan dan rektorat.
   - Marker titik fasilitas (*Point of Interest*): Monumen Bahaudin Mudhary, Musholla Al-Qosos, Kantin, Area Parkir, Lapangan Terbuka.
   - Kontrol zoom, tombol pusatkan peta (*reset/center*), dan penggantian citra satelit (*tile layer switcher*).
   - **Interaksi Utama**: Mengklik gedung membuka halaman **Peta Gedung / Denah Lantai**.

5. **Peta Gedung / Denah Lantai (Interactive 2D Top-View)**:
   - Pilihan tingkat lantai dinamis: **Lantai 1**, **Lantai 2**, **Lantai 3**, **Lantai 4**.
   - Denah arsitektural 2D dengan lorong/koridor utama, pintu masuk, dinding, tangga evakuasi, dan lift.
   - Pembagian warna ruangan berbasis kategori:
     - 🟦 **Ruang Kelas** (Biru Cerah)
     - 🟪 **Ruang Dosen** (Indigo/Ungu)
     - 🟩 **Laboratorium** (Teal/Emerald)
     - 🟧 **Ruang Administrasi** (Amber/Kuning Emas)
     - 🟩 **Fasilitas Umum** (Hijau Tua)
     - 🟥 **Toilet** (Merah Muda/Rose)
     - ⬜ **Tangga / Lift** (Abu-abu Slate)
   - Panel samping kanan: Informasi gedung (foto, total lantai, total ruangan, fasilitas gedung) serta daftar ruangan di lantai aktif dengan live search filter.

6. **Interaksi Denah Ruangan (Modal Detail Lengkap)**:
   - Setiap ruangan pada denah dapat diklik untuk membuka modal informasi lengkap:
     - Foto representatif ruangan
     - Nama & Kode Ruangan (misal: *Ruang Kelas A1.03*, *Lab Komputer B2.01*)
     - Kategori ruangan (badge warna)
     - Lokasi gedung & tingkat lantai
     - Kapasitas tempat duduk
     - Fasilitas lengkap dengan ikon (*AC, Smart Projector, Papan Tulis, Sound System, dll.*)
     - Penanggung Jawab ruangan (*Person in Charge / PIC*)
     - Jam operasional
     - Deskripsi fungsi ruangan
     - Tombol navigasi balik (*← Kembali ke Denah*) dan tombol *Lihat di Peta Kampus*.

7. **Pencarian Ruangan (Split-Screen: Hasil + Peta Lokasi)**:
   - Sebelah Kiri: Daftar card hasil pencarian dengan foto, lokasi, kapasitas, dan tombol aksi.
   - Sebelah Kanan: Peta interaktif yang otomatis bergeser (*flyTo*) dan menyorot (*highlight polygon/marker*) lokasi gedung atau ruangan yang dipilih.
   - Tanpa sistem routing rumit (fokus pemetaan spasial dan informasi ruangan sesuai batasan masalah skripsi).

8. **Katalog Informasi Ruangan**:
   - Filter multivariabel: berdasarkan Gedung, Lantai, dan Kategori Jenis Ruangan.
   - Pilihan mode tampilan: **Card Grid** atau **Tabel Data Komprehensif**.

9. **Direktori Fasilitas Kampus**:
   - Galeri fasilitas kampus lengkap dengan deskripsi dan tombol *Lihat di Peta*.

10. **Berita & Pengumuman**:
    - Informasi agenda kampus, jadwal pemeliharaan laboratorium, serta penambahan fasilitas baru.

11. **Login & Dashboard Admin (CRUD Manajemen Data)**:
    - Autentikasi admin berbasis sesi.
    - Statistik operasional kampus.
    - Kelola Gedung (Tambah, Edit, Hapus, Polygon, Warna).
    - Kelola Ruangan (Tambah, Edit, Hapus, Koordinat Denah X, Y, W, H).
    - Kelola Fasilitas & Berita.
    - Visual Floor Plan Mapper.

---

## 🛠️ Arsitektur Teknologi & Dependensi

- **Frontend**: HTML5 Semantik, CSS3 Modern (Custom Design System Emerald & Mint), JavaScript (ES6+ Moduler).
- **Framework UI**: Bootstrap 5.3.3 & Bootstrap Icons v1.11.3.
- **Mapping & GIS Engine**: Leaflet.js v1.9.4, GeoJSON Format Data Spasial.
- **Backend**: PHP 8.x (REST API endpoints dengan penanganan PDO aman).
- **Database**: MySQL (Skema relasional: `users`, `gedung`, `lantai`, `ruangan`, `fasilitas`, `berita`, `denah`).
- **Dual-Mode Execution**:
  1. *Mode Server (XAMPP)*: Terintegrasi penuh dengan Apache dan basis data MySQL.
  2. *Mode Client/Demo*: Otomatis aktif saat dibuka langsung via browser atau jika MySQL belum di-start, menggunakan dataset spasial lokal dan `localStorage` sehingga seluruh interaksi tetap berjalan 100% tanpa error.

---

## 🚀 Panduan Menjalankan Sistem

### Metode 1: Melalui XAMPP (Rekomendasi untuk Ujian Skripsi)

1. **Jalankan XAMPP Control Panel**:
   - Buka XAMPP Control Panel di komputer Windows Anda.
   - Klik tombol **Start** pada modul **Apache**.
   - Klik tombol **Start** pada modul **MySQL**.

2. **Inisialisasi Database (1-Klik Otomatis)**:
   - Buka browser (Google Chrome, Edge, dll).
   - Akses tautan berikut:
     ```
     http://localhost/uniba_spasial/config/setup_db.php
     ```
   - Klik tombol hijau: **"Jalankan Setup & Import Database"**.
   - Sistem secara otomatis akan membuat database `uniba_spasial` dan mengisi seluruh data master gedung, lantai, ruangan, fasilitas, dan berita.

3. **Buka Aplikasi Utama**:
   - Akses:
     ```
     http://localhost/uniba_spasial/
     ```
     *(atau `http://localhost/uniba_spasial/index.php`)*

4. **Login Admin**:
   - Akses menu **Login Admin** pada bagian bawah sidebar atau buka:
     ```
     http://localhost/uniba_spasial/#admin-login
     ```
   - **Username**: `admin` *(atau `gita`)*
   - **Password**: `admin123`

---

### Metode 2: Menjalankan Langsung Tanpa XAMPP (Mode Mandiri / Live Server)

- Cukup klik ganda (*double click*) file `index.html` di folder `d:\SKRIPSI GITA\uniba_spasial\index.html` atau buka menggunakan ekstensi *Live Server* di Visual Studio Code.
- Sistem akan mendeteksi mode offline dan secara cerdas memuat seluruh peta spasial, denah lantai 2D, data ruangan, serta fungsionalitas CRUD lokal secara mulus.

---

## 📂 Struktur Direktori Proyek

```
d:\SKRIPSI GITA\uniba_spasial\
│
├── index.html                 # Halaman aplikasi web utama (Single Page Application)
├── index.php                  # Entrypoint server PHP terintegrasi database
├── README.md                  # Dokumentasi teknis & panduan lengkap
│
├── api/                       # Endpoint REST API PHP
│   ├── get_gedung.php         # Data gedung & koordinat poligon spasial
│   ├── get_lantai.php         # Data lantai per gedung
│   ├── get_ruangan.php        # Data ruangan & atribut fasilitas
│   ├── get_fasilitas.php      # Data fasilitas kampus
│   ├── get_berita.php         # Data pengumuman kampus
│   ├── search.php             # Pencarian multi-kriteria SQL LIKE
│   ├── admin_login.php        # Validasi autentikasi admin
│   ├── save_gedung.php        # Operasi CRUD gedung
│   ├── save_ruangan.php       # Operasi CRUD ruangan & posisi spasial
│   ├── save_lantai.php        # Operasi CRUD lantai
│   ├── save_fasilitas.php     # Operasi CRUD fasilitas
│   └── save_berita.php        # Operasi CRUD berita
│
├── config/
│   ├── database.php           # Koneksi PDO & error-handling cerdas
│   └── setup_db.php           # Installer 1-klik database & data seeder
│
├── database/
│   └── uniba_spasial.sql      # Skrip DDL & DML lengkap MySQL
│
├── data/
│   ├── uniba_geojson.js       # Data spasial GeoJSON batas kawasan & gedung
│   ├── denah_spasial.js       # Koordinat denah 2D top-view seluruh lantai
│   └── mock_data.js           # Pengendali data dual-mode (MySQL & LocalStorage)
│
└── assets/
    ├── css/
    │   └── style.css          # Desain sistem emerald kampus profesional
    ├── js/
    │   ├── app.js             # Koordinator router & navigasi UI
    │   ├── map_kampus.js      # Controller peta kawasan Leaflet.js
    │   ├── map_denah.js       # Mesin denah 2D interaktif & detail ruangan
    │   ├── search_view.js     # Pengendali split-screen hasil pencarian
    │   ├── catalog_view.js    # Pengendali katalog ruangan & fasilitas
    │   └── admin_app.js       # Pengendali panel admin & operasi data
    └── img/
        ├── uniba_logo.svg     # Logo vektor resmi UNIBA Madura
        ├── uniba_emblem.svg   # Emblem logo bulat kampus
        ├── campus_hero.jpg    # Foto kawasan kampus UNIBA Madura
        ├── buildings/         # Ilustrasi & foto gedung perkuliahan
        └── rooms/             # Ilustrasi & foto ruangan perkuliahan / lab
```

---

## 🧭 Alur Kerja Pengguna (User Flow)

```
[ BERANDA / HOME ]
       ↓
[ PETA KAMPUS ] ─────── (Klik Poligon Gedung) ───────→ [ DENAH GEDUNG ]
       ↓                                                     ↓
[ PENCARIAN RUANGAN ]                                  [ PILIH LANTAI (1-4) ]
       ↓                                                     ↓
[ HASIL + PETA SPLIT ]                                 [ DENAH 2D TOP-VIEW ]
       ↓ (Klik Ruangan)                                      ↓ (Klik Ruangan)
[ DETAIL RUANGAN LENGKAP ] ←─────────────────────────────────┘
  • Foto Ruangan
  • Kapasitas & Jam
  • Fasilitas & PIC
  • Tombol Navigasi Peta / Denah
```

---

## 🎓 Selesai & Siap Diuji

Aplikasi ini telah divalidasi dan diuji kesesuaiannya dengan diagram perancangan skripsi (Use Case, Activity Diagram, Class Diagram, dan Flowchart) serta siap dipresentasikan di hadapan dosen penguji.
