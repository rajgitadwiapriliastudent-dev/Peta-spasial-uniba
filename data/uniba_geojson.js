/**
 * Data Spasial Kawasan Kampus UNIBA Madura
 * Menggunakan Gambar Peta Spasial Lokal Asli: assets/img/peta_spasial_uniba.jpeg
 * Dimensi Gambar: 731 x 1034 pixel
 * Sistem Koordinat: Leaflet CRS.Simple [lat = 1034 - y, lng = x]
 * Pengembang: R. Aj Gita Dwi Aprilia (NIM: 2302510011)
 */

const UNIBA_IMAGE_SRC = 'assets/img/peta_spasial_uniba.jpeg';
const UNIBA_IMAGE_WIDTH = 731;
const UNIBA_IMAGE_HEIGHT = 1034;

// Konversi koordinat pixel (x dari kiri, y dari atas) ke Leaflet CRS.Simple [lat, lng]
function unibaToLatLng(x, y) {
    return [UNIBA_IMAGE_HEIGHT - y, x];
}

// Konversi Leaflet CRS.Simple [lat, lng] ke koordinat pixel
function unibaToXY(latLng) {
    const lat = Array.isArray(latLng) ? latLng[0] : latLng.lat;
    const lng = Array.isArray(latLng) ? latLng[1] : latLng.lng;
    return {
        x: Math.round(lng),
        y: Math.round(UNIBA_IMAGE_HEIGHT - lat)
    };
}

// Batas Area Kampus UNIBA (Deliniasi Kawasan Sesuai Garis Merah Peta Asli)
const UNIBA_DELINIASI_PX = [
    [170, 920], [145, 855], [210, 725], [110, 620], [105, 455],
    [178, 330], [430, 200], [535, 245], [640, 245], [670, 325],
    [710, 360], [680, 480], [605, 600], [530, 650], [435, 715],
    [305, 690], [210, 750], [175, 920]
];

const UNIBA_DELINIASI_KAMPUS = {
    "type": "Feature",
    "properties": {
        "nama": "Kawasan Kampus Universitas Bahaudin Mudhary Madura",
        "desa": "Desa Batuan",
        "kecamatan": "Kecamatan Batuan",
        "kabupaten": "Kabupaten Sumenep",
        "luas_m2": 32500,
        "skala": "1:1.000",
        "stroke": "#047857",
        "strokeWidth": 3.5,
        "fill": "#10b981",
        "fillOpacity": 0.08
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            UNIBA_DELINIASI_PX.map(pt => [pt[0], UNIBA_IMAGE_HEIGHT - pt[1]])
        ]
    }
};

