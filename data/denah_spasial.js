/**
 * Data Denah 2D Spasial Ruangan per Gedung dan Lantai
 * Kampus Universitas Bahaudin Mudhary Madura (UNIBA Madura)
 */

const ROOM_TYPE_COLORS = {
    'Ruang Kelas': {
        stroke: '#0284c7',
        fill: '#e0f2fe',
        fillActive: '#38bdf8',
        badge: 'bg-primary-subtle text-primary border border-primary-subtle'
    },
    'Ruang Dosen': {
        stroke: '#6366f1',
        fill: '#ede9fe',
        fillActive: '#818cf8',
        badge: 'bg-indigo-subtle text-indigo border border-indigo-subtle'
    },
    'Laboratorium': {
        stroke: '#0d9488',
        fill: '#ccfbf1',
        fillActive: '#2dd4bf',
        badge: 'bg-teal-subtle text-teal border border-teal-subtle'
    },
    'Ruang Administrasi': {
        stroke: '#d97706',
        fill: '#fef3c7',
        fillActive: '#fbbf24',
        badge: 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
    },
    'Fasilitas Umum': {
        stroke: '#059669',
        fill: '#d1fae5',
        fillActive: '#34d399',
        badge: 'bg-success-subtle text-success border border-success-subtle'
    },
    'Toilet': {
        stroke: '#e11d48',
        fill: '#ffe4e6',
        fillActive: '#fb7185',
        badge: 'bg-danger-subtle text-danger border border-danger-subtle'
    },
    'Tangga/Lift': {
        stroke: '#64748b',
        fill: '#e2e8f0',
        fillActive: '#94a3b8',
        badge: 'bg-secondary-subtle text-secondary border border-secondary-subtle'
    }
};

