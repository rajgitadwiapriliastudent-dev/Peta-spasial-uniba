/**
 * Controller Katalog Informasi Ruangan, Fasilitas, dan Berita UNIBA Madura
 */

const CatalogView = {
    allRooms: [],
    viewMode: 'grid', // 'grid' | 'table'

    // Inisialisasi Halaman Informasi Ruangan
    async initRoomCatalog() {
        this.allRooms = await DataStore.getRuangans();
        this.populateGedungFilterDropdown();
        this.renderRooms();
    },

    // Isi Dropdown Filter Gedung
    async populateGedungFilterDropdown() {
        const select = document.getElementById('filter-catalog-gedung');
        if (!select) return;

        const gedungs = await DataStore.getGedungs();
        let options = '<option value="">Semua Gedung</option>';
        gedungs.forEach(g => {
            options += `<option value="${g.id_gedung}">${g.nama_gedung}</option>`;
        });
        select.innerHTML = options;
    },

    // Ubah Tampilan Grid vs Tabel
    setViewMode(mode) {
        this.viewMode = mode;
        document.getElementById('btn-view-grid')?.classList.toggle('active', mode === 'grid');
        document.getElementById('btn-view-table')?.classList.toggle('active', mode === 'table');
        this.renderRooms();
    },

    // Render Ruangan dengan Filter
    async renderRooms() {
        const gedungVal = document.getElementById('filter-catalog-gedung')?.value || '';
        const lantaiVal = document.getElementById('filter-catalog-lantai')?.value || '';
        const jenisVal = document.getElementById('filter-catalog-jenis')?.value || '';
        const qVal = document.getElementById('filter-catalog-search')?.value.toLowerCase().trim() || '';

        let filtered = [...this.allRooms];

        if (gedungVal) filtered = filtered.filter(r => r.id_gedung === parseInt(gedungVal));
        if (lantaiVal) filtered = filtered.filter(r => r.id_lantai === parseInt(lantaiVal) || r.nomor_lantai === parseInt(lantaiVal));
        if (jenisVal && jenisVal !== 'semua') filtered = filtered.filter(r => r.jenis_ruangan === jenisVal);
        if (qVal) {
            filtered = filtered.filter(r =>
                r.nama_ruangan.toLowerCase().includes(qVal) ||
                r.kode_ruangan.toLowerCase().includes(qVal) ||
                (r.fasilitas && r.fasilitas.toLowerCase().includes(qVal)) ||
                (r.nama_gedung && r.nama_gedung.toLowerCase().includes(qVal))
            );
        }

        const countBadge = document.getElementById('catalog-room-count');
        if (countBadge) countBadge.textContent = `${filtered.length} Ruangan`;

        const gridContainer = document.getElementById('catalog-rooms-grid');
        const tableContainer = document.getElementById('catalog-rooms-table');

        if (this.viewMode === 'grid') {
            if (gridContainer) gridContainer.classList.remove('d-none');
            if (tableContainer) tableContainer.classList.add('d-none');

            if (!filtered.length) {
                gridContainer.innerHTML = `
                    <div class="col-12 text-center py-5 text-muted">
                        <i class="bi bi-door-closed fs-1 d-block mb-2"></i>
                        <h6>Tidak ada ruangan yang sesuai filter.</h6>
                    </div>
                `;
                return;
            }

            let html = '';
            filtered.forEach(r => {
                const colors = ROOM_TYPE_COLORS[r.jenis_ruangan] || ROOM_TYPE_COLORS['Ruang Kelas'];
                html += `
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="room-grid-card">
                            <div class="position-relative">
                                <img src="${r.foto || 'assets/img/rooms/kelas_standar.svg'}" alt="${r.nama_ruangan}">
                                <span class="badge ${colors.badge} position-absolute top-0 end-0 m-3 shadow-sm">${r.jenis_ruangan}</span>
                            </div>
                            <div class="room-grid-body">
                                <div class="d-flex justify-content-between align-items-baseline mb-1">
                                    <h5 class="fw-bold text-dark mb-0">${r.kode_ruangan}</h5>
                                    <span class="badge bg-light text-secondary border"><i class="bi bi-people me-1"></i>${r.kapasitas} Org</span>
                                </div>
                                <h6 class="fw-bold text-dark mb-2">${r.nama_ruangan}</h6>
                                <p class="small text-success fw-semibold mb-2">
                                    <i class="bi bi-building me-1"></i>${r.nama_gedung} &bull; ${r.nama_lantai}
                                </p>
                                <p class="small text-muted mb-3 flex-grow-1" style="display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                                    ${r.deskripsi || r.fasilitas || 'Fasilitas pembelajaran interaktif.'}
                                </p>
                                <div class="d-flex gap-1 pt-2 border-top">
                                    <button class="btn btn-sm btn-outline-secondary flex-grow-1" onclick="CatalogView.openDetail(${r.id_ruangan})">
                                        <i class="bi bi-info-circle me-1"></i>Detail
                                    </button>
                                    <button class="btn btn-sm btn-outline-success flex-grow-1" onclick="App.navigateToDenahGedung(${r.id_gedung}, ${r.id_lantai}, ${r.id_ruangan})" title="Buka Denah &amp; Sorot Ruangan">
                                        <i class="bi bi-diagram-3 me-1"></i>Denah
                                    </button>
                                    <button class="btn btn-sm btn-success flex-grow-1" onclick="CatalogView.navigateToRoute(${r.id_ruangan})" title="Rute Singkat ke Ruangan">
                                        <i class="bi bi-signpost-2-fill me-1"></i>Rute
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            gridContainer.innerHTML = html;
        } else {
            if (gridContainer) gridContainer.classList.add('d-none');
            if (tableContainer) tableContainer.classList.remove('d-none');

            const tbody = document.getElementById('catalog-table-tbody');
            if (!tbody) return;

            let html = '';
            filtered.forEach((r, idx) => {
                const colors = ROOM_TYPE_COLORS[r.jenis_ruangan] || ROOM_TYPE_COLORS['Ruang Kelas'];
                html += `
                    <tr>
                        <td class="text-center text-muted">${idx + 1}</td>
                        <td class="fw-bold text-success">${r.kode_ruangan}</td>
                        <td class="fw-semibold">${r.nama_ruangan}</td>
                        <td>${r.nama_gedung}</td>
                        <td>${r.nama_lantai}</td>
                        <td><span class="badge ${colors.badge}">${r.jenis_ruangan}</span></td>
                        <td>${r.kapasitas} orang</td>
                        <td class="small text-muted text-truncate" style="max-width:180px;">${r.fasilitas || '-'}</td>
                        <td class="text-end text-nowrap">
                            <button class="btn btn-sm btn-outline-secondary me-1" title="Detail" onclick="CatalogView.openDetail(${r.id_ruangan})">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-success me-1" title="Denah" onclick="App.navigateToDenahGedung(${r.id_gedung}, ${r.id_lantai}, ${r.id_ruangan})">
                                <i class="bi bi-diagram-3"></i>
                            </button>
                            <button class="btn btn-sm btn-success" title="Rute Singkat" onclick="CatalogView.navigateToRoute(${r.id_ruangan})">
                                <i class="bi bi-signpost-2-fill"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        }
    },

    openDetail(roomId) {
        const room = MapDenah.findRoomObject(roomId);
        if (room) {
            MapDenah.showRoomDetailModal(room);
        }
    },

    navigateToRoute(roomId) {
        const room = MapDenah.findRoomObject(roomId);
        if (room) {
            App.navigateTo('map-kampus', {
                routeStart: 'gerbang_utama',
                routeRoom: room
            });
        }
    },

    // Inisialisasi Halaman Fasilitas Kampus
    async initFacilitiesPage() {
        const container = document.getElementById('facilities-grid-container');
        if (!container) return;

        const fasilitas = await DataStore.getFasilitas();
        let html = '';

        fasilitas.forEach(f => {
            html += `
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="feature-card">
                        <div class="position-relative mb-3">
                            <img src="${f.foto}" alt="${f.nama_fasilitas}" style="width:100%; height:180px; object-fit:cover; border-radius:12px;">
                            <span class="badge bg-success position-absolute top-0 end-0 m-3 shadow-sm">${f.kategori}</span>
                        </div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <i class="bi ${f.ikon || 'bi-geo-alt'} text-success fs-5"></i>
                            <h5 class="fw-bold mb-0 text-dark">${f.nama_fasilitas}</h5>
                        </div>
                        <p class="small text-success fw-semibold mb-2">
                            <i class="bi bi-geo-alt-fill me-1"></i>${f.lokasi}
                        </p>
                        <p class="small text-muted mb-3 flex-grow-1">
                            ${f.deskripsi}
                        </p>
                        <button class="btn btn-outline-success w-100 fw-bold" onclick="CatalogView.viewFacilityOnMap(${f.id_gedung || 0}, '${f.nama_fasilitas}')">
                            <i class="bi bi-map-fill me-2"></i>Lihat di Peta Kampus
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // Arahkan ke peta dan sorot fasilitas/gedung
    viewFacilityOnMap(idGedung, namaFasilitas) {
        App.navigateToCampusMap(idGedung || 1);
    },

    // Inisialisasi Halaman Berita & Pengumuman
    async initNewsPage() {
        const container = document.getElementById('news-grid-container');
        if (!container) return;

        const beritas = await DataStore.getBerita();
        let html = '';

        beritas.forEach(b => {
            html += `
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="feature-card">
                        <img src="${b.foto || 'assets/img/campus_hero.jpg'}" alt="${b.judul}" style="width:100%; height:180px; object-fit:cover; border-radius:12px; margin-bottom:1rem;">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-success-subtle text-success">${b.kategori}</span>
                            <span class="small text-muted"><i class="bi bi-calendar3 me-1"></i>${b.tanggal}</span>
                        </div>
                        <h5 class="fw-bold mb-2 text-dark">${b.judul}</h5>
                        <p class="small text-muted mb-3 flex-grow-1">${b.ringkasan}</p>
                        <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                            <span class="small text-muted">${b.penulis}</span>
                            <button class="btn btn-sm btn-link text-success p-0 fw-bold text-decoration-none" onclick="CatalogView.openNewsModal(${b.id_berita})">
                                Baca Selengkapnya &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // Buka Modal Berita
    async openNewsModal(idBerita) {
        const beritas = await DataStore.getBerita();
        const b = beritas.find(x => x.id_berita === idBerita);
        if (!b) return;

        document.getElementById('newsModalTitle').textContent = b.judul;
        document.getElementById('newsModalDate').textContent = `${b.kategori} &bull; ${b.tanggal} &bull; Oleh: ${b.penulis}`;
        document.getElementById('newsModalImg').src = b.foto || 'assets/img/campus_hero.jpg';
        document.getElementById('newsModalContent').textContent = b.isi;

        const modal = new bootstrap.Modal(document.getElementById('newsDetailModal'));
        modal.show();
    }
};
