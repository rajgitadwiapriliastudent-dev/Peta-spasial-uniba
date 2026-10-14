/**
 * Controller Halaman Pencarian Ruangan (Split View: Hasil + Peta Lokasi)
 * Sistem Informasi Spasial UNIBA Madura
 * Menggunakan Peta Spasial Lokal Asli assets/img/peta_spasial_uniba.jpeg (Leaflet CRS.Simple)
 * Bebas Maps API Eksternal
 * Pengembang: R. Aj Gita Dwi Aprilia (NIM: 2302510011)
 */

const SearchView = {
    searchMap: null,
    searchMarkers: [],
    highlightPolygon: null,
    currentResults: [],
    selectedResultId: null,

    // Inisialisasi Peta Split Hasil Pencarian
    initSearchMap(containerId = 'search-map-leaflet') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.searchMap) {
            this.searchMap.invalidateSize();
            return;
        }

        const bounds = [[0, 0], [UNIBA_IMAGE_HEIGHT, UNIBA_IMAGE_WIDTH]];

        this.searchMap = L.map(containerId, {
            crs: L.CRS.Simple,
            minZoom: -1,
            maxZoom: 2,
            zoomSnap: 0.25,
            zoomDelta: 0.5,
            zoomControl: true,
            attributionControl: false,
            maxBounds: [[-100, -100], [UNIBA_IMAGE_HEIGHT + 100, UNIBA_IMAGE_WIDTH + 100]]
        });

        // Overlay Gambar Peta Spasial Asli UNIBA Madura
        L.imageOverlay(UNIBA_IMAGE_SRC, bounds).addTo(this.searchMap);
        this.searchMap.fitBounds(bounds, { padding: [10, 10] });

        // Batas Kampus
        L.geoJSON(UNIBA_DELINIASI_KAMPUS, {
            style: { color: '#047857', weight: 2, fillOpacity: 0.05 }
        }).addTo(this.searchMap);
    },

    // Eksekusi Pencarian
    async executeSearch(keyword) {
        keyword = keyword ? keyword.trim() : '';
        const searchInput = document.getElementById('search-page-input');
        if (searchInput && keyword) searchInput.value = keyword;

        const resultsContainer = document.getElementById('search-results-list');
        const countBadge = document.getElementById('search-results-count');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <div class="text-center py-5 text-muted">
                <div class="spinner-border text-success mb-2" role="status"></div>
                <p class="small mb-0">Mencari di basis data spasial UNIBA Madura...</p>
            </div>
        `;

        const data = await DataStore.search(keyword);
        this.currentResults = data.ruangan || [];

        // Hitung total
        const total = (data.ruangan?.length || 0) + (data.gedung?.length || 0) + (data.fasilitas?.length || 0);
        if (countBadge) countBadge.textContent = `${total} Hasil Ditemukan`;

        this.renderSearchResults(data, keyword);
        this.updateSearchMap(data);
    },

    // Render Hasil Pencarian (Sebelah Kiri)
    renderSearchResults(data, keyword) {
        const container = document.getElementById('search-results-list');
        if (!container) return;

        let html = '';

        if (!data.ruangan?.length && !data.gedung?.length && !data.fasilitas?.length) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-search text-muted fs-1 mb-3 d-block"></i>
                    <h6 class="fw-bold text-dark">Data tidak ditemukan</h6>
                    <p class="small text-muted mb-0">Tidak ada gedung, ruangan, atau fasilitas yang cocok dengan "<b>${keyword}</b>".</p>
                </div>
            `;
            return;
        }

        // 1. Tampilkan Ruangan yang Cocok
        if (data.ruangan && data.ruangan.length > 0) {
            html += `<h6 class="text-uppercase small fw-bold text-muted mb-2">Ruangan (${data.ruangan.length})</h6>`;
            data.ruangan.forEach(r => {
                const isSelected = this.selectedResultId === r.id_ruangan ? 'active' : '';
                html += `
                    <div class="search-result-card ${isSelected}" id="search-card-${r.id_ruangan}" onclick="SearchView.selectRoomResult(${r.id_ruangan})">
                        <img src="${r.foto || 'assets/img/rooms/kelas_standar.svg'}" alt="${r.nama_ruangan}">
                        <div class="search-card-info">
                            <span class="badge bg-success-subtle text-success mb-1" style="font-size:0.72rem;">${r.jenis_ruangan}</span>
                            <h5>${r.kode_ruangan} - ${r.nama_ruangan}</h5>
                            <span class="search-card-location">
                                <i class="bi bi-geo-alt-fill me-1"></i>${r.nama_gedung} &bull; ${r.nama_lantai}
                            </span>
                            <div class="d-flex gap-1 flex-wrap mt-2">
                                <button class="btn btn-sm btn-outline-primary py-1 px-2" onclick="event.stopPropagation(); SearchView.selectRoomResult(${r.id_ruangan})" title="Lihat di Peta Kampus">
                                    <i class="bi bi-geo-alt me-1"></i>Lihat di Peta
                                </button>
                                <button class="btn btn-sm btn-outline-success py-1 px-2" onclick="event.stopPropagation(); App.navigateToDenahGedung(${r.id_gedung}, ${r.id_lantai}, ${r.id_ruangan})" title="Buka Denah &amp; Sorot Ruangan">
                                    <i class="bi bi-diagram-3 me-1"></i>Lihat Denah
                                </button>
                                <button class="btn btn-sm btn-success py-1 px-2" onclick="event.stopPropagation(); SearchView.navigateToRoute(${r.id_ruangan})" title="Tampilkan Rute ke Ruangan Ini">
                                    <i class="bi bi-signpost-2-fill me-1"></i>Rute ke Ruangan
                                </button>
                                <button class="btn btn-sm btn-outline-secondary py-1 px-2" onclick="event.stopPropagation(); SearchView.openRoomDetail(${r.id_ruangan})" title="Detail Ruangan">
                                    <i class="bi bi-info-circle me-1"></i>Detail
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // 2. Tampilkan Gedung yang Cocok
        if (data.gedung && data.gedung.length > 0) {
            html += `<h6 class="text-uppercase small fw-bold text-muted mt-3 mb-2">Gedung (${data.gedung.length})</h6>`;
            data.gedung.forEach(g => {
                html += `
                    <div class="search-result-card" onclick="App.navigateToDenahGedung(${g.id_gedung})">
                        <img src="${g.foto}" alt="${g.nama_gedung}">
                        <div class="search-card-info">
                            <span class="badge bg-primary-subtle text-primary mb-1">${g.kategori}</span>
                            <h5>${g.nama_gedung}</h5>
                            <span class="search-card-location"><i class="bi bi-building me-1"></i>${g.alias}</span>
                            <p class="small text-muted mb-2">${g.jumlah_lantai} Lantai &bull; ${g.total_ruangan || 20} Ruangan</p>
                            <button class="btn btn-sm btn-success py-1 px-3">
                                <i class="bi bi-diagram-3 me-1"></i>Buka Denah Gedung
                            </button>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML = html;
    },

    // Update Marker & Polygon di Peta Split (Sebelah Kanan)
    updateSearchMap(data) {
        if (!this.searchMap) return;

        // Bersihkan layer sebelumnya
        this.searchMarkers.forEach(m => this.searchMap.removeLayer(m));
        this.searchMarkers = [];
        if (this.highlightPolygon) {
            this.searchMap.removeLayer(this.highlightPolygon);
            this.highlightPolygon = null;
        }

        const bounds = L.latLngBounds([]);

        // Pasang marker untuk gedung-gedung yang terkait dengan hasil pencarian ruangan
        const processedBldIds = new Set();
        (data.ruangan || []).forEach(r => {
            if (!processedBldIds.has(r.id_gedung)) {
                processedBldIds.add(r.id_gedung);
                const g = UNIBA_GEDUNG_LIST.find(b => b.id_gedung === r.id_gedung);
                if (g) {
                    const latLng = unibaToLatLng(g.center_px[0], g.center_px[1]);
                    bounds.extend(latLng);

                    const marker = L.marker(latLng, {
                        icon: L.divIcon({
                            html: `<div style="background:#047857; color:#fff; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 10px rgba(0,0,0,0.3); border:2px solid #fff;"><i class="bi bi-geo-alt-fill"></i></div>`,
                            className: 'search-marker-pin',
                            iconSize: [36, 36],
                            iconAnchor: [18, 18]
                        })
                    });

                    marker.bindPopup(`
                        <div class="p-2">
                            <span class="badge bg-success mb-1">${g.kode_gedung}</span>
                            <h6 class="fw-bold mb-1">${g.nama_gedung}</h6>
                            <p class="small text-muted mb-2">${g.alias}</p>
                            <button class="btn btn-sm btn-success w-100" onclick="App.navigateToDenahGedung(${r.id_gedung}, ${r.id_lantai}, ${r.id_ruangan})">
                                Buka Denah &amp; Sorot Ruang &rarr;
                            </button>
                        </div>
                    `);

                    marker.addTo(this.searchMap);
                    this.searchMarkers.push(marker);
                }
            }
        });

        if (bounds.isValid()) {
            this.searchMap.fitBounds(bounds, { padding: [60, 60], maxZoom: 1.5 });
        } else {
            this.searchMap.fitBounds([[0, 0], [UNIBA_IMAGE_HEIGHT, UNIBA_IMAGE_WIDTH]]);
        }
    },

    // Memilih Salah Satu Hasil Pencarian Ruangan
    selectRoomResult(roomId) {
        this.selectedResultId = roomId;
        document.querySelectorAll('.search-result-card').forEach(el => el.classList.remove('active'));
        const targetCard = document.getElementById(`search-card-${roomId}`);
        if (targetCard) targetCard.classList.add('active');

        const room = this.currentResults.find(r => r.id_ruangan === roomId);
        if (!room || !this.searchMap) return;

        const g = UNIBA_GEDUNG_LIST.find(b => b.id_gedung === room.id_gedung);
        if (g) {
            if (this.highlightPolygon) {
                this.searchMap.removeLayer(this.highlightPolygon);
            }

            const latLngs = g.polygon_px.map(pt => unibaToLatLng(pt[0], pt[1]));
            this.highlightPolygon = L.polygon(latLngs, {
                color: '#10b981',
                weight: 4,
                fillColor: '#059669',
                fillOpacity: 0.55
            }).addTo(this.searchMap);

            this.searchMap.fitBounds(this.highlightPolygon.getBounds(), { padding: [50, 50], maxZoom: 1.5 });

            // Buka popup info singkat di peta
            const center = unibaToLatLng(g.center_px[0], g.center_px[1]);
            L.popup()
                .setLatLng(center)
                .setContent(`
                    <div class="p-2 text-center" style="min-width:210px;">
                        <span class="badge bg-success mb-1">${room.kode_ruangan}</span>
                        <h6 class="fw-bold mb-1">${room.nama_ruangan}</h6>
                        <p class="small text-muted mb-2">${room.nama_gedung} &bull; ${room.nama_lantai}</p>
                        <div class="d-flex flex-column gap-1">
                            <button class="btn btn-sm btn-success w-100" onclick="App.navigateToDenahGedung(${room.id_gedung}, ${room.id_lantai}, ${room.id_ruangan})">
                                <i class="bi bi-diagram-3 me-1"></i>Buka Denah &amp; Sorot Ruang
                            </button>
                            <button class="btn btn-sm btn-outline-success w-100" onclick="SearchView.navigateToRoute(${room.id_ruangan})">
                                <i class="bi bi-signpost-2-fill me-1"></i>Rute ke Ruangan Ini
                            </button>
                        </div>
                    </div>
                `)
                .openOn(this.searchMap);
        }
    },

    // Buka detail ruangan dari search
    openRoomDetail(roomId) {
        const room = MapDenah.findRoomObject(roomId);
        if (room) {
            MapDenah.showRoomDetailModal(room);
        }
    },

    // Rute langsung ke ruangan dari search
    navigateToRoute(roomId) {
        const room = MapDenah.findRoomObject(roomId);
        if (room) {
            App.navigateTo('map-kampus', {
                routeStart: 'gerbang_utama',
                routeRoom: room
            });
        }
    }
};
