/**
 * Modul Algoritma Dijkstra & Rute Singkat Kampus UNIBA Madura
 * Sistem Informasi Spasial Interaktif Kampus UNIBA Madura
 * Menggunakan Sistem Koordinat Peta Spasial Lokal Asli (Leaflet CRS.Simple)
 * Menjangkau hingga Titik Akses Ruangan Tujuan (Sesuai Ketentuan Skripsi Bagian 6 & 7)
 * Pengembang: R. Aj Gita Dwi Aprilia (NIM: 2302510011)
 */

const DijkstraRute = {
    // 1. Simpul Jaringan Spasial Kampus (Nodes Luar Kampus & Akses Gedung)
    // Koordinat x, y merujuk ke dimensi asli gambar peta spasial 731 x 1034
    // lat = 1034 - y, lon = x
    nodes: {
        // --- JALUR LUAR KAMPUS & AKSES UTAMA ---
        'gerbang_utama': {
            id: 'gerbang_utama',
            nama: 'Gerbang Utama (Jl. Raya Lenteng)',
            label: 'Gerbang Utama',
            kategori: 'Akses',
            x: 168, y: 910,
            lat: 124, lon: 168
        },
        'pos_keamanan': {
            id: 'pos_keamanan',
            nama: 'Pos Keamanan & Portal Depan',
            label: 'Pos Keamanan',
            kategori: 'Akses',
            x: 200, y: 810,
            lat: 224, lon: 200
        },
        'jalan_masuk': {
            id: 'jalan_masuk',
            nama: 'Jalan Masuk Utama Kawasan',
            label: 'Jalan Masuk Utama',
            kategori: 'Jalan',
            x: 245, y: 730,
            lat: 304, lon: 245
        },
        'simpang_gor': {
            id: 'simpang_gor',
            nama: 'Simpang GOR & Parkir Lorong Bangka',
            label: 'Simpang GOR',
            kategori: 'Simpang',
            x: 285, y: 675,
            lat: 359, lon: 285
        },
        'parkir_gor': {
            id: 'parkir_gor',
            nama: 'Area Parkir GOR Bahaudin Mudhary',
            label: 'Parkir GOR',
            kategori: 'Fasilitas',
            x: 160, y: 665,
            lat: 369, lon: 160
        },
        'parkir_lorong_bangka': {
            id: 'parkir_lorong_bangka',
            nama: 'Area Parkiran Lorong Bangka',
            label: 'Parkir Lorong Bangka',
            kategori: 'Fasilitas',
            x: 330, y: 700,
            lat: 334, lon: 330
        },
        'simpang_pajhur': {
            id: 'simpang_pajhur',
            nama: 'Simpang Panggung Pajhur & Amphitheater',
            label: 'Simpang Pajhur',
            kategori: 'Simpang',
            x: 360, y: 575,
            lat: 459, lon: 360
        },
        'bundaran_monumen': {
            id: 'bundaran_monumen',
            nama: 'Bundaran Monumen Achmad Bahaudin Mudhary',
            label: 'Bundaran Monumen',
            kategori: 'Simpang',
            x: 425, y: 505,
            lat: 529, lon: 425
        },
        'plaza_tengah': {
            id: 'plaza_tengah',
            nama: 'Plaza & Taman Pedestrian Tengah Kampus',
            label: 'Plaza Tengah',
            kategori: 'Simpang',
            x: 460, y: 430,
            lat: 604, lon: 460
        },
        'simpang_barat': {
            id: 'simpang_barat',
            nama: 'Simpang Koridor Barat (Gedung A & D)',
            label: 'Simpang Akses Barat',
            kategori: 'Simpang',
            x: 300, y: 490,
            lat: 544, lon: 300
        },
        'simpang_utara': {
            id: 'simpang_utara',
            nama: 'Simpang Pedestrian Utara (Depan Gedung C)',
            label: 'Simpang Utara',
            kategori: 'Simpang',
            x: 475, y: 380,
            lat: 654, lon: 475
        },
        'parkir_dosen': {
            id: 'parkir_dosen',
            nama: 'Area Parkir Dosen & Karyawan (Sisi FST)',
            label: 'Parkiran Dosen',
            kategori: 'Fasilitas',
            x: 590, y: 585,
            lat: 449, lon: 590
        },
        'jalur_musholla': {
            id: 'jalur_musholla',
            nama: 'Jalur Pedestrian Musholla & Lab Industri',
            label: 'Jalur Musholla',
            kategori: 'Jalan',
            x: 560, y: 360,
            lat: 674, lon: 560
        },
        'musholla': {
            id: 'musholla',
            nama: 'Musholla Al-Qosos Kampus UNIBA',
            label: 'Musholla Al-Qosos',
            kategori: 'Fasilitas',
            x: 620, y: 345,
            lat: 689, lon: 620
        },
        'lab_industri': {
            id: 'lab_industri',
            nama: 'Laboratorium Teknik Industri',
            label: 'Lab Industri',
            kategori: 'Fasilitas',
            x: 685, y: 375,
            lat: 659, lon: 685
        },
        'jalur_kantin': {
            id: 'jalur_kantin',
            nama: 'Jalur Penghubung Pujasera & Kantin',
            label: 'Jalur Kantin',
            kategori: 'Jalan',
            x: 620, y: 285,
            lat: 749, lon: 620
        },
        'kantin': {
            id: 'kantin',
            nama: 'Kantin & Pujasera Mahasiswa',
            label: 'Kantin Kampus',
            kategori: 'Fasilitas',
            x: 655, y: 285,
            lat: 749, lon: 655
        },
        'pkm_koperasi': {
            id: 'pkm_koperasi',
            nama: 'PKM & Koperasi Mahasiswa',
            label: 'PKM & Koperasi',
            kategori: 'Fasilitas',
            x: 605, y: 205,
            lat: 829, lon: 605
        },

        // --- AKSES MASUK GEDUNG (PINTU MASUK / LOBI LUAR) ---
        'akses_gedung_a': {
            id: 'akses_gedung_a',
            nama: 'Pintu Masuk Utama Gedung Deramista (Gedung A)',
            label: 'Pintu Masuk Gedung A',
            kategori: 'Gedung',
            gedung_id: 1,
            x: 245, y: 445,
            lat: 589, lon: 245
        },
        'akses_gedung_b': {
            id: 'akses_gedung_b',
            nama: 'Pintu Masuk Utama Gedung Campaka (Gedung B - FST)',
            label: 'Pintu Masuk Gedung B',
            kategori: 'Gedung',
            gedung_id: 2,
            x: 535, y: 470,
            lat: 564, lon: 535
        },
        'akses_gedung_c': {
            id: 'akses_gedung_c',
            nama: 'Pintu Masuk Utama Gedung Kapanjin (Gedung C - FEB)',
            label: 'Pintu Masuk Gedung C',
            kategori: 'Gedung',
            gedung_id: 3,
            x: 475, y: 355,
            lat: 679, lon: 475
        },
        'akses_gedung_d': {
            id: 'akses_gedung_d',
            nama: 'Pintu Masuk Utama Gedung Tuan Gubhe (Gedung D)',
            label: 'Pintu Masuk Gedung D',
            kategori: 'Gedung',
            gedung_id: 4,
            x: 345, y: 485,
            lat: 549, lon: 345
        },
        'akses_gedung_e': {
            id: 'akses_gedung_e',
            nama: 'Pintu Masuk Utama GOR Bahaudin Mudhary (Gedung E)',
            label: 'Pintu Masuk GOR (Gd. E)',
            kategori: 'Gedung',
            gedung_id: 5,
            x: 260, y: 620,
            lat: 414, lon: 260
        },
        'akses_gedung_f': {
            id: 'akses_gedung_f',
            nama: 'Pintu Masuk Panggung Pajhur (Gedung F)',
            label: 'Panggung Pajhur (Gd. F)',
            kategori: 'Gedung',
            gedung_id: 6,
            x: 430, y: 590,
            lat: 444, lon: 430
        },

        // --- SIMPUL DALAM GEDUNG (INDOOR NODES): GEDUNG A (DERAMISTA - REKTORAT) ---
        'gd_a_lt1_lobi': { id: 'gd_a_lt1_lobi', nama: 'Lobi Utama Gedung A (Lantai 1)', label: 'Lobi Gd. A (Lt. 1)', kategori: 'Koridor', gedung_id: 1, lantai: 1 },
        'gd_a_lt1_koridor': { id: 'gd_a_lt1_koridor', nama: 'Koridor Utama Lantai 1 Gedung A', label: 'Koridor Lt. 1 Gd. A', kategori: 'Koridor', gedung_id: 1, lantai: 1 },
        'gd_a_lt1_tangga': { id: 'gd_a_lt1_tangga', nama: 'Tangga & Lift Lantai 1 Gedung A', label: 'Tangga/Lift Lt. 1 Gd. A', kategori: 'Tangga', gedung_id: 1, lantai: 1 },
        'gd_a_lt2_tangga': { id: 'gd_a_lt2_tangga', nama: 'Tangga & Lift Lantai 2 Gedung A', label: 'Tangga/Lift Lt. 2 Gd. A', kategori: 'Tangga', gedung_id: 1, lantai: 2 },
        'gd_a_lt2_koridor': { id: 'gd_a_lt2_koridor', nama: 'Koridor Rektorat Lantai 2 Gedung A', label: 'Koridor Lt. 2 Gd. A', kategori: 'Koridor', gedung_id: 1, lantai: 2 },
        'gd_a_lt3_tangga': { id: 'gd_a_lt3_tangga', nama: 'Tangga & Lift Lantai 3 Gedung A', label: 'Tangga/Lift Lt. 3 Gd. A', kategori: 'Tangga', gedung_id: 1, lantai: 3 },
        'gd_a_lt3_koridor': { id: 'gd_a_lt3_koridor', nama: 'Koridor Senat Lantai 3 Gedung A', label: 'Koridor Lt. 3 Gd. A', kategori: 'Koridor', gedung_id: 1, lantai: 3 },
        'gd_a_lt4_tangga': { id: 'gd_a_lt4_tangga', nama: 'Tangga & Lift Lantai 4 Gedung A', label: 'Tangga/Lift Lt. 4 Gd. A', kategori: 'Tangga', gedung_id: 1, lantai: 4 },
        'gd_a_lt4_koridor': { id: 'gd_a_lt4_koridor', nama: 'Koridor Aula Lantai 4 Gedung A', label: 'Koridor Lt. 4 Gd. A', kategori: 'Koridor', gedung_id: 1, lantai: 4 },

        // Ruangan Gedung A (ID 1-14)
        'room_1': { id: 'room_1', nama: 'A1.01 - Lobby Utama & Pusat Informasi', label: 'Ruang A1.01', kategori: 'Ruangan', gedung_id: 1, lantai: 1, room_id: 1 },
        'room_2': { id: 'room_2', nama: 'A1.02 - Biro Administrasi Akademik (BAAK)', label: 'Ruang A1.02 (BAAK)', kategori: 'Ruangan', gedung_id: 1, lantai: 1, room_id: 2 },
        'room_3': { id: 'room_3', nama: 'A1.03 - Ruang Kelas Eksekutif A1.03', label: 'Ruang Kelas A1.03', kategori: 'Ruangan', gedung_id: 1, lantai: 1, room_id: 3 },
        'room_4': { id: 'room_4', nama: 'A1.04 - Biro Administrasi Keuangan (BAK)', label: 'Ruang A1.04 (BAK)', kategori: 'Ruangan', gedung_id: 1, lantai: 1, room_id: 4 },
        'room_5': { id: 'room_5', nama: 'A1.05 - Toilet Mahasiswa & Dosen Lantai 1', label: 'Toilet Lt. 1 Gd. A', kategori: 'Ruangan', gedung_id: 1, lantai: 1, room_id: 5 },
        'room_6': { id: 'room_6', nama: 'A1.06 - Tangga & Lift Sentral', label: 'Tangga & Lift A1.06', kategori: 'Ruangan', gedung_id: 1, lantai: 1, room_id: 6 },
        'room_7': { id: 'room_7', nama: 'A2.01 - Ruang Rektor UNIBA Madura', label: 'Ruang Rektor (A2.01)', kategori: 'Ruangan', gedung_id: 1, lantai: 2, room_id: 7 },
        'room_8': { id: 'room_8', nama: 'A2.02 - Ruang Wakil Rektor I & II', label: 'Ruang Warek (A2.02)', kategori: 'Ruangan', gedung_id: 1, lantai: 2, room_id: 8 },
        'room_9': { id: 'room_9', nama: 'A2.03 - Ruang Rapat Pimpinan Terbatas', label: 'Ruang Rapat A2.03', kategori: 'Ruangan', gedung_id: 1, lantai: 2, room_id: 9 },
        'room_10': { id: 'room_10', nama: 'A2.04 - Toilet & Tangga/Lift Lantai 2', label: 'Toilet & Lift A2.04', kategori: 'Ruangan', gedung_id: 1, lantai: 2, room_id: 10 },
        'room_11': { id: 'room_11', nama: 'A3.01 - Ruang Sidang Senat Akademik', label: 'Ruang Sidang Senat (A3.01)', kategori: 'Ruangan', gedung_id: 1, lantai: 3, room_id: 11 },
        'room_12': { id: 'room_12', nama: 'A3.02 - Lembaga Penjaminan Mutu (LPM)', label: 'LPM UNIBA (A3.02)', kategori: 'Ruangan', gedung_id: 1, lantai: 3, room_id: 12 },
        'room_13': { id: 'room_13', nama: 'A4.01 - Deramista Executive Hall', label: 'Executive Hall (A4.01)', kategori: 'Ruangan', gedung_id: 1, lantai: 4, room_id: 13 },
        'room_14': { id: 'room_14', nama: 'A4.02 - Studio Podcast & Media UNIBA TV', label: 'Studio Media (A4.02)', kategori: 'Ruangan', gedung_id: 1, lantai: 4, room_id: 14 },

        // --- SIMPUL DALAM GEDUNG: GEDUNG B (CAMPAKA - FST) ---
        'gd_b_lt1_lobi': { id: 'gd_b_lt1_lobi', nama: 'Lobi Utama Gedung Campaka (Lantai 1)', label: 'Lobi Gd. B (Lt. 1)', kategori: 'Koridor', gedung_id: 2, lantai: 1 },
        'gd_b_lt1_koridor': { id: 'gd_b_lt1_koridor', nama: 'Koridor Utama Lantai 1 FST', label: 'Koridor Lt. 1 FST', kategori: 'Koridor', gedung_id: 2, lantai: 1 },
        'gd_b_lt1_tangga': { id: 'gd_b_lt1_tangga', nama: 'Tangga & Lift Lantai 1 FST', label: 'Tangga/Lift Lt. 1 FST', kategori: 'Tangga', gedung_id: 2, lantai: 1 },
        'gd_b_lt2_tangga': { id: 'gd_b_lt2_tangga', nama: 'Tangga & Lift Lantai 2 FST', label: 'Tangga/Lift Lt. 2 FST', kategori: 'Tangga', gedung_id: 2, lantai: 2 },
        'gd_b_lt2_koridor': { id: 'gd_b_lt2_koridor', nama: 'Koridor Laboratorium Lantai 2 FST', label: 'Koridor Lab Lt. 2 FST', kategori: 'Koridor', gedung_id: 2, lantai: 2 },
        'gd_b_lt3_tangga': { id: 'gd_b_lt3_tangga', nama: 'Tangga & Lift Lantai 3 FST', label: 'Tangga/Lift Lt. 3 FST', kategori: 'Tangga', gedung_id: 2, lantai: 3 },
        'gd_b_lt3_koridor': { id: 'gd_b_lt3_koridor', nama: 'Koridor Ruang Dosen Lantai 3 FST', label: 'Koridor Lt. 3 FST', kategori: 'Koridor', gedung_id: 2, lantai: 3 },
        'gd_b_lt4_tangga': { id: 'gd_b_lt4_tangga', nama: 'Tangga & Lift Lantai 4 FST', label: 'Tangga/Lift Lt. 4 FST', kategori: 'Tangga', gedung_id: 2, lantai: 4 },
        'gd_b_lt4_koridor': { id: 'gd_b_lt4_koridor', nama: 'Koridor Studio & IoT Lantai 4 FST', label: 'Koridor Lt. 4 FST', kategori: 'Koridor', gedung_id: 2, lantai: 4 },

        // Ruangan Gedung B (ID 15-28)
        'room_15': { id: 'room_15', nama: 'B1.01 - Ruang Dekanat Fakultas Sains & Teknologi', label: 'Dekanat FST (B1.01)', kategori: 'Ruangan', gedung_id: 2, lantai: 1, room_id: 15 },
        'room_16': { id: 'room_16', nama: 'B1.02 - Ruang Kuliah FST B1.02', label: 'Kelas B1.02', kategori: 'Ruangan', gedung_id: 2, lantai: 1, room_id: 16 },
        'room_17': { id: 'room_17', nama: 'B1.03 - Ruang Kuliah FST B1.03', label: 'Kelas B1.03', kategori: 'Ruangan', gedung_id: 2, lantai: 1, room_id: 17 },
        'room_18': { id: 'room_18', nama: 'B1.04 - Bagian Tata Usaha & Pelayanan FST', label: 'TU FST (B1.04)', kategori: 'Ruangan', gedung_id: 2, lantai: 1, room_id: 18 },
        'room_19': { id: 'room_19', nama: 'B1.05 - Toilet Mahasiswa & Dosen Lantai 1', label: 'Toilet Lt. 1 FST', kategori: 'Ruangan', gedung_id: 2, lantai: 1, room_id: 19 },
        'room_20': { id: 'room_20', nama: 'B1.06 - Tangga Utama & Akses Evakuasi', label: 'Tangga Utama B1.06', kategori: 'Ruangan', gedung_id: 2, lantai: 1, room_id: 20 },
        'room_21': { id: 'room_21', nama: 'B2.01 - Laboratorium Komputer 1 (Software & GIS)', label: 'Lab Komputer GIS (B2.01)', kategori: 'Ruangan', gedung_id: 2, lantai: 2, room_id: 21 },
        'room_22': { id: 'room_22', nama: 'B2.02 - Laboratorium Jaringan & Keamanan Siber', label: 'Lab Jaringan (B2.02)', kategori: 'Ruangan', gedung_id: 2, lantai: 2, room_id: 22 },
        'room_23': { id: 'room_23', nama: 'B2.03 - Ruang Perkuliahan B2.03', label: 'Kelas B2.03', kategori: 'Ruangan', gedung_id: 2, lantai: 2, room_id: 23 },
        'room_24': { id: 'room_24', nama: 'B2.04 - Toilet & Tangga Lantai 2', label: 'Toilet & Tangga B2.04', kategori: 'Ruangan', gedung_id: 2, lantai: 2, room_id: 24 },
        'room_25': { id: 'room_25', nama: 'B3.01 - Ruang Dosen Sistem Informasi & Informatika', label: 'Ruang Dosen SI & IF (B3.01)', kategori: 'Ruangan', gedung_id: 2, lantai: 3, room_id: 25 },
        'room_26': { id: 'room_26', nama: 'B3.02 - Laboratorium Multimedia & Riset AI', label: 'Lab AI & Multimedia (B3.02)', kategori: 'Ruangan', gedung_id: 2, lantai: 3, room_id: 26 },
        'room_27': { id: 'room_27', nama: 'B4.01 - Laboratorium Internet of Things (IoT) & Robotika', label: 'Lab IoT & Robotika (B4.01)', kategori: 'Ruangan', gedung_id: 2, lantai: 4, room_id: 27 },
        'room_28': { id: 'room_28', nama: 'B4.02 - Studio Inovasi Desain Sistem & Startup Mahasiswa', label: 'Studio Inovasi (B4.02)', kategori: 'Ruangan', gedung_id: 2, lantai: 4, room_id: 28 },

        // --- SIMPUL DALAM GEDUNG: GEDUNG C (KAPANJIN - FEB) ---
        'gd_c_lt1_lobi': { id: 'gd_c_lt1_lobi', nama: 'Lobi Utama Gedung Kapanjin (Lantai 1)', label: 'Lobi Gd. C (Lt. 1)', kategori: 'Koridor', gedung_id: 3, lantai: 1 },
        'gd_c_lt1_koridor': { id: 'gd_c_lt1_koridor', nama: 'Koridor Utama Lantai 1 FEB', label: 'Koridor Lt. 1 FEB', kategori: 'Koridor', gedung_id: 3, lantai: 1 },
        'gd_c_lt1_tangga': { id: 'gd_c_lt1_tangga', nama: 'Tangga & Lift Lantai 1 FEB', label: 'Tangga/Lift Lt. 1 FEB', kategori: 'Tangga', gedung_id: 3, lantai: 1 },
        'gd_c_lt2_tangga': { id: 'gd_c_lt2_tangga', nama: 'Tangga & Lift Lantai 2 FEB', label: 'Tangga/Lift Lt. 2 FEB', kategori: 'Tangga', gedung_id: 3, lantai: 2 },
        'gd_c_lt2_koridor': { id: 'gd_c_lt2_koridor', nama: 'Koridor Lantai 2 FEB', label: 'Koridor Lt. 2 FEB', kategori: 'Koridor', gedung_id: 3, lantai: 2 },

        // Ruangan Gedung C (ID 29-33)
        'room_29': { id: 'room_29', nama: 'C1.01 - Galeri Investasi Bursa Efek Indonesia (BEI)', label: 'Galeri Investasi (C1.01)', kategori: 'Ruangan', gedung_id: 3, lantai: 1, room_id: 29 },
        'room_30': { id: 'room_30', nama: 'C1.02 - Ruang Kuliah Manajemen C1.02', label: 'Kelas C1.02', kategori: 'Ruangan', gedung_id: 3, lantai: 1, room_id: 30 },
        'room_31': { id: 'room_31', nama: 'C1.03 - Tata Usaha & Pelayanan FEB', label: 'TU FEB (C1.03)', kategori: 'Ruangan', gedung_id: 3, lantai: 1, room_id: 31 },
        'room_32': { id: 'room_32', nama: 'C2.01 - Laboratorium Akuntansi & Mini Bank Syariah', label: 'Lab Akuntansi (C2.01)', kategori: 'Ruangan', gedung_id: 3, lantai: 2, room_id: 32 },
        'room_33': { id: 'room_33', nama: 'C2.02 - Ruang Kuliah Akuntansi C2.02', label: 'Kelas C2.02', kategori: 'Ruangan', gedung_id: 3, lantai: 2, room_id: 33 },

        // --- SIMPUL DALAM GEDUNG: GEDUNG D (TUAN GUBHE) ---
        'gd_d_lt1_lobi': { id: 'gd_d_lt1_lobi', nama: 'Lobi Gedung Tuan Gubhe (Perpustakaan)', label: 'Lobi Gd. D (Lt. 1)', kategori: 'Koridor', gedung_id: 4, lantai: 1 },
        'gd_d_lt1_koridor': { id: 'gd_d_lt1_koridor', nama: 'Koridor Perpustakaan Lantai 1', label: 'Koridor Lt. 1 Gd. D', kategori: 'Koridor', gedung_id: 4, lantai: 1 },
        'gd_d_lt1_tangga': { id: 'gd_d_lt1_tangga', nama: 'Tangga & Lift Lantai 1 Gedung D', label: 'Tangga/Lift Lt. 1 Gd. D', kategori: 'Tangga', gedung_id: 4, lantai: 1 },
        'gd_d_lt3_tangga': { id: 'gd_d_lt3_tangga', nama: 'Tangga & Lift Menuju Auditorium Lantai 3', label: 'Tangga/Lift Lt. 3 Gd. D', kategori: 'Tangga', gedung_id: 4, lantai: 3 },
        'gd_d_lt3_koridor': { id: 'gd_d_lt3_koridor', nama: 'Koridor Foyer Auditorium Lantai 3', label: 'Koridor Lt. 3 Gd. D', kategori: 'Koridor', gedung_id: 4, lantai: 3 },

        // Ruangan Gedung D (ID 34-36)
        'room_34': { id: 'room_34', nama: 'D1.01 - Perpustakaan Pusat & Digital Library', label: 'Perpustakaan (D1.01)', kategori: 'Ruangan', gedung_id: 4, lantai: 1, room_id: 34 },
        'room_35': { id: 'room_35', nama: 'D1.02 - Coworking Space & Student Lounge', label: 'Coworking Space (D1.02)', kategori: 'Ruangan', gedung_id: 4, lantai: 1, room_id: 35 },
        'room_36': { id: 'room_36', nama: 'D3.01 - Auditorium Megah Tuan Gubhe', label: 'Auditorium (D3.01)', kategori: 'Ruangan', gedung_id: 4, lantai: 3, room_id: 36 },

        // --- SIMPUL DALAM GEDUNG: GOR & PANGGUNG PAJHUR ---
        'gd_e_lt1_lobi': { id: 'gd_e_lt1_lobi', nama: 'Lobi & Foyer Masuk GOR Bahaudin Mudhary', label: 'Lobi GOR (Gd. E)', kategori: 'Koridor', gedung_id: 5, lantai: 1 },
        'room_37': { id: 'room_37', nama: 'E1.01 - Arena Lapangan Indoor Serbaguna', label: 'Arena GOR (E1.01)', kategori: 'Ruangan', gedung_id: 5, lantai: 1, room_id: 37 },
        'room_38': { id: 'room_38', nama: 'E1.02 - Ruang Medis & Pos P3K Kampus', label: 'Ruang Medis (E1.02)', kategori: 'Ruangan', gedung_id: 5, lantai: 1, room_id: 38 },

        'gd_f_lt1_lobi': { id: 'gd_f_lt1_lobi', nama: 'Plaza & Akses Masuk Panggung Pajhur', label: 'Akses Pajhur (Gd. F)', kategori: 'Koridor', gedung_id: 6, lantai: 1 },
        'room_39': { id: 'room_39', nama: 'F1.01 - Panggung Terbuka Seni Budaya Pajhur', label: 'Panggung Pajhur (F1.01)', kategori: 'Ruangan', gedung_id: 6, lantai: 1, room_id: 39 }
    },

    // 2. Daftar Titik Jalur / Bobot Jarak Antar Node (Edges dalam Meter)
    edges: [
        // --- JALUR LUAR KAMPUS (JALAN & PEDESTRIAN) ---
        { u: 'gerbang_utama', v: 'pos_keamanan', weight: 35, type: 'Jalur Utama' },
        { u: 'pos_keamanan', v: 'jalan_masuk', weight: 40, type: 'Jalur Utama' },
        { u: 'jalan_masuk', v: 'simpang_gor', weight: 35, type: 'Jalur Utama' },
        { u: 'simpang_gor', v: 'parkir_gor', weight: 45, type: 'Jalur Parkir' },
        { u: 'simpang_gor', v: 'parkir_lorong_bangka', weight: 25, type: 'Jalur Parkir' },
        { u: 'simpang_gor', v: 'akses_gedung_e', weight: 30, type: 'Jalur Pedestrian' },
        { u: 'simpang_gor', v: 'simpang_pajhur', weight: 50, type: 'Jalur Utama' },
        { u: 'simpang_pajhur', v: 'akses_gedung_f', weight: 30, type: 'Jalur Pedestrian' },
        { u: 'simpang_pajhur', v: 'bundaran_monumen', weight: 40, type: 'Jalur Utama' },
        { u: 'simpang_pajhur', v: 'simpang_barat', weight: 45, type: 'Jalur Pedestrian' },
        { u: 'simpang_barat', v: 'akses_gedung_a', weight: 25, type: 'Jalur Pedestrian' },
        { u: 'simpang_barat', v: 'akses_gedung_d', weight: 25, type: 'Jalur Pedestrian' },
        { u: 'bundaran_monumen', v: 'simpang_barat', weight: 40, type: 'Jalur Pedestrian' },
        { u: 'bundaran_monumen', v: 'plaza_tengah', weight: 35, type: 'Jalur Pedestrian' },
        { u: 'bundaran_monumen', v: 'parkir_dosen', weight: 65, type: 'Jalur Kendaraan' },
        { u: 'plaza_tengah', v: 'akses_gedung_d', weight: 30, type: 'Jalur Pedestrian' },
        { u: 'plaza_tengah', v: 'akses_gedung_b', weight: 35, type: 'Jalur Pedestrian' },
        { u: 'plaza_tengah', v: 'simpang_utara', weight: 35, type: 'Jalur Pedestrian' },
        { u: 'akses_gedung_b', v: 'parkir_dosen', weight: 35, type: 'Jalur Pedestrian' },
        { u: 'simpang_utara', v: 'akses_gedung_c', weight: 20, type: 'Jalur Pedestrian' },
        { u: 'simpang_utara', v: 'jalur_musholla', weight: 30, type: 'Jalur Pedestrian' },
        { u: 'jalur_musholla', v: 'musholla', weight: 25, type: 'Jalur Pedestrian' },
        { u: 'jalur_musholla', v: 'lab_industri', weight: 35, type: 'Jalur Pedestrian' },
        { u: 'jalur_musholla', v: 'jalur_kantin', weight: 30, type: 'Jalur Pedestrian' },
        { u: 'jalur_kantin', v: 'kantin', weight: 20, type: 'Jalur Pedestrian' },
        { u: 'jalur_kantin', v: 'pkm_koperasi', weight: 35, type: 'Jalur Pedestrian' },

        // --- KONEKSI LUAR KE DALAM GEDUNG A (DERAMISTA - REKTORAT) ---
        { u: 'akses_gedung_a', v: 'gd_a_lt1_lobi', weight: 10, type: 'Pintu Masuk' },
        { u: 'gd_a_lt1_lobi', v: 'gd_a_lt1_koridor', weight: 12, type: 'Koridor' },
        { u: 'gd_a_lt1_koridor', v: 'gd_a_lt1_tangga', weight: 15, type: 'Koridor' },
        { u: 'gd_a_lt1_koridor', v: 'room_1', weight: 8, type: 'Akses Ruang' },
        { u: 'gd_a_lt1_koridor', v: 'room_2', weight: 10, type: 'Akses Ruang' },
        { u: 'gd_a_lt1_koridor', v: 'room_3', weight: 14, type: 'Akses Ruang' },
        { u: 'gd_a_lt1_koridor', v: 'room_4', weight: 10, type: 'Akses Ruang' },
        { u: 'gd_a_lt1_tangga', v: 'room_5', weight: 6, type: 'Akses Ruang' },
        { u: 'gd_a_lt1_tangga', v: 'room_6', weight: 5, type: 'Akses Ruang' },
        // Tangga Antar Lantai Gedung A
        { u: 'gd_a_lt1_tangga', v: 'gd_a_lt2_tangga', weight: 15, type: 'Tangga/Lift' },
        { u: 'gd_a_lt2_tangga', v: 'gd_a_lt2_koridor', weight: 10, type: 'Koridor' },
        { u: 'gd_a_lt2_koridor', v: 'room_7', weight: 12, type: 'Akses Ruang' },
        { u: 'gd_a_lt2_koridor', v: 'room_8', weight: 12, type: 'Akses Ruang' },
        { u: 'gd_a_lt2_koridor', v: 'room_9', weight: 15, type: 'Akses Ruang' },
        { u: 'gd_a_lt2_tangga', v: 'room_10', weight: 6, type: 'Akses Ruang' },
        { u: 'gd_a_lt2_tangga', v: 'gd_a_lt3_tangga', weight: 15, type: 'Tangga/Lift' },
        { u: 'gd_a_lt3_tangga', v: 'gd_a_lt3_koridor', weight: 10, type: 'Koridor' },
        { u: 'gd_a_lt3_koridor', v: 'room_11', weight: 15, type: 'Akses Ruang' },
        { u: 'gd_a_lt3_koridor', v: 'room_12', weight: 12, type: 'Akses Ruang' },
        { u: 'gd_a_lt3_tangga', v: 'gd_a_lt4_tangga', weight: 15, type: 'Tangga/Lift' },
        { u: 'gd_a_lt4_tangga', v: 'gd_a_lt4_koridor', weight: 10, type: 'Koridor' },
        { u: 'gd_a_lt4_koridor', v: 'room_13', weight: 18, type: 'Akses Ruang' },
        { u: 'gd_a_lt4_koridor', v: 'room_14', weight: 12, type: 'Akses Ruang' },

        // --- KONEKSI LUAR KE DALAM GEDUNG B (CAMPAKA - FST) ---
        { u: 'akses_gedung_b', v: 'gd_b_lt1_lobi', weight: 10, type: 'Pintu Masuk' },
        { u: 'gd_b_lt1_lobi', v: 'gd_b_lt1_koridor', weight: 12, type: 'Koridor' },
        { u: 'gd_b_lt1_koridor', v: 'gd_b_lt1_tangga', weight: 15, type: 'Koridor' },
        { u: 'gd_b_lt1_koridor', v: 'room_15', weight: 10, type: 'Akses Ruang' },
        { u: 'gd_b_lt1_koridor', v: 'room_16', weight: 12, type: 'Akses Ruang' },
        { u: 'gd_b_lt1_koridor', v: 'room_17', weight: 14, type: 'Akses Ruang' },
        { u: 'gd_b_lt1_koridor', v: 'room_18', weight: 10, type: 'Akses Ruang' },
        { u: 'gd_b_lt1_tangga', v: 'room_19', weight: 8, type: 'Akses Ruang' },
        { u: 'gd_b_lt1_tangga', v: 'room_20', weight: 5, type: 'Akses Ruang' },
        // Tangga Antar Lantai Gedung B
        { u: 'gd_b_lt1_tangga', v: 'gd_b_lt2_tangga', weight: 15, type: 'Tangga/Lift' },
        { u: 'gd_b_lt2_tangga', v: 'gd_b_lt2_koridor', weight: 10, type: 'Koridor' },
        { u: 'gd_b_lt2_koridor', v: 'room_21', weight: 10, type: 'Akses Ruang' },
        { u: 'gd_b_lt2_koridor', v: 'room_22', weight: 12, type: 'Akses Ruang' },
        { u: 'gd_b_lt2_koridor', v: 'room_23', weight: 15, type: 'Akses Ruang' },
        { u: 'gd_b_lt2_tangga', v: 'room_24', weight: 6, type: 'Akses Ruang' },
        { u: 'gd_b_lt2_tangga', v: 'gd_b_lt3_tangga', weight: 15, type: 'Tangga/Lift' },
        { u: 'gd_b_lt3_tangga', v: 'gd_b_lt3_koridor', weight: 10, type: 'Koridor' },
        { u: 'gd_b_lt3_koridor', v: 'room_25', weight: 12, type: 'Akses Ruang' },
        { u: 'gd_b_lt3_koridor', v: 'room_26', weight: 14, type: 'Akses Ruang' },
        { u: 'gd_b_lt3_tangga', v: 'gd_b_lt4_tangga', weight: 15, type: 'Tangga/Lift' },
        { u: 'gd_b_lt4_tangga', v: 'gd_b_lt4_koridor', weight: 10, type: 'Koridor' },
        { u: 'gd_b_lt4_koridor', v: 'room_27', weight: 14, type: 'Akses Ruang' },
        { u: 'gd_b_lt4_koridor', v: 'room_28', weight: 16, type: 'Akses Ruang' },

        // --- KONEKSI LUAR KE DALAM GEDUNG C (KAPANJIN - FEB) ---
        { u: 'akses_gedung_c', v: 'gd_c_lt1_lobi', weight: 10, type: 'Pintu Masuk' },
        { u: 'gd_c_lt1_lobi', v: 'gd_c_lt1_koridor', weight: 12, type: 'Koridor' },
        { u: 'gd_c_lt1_koridor', v: 'gd_c_lt1_tangga', weight: 15, type: 'Koridor' },
        { u: 'gd_c_lt1_koridor', v: 'room_29', weight: 10, type: 'Akses Ruang' },
        { u: 'gd_c_lt1_koridor', v: 'room_30', weight: 12, type: 'Akses Ruang' },
        { u: 'gd_c_lt1_koridor', v: 'room_31', weight: 10, type: 'Akses Ruang' },
        // Tangga Antar Lantai Gedung C
        { u: 'gd_c_lt1_tangga', v: 'gd_c_lt2_tangga', weight: 15, type: 'Tangga/Lift' },
        { u: 'gd_c_lt2_tangga', v: 'gd_c_lt2_koridor', weight: 10, type: 'Koridor' },
        { u: 'gd_c_lt2_koridor', v: 'room_32', weight: 12, type: 'Akses Ruang' },
        { u: 'gd_c_lt2_koridor', v: 'room_33', weight: 14, type: 'Akses Ruang' },

        // --- KONEKSI LUAR KE DALAM GEDUNG D (TUAN GUBHE) ---
        { u: 'akses_gedung_d', v: 'gd_d_lt1_lobi', weight: 10, type: 'Pintu Masuk' },
        { u: 'gd_d_lt1_lobi', v: 'gd_d_lt1_koridor', weight: 12, type: 'Koridor' },
        { u: 'gd_d_lt1_koridor', v: 'gd_d_lt1_tangga', weight: 15, type: 'Koridor' },
        { u: 'gd_d_lt1_koridor', v: 'room_34', weight: 12, type: 'Akses Ruang' },
        { u: 'gd_d_lt1_koridor', v: 'room_35', weight: 14, type: 'Akses Ruang' },
        // Tangga Antar Lantai Gedung D (Lantai 1 ke Lantai 3 Auditorium)
        { u: 'gd_d_lt1_tangga', v: 'gd_d_lt3_tangga', weight: 25, type: 'Tangga/Lift' },
        { u: 'gd_d_lt3_tangga', v: 'gd_d_lt3_koridor', weight: 10, type: 'Koridor' },
        { u: 'gd_d_lt3_koridor', v: 'room_36', weight: 15, type: 'Akses Ruang' },

        // --- KONEKSI GOR & PANGGUNG PAJHUR ---
        { u: 'akses_gedung_e', v: 'gd_e_lt1_lobi', weight: 10, type: 'Pintu Masuk' },
        { u: 'gd_e_lt1_lobi', v: 'room_37', weight: 12, type: 'Akses Ruang' },
        { u: 'gd_e_lt1_lobi', v: 'room_38', weight: 10, type: 'Akses Ruang' },

        { u: 'akses_gedung_f', v: 'gd_f_lt1_lobi', weight: 10, type: 'Pintu Masuk' },
        { u: 'gd_f_lt1_lobi', v: 'room_39', weight: 10, type: 'Akses Ruang' }
    ],

    // Membangun Graf Adjasensi
    buildGraph() {
        const adj = {};
        for (const nodeId in this.nodes) {
            adj[nodeId] = [];
        }
        this.edges.forEach(e => {
            if (adj[e.u] && adj[e.v]) {
                adj[e.u].push({ node: e.v, weight: e.weight, type: e.type });
                adj[e.v].push({ node: e.u, weight: e.weight, type: e.type });
            }
        });
        return adj;
    },

    // Algoritma Dijkstra: Menghitung Rute Terpendek Antar Simpul
    findShortestPath(startNodeId, targetNodeId) {
        if (!this.nodes[startNodeId] || !this.nodes[targetNodeId]) {
            return null;
        }

        if (startNodeId === targetNodeId) {
            const nodeObj = this.nodes[startNodeId];
            return {
                pathNodeIds: [startNodeId],
                pathNodes: [nodeObj],
                totalDistance: 0,
                estimatedMinutes: 1,
                coordinates: nodeObj.lat ? [[nodeObj.lat, nodeObj.lon]] : [],
                steps: [nodeObj.label],
                stepGuides: [`Anda sudah berada di lokasi: ${nodeObj.nama}`]
            };
        }

        const adj = this.buildGraph();
        const distances = {};
        const previous = {};
        const unvisited = new Set(Object.keys(this.nodes));

        for (const nodeId in this.nodes) {
            distances[nodeId] = Infinity;
            previous[nodeId] = null;
        }
        distances[startNodeId] = 0;

        while (unvisited.size > 0) {
            let current = null;
            let minDistance = Infinity;

            unvisited.forEach(nodeId => {
                if (distances[nodeId] < minDistance) {
                    minDistance = distances[nodeId];
                    current = nodeId;
                }
            });

            if (current === null || current === targetNodeId || minDistance === Infinity) {
                break;
            }

            unvisited.delete(current);

            adj[current].forEach(neighbor => {
                if (unvisited.has(neighbor.node)) {
                    const alt = distances[current] + neighbor.weight;
                    if (alt < distances[neighbor.node]) {
                        distances[neighbor.node] = alt;
                        previous[neighbor.node] = current;
                    }
                }
            });
        }

        // Rekonstruksi jalur dari target ke start
        const path = [];
        let curr = targetNodeId;
        while (curr !== null) {
            path.unshift(curr);
            curr = previous[curr];
        }

        if (path[0] !== startNodeId) {
            return null; // Tidak ada jalur terhubung
        }

        const pathNodeObjects = path.map(id => this.nodes[id]);
        const totalDistance = distances[targetNodeId];
        // Asumsi kecepatan jalan kaki normal di kampus: ~70 meter/menit (1.17 m/s)
        const estimatedMinutes = Math.max(1, Math.round(totalDistance / 70));

        // Ekstrak koordinat peta luar untuk garis Polyline Leaflet CRS.Simple
        // Hanya simpul yang memiliki nilai lat & lon (koordinat peta luar) yang digambar di peta spasial
        const outdoorCoords = [];
        pathNodeObjects.forEach(n => {
            if (typeof n.lat !== 'undefined' && typeof n.lon !== 'undefined') {
                outdoorCoords.push([n.lat, n.lon]);
            }
        });

        // Buat panduan langkah naratif terstruktur
        const stepGuides = this.generateStepGuides(pathNodeObjects);

        return {
            pathNodeIds: path,
            pathNodes: pathNodeObjects,
            totalDistance: totalDistance,
            estimatedMinutes: estimatedMinutes,
            coordinates: outdoorCoords,
            steps: pathNodeObjects.map(n => n.label),
            stepGuides: stepGuides
        };
    },

    // Panduan Naratif Berurutan (Step-by-Step Directions) Sesuai Ketentuan Skripsi Bagian 6 & 7
    generateStepGuides(pathNodeObjects) {
        if (!pathNodeObjects || pathNodeObjects.length === 0) return [];
        const guides = [];

        const start = pathNodeObjects[0];
        const end = pathNodeObjects[pathNodeObjects.length - 1];

        guides.push(`Mulai dari ${start.nama}`);

        for (let i = 1; i < pathNodeObjects.length - 1; i++) {
            const prev = pathNodeObjects[i - 1];
            const curr = pathNodeObjects[i];

            if (curr.kategori === 'Akses' || curr.kategori === 'Simpang' || curr.kategori === 'Jalan') {
                guides.push(`Ikuti jalur pejalan kaki melewati ${curr.nama}`);
            } else if (curr.kategori === 'Gedung' && curr.id.startsWith('akses_')) {
                guides.push(`Masuk melalui ${curr.nama}`);
            } else if (curr.kategori === 'Tangga') {
                if (curr.lantai && prev.lantai && curr.lantai !== prev.lantai) {
                    guides.push(`Gunakan tangga atau lift menuju Lantai ${curr.lantai}`);
                } else if (!prev.lantai) {
                    guides.push(`Menuju akses tangga dan lift gedung`);
                }
            } else if (curr.kategori === 'Koridor') {
                if (!prev.kategori || prev.kategori !== 'Koridor') {
                    guides.push(`Ikuti koridor utama Lantai ${curr.lantai || 1}`);
                }
            }
        }

        guides.push(`Tiba di tujuan: ${end.nama}`);
        return guides;
    },

    // Helper Pemetaan ID Ruangan Database / Denah ke ID Simpul Graf
    findRoomNodeId(roomIdentifier) {
        // Cek langsung jika sudah merupakan node id
        if (typeof roomIdentifier === 'string' && this.nodes[roomIdentifier]) {
            return roomIdentifier;
        }

        const rId = typeof roomIdentifier === 'object'
            ? (roomIdentifier.id || roomIdentifier.id_ruangan)
            : parseInt(roomIdentifier);

        // Cari simpul yang memiliki room_id sesuai
        for (const nId in this.nodes) {
            if (this.nodes[nId].room_id === rId) {
                return nId;
            }
        }

        // Fallback: cari dari kode ruangan
        if (typeof roomIdentifier === 'object' && roomIdentifier.kode) {
            const cleanCode = roomIdentifier.kode.toUpperCase().replace(/\s+/g, '');
            for (const nId in this.nodes) {
                if (this.nodes[nId].nama.toUpperCase().includes(cleanCode)) {
                    return nId;
                }
            }
        }

        return null;
    },

    // 4. Perhitungan Rute Menuju Ruangan Spesifik (Outdoor + Indoor Dijkstra Penuh)
    calculateRouteToRoom(startNodeId, targetRoomObj) {
        if (!targetRoomObj) return null;

        const targetRoomNodeId = this.findRoomNodeId(targetRoomObj);
        let route = null;

        if (targetRoomNodeId) {
            // Jalur Dijkstra penuh dari simpul awal sampai ke simpul ruangan
            route = this.findShortestPath(startNodeId, targetRoomNodeId);
        }

        // Fallback jika simpul indoor spesifik belum terhubung sempurna
        if (!route) {
            const buildingNodeMap = {
                1: 'akses_gedung_a',
                2: 'akses_gedung_b',
                3: 'akses_gedung_c',
                4: 'akses_gedung_d',
                5: 'akses_gedung_e',
                6: 'akses_gedung_f'
            };
            const bldEntranceNode = buildingNodeMap[targetRoomObj.id_gedung] || 'akses_gedung_a';
            const baseRoute = this.findShortestPath(startNodeId, bldEntranceNode);
            if (!baseRoute) return null;

            const floorNum = targetRoomObj.id_lantai || targetRoomObj.nomor_lantai || 1;
            const extraFloor = (floorNum - 1) * 20;
            const extraCorridor = 15;
            const finalDist = baseRoute.totalDistance + extraFloor + extraCorridor;
            const finalMin = Math.max(1, Math.round(finalDist / 70));

            const rCode = targetRoomObj.kode_ruangan || targetRoomObj.kode || '';
            const rName = targetRoomObj.nama_ruangan || targetRoomObj.nama || '';
            const safeName = (rCode ? rCode + ' - ' : '') + rName;

            const newSteps = [...baseRoute.steps];
            if (floorNum > 1) newSteps.push(`Lantai ${floorNum} (Tangga/Lift)`);
            newSteps.push(safeName);

            const newGuides = [...baseRoute.stepGuides];
            if (floorNum > 1) {
                newGuides.push(`Naik ke Lantai ${floorNum} menggunakan tangga utama atau lift gedung`);
            }
            newGuides.push(`Susuri koridor Lantai ${floorNum} menuju pintu masuk ${safeName}`);
            newGuides.push(`Tiba di ruangan tujuan: ${safeName}`);

            route = {
                ...baseRoute,
                totalDistance: finalDist,
                estimatedMinutes: finalMin,
                steps: newSteps,
                stepGuides: newGuides
            };
        }

        const rCode = targetRoomObj.kode_ruangan || targetRoomObj.kode || '';
        const rName = targetRoomObj.nama_ruangan || targetRoomObj.nama || '';
        const roomFullName = (rCode ? rCode + ' - ' : '') + rName;

        return {
            ...route,
            isRoomRoute: true,
            room: targetRoomObj,
            roomName: roomFullName,
            floor: targetRoomObj.id_lantai || targetRoomObj.nomor_lantai || 1,
            buildingId: targetRoomObj.id_gedung || 1
        };
    },

    // 5. Preset Rute Populer Kampus
    presetRoutes: [
        {
            id: 'preset-1',
            startId: 'gerbang_utama',
            targetId: 'room_3',
            targetType: 'room',
            roomId: 3,
            roomCode: 'A1.03',
            roomName: 'Ruang Kelas Eksekutif A1.03',
            buildingName: 'Gedung Deramista (Gedung A)',
            floor: 1,
            label: 'Gerbang Utama → Gedung A (Ruang A1.03)'
        },
        {
            id: 'preset-2',
            startId: 'gerbang_utama',
            targetId: 'room_21',
            targetType: 'room',
            roomId: 21,
            roomCode: 'B2.01',
            roomName: 'Laboratorium Komputer 1 (GIS)',
            buildingName: 'Gedung Campaka (Gedung B - FST)',
            floor: 2,
            label: 'Gerbang Utama → Gedung B (Lab Komputer GIS Lt. 2)'
        },
        {
            id: 'preset-3',
            startId: 'gerbang_utama',
            targetId: 'room_34',
            targetType: 'room',
            roomId: 34,
            roomCode: 'D1.01',
            roomName: 'Perpustakaan Pusat & Digital Library',
            buildingName: 'Gedung Tuan Gubhe (Gedung D)',
            floor: 1,
            label: 'Gerbang Utama → Gedung D (Perpustakaan Digital)'
        },
        {
            id: 'preset-4',
            startId: 'gerbang_utama',
            targetId: 'room_29',
            targetType: 'room',
            roomId: 29,
            roomCode: 'C1.01',
            roomName: 'Galeri Investasi Bursa Efek (IDX)',
            buildingName: 'Gedung Kapanjin (Gedung C - FEB)',
            floor: 1,
            label: 'Gerbang Utama → Gedung C (Galeri Investasi IDX)'
        },
        {
            id: 'preset-5',
            startId: 'gerbang_utama',
            targetId: 'akses_gedung_e',
            targetType: 'building',
            buildingName: 'GOR Bahaudin Mudhary',
            label: 'Gerbang Utama → GOR Kampus'
        }
    ]
};

