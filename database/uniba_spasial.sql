-- ===================================================================
-- SISTEM INFORMASI SPASIAL INTERAKTIF BERBASIS WEB
-- UNTUK PEMETAAN DAN INFORMASI RUANGAN KAMPUS
-- UNIVERSITAS BAHAUDIN MUDHARY MADURA (UNIBA MADURA)
--
-- Peneliti / Pengembang : R. AJ GITA DWI APRILIA (NIM: 2302510011)
-- Program Studi          : S1 Sistem Informasi
-- Fakultas               : Sains dan Teknologi
-- Universitas            : Universitas Bahaudin Mudhary Madura (Sumenep)
-- ===================================================================

CREATE DATABASE IF NOT EXISTS `uniba_spasial` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `uniba_spasial`;

-- --------------------------------------------------------
-- 1. Tabel users (Admin & Pengelola Sistem)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('superadmin','admin_gedung','staff') NOT NULL DEFAULT 'superadmin',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Password default: 'admin123' (hash bcrypt dan plain fallback)
INSERT INTO `users` (`id_user`, `username`, `password`, `nama_lengkap`, `email`, `role`) VALUES
(1, 'admin', '$2y$10$4y9pA7m4lZ4Xm97N01iBf.d29kH8R5f9XfLkW3vFhB3VnBf2WJcwe', 'Administrator Utama UNIBA', 'admin@unibamadura.ac.id', 'superadmin'),
(2, 'gita', '$2y$10$4y9pA7m4lZ4Xm97N01iBf.d29kH8R5f9XfLkW3vFhB3VnBf2WJcwe', 'R. Aj Gita Dwi Aprilia', 'gita.apr@unibamadura.ac.id', 'superadmin');