// Data Gedung & Poligon Spasial Kawasan Kampus UNIBA
const UNIBA_GEDUNG_LIST = [
    {
        id_gedung: 1,
        kode_gedung: "GD-A",
        nama_gedung: "Gedung Deramista (Gedung A)",
        alias: "Rektorat & Perkantoran Utama",
        kategori: "Rektorat & Perkantoran",
        jumlah_lantai: 4,
        jumlah_ruangan: 20,
        warna: "#059669",
        foto: "assets/img/buildings/gedung_deramista.svg",
        deskripsi: "Gedung utama pusat pimpinan universitas yang memuat kantor Rektor, Wakil Rektor, BAAK, BAK, Ruang Rapat Senat, serta ruang kerja pimpinan dan staf universitas.",
        fasilitas_utama: ["Ruang Rektor & Warek", "BAAK & BAK", "Ruang Sidang Senat", "Lobby Utama", "Lift Sentral & Tangga"],
        center_px: [205, 400],
        entrance_px: [245, 445],
        node_id: "akses_gedung_a",
        polygon_px: [
            [228, 308], [298, 380], [225, 450], [182, 495],
            [105, 455], [135, 418], [112, 396], [178, 332]
        ]
    },
    {
        id_gedung: 2,
        kode_gedung: "GD-B",
        nama_gedung: "Gedung Campaka (Gedung B)",
        alias: "Fakultas Sains dan Teknologi (FST)",
        kategori: "Fakultas & Laboratorium",
        jumlah_lantai: 4,
        jumlah_ruangan: 24,
        warna: "#0284c7",
        foto: "assets/img/buildings/gedung_campaka.svg",
        deskripsi: "Gedung Fakultas Sains dan Teknologi berlantai 4 dengan laboratorium komputasi terkini, lab jaringan, studio desain sistem, dan ruang kuliah modern prodi Sistem Informasi & Informatika.",
        fasilitas_utama: ["Lab Komputer GIS", "Lab Jaringan", "Dekanat FST", "Ruang Dosen SI & IF", "Smart Classroom"],
        center_px: [605, 460],
        entrance_px: [535, 470],
        node_id: "akses_gedung_b",
        polygon_px: [
            [560, 420], [618, 375], [682, 438], [694, 465],
            [642, 516], [604, 480], [565, 520], [516, 474]
        ]
    },
    {
        id_gedung: 3,
        kode_gedung: "GD-C",
        nama_gedung: "Gedung Kapanjin (Gedung C)",
        alias: "Fakultas Ekonomi dan Bisnis (FEB)",
        kategori: "Fakultas & Akademik",
        jumlah_lantai: 4,
        jumlah_ruangan: 20,
        warna: "#d97706",
        foto: "assets/img/buildings/gedung_kapanjin.svg",
        deskripsi: "Gedung Fakultas Ekonomi dan Bisnis 4 lantai yang memuat Galeri Investasi BEI, Mini Bank, ruang dosen FEB, dan ruang perkuliahan representatif prodi Manajemen dan Akuntansi.",
        fasilitas_utama: ["Galeri Investasi Bursa Efek", "Lab Akuntansi & Mini Bank", "Dekanat FEB", "Ruang Dosen FEB", "Ruang Sidang Skripsi"],
        center_px: [490, 290],
        entrance_px: [475, 355],
        node_id: "akses_gedung_c",
        polygon_px: [
            [476, 220], [532, 260], [482, 320], [546, 358],
            [520, 362], [455, 335], [432, 304], [480, 255]
        ]
    },
    {
        id_gedung: 4,
        kode_gedung: "GD-D",
        nama_gedung: "Gedung Tuan Gubhe (Gedung D)",
        alias: "Perkuliahan Bersama & Perpustakaan Digital",
        kategori: "Perkuliahan & Fasilitas",
        jumlah_lantai: 3,
        jumlah_ruangan: 16,
        warna: "#7c3aed",
        foto: "assets/img/buildings/gedung_tuangubhe.svg",
        deskripsi: "Gedung terintegrasi untuk perkuliahan bersama, pusat Perpustakaan Digital UNIBA Madura, ruang coworking mahasiswa, dan Auditorium megah berkapasitas 500 kursi.",
        fasilitas_utama: ["Perpustakaan Digital Pusat", "Auditorium Utama Tuan Gubhe", "Coworking Space", "E-Library OPAC", "Student Lounge"],
        center_px: [315, 446],
        entrance_px: [345, 485],
        node_id: "akses_gedung_d",
        polygon_px: [
            [298, 380], [376, 434], [346, 464], [396, 484],
            [372, 506], [300, 506], [236, 442]
        ]
    },
    {
        id_gedung: 5,
        kode_gedung: "GD-E",
        nama_gedung: "GOR Bahaudin Mudhary (Gedung E)",
        alias: "Gedung Olahraga & Serbaguna",
        kategori: "Olahraga & Event",
        jumlah_lantai: 2,
        jumlah_ruangan: 8,
        warna: "#dc2626",
        foto: "assets/img/buildings/gedung_gor.svg",
        deskripsi: "Gelanggang olahraga indoor terstandar internasional dengan 3 lapangan bulutangkis, lapangan futsal/basket, tribun kapasitas 1.200 penonton, dan pusat kebugaran kampus.",
        fasilitas_utama: ["Lapangan Badminton BWF", "Lapangan Futsal & Basket", "Tribun 1.200 Penonton", "Ruang Kebugaran/Fitness", "Ruang Ganti & Toilet"],
        center_px: [215, 605],
        entrance_px: [260, 620],
        node_id: "akses_gedung_e",
        polygon_px: [
            [155, 535], [225, 535], [225, 550], [290, 550],
            [305, 570], [280, 600], [295, 620], [270, 645],
            [245, 630], [225, 675], [140, 675], [115, 620]
        ]
    },
    {
        id_gedung: 6,
        kode_gedung: "GD-F",
        nama_gedung: "Panggung Pajhur (Gedung F)",
        alias: "Amphitheater Seni & Budaya Kampus",
        kategori: "Seni & Kreativitas",
        jumlah_lantai: 1,
        jumlah_ruangan: 4,
        warna: "#0d9488",
        foto: "assets/img/buildings/panggung_pajhur.svg",
        deskripsi: "Panggung pertunjukan seni terbuka berdesain amphitheater setengah lingkaran untuk pentas kreasi UKM mahasiswa, musik tradisional Madura, teater, dan orasi literasi.",
        fasilitas_utama: ["Panggung Granit Melengkung", "Tata Lampu Panggung Outdoor", "Plaza Penonton Terbuka", "Ruang Sound & Operator"],
        center_px: [445, 615],
        entrance_px: [430, 590],
        node_id: "akses_gedung_f",
        polygon_px: [
            [400, 615], [415, 580], [445, 575], [480, 585],
            [495, 615], [485, 645], [450, 650], [415, 640]
        ]
    }
];

// FeatureCollection GeoJSON untuk Gedung Kampus
const UNIBA_GEDUNG_GEOJSON = {
    "type": "FeatureCollection",
    "features": UNIBA_GEDUNG_LIST.map(g => ({
        "type": "Feature",
        "properties": {
            "id_gedung": g.id_gedung,
            "kode_gedung": g.kode_gedung,
            "nama_gedung": g.nama_gedung,
            "alias": g.alias,
            "kategori": g.kategori,
            "jumlah_lantai": g.jumlah_lantai,
            "jumlah_ruangan": g.jumlah_ruangan,
            "warna": g.warna,
            "foto": g.foto,
            "deskripsi": g.deskripsi,
            "fasilitas_utama": g.fasilitas_utama,
            "node_id": g.node_id,
            "center_latlng": unibaToLatLng(g.center_px[0], g.center_px[1]),
            "entrance_latlng": unibaToLatLng(g.entrance_px[0], g.entrance_px[1])
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                g.polygon_px.map(pt => [pt[0], UNIBA_IMAGE_HEIGHT - pt[1]])
            ]
        }
    }))
};

