/**
 * Master Data Store & Dual-Mode Controller (MySQL API + Local Fallback)
 * Sistem Informasi Spasial UNIBA Madura
 */

const DataStore = {
    isServerApiAvailable: null, // true | false | null (untested)

    // Deteksi apakah backend PHP & MySQL aktif
    async checkBackend() {
        if (this.isServerApiAvailable !== null) return this.isServerApiAvailable;
        try {
            const res = await fetch('api/get_gedung.php', { method: 'GET', cache: 'no-store' });
            if (res.ok) {
                const json = await res.json();
                if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
                    this.isServerApiAvailable = true;
                    console.log('✅ Terhubung ke Backend PHP & MySQL Database uniba_spasial');
                    return true;
                }
            }
        } catch (e) {
            // Offline / static file mode
        }
        this.isServerApiAvailable = false;
        console.log('ℹ️ Menggunakan Data Spasial Internal & LocalStorage (Mode Demo / Client)');
        this.initLocalData();
        return false;
    },

    // Inisialisasi data lokal jika belum ada di localStorage
    initLocalData() {
        const CURRENT_DATA_VERSION = 'v2_full_39rooms';
        if (localStorage.getItem('uniba_data_version') !== CURRENT_DATA_VERSION) {
            localStorage.removeItem('uniba_nodes');
            localStorage.removeItem('uniba_edges');
            localStorage.removeItem('uniba_ruangan');
            localStorage.setItem('uniba_data_version', CURRENT_DATA_VERSION);
        }

        if (!localStorage.getItem('uniba_gedung')) {
            const gedungs = UNIBA_GEDUNG_LIST.map(g => ({
                id_gedung: g.id_gedung,
                kode_gedung: g.kode_gedung,
                nama_gedung: g.nama_gedung,
                alias: g.alias,
                kategori: g.kategori,
                jumlah_lantai: g.jumlah_lantai,
                total_ruangan: g.jumlah_ruangan,
                foto: g.foto,
                deskripsi: g.deskripsi,
                warna_peta: g.warna,
                latitude: unibaToLatLng(g.center_px[0], g.center_px[1])[0],
                longitude: unibaToLatLng(g.center_px[0], g.center_px[1])[1],
                fasilitas_utama: g.fasilitas_utama
            }));
            localStorage.setItem('uniba_gedung', JSON.stringify(gedungs));
        }

        if (!localStorage.getItem('uniba_ruangan')) {
            const allRooms = [];
            for (const gId in DENAH_SPASIAL_DATA) {
                const b = DENAH_SPASIAL_DATA[gId];
                for (const fId in b.lantai) {
                    const fl = b.lantai[fId];
                    fl.ruangan.forEach(r => {
                        allRooms.push({
                            id_ruangan: r.id,
                            id_gedung: parseInt(gId),
                            id_lantai: parseInt(fId),
                            kode_ruangan: r.kode,
                            nama_ruangan: r.nama,
                            jenis_ruangan: r.jenis,
                            kapasitas: r.kapasitas,
                            fasilitas: r.fasilitas,
                            penanggung_jawab: r.pic,
                            jam_operasional: r.jam,
                            deskripsi: r.deskripsi,
                            foto: r.foto,
                            denah_x: r.x,
                            denah_y: r.y,
                            denah_w: r.w,
                            denah_h: r.h,
                            nama_gedung: b.nama_gedung,
                            nama_lantai: fl.nama_lantai,
                            nomor_lantai: fl.nomor_lantai
                        });
                    });
                }
            }
            localStorage.setItem('uniba_ruangan', JSON.stringify(allRooms));
        }

        if (!localStorage.getItem('uniba_fasilitas')) {
            const fasilitasList = [
                {
                    id_fasilitas: 1,
                    id_gedung: 2,
                    id_ruangan: 21,
                    nama_fasilitas: "Laboratorium Komputer & SIG",
                    kategori: "Laboratorium",
                    lokasi: "Gedung Campaka (FST) - Lantai 2",
                    deskripsi: "Laboratorium komputer spesifikasi tinggi dengan lisensi software pemetaan GIS dan IDE pengembangan sistem.",
                    ikon: "bi-laptop",
                    foto: "assets/img/rooms/lab_komputer.svg",
                    nama_gedung: "Gedung Campaka (Gedung B)"
                },
                {
                    id_fasilitas: 2,
                    id_gedung: 4,
                    id_ruangan: 34,
                    nama_fasilitas: "Perpustakaan Pusat & Digital Library",
                    kategori: "Perpustakaan",
                    lokasi: "Gedung Tuan Gubhe - Lantai 1",
                    deskripsi: "Pusat sumber belajar dengan koleksi ribuan pustaka cetak, jurnal elektronik, dan ruang baca berpendingin udara.",
                    ikon: "bi-book-half",
                    foto: "assets/img/rooms/perpustakaan.svg",
                    nama_gedung: "Gedung Tuan Gubhe (Gedung D)"
                },
                {
                    id_fasilitas: 3,
                    id_gedung: 4,
                    id_ruangan: 36,
                    nama_fasilitas: "Auditorium Megah Tuan Gubhe",
                    kategori: "Auditorium",
                    lokasi: "Gedung Tuan Gubhe - Lantai 3",
                    deskripsi: "Auditorium representatif dengan kapasitas 500 orang untuk seminar nasional, kuliah perdana, dan wisuda.",
                    ikon: "bi-building",
                    foto: "assets/img/rooms/auditorium.svg",
                    nama_gedung: "Gedung Tuan Gubhe (Gedung D)"
                },
                {
                    id_fasilitas: 4,
                    id_gedung: 5,
                    id_ruangan: 37,
                    nama_fasilitas: "GOR Bahaudin Mudhary Indoor",
                    kategori: "Olahraga",
                    lokasi: "Gedung Olahraga (GOR) UNIBA",
                    deskripsi: "Sarana olahraga bulutangkis, futsal, dan basket berlantai standar internasional dengan kapasitas tribun 1.200 penonton.",
                    ikon: "bi-trophy",
                    foto: "assets/img/buildings/gedung_gor.svg",
                    nama_gedung: "GOR Bahaudin Mudhary (Gedung E)"
                },
                {
                    id_fasilitas: 5,
                    id_gedung: 3,
                    id_ruangan: 29,
                    nama_fasilitas: "Galeri Investasi Bursa Efek (IDX)",
                    kategori: "Laboratorium",
                    lokasi: "Gedung Kapanjin (FEB) - Lantai 1",
                    deskripsi: "Sarana edukasi pasar modal dan investasi bagi civitas akademika bekerjasama dengan Bursa Efek Indonesia.",
                    ikon: "bi-graph-up-arrow",
                    foto: "assets/img/rooms/lab_komputer.svg",
                    nama_gedung: "Gedung Kapanjin (Gedung C)"
                },
                {
                    id_fasilitas: 6,
                    id_gedung: 6,
                    id_ruangan: 39,
                    nama_fasilitas: "Panggung Amphitheater Pajhur",
                    kategori: "Pusat Seni",
                    lokasi: "Sisi Selatan Plaza Utama Kampus",
                    deskripsi: "Panggung pertunjukan terbuka untuk kegiatan kreativitas seni mahasiswa, musik kampus, dan orasi literasi.",
                    ikon: "bi-music-note-beamed",
                    foto: "assets/img/buildings/panggung_pajhur.svg",
                    nama_gedung: "Panggung Pajhur (Gedung F)"
                },
                {
                    id_fasilitas: 7,
                    id_gedung: null,
                    id_ruangan: null,
                    nama_fasilitas: "Musholla Al-Qosos Kampus",
                    kategori: "Ibadah",
                    lokasi: "Sebelah Timur Gedung Kapanjin",
                    deskripsi: "Tempat ibadah sholat berjamaah untuk mahasiswa dan staf yang bersih, nyaman, dengan tempat wudhu memadai.",
                    ikon: "bi-moon-stars",
                    foto: "assets/img/rooms/musholla.svg",
                    nama_gedung: "Kawasan Kampus Timur"
                },
                {
                    id_fasilitas: 8,
                    id_gedung: null,
                    id_ruangan: null,
                    nama_fasilitas: "Kantin & Pujasera Mahasiswa",
                    kategori: "Kantin",
                    lokasi: "Sisi Utara Kawasan Kampus UNIBA",
                    deskripsi: "Pusat kuliner kampus yang higienis dan terjangkau dengan aneka makanan khas Madura dan minuman segar.",
                    ikon: "bi-cup-hot",
                    foto: "assets/img/rooms/kantin.svg",
                    nama_gedung: "Kawasan Kampus Utara"
                },
                {
                    id_fasilitas: 9,
                    id_gedung: null,
                    id_ruangan: null,
                    nama_fasilitas: "Area Parkir Terpadu Kampus",
                    kategori: "Parkir",
                    lokasi: "Parkiran Dosen, Parkiran GOR, dan Gerbang Utama",
                    deskripsi: "Area parkir luas yang aman dilengkapi pengawasan pos keamanan 24 jam dan kamera CCTV.",
                    ikon: "bi-p-circle",
                    foto: "assets/img/campus_hero.jpg",
                    nama_gedung: "Area Parkir UNIBA"
                }
            ];
            localStorage.setItem('uniba_fasilitas', JSON.stringify(fasilitasList));
        }

        if (!localStorage.getItem('uniba_berita')) {
            const beritas = [
                {
                    id_berita: 1,
                    judul: "Peluncuran Sistem Informasi Spasial Interaktif Pemetaan Ruangan UNIBA Madura",
                    kategori: "Berita Kampus",
                    tanggal: "2026-10-01",
                    ringkasan: "UNIBA Madura resmi memperkenalkan sistem pemetaan ruangan spasial interaktif berbasis web untuk memudahkan civitas akademika dan masyarakat.",
                    isi: "Universitas Bahaudin Mudhary Madura (UNIBA Madura) terus berinovasi dalam memajukan infrastruktur digital kampus. Melalui penelitian skripsi saudari R. Aj Gita Dwi Aprilia dari Prodi S1 Sistem Informasi Fakultas Sains dan Teknologi, kini hadir Sistem Informasi Spasial Interaktif berbasis web. Sistem ini memudahkan seluruh mahasiswa, dosen, tamu, dan civitas akademika dalam mencari lokasi gedung, denah lantai, dan informasi spesifik fasilitas ruangan dengan akurat.",
                    penulis: "Humas UNIBA Madura",
                    foto: "assets/img/campus_hero.jpg"
                },
                {
                    id_berita: 2,
                    judul: "Jadwal Pemeliharaan Berkala Laboratorium Komputer FST Gedung Campaka",
                    kategori: "Perubahan Ruangan",
                    tanggal: "2026-10-03",
                    ringkasan: "Laboratorium Komputer 1 Gedung B Lantai 2 akan menjalani upgrade software workstation pada akhir pekan ini.",
                    isi: "Diberitahukan kepada seluruh mahasiswa FST bahwa Laboratorium Komputer B2.01 Gedung Campaka akan dilakukan pemeliharaan berkala dan pemasangan modul software komputasi terbaru pada hari Sabtu. Seluruh perkuliahan praktikum sementara dialihkan ke Lab Komputer 2 Lantai 3.",
                    penulis: "Unit Laboratorium FST",
                    foto: "assets/img/rooms/lab_komputer.svg"
                },
                {
                    id_berita: 3,
                    judul: "Penambahan Fasilitas Smart Projector di Seluruh Ruang Kuliah Gedung A & B",
                    kategori: "Informasi Fasilitas",
                    tanggal: "2026-09-28",
                    ringkasan: "Meningkatkan kenyamanan belajar mengajar, UNIBA Madura memasang Smart Projector interaktif pada ruang kelas.",
                    isi: "Dalam rangka mendukung pembelajaran berbasis teknologi modern, Biro Sarana dan Prasarana telah menyelesaikan pemasangan perangkat Smart Projector interaktif dengan resolusi ultra high definition pada seluruh ruang kuliah di Gedung Deramista dan Gedung Campaka.",
                    penulis: "Biro Sarana & Prasarana",
                    foto: "assets/img/rooms/kelas_standar.svg"
                }
            ];
            localStorage.setItem('uniba_berita', JSON.stringify(beritas));
        }

        if (!localStorage.getItem('uniba_nodes') && typeof DijkstraRute !== 'undefined') {
            const nodeList = Object.values(DijkstraRute.nodes);
            localStorage.setItem('uniba_nodes', JSON.stringify(nodeList));
        }

        if (!localStorage.getItem('uniba_edges') && typeof DijkstraRute !== 'undefined') {
            const edgeList = DijkstraRute.edges.map((e, idx) => ({
                id_edge: idx + 1,
                node_awal: e.u,
                node_tujuan: e.v,
                jarak: e.weight,
                jenis_jalur: e.type || 'Jalur Pejalan Kaki'
            }));
            localStorage.setItem('uniba_edges', JSON.stringify(edgeList));
        }
    },

    // 1. Ambil Semua Gedung
    async getGedungs() {
        const hasServer = await this.checkBackend();
        if (hasServer) {
            try {
                const res = await fetch('api/get_gedung.php');
                const json = await res.json();
                if (json.status === 'success') return json.data;
            } catch (e) {
                console.warn('API error, fallback to local data');
            }
        }
        return JSON.parse(localStorage.getItem('uniba_gedung') || '[]');
    },

    // 2. Ambil Gedung berdasarkan ID
    async getGedungById(id) {
        id = parseInt(id);
        const hasServer = await this.checkBackend();
        if (hasServer) {
            try {
                const res = await fetch(`api/get_gedung.php?id=${id}`);
                const json = await res.json();
                if (json.status === 'success') return json.data;
            } catch (e) {}
        }
        const list = await this.getGedungs();
        return list.find(g => g.id_gedung === id) || null;
    },

    // 3. Ambil Semua Ruangan (dengan filter)
    async getRuangans(filters = {}) {
        const hasServer = await this.checkBackend();
        if (hasServer) {
            try {
                const params = new URLSearchParams();
                if (filters.id_gedung) params.append('id_gedung', filters.id_gedung);
                if (filters.id_lantai) params.append('id_lantai', filters.id_lantai);
                if (filters.jenis) params.append('jenis', filters.jenis);
                if (filters.q) params.append('q', filters.q);
                const res = await fetch(`api/get_ruangan.php?${params.toString()}`);
                const json = await res.json();
                if (json.status === 'success') return json.data;
            } catch (e) {}
        }

        let list = JSON.parse(localStorage.getItem('uniba_ruangan') || '[]');
        if (filters.id_gedung) {
            list = list.filter(r => r.id_gedung === parseInt(filters.id_gedung));
        }
        if (filters.id_lantai) {
            list = list.filter(r => r.id_lantai === parseInt(filters.id_lantai));
        }
        if (filters.jenis && filters.jenis !== 'semua') {
            list = list.filter(r => r.jenis_ruangan === filters.jenis);
        }
        if (filters.q) {
            const q = filters.q.toLowerCase();
            list = list.filter(r =>
                r.nama_ruangan.toLowerCase().includes(q) ||
                r.kode_ruangan.toLowerCase().includes(q) ||
                (r.fasilitas && r.fasilitas.toLowerCase().includes(q)) ||
                (r.nama_gedung && r.nama_gedung.toLowerCase().includes(q))
            );
        }
        return list;
    },

    // 4. Ambil Ruangan berdasarkan ID
    async getRuanganById(id) {
        id = parseInt(id);
        const hasServer = await this.checkBackend();
        if (hasServer) {
            try {
                const res = await fetch(`api/get_ruangan.php?id=${id}`);
                const json = await res.json();
                if (json.status === 'success') return json.data;
            } catch (e) {}
        }
        const list = await this.getRuangans();
        return list.find(r => r.id_ruangan === id) || null;
    },

    // 5. Ambil Fasilitas Kampus
    async getFasilitas(filters = {}) {
        const hasServer = await this.checkBackend();
        if (hasServer) {
            try {
                const params = new URLSearchParams();
                if (filters.kategori && filters.kategori !== 'semua') params.append('kategori', filters.kategori);
                if (filters.id_gedung) params.append('id_gedung', filters.id_gedung);
                const res = await fetch(`api/get_fasilitas.php?${params.toString()}`);
                const json = await res.json();
                if (json.status === 'success') return json.data;
            } catch (e) {}
        }

        let list = JSON.parse(localStorage.getItem('uniba_fasilitas') || '[]');
        if (filters.kategori && filters.kategori !== 'semua') {
            list = list.filter(f => f.kategori === filters.kategori);
        }
        if (filters.id_gedung) {
            list = list.filter(f => f.id_gedung === parseInt(filters.id_gedung));
        }
        return list;
    },

    // 6. Ambil Berita & Pengumuman
    async getBerita(filters = {}) {
        const hasServer = await this.checkBackend();
        if (hasServer) {
            try {
                const params = new URLSearchParams();
                if (filters.kategori && filters.kategori !== 'semua') params.append('kategori', filters.kategori);
                const res = await fetch(`api/get_berita.php?${params.toString()}`);
                const json = await res.json();
                if (json.status === 'success') return json.data;
            } catch (e) {}
        }

        let list = JSON.parse(localStorage.getItem('uniba_berita') || '[]');
        if (filters.kategori && filters.kategori !== 'semua') {
            list = list.filter(b => b.kategori === filters.kategori);
        }
        return list;
    },

    // 7. Multi-field Search
    async search(keyword) {
        if (!keyword || !keyword.trim()) return { ruangan: [], gedung: [], fasilitas: [] };
        keyword = keyword.trim().toLowerCase();

        const hasServer = await this.checkBackend();
        if (hasServer) {
            try {
                const res = await fetch(`api/search.php?q=${encodeURIComponent(keyword)}`);
                const json = await res.json();
                if (json.status === 'success') return json.data;
            } catch (e) {}
        }

        // Local search fallback
        const allRooms = await this.getRuangans();
        const allGedungs = await this.getGedungs();
        const allFasilitas = await this.getFasilitas();

        const matchedRooms = allRooms.filter(r =>
            r.nama_ruangan.toLowerCase().includes(keyword) ||
            r.kode_ruangan.toLowerCase().includes(keyword) ||
            (r.fasilitas && r.fasilitas.toLowerCase().includes(keyword)) ||
            (r.nama_gedung && r.nama_gedung.toLowerCase().includes(keyword))
        );

        const matchedGedungs = allGedungs.filter(g =>
            g.nama_gedung.toLowerCase().includes(keyword) ||
            g.kode_gedung.toLowerCase().includes(keyword) ||
            (g.alias && g.alias.toLowerCase().includes(keyword)) ||
            (g.deskripsi && g.deskripsi.toLowerCase().includes(keyword))
        );

        const matchedFasilitas = allFasilitas.filter(f =>
            f.nama_fasilitas.toLowerCase().includes(keyword) ||
            f.kategori.toLowerCase().includes(keyword) ||
            f.lokasi.toLowerCase().includes(keyword) ||
            (f.deskripsi && f.deskripsi.toLowerCase().includes(keyword))
        );

        return {
            ruangan: matchedRooms,
            gedung: matchedGedungs,
            fasilitas: matchedFasilitas
        };
    },

    // 8. Admin Authentication
    async adminLogin(username, password) {
        const hasServer = await this.checkBackend();
        if (hasServer) {
            try {
                const res = await fetch('api/admin_login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const json = await res.json();
                if (json.status === 'success') {
                    localStorage.setItem('uniba_admin_session', JSON.stringify(json.data));
                    return { success: true, data: json.data };
                }
                return { success: false, message: json.message || 'Login gagal' };
            } catch (e) {}
        }

        // Fallback login
        if ((username === 'admin' || username === 'gita') && (password === 'admin123' || password === 'admin')) {
            const user = {
                id_user: 1,
                username: username,
                nama_lengkap: username === 'gita' ? 'R. Aj Gita Dwi Aprilia' : 'Administrator Utama UNIBA',
                role: 'superadmin'
            };
            localStorage.setItem('uniba_admin_session', JSON.stringify(user));
            return { success: true, data: user };
        }
        return { success: false, message: 'Username atau password salah!' };
    },

    // 9. Admin CRUD operations
    async saveGedung(data) {
        const hasServer = await this.checkBackend();
        if (hasServer) {
            try {
                const res = await fetch('api/save_gedung.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const json = await res.json();
                if (json.status === 'success') return json;
            } catch (e) {}
        }

        let list = await this.getGedungs();
        if (data.id_gedung) {
            const idx = list.findIndex(g => g.id_gedung === parseInt(data.id_gedung));
            if (idx !== -1) list[idx] = { ...list[idx], ...data };
        } else {
            const newId = list.length ? Math.max(...list.map(g => g.id_gedung)) + 1 : 1;
            data.id_gedung = newId;
            data.total_ruangan = data.total_ruangan || 0;
            list.push(data);
        }
        localStorage.setItem('uniba_gedung', JSON.stringify(list));
        return { status: 'success', message: 'Gedung tersimpan secara lokal' };
    },

    async saveRuangan(data) {
        const hasServer = await this.checkBackend();
        if (hasServer) {
            try {
                const res = await fetch('api/save_ruangan.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const json = await res.json();
                if (json.status === 'success') return json;
            } catch (e) {}
        }

        let list = await this.getRuangans();
        if (data.id_ruangan) {
            const idx = list.findIndex(r => r.id_ruangan === parseInt(data.id_ruangan));
            if (idx !== -1) list[idx] = { ...list[idx], ...data };
        } else {
            const newId = list.length ? Math.max(...list.map(r => r.id_ruangan)) + 1 : 1;
            data.id_ruangan = newId;
            list.push(data);
        }
        localStorage.setItem('uniba_ruangan', JSON.stringify(list));
        return { status: 'success', message: 'Ruangan tersimpan secara lokal' };
    },

    async deleteItem(type, id) {
        id = parseInt(id);
        const hasServer = await this.checkBackend();
        if (hasServer) {
            try {
                const url = type === 'gedung' ? `api/save_gedung.php?action=delete&id_gedung=${id}`
                          : type === 'ruangan' ? `api/save_ruangan.php?action=delete&id_ruangan=${id}`
                          : type === 'fasilitas' ? `api/save_fasilitas.php?action=delete&id_fasilitas=${id}`
                          : `api/save_berita.php?action=delete&id_berita=${id}`;
                const res = await fetch(url, { method: 'POST' });
                const json = await res.json();
                if (json.status === 'success') return json;
            } catch (e) {}
        }

        if (type === 'gedung') {
            let list = await this.getGedungs();
            list = list.filter(g => g.id_gedung !== id);
            localStorage.setItem('uniba_gedung', JSON.stringify(list));
        } else if (type === 'ruangan') {
            let list = await this.getRuangans();
            list = list.filter(r => r.id_ruangan !== id);
            localStorage.setItem('uniba_ruangan', JSON.stringify(list));
        } else if (type === 'fasilitas') {
            let list = await this.getFasilitas();
            list = list.filter(f => f.id_fasilitas !== id);
            localStorage.setItem('uniba_fasilitas', JSON.stringify(list));
        } else if (type === 'berita') {
            let list = await this.getBerita();
            list = list.filter(b => b.id_berita !== id);
            localStorage.setItem('uniba_berita', JSON.stringify(list));
        }
        return { status: 'success', message: 'Data berhasil dihapus!' };
    },

    // 10. Node & Edge Management (Kelola Jaringan Rute Spasial)
    async getNodes() {
        if (!localStorage.getItem('uniba_nodes')) {
            this.initLocalData();
        }
        return JSON.parse(localStorage.getItem('uniba_nodes') || '[]');
    },

    async saveNode(data) {
        const nodeId = data.id_node || data.id;
        data.id_node = nodeId;
        data.id = nodeId;
        let list = await this.getNodes();
        const existingIdx = list.findIndex(n => (n.id_node || n.id) === nodeId);
        if (existingIdx !== -1) {
            list[existingIdx] = { ...list[existingIdx], ...data };
        } else {
            list.push(data);
        }
        localStorage.setItem('uniba_nodes', JSON.stringify(list));
        if (typeof DijkstraRute !== 'undefined') {
            DijkstraRute.nodes[nodeId] = {
                id: nodeId,
                name: data.nama_node || data.name,
                x: data.x ?? data.koordinat_x,
                y: data.y ?? data.koordinat_y,
                type: data.jenis_node || data.type,
                buildingId: data.gedung_id || data.buildingId,
                floor: data.lantai || data.floor
            };
        }
        return { status: 'success', message: 'Simpul rute spasial berhasil disimpan!' };
    },

    async deleteNode(id) {
        let list = await this.getNodes();
        list = list.filter(n => (n.id_node || n.id) !== id);
        localStorage.setItem('uniba_nodes', JSON.stringify(list));
        if (typeof DijkstraRute !== 'undefined') {
            delete DijkstraRute.nodes[id];
        }
        // Hapus juga edge terkait
        let edges = await this.getEdges();
        edges = edges.filter(e => e.node_awal !== id && e.node_tujuan !== id);
        localStorage.setItem('uniba_edges', JSON.stringify(edges));
        return { status: 'success', message: 'Simpul rute dan edge terkait berhasil dihapus!' };
    },

    async getEdges() {
        if (!localStorage.getItem('uniba_edges')) {
            this.initLocalData();
        }
        return JSON.parse(localStorage.getItem('uniba_edges') || '[]');
    },

    async saveEdge(data) {
        let list = await this.getEdges();
        if (data.id_edge) {
            const idx = list.findIndex(e => e.id_edge === parseInt(data.id_edge));
            if (idx !== -1) list[idx] = { ...list[idx], ...data };
        } else {
            const newId = list.length ? Math.max(...list.map(e => e.id_edge || 0)) + 1 : 1;
            data.id_edge = newId;
            list.push(data);
        }
        localStorage.setItem('uniba_edges', JSON.stringify(list));
        if (typeof DijkstraRute !== 'undefined') {
            DijkstraRute.edges = list.map(e => ({
                u: e.node_awal,
                v: e.node_tujuan,
                weight: parseFloat(e.jarak),
                type: e.jenis_jalur
            }));
        }
        return { status: 'success', message: 'Jalur edge spasial berhasil disimpan!' };
    },

    async deleteEdge(id) {
        id = parseInt(id);
        let list = await this.getEdges();
        list = list.filter(e => e.id_edge !== id);
        localStorage.setItem('uniba_edges', JSON.stringify(list));
        if (typeof DijkstraRute !== 'undefined') {
            DijkstraRute.edges = list.map(e => ({
                u: e.node_awal,
                v: e.node_tujuan,
                weight: parseFloat(e.jarak),
                type: e.jenis_jalur
            }));
        }
        return { status: 'success', message: 'Jalur edge berhasil dihapus!' };
    }
};

// Auto check backend saat file dimuat
DataStore.checkBackend();