-- --------------------------------------------------------
-- 2. Tabel gedung (Master Gedung & Data Spasial Kawasan)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `gedung`;
CREATE TABLE `gedung` (
  `id_gedung` int(11) NOT NULL AUTO_INCREMENT,
  `kode_gedung` varchar(20) NOT NULL UNIQUE,
  `nama_gedung` varchar(100) NOT NULL,
  `alias` varchar(100) DEFAULT NULL,
  `kategori` varchar(50) NOT NULL DEFAULT 'Akademik',
  `deskripsi` text DEFAULT NULL,
  `foto` varchar(255) DEFAULT 'assets/img/buildings/gedung_deramista.svg',
  `lokasi` varchar(150) NOT NULL DEFAULT 'Kampus UNIBA Madura, Batuan, Sumenep',
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `polygon_geojson` text DEFAULT NULL,
  `jumlah_lantai` int(11) NOT NULL DEFAULT 1,
  `warna_peta` varchar(20) DEFAULT '#059669',
  `status` enum('aktif','renovasi','nonaktif') NOT NULL DEFAULT 'aktif',
  PRIMARY KEY (`id_gedung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `gedung` (`id_gedung`, `kode_gedung`, `nama_gedung`, `alias`, `kategori`, `deskripsi`, `foto`, `lokasi`, `latitude`, `longitude`, `jumlah_lantai`, `warna_peta`, `status`) VALUES
(1, 'GD-A', 'Gedung Deramista (Gedung A)', 'Gedung Rektorat & Administrasi Pusat', 'Rektorat & Perkantoran', 'Gedung utama pusat pimpinan universitas yang memuat kantor Rektor, Wakil Rektor, BAAK, BAK, Ruang Rapat Senat, serta ruang kerja pimpinan dan staf universitas.', 'assets/img/buildings/gedung_deramista.svg', 'Sisi Barat Kawasan Kampus UNIBA', -7.01285000, 113.82980000, 4, '#059669', 'aktif'),
(2, 'GD-B', 'Gedung Campaka (Gedung B)', 'Fakultas Sains dan Teknologi (FST)', 'Fakultas & Laboratorium', 'Gedung Fakultas Sains dan Teknologi dengan program studi Sistem Informasi, Informatika, dan Teknik Industri. Memiliki fasilitas laboratorium komputasi modern, jaringan komputer, ruang seminar, dan ruang dosen.', 'assets/img/buildings/gedung_campaka.svg', 'Sisi Timur-Selatan Kawasan Kampus UNIBA', -7.01360000, 113.83120000, 4, '#0284c7', 'aktif'),
(3, 'GD-C', 'Gedung Kapanjin (Gedung C)', 'Fakultas Ekonomi dan Bisnis (FEB)', 'Fakultas & Akademik', 'Gedung Fakultas Ekonomi dan Bisnis untuk perkuliahan Manajemen dan Akuntansi. Dilengkapi Galeri Investasi BEI, Mini Bank, ruang dosen FEB, dan ruang kuliah representatif.', 'assets/img/buildings/gedung_kapanjin.svg', 'Sisi Timur-Utara Kawasan Kampus UNIBA', -7.01275000, 113.83085000, 4, '#d97706', 'aktif'),
(4, 'GD-D', 'Gedung Tuan Gubhe (Gedung D)', 'Perkuliahan Bersama & Perpustakaan Digital', 'Perkuliahan & Fasilitas Umum', 'Gedung terintegrasi untuk ruang kuliah bersama, pusat Perpustakaan Digital UNIBA Madura, ruang belajar mandiri mahasiswa, dan Auditorium serbaguna.', 'assets/img/buildings/gedung_tuangubhe.svg', 'Sisi Tengah-Barat Kawasan Kampus UNIBA', -7.01320000, 113.83030000, 3, '#7c3aed', 'aktif'),
(5, 'GD-E', 'GOR Bahaudin Mudhary (Gedung E)', 'Gedung Olahraga & Serbaguna Kampus', 'Olahraga & Event', 'Gedung serbaguna olahraga indoor berstandar yang dapat digunakan untuk pertandingan bulutangkis, futsal, basket, event seni, dan upacara wisuda akbar universitas.', 'assets/img/buildings/gedung_gor.svg', 'Sisi Barat-Selatan Kawasan Kampus UNIBA', -7.01410000, 113.82960000, 2, '#dc2626', 'aktif'),
(6, 'GD-F', 'Panggung Pajhur (Gedung F)', 'Amphitheater Seni & Pusat Kegiatan Mahasiswa', 'Kesenian & Kreativitas', 'Amphitheater outdoor setengah lingkaran untuk pentas seni, pagelaran teater kampus, unjuk kreasi UKM mahasiswa, dan dialog terbuka mahasiswa.', 'assets/img/buildings/panggung_pajhur.svg', 'Sisi Selatan Plaza Utama Kampus UNIBA', -7.01425000, 113.83060000, 1, '#0d9488', 'aktif');

-- --------------------------------------------------------
-- 3. Tabel lantai (Hierarki Lantai per Gedung)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `lantai`;
CREATE TABLE `lantai` (
  `id_lantai` int(11) NOT NULL AUTO_INCREMENT,
  `id_gedung` int(11) NOT NULL,
  `nomor_lantai` int(11) NOT NULL,
  `nama_lantai` varchar(50) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `denah_file` varchar(255) DEFAULT 'assets/img/contoh_denah.png',
  `denah_data` longtext DEFAULT NULL,
  PRIMARY KEY (`id_lantai`),
  KEY `fk_lantai_gedung` (`id_gedung`),
  CONSTRAINT `fk_lantai_gedung` FOREIGN KEY (`id_gedung`) REFERENCES `gedung` (`id_gedung`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `lantai` (`id_lantai`, `id_gedung`, `nomor_lantai`, `nama_lantai`, `deskripsi`) VALUES
-- Gedung A (Deramista)
(1, 1, 1, 'Lantai 1', 'Lantai dasar Gedung A: Lobby Utama, BAAK, BAK, Ruang Pelayanan Terpadu & Toilet'),
(2, 1, 2, 'Lantai 2', 'Lantai 2 Gedung A: Ruang Rektor, Ruang Wakil Rektor, Ruang Tamu VIP & Ruang Sekretariat'),
(3, 1, 3, 'Lantai 3', 'Lantai 3 Gedung A: Ruang Sidang Senat Universitas & Ruang Arsip Lembaga'),
(4, 1, 4, 'Lantai 4', 'Lantai 4 Gedung A: Aula Pertemuan Eksekutif & Ruang Konferensi Pimpinan'),
-- Gedung B (Campaka - FST)
(5, 2, 1, 'Lantai 1', 'Lantai dasar Gedung B: Ruang Dekanat FST, Tata Usaha FST & Ruang Perkuliahan C1.01-C1.04'),
(6, 2, 2, 'Lantai 2', 'Lantai 2 Gedung B: Laboratorium Komputer 1, Laboratorium Jaringan & Ruang Kuliah C2.01-C2.04'),
(7, 2, 3, 'Lantai 3', 'Lantai 3 Gedung B: Laboratorium Komputer 2 (Multimedia & AI), Ruang Dosen FST & Kelas C3.01'),
(8, 2, 4, 'Lantai 4', 'Lantai 4 Gedung B: Studio Desain Sistem, Lab IoT & Robotika, Ruang Diskusi Mahasiswa'),
-- Gedung C (Kapanjin - FEB)
(9, 3, 1, 'Lantai 1', 'Lantai dasar Gedung C: Lobby FEB, Galeri Investasi BEI, Tata Usaha FEB & Ruang Kuliah K1.01-K1.03'),
(10, 3, 2, 'Lantai 2', 'Lantai 2 Gedung C: Lab Akuntansi, Lab Pasar Modal & Ruang Kuliah K2.01-K2.04'),
(11, 3, 3, 'Lantai 3', 'Lantai 3 Gedung C: Ruang Dekanat FEB, Ruang Dosen FEB & Ruang Kuliah K3.01-K3.03'),
(12, 3, 4, 'Lantai 4', 'Lantai 4 Gedung C: Ruang Sidang Skripsi FEB & Ruang Perkuliahan Bersama FEB'),
-- Gedung D (Tuan Gubhe)
(13, 4, 1, 'Lantai 1', 'Lantai 1 Gedung D: Lobby Perpustakaan Digital, Ruang Sirkulasi Buku & Area Coworking'),
(14, 4, 2, 'Lantai 2', 'Lantai 2 Gedung D: Ruang Baca Digital, Ruang Koleksi Jurnal & Ruang Rapat Mahasiswa'),
(15, 4, 3, 'Lantai 3', 'Lantai 3 Gedung D: Auditorium Utama Tuan Gubhe (Kapasitas 500 kursi)'),
-- Gedung E (GOR)
(16, 5, 1, 'Lantai 1', 'Lantai 1 GOR: Lapangan Bulutangkis, Futsal, Basket, Ruang Pengelola, Ruang Ganti & Toilet'),
(17, 5, 2, 'Lantai 2', 'Lantai 2 GOR: Tribun Penonton Atas & Ruang Kebugaran / Fitness Kampus'),
-- Gedung F (Panggung Pajhur)
(18, 6, 1, 'Lantai 1', 'Lantai dasar: Panggung Terbuka Utama, Ruang Sound Operator & Area Transit Pengisi Acara');

-- --------------------------------------------------------
-- 4. Tabel ruangan (Informasi Detail Ruangan & Koordinat Spasial Denah)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ruangan`;
CREATE TABLE `ruangan` (
  `id_ruangan` int(11) NOT NULL AUTO_INCREMENT,
  `id_gedung` int(11) NOT NULL,
  `id_lantai` int(11) NOT NULL,
  `kode_ruangan` varchar(30) NOT NULL,
  `nama_ruangan` varchar(100) NOT NULL,
  `jenis_ruangan` enum('Ruang Kelas','Ruang Dosen','Laboratorium','Ruang Administrasi','Fasilitas Umum','Toilet','Tangga/Lift') NOT NULL,
  `kapasitas` int(11) NOT NULL DEFAULT 30,
  `fasilitas` text DEFAULT NULL,
  `penanggung_jawab` varchar(100) DEFAULT NULL,
  `jam_operasional` varchar(50) DEFAULT '07.30 - 17.00 WIB',
  `deskripsi` text DEFAULT NULL,
  `foto` varchar(255) DEFAULT 'assets/img/rooms/kelas_standar.svg',
  `denah_x` int(11) NOT NULL DEFAULT 0,
  `denah_y` int(11) NOT NULL DEFAULT 0,
  `denah_w` int(11) NOT NULL DEFAULT 100,
  `denah_h` int(11) NOT NULL DEFAULT 80,
  `node_akses_id` varchar(50) DEFAULT NULL,
  `status` enum('tersedia','dipakai','pemeliharaan') NOT NULL DEFAULT 'tersedia',
  PRIMARY KEY (`id_ruangan`),
  KEY `fk_ruang_gedung` (`id_gedung`),
  KEY `fk_ruang_lantai` (`id_lantai`),
  CONSTRAINT `fk_ruang_gedung` FOREIGN KEY (`id_gedung`) REFERENCES `gedung` (`id_gedung`) ON DELETE CASCADE,
  CONSTRAINT `fk_ruang_lantai` FOREIGN KEY (`id_lantai`) REFERENCES `lantai` (`id_lantai`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `ruangan` (`id_ruangan`, `id_gedung`, `id_lantai`, `kode_ruangan`, `nama_ruangan`, `jenis_ruangan`, `kapasitas`, `fasilitas`, `penanggung_jawab`, `jam_operasional`, `deskripsi`, `foto`, `denah_x`, `denah_y`, `denah_w`, `denah_h`, `status`) VALUES
-- Gedung A Lantai 1
(1, 1, 1, 'A1.01', 'Lobby Utama & Informasi Gedung A', 'Fasilitas Umum', 25, 'Meja Resepsionis, Sofa Tamu, TV Display Informasi Kampus, AC', 'Security & Front Desk UNIBA', '07.00 - 17.30 WIB', 'Lobby kedatangan utama tamu universitas dan pusat informasi perizinan gedung.', 'assets/img/rooms/ruang_rapat.svg', 40, 40, 180, 120, 'tersedia'),
(2, 1, 1, 'A1.02', 'Biro Administrasi Akademik (BAAK)', 'Ruang Administrasi', 30, 'Komputer Kerja, Printer, Loket Pelayanan Mahasiswa, Ruang Tunggu Ber-AC', 'Kepala BAAK UNIBA', '08.00 - 16.00 WIB', 'Pusat pelayanan KRS, transkrip nilai, surat keterangan aktif kuliah, dan administrasi wisuda.', 'assets/img/rooms/ruang_dosen.svg', 240, 40, 180, 120, 'tersedia'),
(3, 1, 1, 'A1.03', 'Ruang Kelas Eksekutif A1.03', 'Ruang Kelas', 40, 'AC Split 2 Unit, Smart Projector, Papan Tulis Interaktif, Meja & Kursi Ergonomis, Sound System', 'Koordinator Sarpras Gedung A', '07.30 - 17.00 WIB', 'Ruang kelas kuliah representatif berstandar modern untuk perkuliahan program reguler dan pascasarjana.', 'assets/img/rooms/kelas_standar.svg', 440, 40, 200, 120, 'tersedia'),
(4, 1, 1, 'A1.04', 'Biro Administrasi Keuangan (BAK)', 'Ruang Administrasi', 20, '4 Komputer Staf, Brankas Keuangan, Mesin EDC, Loket Pembayaran', 'Kepala BAK UNIBA', '08.00 - 15.30 WIB', 'Pusat administrasi pembayaran SPP, registrasi mahasiswa baru, dan verifikasi keuangan beasiswa.', 'assets/img/rooms/ruang_dosen.svg', 40, 200, 180, 120, 'tersedia'),
(5, 1, 1, 'A1.05', 'Toilet Pria & Wanita Lantai 1', 'Toilet', 10, 'Wastafel Otomatis, Kaca Besar, Pengering Tangan, Kloset Duduk', 'Petugas Kebersihan Gedung A', '24 Jam', 'Fasilitas toilet terpisah untuk pria dan wanita dengan standar kebersihan tinggi.', 'assets/img/rooms/ruang_dosen.svg', 660, 40, 90, 120, 'tersedia'),
(6, 1, 1, 'A1.06', 'Tangga Utama & Lift Sentral', 'Tangga/Lift', 15, 'Lift Kapasitas 10 Orang, Tangga Darurat Lebar, Jalur Evakuasi', 'Teknisi Lift UNIBA', '24 Jam', 'Akses vertikal antar lantai dari Lantai 1 menuju Lantai 4.', 'assets/img/rooms/ruang_dosen.svg', 660, 200, 90, 120, 'tersedia'),

-- Gedung A Lantai 2
(7, 1, 2, 'A2.01', 'Ruang Rektor UNIBA Madura', 'Ruang Administrasi', 15, 'Meja Pimpinan Kayu Jati, Set Sofa Tamu VVIP, Smart TV, AC Inverter, Kamar Mandi Dalam', 'Sekretaris Rektor', '08.00 - 16.00 WIB', 'Ruang kerja Rektor Universitas Bahaudin Mudhary Madura untuk penerimaan tamu resmi dan kebijakan strategis.', 'assets/img/rooms/ruang_rapat.svg', 40, 40, 220, 140, 'tersedia'),
(8, 1, 2, 'A2.02', 'Ruang Wakil Rektor I & II', 'Ruang Administrasi', 15, 'Meja Kerja Warek, Meja Pertemuan Mini, AC, Lemari Arsip', 'Sekretariat Warek', '08.00 - 16.00 WIB', 'Ruang kantor Wakil Rektor Bidang Akademik dan Bidang Keuangan & Kerjasama.', 'assets/img/rooms/ruang_dosen.svg', 280, 40, 200, 140, 'tersedia'),
(9, 1, 2, 'A2.03', 'Ruang Rapat Pimpinan Terbatas', 'Ruang Kelas', 25, 'Meja Konferensi Oval, 25 Kursi Putar, Smart TV 75 Inci, Video Conference Cam, AC', 'Bagian Humas & Protokoler', '08.00 - 17.00 WIB', 'Ruang rapat koordinasi rektorat dengan para dekan dan stakeholder kampus.', 'assets/img/rooms/ruang_rapat.svg', 500, 40, 160, 140, 'tersedia'),

-- Gedung B (Campaka - FST) Lantai 1
(10, 2, 5, 'B1.01', 'Ruang Dekanat Fakultas Sains & Teknologi', 'Ruang Administrasi', 20, 'Ruang Dekan, Ruang Wadek, Meja Tamu, AC, Display Penghargaan FST', 'Dekan FST UNIBA', '08.00 - 16.00 WIB', 'Kantor pimpinan Fakultas Sains dan Teknologi dalam merumuskan kurikulum dan kebijakan akademik fakultas.', 'assets/img/rooms/ruang_rapat.svg', 40, 40, 190, 120, 'tersedia'),
(11, 2, 5, 'B1.02', 'Ruang Kelas FST B1.02', 'Ruang Kelas', 45, 'Proyektor HD, Whiteboard Magnetik, AC 2 Unit, Kursi Kuliah Lipat, Wi-Fi 6', 'Koordinator Ruang FST', '07.30 - 17.00 WIB', 'Ruang perkuliahan prodi Sistem Informasi dan Informatika untuk matakuliah teori.', 'assets/img/rooms/kelas_standar.svg', 250, 40, 190, 120, 'tersedia'),
(12, 2, 5, 'B1.03', 'Ruang Kelas FST B1.03', 'Ruang Kelas', 45, 'Proyektor HD, AC 2 Unit, Papan Tulis, Audio Amplifier, Meja Dosen', 'Koordinator Ruang FST', '07.30 - 17.00 WIB', 'Ruang kuliah dengan kapasitas 45 mahasiswa, pencahayaan alami optimal, dan fasilitas multimedia.', 'assets/img/rooms/kelas_standar.svg', 460, 40, 190, 120, 'tersedia'),
(13, 2, 5, 'B1.04', 'Tata Usaha & Pelayanan FST', 'Ruang Administrasi', 15, 'Loket Surat, Komputer Staf TU, Printer Cetak Ijazah, Ruang Tunggu', 'Ka. TU FST UNIBA', '08.00 - 16.00 WIB', 'Pusat pengurusan administrasi ujian, pengajuan proposal skripsi, dan surat pengantar mahasiswa FST.', 'assets/img/rooms/ruang_dosen.svg', 40, 190, 190, 130, 'tersedia'),

-- Gedung B Lantai 2 (Laboratorium)
(14, 2, 6, 'B2.01', 'Laboratorium Komputer 1 (Software & GIS)', 'Laboratorium', 40, '40 PC Core i7 RAM 16GB, Server Lokal, GIS Software QGIS & ArcGIS, Proyektor, AC 3 Unit', 'Kepala Lab Komputer FST', '08.00 - 17.00 WIB', 'Laboratorium utama untuk praktikum Pemrograman Web, Sistem Informasi Geografis (SIG), Basis Data, dan Rekayasa Perangkat Lunak.', 'assets/img/rooms/lab_komputer.svg', 40, 40, 240, 140, 'tersedia'),
(15, 2, 6, 'B2.02', 'Laboratorium Jaringan & Keamanan Siber', 'Laboratorium', 35, '35 PC, Router & Switch Cisco Rackmount, Mikrotik Kit, Crimping Tools, Tester LAN', 'Laboran Jaringan FST', '08.00 - 17.00 WIB', 'Praktek perancangan jaringan komputer kampus, routing switching, dan simulasi keamanan siber.', 'assets/img/rooms/lab_komputer.svg', 300, 40, 220, 140, 'tersedia'),
(16, 2, 6, 'B2.03', 'Ruang Kelas B2.03', 'Ruang Kelas', 40, 'Proyektor Epson, AC 2 Unit, Sound System, Kursi Kuliah Busa', 'Sarpras FST', '07.30 - 17.00 WIB', 'Ruang kelas kuliah teori algoritma, pemodelan sistem, dan matematika diskrit.', 'assets/img/rooms/kelas_standar.svg', 540, 40, 190, 140, 'tersedia'),

-- Gedung B Lantai 3 (Ruang Dosen)
(17, 2, 7, 'B3.01', 'Ruang Dosen Sistem Informasi & Informatika', 'Ruang Dosen', 30, '30 Kubikel Kerja Dosen, PC Kerja, Lemari Arsip Matakuliah, Meja Diskusi Mahasiswa, AC 3 Unit', 'Sekretaris Prodi SI & IF', '07.30 - 16.30 WIB', 'Ruang kerja para dosen FST untuk bimbingan skripsi, konsultasi akademik mahasiswa, dan riset.', 'assets/img/rooms/ruang_dosen.svg', 40, 40, 300, 150, 'tersedia'),
(18, 2, 7, 'B3.02', 'Laboratorium Multimedia & AI Research', 'Laboratorium', 30, '30 PC High-End GPU RTX 4070, Drawing Tablet, Green Screen, Mic Podcast, AC', 'Ketua Lab AI & Multimedia', '08.00 - 17.00 WIB', 'Laboratorium riset Artificial Intelligence, Machine Learning, grafika komputer, dan produksi video edukasi.', 'assets/img/rooms/lab_komputer.svg', 360, 40, 260, 150, 'tersedia'),

-- Gedung C (Kapanjin - FEB) Lantai 1 & 2
(19, 3, 9, 'C1.01', 'Galeri Investasi Bursa Efek Indonesia', 'Laboratorium', 30, 'Ticker Saham Digital, 20 PC Trading, Monitor Bloomberg Market, AC, Ruang Konsultasi', 'Direktur Galeri Investasi UNIBA', '08.30 - 16.00 WIB', 'Kerjasama dengan IDX untuk edukasi pasar modal, simulasi transaksi saham, dan riset keuangan mahasiswa.', 'assets/img/rooms/lab_komputer.svg', 40, 40, 250, 130, 'tersedia'),
(20, 3, 9, 'C1.02', 'Ruang Kelas FEB C1.02', 'Ruang Kelas', 45, 'Proyektor HD, AC Split, Papan Tulis, Kursi Lipat Mahasiswa', 'Koordinator Sarpras FEB', '07.30 - 17.00 WIB', 'Ruang kuliah Manajemen Keuangan dan Pengantar Akuntansi.', 'assets/img/rooms/kelas_standar.svg', 310, 40, 210, 130, 'tersedia'),
(21, 3, 10, 'C2.01', 'Laboratorium Akuntansi & Bank Mini', 'Laboratorium', 35, '35 PC Software Akuntansi Accurate & MYOB, Counter Teller Simulasi Bank, AC', 'Ketua Lab Akuntansi FEB', '08.00 - 16.00 WIB', 'Tempat praktikum pembukuan akuntansi, perpajakan, audit digital, dan simulasi perbankan syariah.', 'assets/img/rooms/lab_komputer.svg', 40, 40, 260, 140, 'tersedia'),
(22, 3, 11, 'C3.01', 'Ruang Dosen Fakultas Ekonomi & Bisnis', 'Ruang Dosen', 35, 'Meja Kerja Dosen FEB, Sofa Konsultasi Bimbingan, Dispenser, AC, Wi-Fi Dedicated', 'Sekretaris Prodi Manajemen & Akuntansi', '07.30 - 16.30 WIB', 'Ruang kerja dosen ekonomi untuk bimbingan tugas akhir dan penelitian ekonomi Madura.', 'assets/img/rooms/ruang_dosen.svg', 40, 40, 300, 140, 'tersedia'),

-- Gedung D (Tuan Gubhe) Lantai 1, 2 & 3
(23, 4, 13, 'D1.01', 'Perpustakaan Pusat & E-Library UNIBA', 'Fasilitas Umum', 80, 'Rak Buku 10.000 Judul, 25 Komputer E-Library OPAC, Barcode Scanner, Meja Baca Estetik, AC Sentral', 'Kepala Perpustakaan UNIBA', '08.00 - 17.00 WIB', 'Pusat literasi kampus dengan ribuan koleksi buku ilmiah, jurnal nasional/internasional, dan repositori skripsi digital.', 'assets/img/rooms/perpustakaan.svg', 40, 40, 350, 150, 'tersedia'),
(24, 4, 13, 'D1.02', 'Coworking Space & Student Lounge', 'Fasilitas Umum', 50, 'Colokan Listrik Tiap Meja, High Speed Wi-Fi, Bean Bags, Meja Diskusi Bundar, AC', 'Pengelola Fasilitas Tuan Gubhe', '08.00 - 20.00 WIB', 'Area belajar kreatif mahasiswa untuk berdiskusi tugas kelompok dan berkolaborasi secara produktif.', 'assets/img/rooms/perpustakaan.svg', 410, 40, 240, 150, 'tersedia'),
(25, 4, 15, 'D3.01', 'Auditorium Utama Tuan Gubhe', 'Fasilitas Umum', 500, 'Stage Panggung Teater, Sound System Line Array, Proyektor Bioskop 10.000 Lumens, Kursi VIP Beludru, AC Sentral', 'Koordinator Auditorium UNIBA', 'Sesuai Jadwal Event / Acara', 'Auditorium megah berkapasitas 500 peserta untuk kuliah tamu internasional, pelantikan, seminar nasional, dan wisuda.', 'assets/img/rooms/auditorium.svg', 40, 40, 600, 220, 'tersedia'),

-- Gedung E (GOR) Lantai 1
(26, 5, 16, 'E1.01', 'Arena Lapangan Indoor Utama GOR', 'Fasilitas Umum', 1200, '3 Lapangan Badminton Vinyl BWF, 1 Lapangan Basket / Futsal Interlock, Lampu Sorot LED Arena, Skor Digital', 'Pengelola GOR Bahaudin Mudhary', '06.00 - 22.00 WIB', 'Pusat aktivitas fisik, turnamen olahraga antar universitas, dan kejuaraan pekan olahraga mahasiswa.', 'assets/img/rooms/auditorium.svg', 40, 40, 620, 240, 'tersedia'),

-- Gedung F (Panggung Pajhur)
(27, 6, 18, 'F1.01', 'Panggung Terbuka Seni Budaya Pajhur', 'Fasilitas Umum', 300, 'Panggung Batu Granit Melengkung, Tata Lampu Panggung Outdoor, Sound Monitor, Plaza Terbuka', 'Koordinator Seni & Budaya UNIBA', '08.00 - 21.00 WIB', 'Panggung amphitheater outdoor tempat mahasiswa menggelar pentas musik, tari Madura, dan pentas sastra.', 'assets/img/rooms/auditorium.svg', 40, 40, 500, 200, 'tersedia');

-- --------------------------------------------------------
-- 5. Tabel fasilitas (Fasilitas Kampus & Pemetaan ke Gedung)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `fasilitas`;
CREATE TABLE `fasilitas` (
  `id_fasilitas` int(11) NOT NULL AUTO_INCREMENT,
  `id_gedung` int(11) DEFAULT NULL,
  `id_ruangan` int(11) DEFAULT NULL,
  `nama_fasilitas` varchar(100) NOT NULL,
  `kategori` varchar(50) NOT NULL,
  `lokasi` varchar(150) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `ikon` varchar(50) DEFAULT 'bi-geo-alt',
  `foto` varchar(255) DEFAULT 'assets/img/campus_hero.jpg',
  `status` enum('aktif','perbaikan') NOT NULL DEFAULT 'aktif',
  PRIMARY KEY (`id_fasilitas`),
  KEY `fk_fasilitas_gedung` (`id_gedung`),
  KEY `fk_fasilitas_ruang` (`id_ruangan`),
  CONSTRAINT `fk_fasilitas_gedung` FOREIGN KEY (`id_gedung`) REFERENCES `gedung` (`id_gedung`) ON DELETE SET NULL,
  CONSTRAINT `fk_fasilitas_ruang` FOREIGN KEY (`id_ruangan`) REFERENCES `ruangan` (`id_ruangan`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `fasilitas` (`id_fasilitas`, `id_gedung`, `id_ruangan`, `nama_fasilitas`, `kategori`, `lokasi`, `deskripsi`, `ikon`, `foto`, `status`) VALUES
(1, 2, 14, 'Laboratorium Komputer & SIG', 'Laboratorium', 'Gedung Campaka (FST) - Lantai 2', 'Laboratorium komputer spesifikasi tinggi dengan lisensi software pemetaan GIS dan IDE pengembangan sistem.', 'bi-laptop', 'assets/img/rooms/lab_komputer.svg', 'aktif'),
(2, 4, 23, 'Perpustakaan Pusat & E-Library', 'Perpustakaan', 'Gedung Tuan Gubhe - Lantai 1', 'Pusat sumber belajar dengan koleksi ribuan pustaka cetak, jurnal elektronik, dan ruang baca berpendingin udara.', 'bi-book-half', 'assets/img/rooms/perpustakaan.svg', 'aktif'),
(3, 4, 25, 'Auditorium Megah Tuan Gubhe', 'Auditorium', 'Gedung Tuan Gubhe - Lantai 3', 'Auditorium representatif dengan kapasitas 500 orang untuk seminar nasional, kuliah perdana, dan pentas akademik.', 'bi-building', 'assets/img/rooms/auditorium.svg', 'aktif'),
(4, 5, 26, 'GOR Bahaudin Mudhary Indoor', 'Olahraga', 'Gedung Olahraga (GOR) UNIBA', 'Sarana olahraga bulutangkis, futsal, dan basket berlantai standar internasional dengan kapasitas tribun 1.200 penonton.', 'bi-trophy', 'assets/img/buildings/gedung_gor.svg', 'aktif'),
(5, 3, 19, 'Galeri Investasi Bursa Efek (IDX)', 'Laboratorium', 'Gedung Kapanjin (FEB) - Lantai 1', 'Sarana edukasi pasar modal dan investasi bagi civitas akademika bekerjasama dengan Bursa Efek Indonesia.', 'bi-graph-up-arrow', 'assets/img/rooms/lab_komputer.svg', 'aktif'),
(6, 6, 27, 'Panggung Amphitheater Pajhur', 'Pusat Seni', 'Sisi Selatan Plaza Utama Kampus', 'Panggung pertunjukan terbuka untuk kegiatan kreativitas seni mahasiswa, musik kampus, dan orasi literasi.', 'bi-music-note-beamed', 'assets/img/buildings/panggung_pajhur.svg', 'aktif'),
(7, NULL, NULL, 'Musholla Al-Qosos Kampus', 'Ibadah', 'Sebelah Timur Gedung Kapanjin', 'Tempat ibadah sholat berjamaah untuk mahasiswa dan staf yang bersih, nyaman, dengan tempat wudhu memadai.', 'bi-moon-stars', 'assets/img/rooms/musholla.svg', 'aktif'),
(8, NULL, NULL, 'Kantin & Pujasera Mahasiswa', 'Kantin', 'Sisi Utara Kawasan Kampus UNIBA', 'Pusat kuliner kampus yang higienis dan terjangkau dengan aneka makanan khas Madura dan minuman segar.', 'bi-cup-hot', 'assets/img/rooms/kantin.svg', 'aktif'),
(9, NULL, NULL, 'Area Parkir Terpadu Kampus', 'Parkir', 'Parkiran Dosen, Parkiran GOR, dan Gerbang Utama', 'Area parkir luas yang aman dilengkapi pengawasan pos keamanan 24 jam dan kamera CCTV.', 'bi-p-circle', 'assets/img/campus_hero.jpg', 'aktif');

-- --------------------------------------------------------
-- 6. Tabel berita (Berita & Pengumuman Perubahan Ruangan)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `berita`;
CREATE TABLE `berita` (
  `id_berita` int(11) NOT NULL AUTO_INCREMENT,
  `judul` varchar(200) NOT NULL,
  `kategori` enum('Berita Kampus','Pengumuman','Informasi Fasilitas','Perubahan Ruangan') NOT NULL DEFAULT 'Pengumuman',
  `tanggal` date NOT NULL,
  `ringkasan` text NOT NULL,
  `isi` longtext NOT NULL,
  `penulis` varchar(100) NOT NULL DEFAULT 'Humas UNIBA Madura',
  `foto` varchar(255) DEFAULT 'assets/img/campus_hero.jpg',
  `status` enum('terbit','draf') NOT NULL DEFAULT 'terbit',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_berita`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `berita` (`id_berita`, `judul`, `kategori`, `tanggal`, `ringkasan`, `isi`, `penulis`, `foto`, `status`) VALUES
(1, 'Peluncuran Sistem Informasi Spasial Interaktif Pemetaan Ruangan UNIBA Madura', 'Berita Kampus', '2026-10-01', 'UNIBA Madura resmi memperkenalkan sistem pemetaan ruangan spasial interaktif berbasis web untuk memudahkan civitas akademika.', 'Universitas Bahaudin Mudhary Madura (UNIBA Madura) terus berinovasi dalam memajukan infrastruktur digital kampus. Melalui penelitian skripsi saudari R. Aj Gita Dwi Aprilia dari Prodi S1 Sistem Informasi Fakultas Sains dan Teknologi, kini hadir Sistem Informasi Spasial Interaktif berbasis web. Sistem ini memudahkan seluruh mahasiswa, dosen, tamu, dan civitas akademika dalam mencari lokasi gedung, denah lantai, dan informasi spesifik fasilitas ruangan dengan akurat.', 'Humas UNIBA Madura', 'assets/img/campus_hero.jpg', 'terbit'),
(2, 'Jadwal Pemeliharaan Berkala Laboratorium Komputer FST Gedung Campaka', 'Perubahan Ruangan', '2026-10-03', 'Laboratorium Komputer 1 Gedung B Lantai 2 akan menjalani upgrade software workstation pada akhir pekan ini.', 'Diberitahukan kepada seluruh mahasiswa FST bahwa Laboratorium Komputer B2.01 Gedung Campaka akan dilakukan pemeliharaan berkala dan pemasangan modul software komputasi terbaru pada hari Sabtu. Seluruh perkuliahan praktikum sementara dialihkan ke Lab Komputer 2 Lantai 3.', 'Unit Laboratorium Komputer FST', 'assets/img/rooms/lab_komputer.svg', 'terbit'),
(3, 'Penambahan Fasilitas Smart Projector di Seluruh Ruang Kuliah Gedung A & B', 'Informasi Fasilitas', '2026-09-28', 'Meningkatkan kenyamanan belajar mengajar, UNIBA Madura memasang Smart Projector interaktif pada ruang kelas.', 'Dalam rangka mendukung pembelajaran berbasis teknologi modern, Biro Sarana dan Prasarana telah menyelesaikan pemasangan perangkat Smart Projector interaktif dengan resolusi ultra high definition pada seluruh ruang kuliah di Gedung Deramista dan Gedung Campaka.', 'Biro Sarana & Prasarana', 'assets/img/rooms/kelas_standar.svg', 'terbit');

-- --------------------------------------------------------
-- 7. Tabel denah (Arsip Metadata Spasial Denah Lantai)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `denah`;
CREATE TABLE `denah` (
  `id_denah` int(11) NOT NULL AUTO_INCREMENT,
  `id_gedung` int(11) NOT NULL,
  `id_lantai` int(11) NOT NULL,
  `versi` varchar(20) DEFAULT 'v1.0',
  `lebar_px` int(11) NOT NULL DEFAULT 800,
  `tinggi_px` int(11) NOT NULL DEFAULT 500,
  `svg_layout` longtext DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_denah`),
  KEY `fk_denah_gedung` (`id_gedung`),
  KEY `fk_denah_lantai` (`id_lantai`),
  CONSTRAINT `fk_denah_gedung` FOREIGN KEY (`id_gedung`) REFERENCES `gedung` (`id_gedung`) ON DELETE CASCADE,
  CONSTRAINT `fk_denah_lantai` FOREIGN KEY (`id_lantai`) REFERENCES `lantai` (`id_lantai`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `denah` (`id_denah`, `id_gedung`, `id_lantai`, `versi`, `lebar_px`, `tinggi_px`) VALUES
(1, 1, 1, '1.0', 800, 500),
(2, 2, 5, '1.0', 800, 500),
(3, 2, 6, '1.0', 800, 500),
(4, 3, 9, '1.0', 800, 500),
(5, 4, 13, '1.0', 800, 500);

-- --------------------------------------------------------
-- 8. Tabel node_rute (Simpul Jaringan Spasial Luar & Dalam Gedung)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `node_rute`;
CREATE TABLE `node_rute` (
  `id_node` varchar(50) NOT NULL,
  `nama_node` varchar(100) NOT NULL,
  `jenis_node` enum('Akses','Simpang','Jalan','Gedung','Koridor','Tangga','Lift','Ruangan','Fasilitas') NOT NULL DEFAULT 'Simpang',
  `id_gedung` int(11) DEFAULT NULL,
  `id_lantai` int(11) DEFAULT NULL,
  `koordinat_x` int(11) NOT NULL DEFAULT 0,
  `koordinat_y` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_node`),
  KEY `fk_node_gedung` (`id_gedung`),
  KEY `fk_node_lantai` (`id_lantai`),
  CONSTRAINT `fk_node_gedung` FOREIGN KEY (`id_gedung`) REFERENCES `gedung` (`id_gedung`) ON DELETE SET NULL,
  CONSTRAINT `fk_node_lantai` FOREIGN KEY (`id_lantai`) REFERENCES `lantai` (`id_lantai`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `node_rute` (`id_node`, `nama_node`, `jenis_node`, `id_gedung`, `id_lantai`, `koordinat_x`, `koordinat_y`) VALUES
('gerbang_utama', 'Gerbang Utama (Jl. Raya Lenteng)', 'Akses', NULL, NULL, 168, 910),
('pos_keamanan', 'Pos Keamanan & Portal Depan', 'Akses', NULL, NULL, 200, 810),
('jalan_masuk', 'Jalan Masuk Utama Kawasan', 'Jalan', NULL, NULL, 245, 730),
('simpang_gor', 'Simpang GOR & Parkir Lorong Bangka', 'Simpang', NULL, NULL, 285, 675),
('parkir_gor', 'Area Parkir GOR Bahaudin Mudhary', 'Fasilitas', 5, NULL, 160, 665),
('parkir_lorong_bangka', 'Area Parkiran Lorong Bangka', 'Fasilitas', NULL, NULL, 330, 700),
('simpang_pajhur', 'Simpang Panggung Pajhur', 'Simpang', NULL, NULL, 360, 575),
('bundaran_monumen', 'Bundaran Monumen Achmad Bahaudin Mudhary', 'Simpang', NULL, NULL, 425, 505),
('plaza_tengah', 'Plaza & Taman Pedestrian Kampus', 'Simpang', NULL, NULL, 460, 430),
('simpang_barat', 'Simpang Koridor Barat (Gedung A & D)', 'Simpang', NULL, NULL, 300, 490),
('simpang_utara', 'Simpang Pedestrian Utara (Depan Gedung C)', 'Simpang', NULL, NULL, 475, 380),
('parkir_dosen', 'Area Parkir Dosen & Karyawan', 'Fasilitas', 2, NULL, 590, 585),
('jalur_musholla', 'Jalur Pedestrian Musholla', 'Jalan', NULL, NULL, 560, 360),
('musholla', 'Musholla Al-Qosos Kampus', 'Fasilitas', NULL, NULL, 620, 345),
('lab_industri', 'Laboratorium Teknik Industri', 'Fasilitas', 2, NULL, 685, 375),
('jalur_kantin', 'Jalur Penghubung Kantin & Pujasera', 'Jalan', NULL, NULL, 620, 285),
('kantin', 'Kantin & Pujasera Mahasiswa', 'Fasilitas', NULL, NULL, 655, 285),
('pkm_koperasi', 'PKM & Koperasi Mahasiswa', 'Fasilitas', NULL, NULL, 605, 205),
('akses_gedung_a', 'Pintu Masuk Utama Gedung Deramista (Gedung A)', 'Gedung', 1, 1, 245, 445),
('akses_gedung_b', 'Pintu Masuk Utama Gedung Campaka (Gedung B - FST)', 'Gedung', 2, 5, 535, 470),
('akses_gedung_c', 'Pintu Masuk Utama Gedung Kapanjin (Gedung C - FEB)', 'Gedung', 3, 9, 475, 355),
('akses_gedung_d', 'Pintu Masuk Utama Gedung Tuan Gubhe (Gedung D)', 'Gedung', 4, 13, 345, 485),
('akses_gedung_e', 'Pintu Masuk Utama GOR Bahaudin Mudhary (Gedung E)', 'Gedung', 5, 16, 260, 620),
('akses_gedung_f', 'Pintu Masuk Panggung Pajhur (Gedung F)', 'Gedung', 6, 18, 430, 590),
-- Indoor Nodes Gedung A
('gd_a_lt1_lobi', 'Lobi Utama Gedung A (Lantai 1)', 'Koridor', 1, 1, 0, 0),
('gd_a_lt1_koridor', 'Koridor Utama Lantai 1 Gedung A', 'Koridor', 1, 1, 0, 0),
('gd_a_lt1_tangga', 'Tangga & Lift Lantai 1 Gedung A', 'Tangga', 1, 1, 0, 0),
('gd_a_lt2_tangga', 'Tangga & Lift Lantai 2 Gedung A', 'Tangga', 1, 2, 0, 0),
('gd_a_lt2_koridor', 'Koridor Rektorat Lantai 2 Gedung A', 'Koridor', 1, 2, 0, 0),
('room_1', 'A1.01 - Lobby Utama & Informasi', 'Ruangan', 1, 1, 0, 0),
('room_2', 'A1.02 - Biro Administrasi Akademik (BAAK)', 'Ruangan', 1, 1, 0, 0),
('room_3', 'A1.03 - Ruang Kelas Eksekutif A1.03', 'Ruangan', 1, 1, 0, 0),
-- Indoor Nodes Gedung B (FST)
('gd_b_lt1_lobi', 'Lobi Utama Gedung Campaka (Lantai 1)', 'Koridor', 2, 5, 0, 0),
('gd_b_lt1_koridor', 'Koridor Utama Lantai 1 FST', 'Koridor', 2, 5, 0, 0),
('gd_b_lt1_tangga', 'Tangga & Lift Lantai 1 FST', 'Tangga', 2, 5, 0, 0),
('gd_b_lt2_tangga', 'Tangga & Lift Lantai 2 FST', 'Tangga', 2, 6, 0, 0),
('gd_b_lt2_koridor', 'Koridor Laboratorium Lantai 2 FST', 'Koridor', 2, 6, 0, 0),
('room_10', 'B1.01 - Ruang Dekanat FST', 'Ruangan', 2, 5, 0, 0),
('room_14', 'B2.01 - Laboratorium Komputer 1 (GIS)', 'Ruangan', 2, 6, 0, 0),
('room_15', 'B2.02 - Laboratorium Jaringan Komputer', 'Ruangan', 2, 6, 0, 0);

-- --------------------------------------------------------
-- 9. Tabel edge_rute (Penghubung Simpul / Jalur Spasial)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `edge_rute`;
CREATE TABLE `edge_rute` (
  `id_edge` int(11) NOT NULL AUTO_INCREMENT,
  `node_awal` varchar(50) NOT NULL,
  `node_tujuan` varchar(50) NOT NULL,
  `jarak` decimal(8,2) NOT NULL DEFAULT 10.00,
  `jenis_jalur` varchar(50) NOT NULL DEFAULT 'Jalur Pejalan Kaki',
  PRIMARY KEY (`id_edge`),
  KEY `fk_edge_awal` (`node_awal`),
  KEY `fk_edge_tujuan` (`node_tujuan`),
  CONSTRAINT `fk_edge_awal` FOREIGN KEY (`node_awal`) REFERENCES `node_rute` (`id_node`) ON DELETE CASCADE,
  CONSTRAINT `fk_edge_tujuan` FOREIGN KEY (`node_tujuan`) REFERENCES `node_rute` (`id_node`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `edge_rute` (`id_edge`, `node_awal`, `node_tujuan`, `jarak`, `jenis_jalur`) VALUES
(1, 'gerbang_utama', 'pos_keamanan', 35.00, 'Jalur Utama'),
(2, 'pos_keamanan', 'jalan_masuk', 40.00, 'Jalur Utama'),
(3, 'jalan_masuk', 'simpang_gor', 35.00, 'Jalur Utama'),
(4, 'simpang_gor', 'parkir_gor', 45.00, 'Jalur Parkir'),
(5, 'simpang_gor', 'parkir_lorong_bangka', 25.00, 'Jalur Parkir'),
(6, 'simpang_gor', 'akses_gedung_e', 30.00, 'Jalur Pedestrian'),
(7, 'simpang_gor', 'simpang_pajhur', 50.00, 'Jalur Utama'),
(8, 'simpang_pajhur', 'akses_gedung_f', 30.00, 'Jalur Pedestrian'),
(9, 'simpang_pajhur', 'bundaran_monumen', 40.00, 'Jalur Utama'),
(10, 'simpang_pajhur', 'simpang_barat', 45.00, 'Jalur Pedestrian'),
(11, 'simpang_barat', 'akses_gedung_a', 25.00, 'Jalur Pedestrian'),
(12, 'simpang_barat', 'akses_gedung_d', 25.00, 'Jalur Pedestrian'),
(13, 'bundaran_monumen', 'simpang_barat', 40.00, 'Jalur Pedestrian'),
(14, 'bundaran_monumen', 'plaza_tengah', 35.00, 'Jalur Pedestrian'),
(15, 'bundaran_monumen', 'parkir_dosen', 65.00, 'Jalur Kendaraan'),
(16, 'plaza_tengah', 'akses_gedung_d', 30.00, 'Jalur Pedestrian'),
(17, 'plaza_tengah', 'akses_gedung_b', 35.00, 'Jalur Pedestrian'),
(18, 'plaza_tengah', 'simpang_utara', 35.00, 'Jalur Pedestrian'),
(19, 'akses_gedung_b', 'parkir_dosen', 35.00, 'Jalur Pedestrian'),
(20, 'simpang_utara', 'akses_gedung_c', 20.00, 'Jalur Pedestrian'),
(21, 'simpang_utara', 'jalur_musholla', 30.00, 'Jalur Pedestrian'),
(22, 'jalur_musholla', 'musholla', 25.00, 'Jalur Pedestrian'),
(23, 'jalur_musholla', 'lab_industri', 35.00, 'Jalur Pedestrian'),
(24, 'jalur_musholla', 'jalur_kantin', 30.00, 'Jalur Pedestrian'),
(25, 'jalur_kantin', 'kantin', 20.00, 'Jalur Pedestrian'),
(26, 'jalur_kantin', 'pkm_koperasi', 35.00, 'Jalur Pedestrian'),
-- Indoor Edges
(27, 'akses_gedung_a', 'gd_a_lt1_lobi', 10.00, 'Pintu Masuk'),
(28, 'gd_a_lt1_lobi', 'gd_a_lt1_koridor', 12.00, 'Koridor'),
(29, 'gd_a_lt1_koridor', 'gd_a_lt1_tangga', 15.00, 'Koridor'),
(30, 'gd_a_lt1_koridor', 'room_1', 8.00, 'Akses Ruang'),
(31, 'gd_a_lt1_koridor', 'room_2', 10.00, 'Akses Ruang'),
(32, 'gd_a_lt1_koridor', 'room_3', 14.00, 'Akses Ruang'),
(33, 'gd_a_lt1_tangga', 'gd_a_lt2_tangga', 15.00, 'Tangga/Lift'),
(34, 'gd_a_lt2_tangga', 'gd_a_lt2_koridor', 10.00, 'Koridor'),
(35, 'akses_gedung_b', 'gd_b_lt1_lobi', 10.00, 'Pintu Masuk'),
(36, 'gd_b_lt1_lobi', 'gd_b_lt1_koridor', 12.00, 'Koridor'),
(37, 'gd_b_lt1_koridor', 'gd_b_lt1_tangga', 15.00, 'Koridor'),
(38, 'gd_b_lt1_koridor', 'room_10', 8.00, 'Akses Ruang'),
(39, 'gd_b_lt1_tangga', 'gd_b_lt2_tangga', 15.00, 'Tangga/Lift'),
(40, 'gd_b_lt2_tangga', 'gd_b_lt2_koridor', 10.00, 'Koridor'),
(41, 'gd_b_lt2_koridor', 'room_14', 10.00, 'Akses Ruang'),
(42, 'gd_b_lt2_koridor', 'room_15', 12.00, 'Akses Ruang');

-- End of SQL Script