// Data struktur gedung -> lantai -> ruangan
const DENAH_SPASIAL_DATA = {
    // ==========================================
    // GEDUNG 1: Gedung Deramista (Gedung A)
    // ==========================================
    1: {
        nama_gedung: "Gedung Deramista (Gedung A)",
        alias: "Rektorat & Perkantoran Utama",
        lantai: {
            1: {
                nomor_lantai: 1,
                nama_lantai: "Lantai 1",
                deskripsi: "Lobby Utama, Pelayanan BAAK & BAK, Ruang Kelas Eksekutif, Toilet & Tangga/Lift",
                lebar_canvas: 800,
                tinggi_canvas: 480,
                ruangan: [
                    {
                        id: 1,
                        kode: "A1.01",
                        nama: "Lobby Utama & Pusat Informasi",
                        jenis: "Fasilitas Umum",
                        x: 50, y: 50, w: 200, h: 140,
                        kapasitas: 25,
                        fasilitas: "Meja Resepsionis, Sofa Tamu, TV Display Informasi Kampus, AC Sentral",
                        pic: "Kepala Keamanan & Front Desk",
                        jam: "07.00 - 17.30 WIB",
                        foto: "assets/img/rooms/ruang_rapat.svg",
                        deskripsi: "Lobby utama penyambutan tamu universitas, pusat informasi perizinan, dan ruang tunggu pimpinan kampus."
                    },
                    {
                        id: 2,
                        kode: "A1.02",
                        nama: "Biro Administrasi Akademik (BAAK)",
                        jenis: "Ruang Administrasi",
                        x: 270, y: 50, w: 220, h: 140,
                        kapasitas: 30,
                        fasilitas: "Komputer Kerja, Mesin Antrian, 4 Loket Pelayanan Mahasiswa, Printer Laser, AC",
                        pic: "Bpk. H. Achmad Fauzi, M.Kom (Ka. BAAK)",
                        jam: "08.00 - 16.00 WIB",
                        foto: "assets/img/rooms/ruang_dosen.svg",
                        deskripsi: "Pusat pelayanan akademik terpadu untuk pengurusan KRS, transkrip nilai mahasiswa, surat rekomendasi, dan persiapan wisuda."
                    },
                    {
                        id: 3,
                        kode: "A1.03",
                        nama: "Ruang Kelas Eksekutif A1.03",
                        jenis: "Ruang Kelas",
                        x: 510, y: 50, w: 240, h: 140,
                        kapasitas: 40,
                        fasilitas: "AC Split 2 Unit, Smart Projector, Papan Tulis Interaktif, Meja dan Kursi Ergonomis, Sound System",
                        pic: "Ibu Nurul Qomariyah, M.Pd",
                        jam: "07.30 - 17.00 WIB",
                        foto: "assets/img/rooms/kelas_standar.svg",
                        deskripsi: "Ruang kuliah modern dengan tata pencahayaan representatif untuk perkuliahan reguler dan kelas pimpinan."
                    },
                    {
                        id: 4,
                        kode: "A1.04",
                        nama: "Biro Administrasi Keuangan (BAK)",
                        jenis: "Ruang Administrasi",
                        x: 50, y: 270, w: 200, h: 150,
                        kapasitas: 20,
                        fasilitas: "Loket Pembayaran, Brankas Dokumen, 3 PC Staf, AC, Mesin Penghitung Uang",
                        pic: "Ibu Siti Rohmah, S.E., M.Ak (Ka. BAK)",
                        jam: "08.00 - 15.30 WIB",
                        foto: "assets/img/rooms/ruang_dosen.svg",
                        deskripsi: "Layanan pembayaran biaya studi, validasi slip perbankan, dan administrasi keuangan beasiswa universitas."
                    },
                    {
                        id: 5,
                        kode: "A1.05",
                        nama: "Toilet Pria & Wanita Lantai 1",
                        jenis: "Toilet",
                        x: 510, y: 270, w: 110, h: 150,
                        kapasitas: 8,
                        fasilitas: "Wastafel Otomatis, Kaca Besar, Pengering Tangan, Kloset Duduk, Exhaust Fan",
                        pic: "Unit Sarpras Gedung Deramista",
                        jam: "24 Jam",
                        foto: "assets/img/rooms/ruang_dosen.svg",
                        deskripsi: "Fasilitas sanitasi toilet higienis terpisah untuk pria dan wanita dengan fasilitas ramah disabilitas."
                    },
                    {
                        id: 6,
                        kode: "A1.06",
                        nama: "Tangga Darurat & Lift Sentral",
                        jenis: "Tangga/Lift",
                        x: 640, y: 270, w: 110, h: 150,
                        kapasitas: 12,
                        fasilitas: "Lift Otomatis Kapasitas 10 Orang, Tangga Beton Lebar, Petunjuk Jalur Evakuasi, Alat APAR",
                        pic: "Teknisi Pemeliharaan Lift UNIBA",
                        jam: "24 Jam",
                        foto: "assets/img/rooms/ruang_dosen.svg",
                        deskripsi: "Akses sirkulasi vertikal penghubung Lantai 1 hingga Lantai 4 Gedung Deramista."
                    }
                ]
            },
            2: {
                nomor_lantai: 2,
                nama_lantai: "Lantai 2",
                deskripsi: "Ruang Rektor, Ruang Wakil Rektor I & II, Ruang Tamu VIP & Ruang Rapat Pimpinan",
                lebar_canvas: 800,
                tinggi_canvas: 480,
                ruangan: [
                    {
                        id: 7,
                        kode: "A2.01",
                        nama: "Ruang Rektor UNIBA Madura",
                        jenis: "Ruang Administrasi",
                        x: 50, y: 50, w: 260, h: 160,
                        kapasitas: 15,
                        fasilitas: "Meja Kerja Jati Rektor, Sofa Tamu VIP, Smart TV 65 Inch, AC Inverter, Kamar Mandi Dalam",
                        pic: "Prof. Dr. Ir. H. M. Bahaudin (Rektor UNIBA)",
                        jam: "08.00 - 16.00 WIB",
                        foto: "assets/img/rooms/ruang_rapat.svg",
                        deskripsi: "Kantor pimpinan tertinggi universitas dalam menyelenggarakan kegiatan akademik dan kebijakan strategis."
                    },
                    {
                        id: 8,
                        kode: "A2.02",
                        nama: "Ruang Wakil Rektor I & II",
                        jenis: "Ruang Administrasi",
                        x: 330, y: 50, w: 230, h: 160,
                        kapasitas: 15,
                        fasilitas: "2 Meja Kerja Warek, Meja Pertemuan Mini, Lemari Arsip, AC 2 Unit",
                        pic: "Dr. Achmad Qodri, M.T (Warek I)",
                        jam: "08.00 - 16.00 WIB",
                        foto: "assets/img/rooms/ruang_dosen.svg",
                        deskripsi: "Ruang kantor Wakil Rektor Bidang Akademik serta Bidang Non-Akademik & Kerjasama."
                    },
                    {
                        id: 9,
                        kode: "A2.03",
                        nama: "Ruang Rapat Pimpinan Terbatas",
                        jenis: "Ruang Kelas",
                        x: 50, y: 270, w: 320, h: 150,
                        kapasitas: 25,
                        fasilitas: "Meja Rapat Konferensi Kayu, 25 Kursi Putar, Proyektor Smart UHD, Mic Delegate Wireless, AC",
                        pic: "Sekretariat Rektorat UNIBA",
                        jam: "08.00 - 17.00 WIB",
                        foto: "assets/img/rooms/ruang_rapat.svg",
                        deskripsi: "Ruang rapat koordinasi rektorat dengan para Dekan, Ketua Lembaga, dan tamu kehormatan instansi."
                    },
                    {
                        id: 10,
                        kode: "A2.04",
                        nama: "Toilet & Tangga/Lift Lantai 2",
                        jenis: "Tangga/Lift",
                        x: 640, y: 270, w: 110, h: 150,
                        kapasitas: 12,
                        fasilitas: "Lift Akses, Tangga Darurat, Toilet VIP Lantai 2",
                        pic: "Sarpras Kampus",
                        jam: "24 Jam",
                        foto: "assets/img/rooms/ruang_dosen.svg",
                        deskripsi: "Akses vertikal dan sarana sanitasi di Lantai 2."
                    }
                ]
            },
            3: {
                nomor_lantai: 3,
                nama_lantai: "Lantai 3",
                deskripsi: "Ruang Sidang Senat Universitas & Ruang Arsip Lembaga Penjaminan Mutu (LPM)",
                lebar_canvas: 800,
                tinggi_canvas: 480,
                ruangan: [
                    {
                        id: 11,
                        kode: "A3.01",
                        nama: "Ruang Sidang Senat Akademik",
                        jenis: "Fasilitas Umum",
                        x: 50, y: 50, w: 460, h: 180,
                        kapasitas: 60,
                        fasilitas: "Podium Rapat Senat, Kursi Eksklusif 60 Seat, Sound System Digital, AC Sentral 4 PK, Dual Screen Display",
                        pic: "Sekretaris Senat Akademik",
                        jam: "Sesuai Agenda Sidang",
                        foto: "assets/img/rooms/auditorium.svg",
                        deskripsi: "Tempat penyelenggaraan Sidang Terbuka dan Sidang Pleno Senat Akademik UNIBA Madura."
                    },
                    {
                        id: 12,
                        kode: "A3.02",
                        nama: "Lembaga Penjaminan Mutu (LPM)",
                        jenis: "Ruang Administrasi",
                        x: 530, y: 50, w: 220, h: 180,
                        kapasitas: 15,
                        fasilitas: "Ruang Auditor Mutu Internal, Komputer Dokumen Akreditasi, AC Split, Meja Diskusi",
                        pic: "Ketua LPM UNIBA Madura",
                        jam: "08.00 - 16.00 WIB",
                        foto: "assets/img/rooms/ruang_dosen.svg",
                        deskripsi: "Kantor pengawasan standar mutu pendidikan, akreditasi program studi, dan audit mutu internal."
                    }
                ]
            },
            4: {
                nomor_lantai: 4,
                nama_lantai: "Lantai 4",
                deskripsi: "Aula Pertemuan Eksekutif Deramista Hall & Ruang Podcast Kampus",
                lebar_canvas: 800,
                tinggi_canvas: 480,
                ruangan: [
                    {
                        id: 13,
                        kode: "A4.01",
                        nama: "Deramista Executive Hall",
                        jenis: "Fasilitas Umum",
                        x: 50, y: 50, w: 480, h: 360,
                        kapasitas: 150,
                        fasilitas: "Stage Hall Panggung, Sound System Karaoke & Pidato, Kursi Banquet 150 Unit, AC Sentral",
                        pic: "Pengelola Hall Gedung A",
                        jam: "08.00 - 21.00 WIB",
                        foto: "assets/img/rooms/auditorium.svg",
                        deskripsi: "Aula representatif untuk workshop dosen, pembekalan magang, kuliah umum eksekutif, dan gala dinner."
                    },
                    {
                        id: 14,
                        kode: "A4.02",
                        nama: "Studio Podcast & Media UNIBA TV",
                        jenis: "Laboratorium",
                        x: 550, y: 50, w: 200, h: 170,
                        kapasitas: 10,
                        fasilitas: "Ruang Kedap Suara, 4 Mic Shure Podcast, Kamera Video 4K, Lighting Softbox, Mixer Audio",
                        pic: "Koordinator Media Kreatif UNIBA",
                        jam: "08.30 - 17.00 WIB",
                        foto: "assets/img/rooms/lab_komputer.svg",
                        deskripsi: "Studio siaran podcast edukasi, wawancara tokoh inspiratif, dan pembuatan konten video profil kampus."
                    }
                ]
            }
        }
    },

    // ==========================================
    // GEDUNG 2: Gedung Campaka (Gedung B - FST)
    // ==========================================
    2: {
        nama_gedung: "Gedung Campaka (Gedung B)",
        alias: "Fakultas Sains dan Teknologi (FST)",
        lantai: {
            1: {
                nomor_lantai: 1,
                nama_lantai: "Lantai 1",
                deskripsi: "Ruang Dekanat FST, Tata Usaha FST & Ruang Perkuliahan C1.01-C1.04",
                lebar_canvas: 800,
                tinggi_canvas: 480,
                ruangan: [
                    {
                        id: 15,
                        kode: "B1.01",
                        nama: "Ruang Dekanat Fakultas Sains & Teknologi",
                        jenis: "Ruang Administrasi",
                        x: 50, y: 50, w: 210, h: 140,
                        kapasitas: 20,
                        fasilitas: "Ruang Kerja Dekan FST, Ruang Wadek, Meja Tamu, Display Karya Inovasi FST, AC 2 Unit",
                        pic: "Dekan FST UNIBA Madura",
                        jam: "08.00 - 16.00 WIB",
                        foto: "assets/img/rooms/ruang_rapat.svg",
                        deskripsi: "Kantor pimpinan Fakultas Sains dan Teknologi yang mengoordinasikan program studi teknik dan sains."
                    },
                    {
                        id: 16,
                        kode: "B1.02",
                        nama: "Ruang Kuliah FST B1.02",
                        jenis: "Ruang Kelas",
                        x: 280, y: 50, w: 220, h: 140,
                        kapasitas: 45,
                        fasilitas: "Proyektor Full HD, Whiteboard Magnetik, AC 2 Unit, Kursi Kuliah Busa Lipat, Wi-Fi 6",
                        pic: "Koordinator Sarpras FST",
                        jam: "07.30 - 17.00 WIB",
                        foto: "assets/img/rooms/kelas_standar.svg",
                        deskripsi: "Ruang kelas perkuliahan reguler untuk prodi Sistem Informasi dan Informatika."
                    },
                    {
                        id: 17,
                        kode: "B1.03",
                        nama: "Ruang Kuliah FST B1.03",
                        jenis: "Ruang Kelas",
                        x: 520, y: 50, w: 230, h: 140,
                        kapasitas: 45,
                        fasilitas: "Proyektor HD, AC 2 Unit, Papan Tulis, Audio Pengeras Suara, Meja Dosen",
                        pic: "Koordinator Sarpras FST",
                        jam: "07.30 - 17.00 WIB",
                        foto: "assets/img/rooms/kelas_standar.svg",
                        deskripsi: "Ruang perkuliahan interaktif dengan sirkulasi udara sejuk dan pencahayaan maksimal."
                    },
                    {
                        id: 18,
                        kode: "B1.04",
                        nama: "Bagian Tata Usaha & Pelayanan FST",
                        jenis: "Ruang Administrasi",
                        x: 50, y: 270, w: 210, h: 150,
                        kapasitas: 15,
                        fasilitas: "Loket Pelayanan Mahasiswa, Komputer Staf TU, Printer Cetak Ijazah, Ruang Tunggu",
                        pic: "Ka. TU FST UNIBA",
                        jam: "08.00 - 16.00 WIB",
                        foto: "assets/img/rooms/ruang_dosen.svg",
                        deskripsi: "Pelayanan administrasi skripsi, surat izin penelitian, pengajuan pembimbing, dan yudisium."
                    },
                    {
                        id: 19,
                        kode: "B1.05",
                        nama: "Toilet Mahasiswa & Dosen Lantai 1",
                        jenis: "Toilet",
                        x: 520, y: 270, w: 100, h: 150,
                        kapasitas: 8,
                        fasilitas: "Wastafel, Cermin, Kloset Duduk & Jongkok, Kran Wudhu",
                        pic: "Petugas Kebersihan Gedung B",
                        jam: "24 Jam",
                        foto: "assets/img/rooms/ruang_dosen.svg",
                        deskripsi: "Fasilitas toilet pria dan wanita di lantai 1 Gedung Campaka."
                    },
                    {
                        id: 20,
                        kode: "B1.06",
                        nama: "Tangga Utama & Akses Evakuasi",
                        jenis: "Tangga/Lift",
                        x: 640, y: 270, w: 110, h: 150,
                        kapasitas: 15,
                        fasilitas: "Tangga Beton Lebar dengan Handrail Stainless, Petunjuk Lantai",
                        pic: "Sarpras FST",
                        jam: "24 Jam",
                        foto: "assets/img/rooms/ruang_dosen.svg",
                        deskripsi: "Tangga sirkulasi utama penghubung antar lantai Gedung Campaka."
                    }
                ]
            },
            2: {
                nomor_lantai: 2,
                nama_lantai: "Lantai 2",
                deskripsi: "Laboratorium Komputer 1 (Software & GIS), Lab Jaringan & Keamanan Siber, Kelas B2.03",
                lebar_canvas: 800,
                tinggi_canvas: 480,
                ruangan: [
                    {
                        id: 21,
                        kode: "B2.01",
                        nama: "Laboratorium Komputer 1 (Software & GIS)",
                        jenis: "Laboratorium",
                        x: 50, y: 50, w: 260, h: 160,
                        kapasitas: 40,
                        fasilitas: "40 PC Intel Core i7 RAM 16GB, Server Lokal GIS, Software QGIS & ArcGIS, Smart TV 75 Inch, AC 3 Unit",
                        pic: "Bpk. M. Wildan S.Kom., M.Cs (Ka. Lab Komputer)",
                        jam: "08.00 - 17.00 WIB",
                        foto: "assets/img/rooms/lab_komputer.svg",
                        deskripsi: "Laboratorium unggulan untuk praktikum Pemrograman Web, Sistem Informasi Geografis (SIG), Basis Data, dan Rekayasa Perangkat Lunak."
                    },
                    {
                        id: 22,
                        kode: "B2.02",
                        nama: "Laboratorium Jaringan & Keamanan Siber",
                        jenis: "Laboratorium",
                        x: 330, y: 50, w: 240, h: 160,
                        kapasitas: 35,
                        fasilitas: "35 PC Praktikum Jaringan, Rack Server Cisco, Mikrotik RouterBoard, Toolset Crimping & Tester LAN, AC 2 Unit",
                        pic: "Bpk. Fajar Ramadhan, M.Kom",
                        jam: "08.00 - 17.00 WIB",
                        foto: "assets/img/rooms/lab_komputer.svg",
                        deskripsi: "Laboratorium simulasi perancangan topologi jaringan kampus, konfigurasi server Linux, routing switching, dan cyber security."
                    },
                    {
                        id: 23,
                        kode: "B2.03",
                        nama: "Ruang Perkuliahan B2.03",
                        jenis: "Ruang Kelas",
                        x: 50, y: 270, w: 280, h: 150,
                        kapasitas: 40,
                        fasilitas: "Proyektor Epson HD, AC Split 2 Unit, Papan Tulis Magnetik, Kursi Kuliah Busa, Sound Mini",
                        pic: "Koordinator Kelas FST",
                        jam: "07.30 - 17.00 WIB",
                        foto: "assets/img/rooms/kelas_standar.svg",
                        deskripsi: "Ruang kuliah teori pemrograman berorientasi objek, kecerdasan buatan, dan arsitektur komputer."
                    },
                    {
                        id: 24,
                        kode: "B2.04",
                        nama: "Toilet & Tangga Lantai 2",
                        jenis: "Tangga/Lift",
                        x: 640, y: 270, w: 110, h: 150,
                        kapasitas: 12,
                        fasilitas: "Tangga Utama, Toilet Lantai 2",
                        pic: "Sarpras FST",
                        jam: "24 Jam",
                        foto: "assets/img/rooms/ruang_dosen.svg",
                        deskripsi: "Akses tangga dan fasilitas sanitasi di Lantai 2 Gedung Campaka."
                    }
                ]
            },
            3: {
                nomor_lantai: 3,
                nama_lantai: "Lantai 3",
                deskripsi: "Laboratorium Komputer 2 (AI & Multimedia), Ruang Dosen FST, Ruang Konsultasi Mahasiswa",
                lebar_canvas: 800,
                tinggi_canvas: 480,
                ruangan: [
                    {
                        id: 25,
                        kode: "B3.01",
                        nama: "Ruang Dosen Sistem Informasi & Informatika",
                        jenis: "Ruang Dosen",
                        x: 50, y: 50, w: 320, h: 170,
                        kapasitas: 30,
                        fasilitas: "30 Meja Kubikel Dosen, Lemari Dokumen Kurikulum, Meja Bimbingan Skripsi, AC 3 Unit, Dispenser Air Minum",
                        pic: "Sekretaris Prodi Sistem Informasi",
                        jam: "07.30 - 16.30 WIB",
                        foto: "assets/img/rooms/ruang_dosen.svg",
                        deskripsi: "Ruang kerja dosen tetap FST untuk kegiatan tridharma perguruan tinggi, bimbingan tugas akhir, dan riset keilmuan."
                    },
                    {
                        id: 26,
                        kode: "B3.02",
                        nama: "Laboratorium Multimedia & Riset AI",
                        jenis: "Laboratorium",
                        x: 390, y: 50, w: 260, h: 170,
                        kapasitas: 30,
                        fasilitas: "30 PC GPU Nvidia RTX, Wacom Pen Tablet, Ruang Pengisi Suara Mini, Smart TV, AC 2 Unit",
                        pic: "Ketua Lab AI & Multimedia FST",
                        jam: "08.00 - 17.00 WIB",
                        foto: "assets/img/rooms/lab_komputer.svg",
                        deskripsi: "Laboratorium riset Artificial Intelligence, Deep Learning, UI/UX Design, dan pengembangan gim interaktif."
                    }
                ]
            },
            4: {
                nomor_lantai: 4,
                nama_lantai: "Lantai 4",
                deskripsi: "Studio Desain Sistem, Lab IoT & Robotika, Ruang Diskusi Mahasiswa FST",
                lebar_canvas: 800,
                tinggi_canvas: 480,
                ruangan: [
                    {
                        id: 27,
                        kode: "B4.01",
                        nama: "Laboratorium Internet of Things (IoT) & Robotika",
                        jenis: "Laboratorium",
                        x: 50, y: 50, w: 300, h: 170,
                        kapasitas: 30,
                        fasilitas: "Kit Arduino & ESP32, Solder Station, 3D Printer Creality, Osiloskop Digital, Komputer Pemrograman IoT",
                        pic: "Koordinator Lab Robotika FST",
                        jam: "08.00 - 17.00 WIB",
                        foto: "assets/img/rooms/lab_komputer.svg",
                        deskripsi: "Pusat perancangan purwarupa perangkat keras cerdas, sensor pertanian presisi Madura, dan otomasi industri."
                    },
                    {
                        id: 28,
                        kode: "B4.02",
                        nama: "Studio Inovasi Desain Sistem & Startup Mahasiswa",
                        jenis: "Fasilitas Umum",
                        x: 370, y: 50, w: 280, h: 170,
                        kapasitas: 35,
                        fasilitas: "Whiteboard Dinding, Meja Kolaborasi Bulat, Akses Wi-Fi Gigabit, Coffee Corner, AC 2 Unit",
                        pic: "Pusat Inkubasi Bisnis Digital UNIBA",
                        jam: "08.00 - 18.00 WIB",
                        foto: "assets/img/rooms/perpustakaan.svg",
                        deskripsi: "Ruang kolaborasi mahasiswa dalam mengembangkan prototipe perangkat lunak dan startup digital binaan kampus."
                    }
                ]
            }
        }
    },

    // ==========================================
    // GEDUNG 3: Gedung Kapanjin (Gedung C - FEB)
    // ==========================================
    3: {
        nama_gedung: "Gedung Kapanjin (Gedung C)",
        alias: "Fakultas Ekonomi dan Bisnis (FEB)",
        lantai: {
            1: {
                nomor_lantai: 1,
                nama_lantai: "Lantai 1",
                deskripsi: "Galeri Investasi BEI, Tata Usaha FEB & Ruang Perkuliahan K1.01-K1.03",
                lebar_canvas: 800,
                tinggi_canvas: 480,
                ruangan: [
                    {
                        id: 29,
                        kode: "C1.01",
                        nama: "Galeri Investasi Bursa Efek Indonesia (BEI)",
                        jenis: "Laboratorium",
                        x: 50, y: 50, w: 260, h: 150,
                        kapasitas: 30,
                        fasilitas: "Ticker Saham Digital Berjalan, 20 PC Trading, Monitor Bloomberg Market, AC Split 2 Unit",
                        pic: "Direktur Galeri Investasi BEI UNIBA",
                        jam: "08.30 - 16.00 WIB",
                        foto: "assets/img/rooms/lab_komputer.svg",
                        deskripsi: "Fasilitas edukasi pasar modal, simulasi transaksi saham real-time, dan riset portofolio keuangan mahasiswa."
                    },
                    {
                        id: 30,
                        kode: "C1.02",
                        nama: "Ruang Kuliah Manajemen C1.02",
                        jenis: "Ruang Kelas",
                        x: 330, y: 50, w: 220, h: 150,
                        kapasitas: 45,
                        fasilitas: "Proyektor Full HD, AC 2 Unit, Papan Tulis Kaca, Kursi Kuliah Nyaman",
                        pic: "Sarpras FEB",
                        jam: "07.30 - 17.00 WIB",
                        foto: "assets/img/rooms/kelas_standar.svg",
                        deskripsi: "Ruang perkuliahan teori Manajemen Bisnis, Manajemen Pemasaran, dan Kewirausahaan."
                    },
                    {
                        id: 31,
                        kode: "C1.03",
                        nama: "Tata Usaha & Pelayanan FEB",
                        jenis: "Ruang Administrasi",
                        x: 50, y: 260, w: 220, h: 150,
                        kapasitas: 15,
                        fasilitas: "Loket Layanan FEB, Komputer Staf, Lemari Arsip Mahasiswa, AC Split",
                        pic: "Ka. TU FEB UNIBA",
                        jam: "08.00 - 16.00 WIB",
                        foto: "assets/img/rooms/ruang_dosen.svg",
                        deskripsi: "Pusat pelayanan akademik bagi mahasiswa program studi Manajemen dan Akuntansi."
                    }
                ]
            },
            2: {
                nomor_lantai: 2,
                nama_lantai: "Lantai 2",
                deskripsi: "Laboratorium Akuntansi & Mini Bank Syariah, Ruang Kuliah K2.01",
                lebar_canvas: 800,
                tinggi_canvas: 480,
                ruangan: [
                    {
                        id: 32,
                        kode: "C2.01",
                        nama: "Laboratorium Akuntansi & Mini Bank Syariah",
                        jenis: "Laboratorium",
                        x: 50, y: 50, w: 320, h: 160,
                        kapasitas: 35,
                        fasilitas: "35 PC Software Accurate & MYOB, Counter Teller Simulasi Bank, Mesin Kasir, AC 3 Unit",
                        pic: "Kepala Lab Akuntansi FEB",
                        jam: "08.00 - 16.00 WIB",
                        foto: "assets/img/rooms/lab_komputer.svg",
                        deskripsi: "Tempat praktikum pembukuan akuntansi, audit keuangan, dan operasional perbankan syariah."
                    },
                    {
                        id: 33,
                        kode: "C2.02",
                        nama: "Ruang Kuliah Akuntansi C2.02",
                        jenis: "Ruang Kelas",
                        x: 390, y: 50, w: 250, h: 160,
                        kapasitas: 40,
                        fasilitas: "Proyektor, AC 2 Unit, Papan Tulis, Meja Dosen, Sound System",
                        pic: "Sarpras FEB",
                        jam: "07.30 - 17.00 WIB",
                        foto: "assets/img/rooms/kelas_standar.svg",
                        deskripsi: "Ruang kelas perkuliahan Akuntansi Keuangan Menengah, Perpajakan, dan Sistem Informasi Akuntansi."
                    }
                ]
            }
        }
    },

    // ==========================================
    // GEDUNG 4: Gedung Tuan Gubhe (Gedung D)
    // ==========================================
    4: {
        nama_gedung: "Gedung Tuan Gubhe (Gedung D)",
        alias: "Perkuliahan Bersama & Perpustakaan Digital",
        lantai: {
            1: {
                nomor_lantai: 1,
                nama_lantai: "Lantai 1",
                deskripsi: "Perpustakaan Pusat UNIBA Madura, E-Library OPAC & Ruang Coworking",
                lebar_canvas: 800,
                tinggi_canvas: 480,
                ruangan: [
                    {
                        id: 34,
                        kode: "D1.01",
                        nama: "Perpustakaan Pusat & Digital Library",
                        jenis: "Fasilitas Umum",
                        x: 50, y: 50, w: 380, h: 180,
                        kapasitas: 80,
                        fasilitas: "Rak Buku 10.000 Judul, 25 Komputer OPAC, Meja Baca Mandiri, Barcode Scanner, AC Sentral",
                        pic: "Ibu Dra. Hj. Maryam, M.IP (Ka. Perpustakaan)",
                        jam: "08.00 - 17.00 WIB",
                        foto: "assets/img/rooms/perpustakaan.svg",
                        deskripsi: "Pusat repositori skripsi, jurnal terindeks, buku teks akademik, dan ruang literasi nyaman mahasiswa."
                    },
                    {
                        id: 35,
                        kode: "D1.02",
                        nama: "Coworking Space & Student Lounge",
                        jenis: "Fasilitas Umum",
                        x: 450, y: 50, w: 260, h: 180,
                        kapasitas: 50,
                        fasilitas: "Colokan Listrik Tiap Meja, High Speed Wi-Fi 500Mbps, Bean Bags, Meja Kolaborasi Bundar, AC",
                        pic: "Pengelola Gedung Tuan Gubhe",
                        jam: "08.00 - 20.00 WIB",
                        foto: "assets/img/rooms/perpustakaan.svg",
                        deskripsi: "Area kerja bersama mahasiswa untuk menyelesaikan tugas proyek, diskusi santai, dan belajar kelompok."
                    }
                ]
            },
            3: {
                nomor_lantai: 3,
                nama_lantai: "Lantai 3",
                deskripsi: "Auditorium Utama Tuan Gubhe (Kapasitas 500 orang)",
                lebar_canvas: 800,
                tinggi_canvas: 480,
                ruangan: [
                    {
                        id: 36,
                        kode: "D3.01",
                        nama: "Auditorium Megah Tuan Gubhe",
                        jenis: "Fasilitas Umum",
                        x: 50, y: 50, w: 660, h: 260,
                        kapasitas: 500,
                        fasilitas: "Panggung Teater Megah, Tata Suara Line Array, Proyektor 10.000 Lumens, 500 Kursi VIP Beludru, AC Sentral",
                        pic: "Bpk. Rahmatullah, S.T (Koordinator Auditorium)",
                        jam: "Sesuai Jadwal Event Kampus",
                        foto: "assets/img/rooms/auditorium.svg",
                        deskripsi: "Auditorium representatif termegah di Sumenep untuk seminar internasional, kuliah tamu rektor, dan wisuda."
                    }
                ]
            }
        }
    },

    // ==========================================
    // GEDUNG 5: GOR Bahaudin Mudhary (Gedung E)
    // ==========================================
    5: {
        nama_gedung: "GOR Bahaudin Mudhary (Gedung E)",
        alias: "Gedung Olahraga & Serbaguna",
        lantai: {
            1: {
                nomor_lantai: 1,
                nama_lantai: "Lantai 1",
                deskripsi: "Arena Lapangan Indoor Utama, Ruang Medis, Ruang Ganti & Toilet",
                lebar_canvas: 800,
                tinggi_canvas: 480,
                ruangan: [
                    {
                        id: 37,
                        kode: "E1.01",
                        nama: "Arena Lapangan Indoor Serbaguna",
                        jenis: "Fasilitas Umum",
                        x: 50, y: 50, w: 480, h: 360,
                        kapasitas: 1200,
                        fasilitas: "3 Lapangan Badminton Vinyl BWF, Lapangan Futsal & Basket Interlock, Lampu Sorot LED Arena, Scoreboard Digital",
                        pic: "Biro Olahraga & Prestasi Mahasiswa",
                        jam: "06.00 - 22.00 WIB",
                        foto: "assets/img/buildings/gedung_gor.svg",
                        deskripsi: "Sarana olahraga indoor berstandar untuk kejuaraan mahasiswa, latihan UKM olahraga, dan acara besar universitas."
                    },
                    {
                        id: 38,
                        kode: "E1.02",
                        nama: "Ruang Medis & Pos P3K Kampus",
                        jenis: "Fasilitas Umum",
                        x: 550, y: 50, w: 180, h: 160,
                        kapasitas: 10,
                        fasilitas: "2 Bed Periksa Pasien, Tabung Oksigen, Kotak P3K Lengkap, Tandu Evakuasi, AC",
                        pic: "Tim Medis KSR PMI UNIBA",
                        jam: "07.30 - 17.00 WIB",
                        foto: "assets/img/rooms/ruang_dosen.svg",
                        deskripsi: "Pusat penanganan medis darurat saat pertandingan olahraga dan pelayanan kesehatan awal warga kampus."
                    }
                ]
            }
        }
    },

    // ==========================================
    // GEDUNG 6: Panggung Pajhur (Gedung F)
    // ==========================================
    6: {
        nama_gedung: "Panggung Pajhur (Gedung F)",
        alias: "Amphitheater Seni & Budaya Kampus",
        lantai: {
            1: {
                nomor_lantai: 1,
                nama_lantai: "Lantai 1",
                deskripsi: "Panggung Terbuka Utama, Plaza Penonton & Ruang Transit Kesenian",
                lebar_canvas: 800,
                tinggi_canvas: 480,
                ruangan: [
                    {
                        id: 39,
                        kode: "F1.01",
                        nama: "Panggung Terbuka Seni Budaya Pajhur",
                        jenis: "Fasilitas Umum",
                        x: 50, y: 50, w: 500, h: 240,
                        kapasitas: 300,
                        fasilitas: "Panggung Lengkung Batu Granit, Lighting Panggung Outdoor, Sound Monitor Panggung, Ruang Transit Artis",
                        pic: "Unit Kegiatan Mahasiswa Seni Budaya",
                        jam: "08.00 - 21.00 WIB",
                        foto: "assets/img/buildings/panggung_pajhur.svg",
                        deskripsi: "Panggung amphitheater outdoor tempat unjuk kreativitas pentas musik, tari tradisional Madura, teater, dan dialog mahasiswa."
                    }
                ]
            }
        }
    }
};