/**
 * Controller Komponen Preview Rute Singkat di Halaman Beranda (Home)
 */
const HomeRoutePreview = {
    currentStart: 'gerbang_utama',
    currentTargetId: 'room-3',
    currentRoomObj: null,
    isInitialized: false,

    init() {
        const startSelect = document.getElementById('home-route-start');
        const targetSelect = document.getElementById('home-route-target');
        const viewMapBtn = document.getElementById('home-btn-view-route-map');
        if (!startSelect || !targetSelect) return;

        // Default tujuan: Ruang A1.03 (Gedung A, Lt 1)
        this.currentRoomObj = MapDenah.findRoomObject(3) || {
            id: 3,
            id_ruangan: 3,
            id_gedung: 1,
            id_lantai: 1,
            kode_ruangan: 'A1.03',
            kode: 'A1.03',
            nama_ruangan: 'Ruang Kelas Eksekutif A1.03',
            nama: 'Ruang Kelas Eksekutif A1.03',
            nama_gedung: 'Gedung Deramista (Gedung A)'
        };

        if (!this.isInitialized) {
            startSelect.addEventListener('change', () => this.calculateAndRender());
            targetSelect.addEventListener('change', () => this.calculateAndRender());

            if (viewMapBtn) {
                viewMapBtn.addEventListener('click', () => {
                    App.navigateTo('map-kampus', {
                        routeStart: this.currentStart,
                        routeEnd: this.currentTargetId,
                        routeRoom: this.currentRoomObj
                    });
                });
            }
            this.isInitialized = true;
        }

        this.calculateAndRender();
    },

    selectPreset(presetId) {
        const startSelect = document.getElementById('home-route-start');
        const targetSelect = document.getElementById('home-route-target');
        if (!startSelect || !targetSelect) return;

        startSelect.value = 'gerbang_utama';

        if (presetId === 'preset-gedung-a') {
            targetSelect.value = 'akses_gedung_a';
        } else if (presetId === 'preset-1') {
            targetSelect.value = 'room-3';
        } else if (presetId === 'preset-2') {
            targetSelect.value = 'room-21';
        } else if (presetId === 'preset-3') {
            targetSelect.value = 'room-34';
        } else if (presetId === 'preset-4') {
            targetSelect.value = 'room-29';
        } else if (presetId === 'preset-5') {
            targetSelect.value = 'akses_gedung_e';
        }

        this.calculateAndRender();
    },

    calculateAndRender() {
        const startSelect = document.getElementById('home-route-start');
        const targetSelect = document.getElementById('home-route-target');
        if (!startSelect || !targetSelect) return;

        this.currentStart = startSelect.value || 'gerbang_utama';
        const targetVal = targetSelect.value || 'room-3';
        this.currentTargetId = targetVal;

        let route = null;

        // Cek apakah target merupakan ruangan (room-X atau room_X atau kode seperti room_A1.03)
        if (targetVal.startsWith('room-') || targetVal.startsWith('room_')) {
            const rawId = targetVal.replace(/^room[-_]/, '');
            let roomId = parseInt(rawId);
            let roomObj = null;

            if (!isNaN(roomId)) {
                roomObj = MapDenah.findRoomObject(roomId);
            }

            // Fallback cari berdasarkan kode ruangan (misal: A1.03, B2.01)
            if (!roomObj) {
                for (const gId in DENAH_SPASIAL_DATA) {
                    const b = DENAH_SPASIAL_DATA[gId];
                    for (const fId in b.lantai) {
                        const found = b.lantai[fId].ruangan.find(r => r.kode.toUpperCase() === rawId.toUpperCase());
                        if (found) {
                            roomObj = MapDenah.findRoomObject(found.id);
                            break;
                        }
                    }
                    if (roomObj) break;
                }
            }

            if (roomObj) {
                this.currentRoomObj = roomObj;
                route = DijkstraRute.calculateRouteToRoom(this.currentStart, roomObj);
            }
        } else {
            // Target gedung / fasilitas umum luar
            this.currentRoomObj = null;
            route = DijkstraRute.findShortestPath(this.currentStart, targetVal);
        }

        this.renderPreviewResult(route);
    },

    renderPreviewResult(route) {
        const container = document.getElementById('home-route-result-container');
        if (!container) return;

        if (!route) {
            container.innerHTML = `
                <div class="alert alert-warning border-0 rounded-3 p-3">
                    <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                    Jalur rute belum dapat dihitung untuk titik awal dan tujuan tersebut.
                </div>
            `;
            return;
        }

        const badges = route.steps.map((st, i) => {
            const isFirst = i === 0;
            const isLast = i === route.steps.length - 1;
            const badgeClass = isFirst ? 'bg-success text-white' : (isLast ? 'bg-warning text-dark' : 'bg-light text-dark border');
            return `<span class="badge ${badgeClass} p-2">${i + 1}. ${st}</span>`;
        }).join(' <i class="bi bi-arrow-right text-muted mx-1"></i> ');

        const guidesHtml = (route.stepGuides && route.stepGuides.length)
            ? `<div class="bg-white p-3 rounded-3 border mb-3">
                <span class="small fw-bold text-success d-block mb-2"><i class="bi bi-signpost-split me-1"></i>Petunjuk Perjalanan Bertahap:</span>
                <ol class="small text-muted mb-0 ps-3" style="line-height: 1.6;">
                    ${route.stepGuides.map(g => `<li class="mb-1">${g}</li>`).join('')}
                </ol>
               </div>`
            : '';

        container.innerHTML = `
            <div class="card border-0 shadow-sm rounded-4 p-3 mb-2" style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-left: 4px solid #059669 !important;">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                    <div>
                        <span class="badge bg-success-subtle text-success small mb-1">Hasil Perhitungan Dijkstra</span>
                        <h6 class="fw-bold mb-0 text-dark">
                            ${this.currentRoomObj ? (this.currentRoomObj.kode + ' - ' + this.currentRoomObj.nama) : (DijkstraRute.nodes[this.currentTargetId]?.nama || 'Tujuan Kampus')}
                        </h6>
                    </div>
                    <div class="d-flex gap-3 align-items-center">
                        <div class="text-end">
                            <span class="small text-muted d-block">Total Jarak</span>
                            <span class="fw-bold text-success fs-6" id="home-route-dist">± ${route.totalDistance} meter</span>
                        </div>
                        <div class="text-end border-start ps-3">
                            <span class="small text-muted d-block">Estimasi Waktu</span>
                            <span class="fw-bold text-warning fs-6" id="home-route-time">± ${route.estimatedMinutes} menit</span>
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <span class="small fw-bold text-dark d-block mb-2">Urutan Jalur yang Dilewati (${route.steps.length} Titik):</span>
                    <div class="d-flex flex-wrap align-items-center gap-1" id="home-route-steps-container">
                        ${badges}
                    </div>
                </div>

                ${guidesHtml}

                <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-sm btn-success fw-bold px-3 py-2" onclick="App.navigateTo('map-kampus', { routeStart: '${this.currentStart}', routeEnd: '${this.currentTargetId}', routeRoom: ${this.currentRoomObj ? JSON.stringify(this.currentRoomObj).replace(/"/g, '&quot;') : 'null'} })">
                        <i class="bi bi-map-fill me-1"></i>Buka Rute di Peta Kampus &rarr;
                    </button>
                </div>
            </div>
        `;
    }
};