// Titik Penting / Point of Interest (POI) Kampus UNIBA Madura
const UNIBA_POIS = [
    {
        id: "poi-gerbang",
        node_id: "gerbang_utama",
        nama: "Gerbang Utama Kampus",
        kategori: "Akses Utama",
        x: 168,
        y: 910,
        deskripsi: "Pintu masuk utama kampus UNIBA Madura dari arah Jl. Raya Lenteng No. 10 Batuan, Sumenep.",
        ikon: "bi-signpost-fill",
        warna: "#047857"
    },
    {
        id: "poi-pos",
        node_id: "pos_keamanan",
        nama: "Pos Keamanan & Portal Depan",
        kategori: "Keamanan",
        x: 200,
        y: 810,
        deskripsi: "Pos keamanan penjagaan 24 jam dan pemeriksaan kendaraan masuk kampus.",
        ikon: "bi-shield-check",
        warna: "#047857"
    },
    {
        id: "poi-bundaran",
        node_id: "bundaran_monumen",
        nama: "Bundaran Monumen & Plaza Tengah",
        kategori: "Landmark",
        x: 425,
        y: 505,
        deskripsi: "Bundaran monumen pendiri K.H. Bahaudin Mudhary dan plaza pedestrian tengah kampus.",
        ikon: "bi-award-fill",
        warna: "#d97706"
    },
    {
        id: "poi-plaza",
        node_id: "plaza_tengah",
        nama: "Plaza & Taman Pedestrian Kampus",
        kategori: "Area Terbuka",
        x: 460,
        y: 430,
        deskripsi: "Area terbuka pedestrian hijau penghubung Gedung Deramista, Campaka, Kapanjin, dan Tuan Gubhe.",
        ikon: "bi-tree-fill",
        warna: "#059669"
    },
    {
        id: "poi-musholla",
        node_id: "musholla",
        nama: "Musholla Al-Qosos Kampus",
        kategori: "Ibadah",
        x: 620,
        y: 345,
        deskripsi: "Sarana ibadah sholat berjamaah civitas akademika yang bersih, nyaman, dan ber-AC.",
        ikon: "bi-moon-stars-fill",
        warna: "#059669"
    },
    {
        id: "poi-kantin",
        node_id: "kantin",
        nama: "Kantin & Pujasera Mahasiswa",
        kategori: "Kuliner",
        x: 655,
        y: 285,
        deskripsi: "Pusat kuliner kampus yang higienis dengan aneka hidangan khas Madura dan minuman segar.",
        ikon: "bi-cup-hot-fill",
        warna: "#ea580c"
    },
    {
        id: "poi-parkir-dosen",
        node_id: "parkir_dosen",
        nama: "Area Parkir Dosen & Karyawan",
        kategori: "Parkir",
        x: 590,
        y: 585,
        deskripsi: "Area parkir khusus dosen dan staf dekat Gedung Campaka (FST).",
        ikon: "bi-p-circle-fill",
        warna: "#64748b"
    },
    {
        id: "poi-parkir-gor",
        node_id: "parkir_gor",
        nama: "Area Parkir Lapangan GOR",
        kategori: "Parkir",
        x: 160,
        y: 665,
        deskripsi: "Area parkir luas untuk pengunjung GOR Bahaudin Mudhary dan mahasiswa.",
        ikon: "bi-p-circle-fill",
        warna: "#64748b"
    },
    {
        id: "poi-parkir-bangka",
        node_id: "parkir_lorong_bangka",
        nama: "Parkiran Lorong Bangka",
        kategori: "Parkir",
        x: 330,
        y: 700,
        deskripsi: "Area parkir terpadu sisi timur akses masuk kampus.",
        ikon: "bi-p-circle-fill",
        warna: "#64748b"
    },
    {
        id: "poi-lab-industri",
        node_id: "lab_industri",
        nama: "Laboratorium Teknik Industri",
        kategori: "Laboratorium",
        x: 685,
        y: 375,
        deskripsi: "Laboratorium proses manufaktur dan ergonomi prodi Teknik Industri FST.",
        ikon: "bi-gear-wide-connected",
        warna: "#0284c7"
    },
    {
        id: "poi-pkm",
        node_id: "pkm_koperasi",
        nama: "PKM & Koperasi Mahasiswa",
        kategori: "Fasilitas Umum",
        x: 605,
        y: 205,
        deskripsi: "Pusat kegiatan organisasi kemahasiswaan dan gerai koperasi kampus.",
        ikon: "bi-shop",
        warna: "#7c3aed"
    }
];

// Helper mendapatkan latlng untuk POI
UNIBA_POIS.forEach(p => {
    p.lat = UNIBA_IMAGE_HEIGHT - p.y;
    p.lon = p.x;
});
