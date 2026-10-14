/**
 * Controller Peta Spasial Kawasan Kampus UNIBA Madura
 * Menggunakan Gambar Peta Asli: assets/img/peta_spasial_uniba.jpeg (Leaflet CRS.Simple)
 * Bebas Ketergantungan Maps API / Tile Layer Eksternal (Sesuai Ketentuan Skripsi Bagian 1 & 2)
 * Pengembang: R. Aj Gita Dwi Aprilia (NIM: 2302510011)
 */

const MapKampus = {
    map: null,
    previewMap: null,
    imageOverlay: null,
    boundaryLayer: null,
    buildingLayer: null,
    poiLayer: null,
    pathLayer: null,
    routeLayer: null,
    routeMarkers: [],
    activeRoute: null,
    currentSelectedBuildingId: null,

    // Konfigurasi Dimensi & Batas Peta Gambar
    imgWidth: 731,
    imgHeight: 1034,

    getBounds() {
        return [[0, 0], [this.imgHeight, this.imgWidth]];
    },

    // Inisialisasi Peta Utama Halaman "Peta Kampus"
    initMainMap(containerId = 'map-kampus-leaflet') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.map) {
            this.map.invalidateSize();
            return;
        }

        const bounds = this.getBounds();

        // Setup Leaflet Map menggunakan Simple CRS (Koordinat Gambar Lokal)
        this.map = L.map(containerId, {
            crs: L.CRS.Simple,
            minZoom: -1,
            maxZoom: 3,
            zoomSnap: 0.25,
            zoomDelta: 0.5,
            zoomControl: false,
            attributionControl: false,
            maxBounds: [[-100, -100], [this.imgHeight + 100, this.imgWidth + 100]],
            maxBoundsViscosity: 0.8
        });

        // 1. Tambahkan Gambar Peta Spasial Asli UNIBA Madura sebagai Base Layer
        this.imageOverlay = L.imageOverlay(UNIBA_IMAGE_SRC, bounds, {
            alt: 'Peta Spasial Kawasan Kampus UNIBA Madura'
        }).addTo(this.map);

        // Sesuaikan tampilan awal agar pas dengan kontainer layar
        this.map.fitBounds(bounds, { padding: [10, 10] });

        // 2. Gambar Batas Area Kawasan Kampus (Delineasi Merah Sesuai Peta Asli)
        this.renderCampusBoundary();

        // 3. Gambar Poligon Interaktif Gedung Kampus
        this.renderBuildings();

        // 4. Render Landmark / Point of Interest (POI)
        this.renderPOIs();

        // 5. Render Daftar Gedung di Panel Samping
        this.renderBuildingSidebarList();
    },

    // Inisialisasi Mini Map Preview di Halaman Beranda (Home)
    initPreviewMap(containerId = 'home-map-preview') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.previewMap) {
            this.previewMap.invalidateSize();
            return;
        }

        const bounds = this.getBounds();

        this.previewMap = L.map(containerId, {
            crs: L.CRS.Simple,
            minZoom: -2,
            maxZoom: 1,
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false
        });

        // Gambar Peta Lokal di Preview Beranda
        L.imageOverlay(UNIBA_IMAGE_SRC, bounds).addTo(this.previewMap);
        this.previewMap.fitBounds(bounds);

        // Tambah Batas & Poligon Ringkas di Preview
        L.geoJSON(UNIBA_DELINIASI_KAMPUS, {
            style: { color: '#047857', weight: 2, fillOpacity: 0.08 }
        }).addTo(this.previewMap);

        UNIBA_GEDUNG_LIST.forEach(g => {
            const latLngs = g.polygon_px.map(pt => unibaToLatLng(pt[0], pt[1]));
            L.polygon(latLngs, {
                color: g.warna || '#059669',
                weight: 1.5,
                fillColor: g.warna || '#10b981',
                fillOpacity: 0.35
            }).addTo(this.previewMap);
        });
    },

    // Render Garis Deliniasi Batas Kawasan Kampus
    renderCampusBoundary() {
        if (!this.map) return;
        this.boundaryLayer = L.geoJSON(UNIBA_DELINIASI_KAMPUS, {
            style: {
                color: '#dc2626',
                weight: 3,
                dashArray: '8, 6',
                fillColor: '#10b981',
                fillOpacity: 0.06
            }
        }).addTo(this.map);
    },

    // Render Poligon Gedung & Interaksi Pop-up Foto Informasi Gedung (Ketentuan Bagian 2 & 3)
    renderBuildings() {
        if (!this.map) return;
        const self = this;

        if (this.buildingLayer) {
            this.map.removeLayer(this.buildingLayer);
        }

        const group = L.featureGroup();

        UNIBA_GEDUNG_LIST.forEach(g => {
            const latLngs = g.polygon_px.map(pt => unibaToLatLng(pt[0], pt[1]));
            const centerLatLng = unibaToLatLng(g.center_px[0], g.center_px[1]);

            const polygon = L.polygon(latLngs, {
                color: g.warna || '#059669',
                weight: 2.5,
                fillColor: g.warna || '#10b981',
                fillOpacity: 0.38,
                className: 'uniba-building-polygon'
            });

            // Tooltip saat hover cursor
            polygon.bindTooltip(`
                <div class="px-1 py-0 text-center">
                    <span class="fw-bold d-block text-dark">${g.nama_gedung}</span>
                    <small class="text-success fw-semibold">${g.alias}</small>
                </div>
            `, {
                permanent: false,
                direction: 'top',
                className: 'uniba-custom-tooltip'
            });

            // Efek hover interaktif
            polygon.on('mouseover', function () {
                this.setStyle({
                    weight: 4,
                    fillOpacity: 0.65,
                    color: '#047857'
                });
            });

            polygon.on('mouseout', function () {
                polygon.setStyle({
                    color: g.warna || '#059669',
                    weight: 2.5,
                    fillOpacity: 0.38
                });
            });

            // Bangun Konten Pop-up Foto & Informasi Gedung (Sesuai Ketentuan Bagian 3)
            const popupContent = self.generateBuildingPopupHtml(g);
            polygon.bindPopup(popupContent, {
                maxWidth: 320,
                minWidth: 280,
                className: 'uniba-building-popup-container',
                autoPan: true,
                autoPanPadding: [20, 20]
            });

            // Klik pada polygon: highlight di sidebar & buka popup
            polygon.on('click', function () {
                self.currentSelectedBuildingId = g.id_gedung;
                self.highlightBuildingSidebar(g.id_gedung);
                // Jika layar mobile kecil, sinkronkan juga panel bottom sheet
                self.showMobileBuildingSheet(g);
            });

            polygon.buildingId = g.id_gedung;
            group.addLayer(polygon);

            // Tambahkan Label Marker / Icon Pusat Gedung
            const labelIcon = L.divIcon({
                html: `
                    <div class="uniba-map-building-tag" style="border-left: 3px solid ${g.warna};">
                        <span>${g.kode_gedung}</span>
                    </div>
                `,
                className: 'custom-building-tag-marker',
                iconSize: [40, 22],
                iconAnchor: [20, 11]
            });

            const marker = L.marker(centerLatLng, { icon: labelIcon });
            marker.on('click', () => {
                polygon.fire('click');
                polygon.openPopup();
            });
            group.addLayer(marker);
        });

        group.addTo(this.map);
        this.buildingLayer = group;
    },

    // Generator HTML Pop-up Foto & Informasi Gedung (Warna Hijau & Putih Identitas UNIBA)
    generateBuildingPopupHtml(g) {
        const fasilitasBadges = (g.fasilitas_utama || []).slice(0, 3).map(f => `
            <span class="badge bg-light text-dark border me-1 mb-1" style="font-size:0.70rem;">
                <i class="bi bi-check-circle-fill text-success me-1"></i>${f}
            </span>
        `).join('');

        return `
            <div class="uniba-building-card-popup position-relative">
                <button type="button" class="btn-close btn-sm position-absolute top-0 end-0 m-2 bg-white rounded-circle p-1 shadow-sm" style="z-index: 10; opacity: 0.9;" onclick="MapKampus.map.closePopup();" aria-label="Tutup Pop-up" title="Tutup Pop-up"></button>
                <div class="uniba-popup-photo-wrap">
                    <img src="${g.foto}" alt="${g.nama_gedung}" class="uniba-popup-photo">
                    <span class="uniba-popup-category-badge">${g.kategori}</span>
                </div>
                <div class="uniba-popup-body">
                    <h5 class="uniba-popup-title">${g.nama_gedung}</h5>
                    <p class="uniba-popup-subtitle">${g.alias}</p>
                    <p class="uniba-popup-desc">${g.deskripsi ? g.deskripsi.substring(0, 110) + '...' : ''}</p>

                    <div class="uniba-popup-meta">
                        <span><i class="bi bi-layers-fill text-success me-1"></i><b>${g.jumlah_lantai}</b> Lantai</span>
                        <span><i class="bi bi-door-open-fill text-primary me-1"></i><b>${g.jumlah_ruangan}</b> Ruangan</span>
                    </div>

                    <div class="mb-2">
                        <small class="text-muted d-block mb-1" style="font-size:0.70rem; font-weight:700;">FASILITAS UTAMA:</small>
                        <div class="d-flex flex-wrap">${fasilitasBadges}</div>
                    </div>

                    <div class="uniba-popup-actions d-flex flex-column gap-1 pt-2 border-top">
                        <button class="btn btn-sm btn-success fw-bold w-100 py-1" onclick="App.navigateToDenahGedung(${g.id_gedung})">
                            <i class="bi bi-diagram-3-fill me-1"></i>Lihat Denah
                        </button>
                        <button class="btn btn-sm btn-outline-success fw-semibold w-100 py-1" onclick="MapKampus.showBuildingDetailModal(${g.id_gedung})">
                            <i class="bi bi-info-circle-fill me-1"></i>Lihat Detail Gedung
                        </button>
                        <button class="btn btn-sm btn-outline-dark fw-semibold w-100 py-1" onclick="MapKampus.openBuildingRoomSelector(${g.id_gedung})">
                            <i class="bi bi-signpost-2-fill me-1"></i>Tampilkan Rute
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Render Point of Interest (Musholla, Gerbang, Parkiran, Kantin, dll)
    renderPOIs() {
        if (!this.map) return;
        const self = this;

        if (this.poiLayer) {
            this.map.removeLayer(this.poiLayer);
        }

        const poiGroup = L.layerGroup();

        UNIBA_POIS.forEach(poi => {
            const latLng = unibaToLatLng(poi.x, poi.y);

            const iconHtml = `
                <div class="uniba-poi-pin" style="background:#ffffff; border:2px solid ${poi.warna || '#047857'}; color:${poi.warna || '#047857'};">
                    <i class="bi ${poi.ikon}"></i>
                </div>
            `;
            const customIcon = L.divIcon({
                html: iconHtml,
                className: 'custom-poi-marker',
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });

            const marker = L.marker(latLng, { icon: customIcon });

            marker.bindPopup(`
                <div class="p-2" style="max-width: 240px;">
                    <span class="badge bg-success-subtle text-success mb-1" style="font-size:0.70rem;">${poi.kategori}</span>
                    <h6 class="fw-bold mb-1 text-dark" style="font-size:0.88rem;">${poi.nama}</h6>
                    <p class="small text-muted mb-2" style="font-size:0.75rem; line-height:1.4;">${poi.deskripsi}</p>
                    <button class="btn btn-sm btn-success w-100 py-1 fw-semibold" style="font-size:0.74rem;" onclick="MapKampus.showRoute('${poi.node_id || 'gerbang_utama'}', 'akses_gedung_a')">
                        <i class="bi bi-signpost me-1"></i>Rute dari Titik Ini
                    </button>
                </div>
            `, { className: 'uniba-poi-popup' });

            poiGroup.addLayer(marker);
        });

        poiGroup.addTo(this.map);
        this.poiLayer = poiGroup;
    },

    // Render Daftar Gedung di Sidebar Peta
    renderBuildingSidebarList() {
        const container = document.getElementById('map-building-list-container');
        if (!container) return;

        let html = '';
        UNIBA_GEDUNG_LIST.forEach(g => {
            html += `
                <div class="building-list-item" id="sidebar-bld-${g.id_gedung}" onclick="MapKampus.focusBuilding(${g.id_gedung})">
                    <div class="building-item-color" style="background-color: ${g.warna};"></div>
                    <div class="building-item-info flex-grow-1">
                        <h4>${g.nama_gedung}</h4>
                        <span>${g.jumlah_lantai} Lantai &bull; ${g.kategori}</span>
                    </div>
                    <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-success rounded-pill px-2 py-1" onclick="event.stopPropagation(); MapKampus.openBuildingRoomSelector(${g.id_gedung})" title="Lihat Ruangan &amp; Tampilkan Rute">
                            <i class="bi bi-door-open"></i>
                        </button>
                        <button class="btn btn-sm btn-success rounded-pill px-2 py-1" onclick="event.stopPropagation(); App.navigateToDenahGedung(${g.id_gedung})" title="Lihat Denah Gedung">
                            <i class="bi bi-diagram-3"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    },

    // Fokus dan Buka Pop-up Gedung
    focusBuilding(idGedung) {
        if (!this.map || !this.buildingLayer) return;
        idGedung = parseInt(idGedung);

        let targetPolygon = null;
        this.buildingLayer.eachLayer(layer => {
            if (layer.buildingId === idGedung && typeof layer.getBounds === 'function') {
                targetPolygon = layer;
            }
        });

        if (targetPolygon) {
            this.map.fitBounds(targetPolygon.getBounds(), { padding: [60, 60], maxZoom: 1.5 });
            targetPolygon.openPopup();
            this.highlightBuildingSidebar(idGedung);
        }
    },

    // Highlight item di sidebar
    highlightBuildingSidebar(idGedung) {
        document.querySelectorAll('.building-list-item').forEach(el => el.classList.remove('selected'));
        const el = document.getElementById(`sidebar-bld-${idGedung}`);
        if (el) {
            el.classList.add('selected');
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    },

    // Reset posisi peta (Center & Reset View)
    resetView() {
        if (this.map) {
            this.map.fitBounds(this.getBounds(), { padding: [10, 10], animate: true });
        }
    },

    // Kontrol Zoom In & Zoom Out
    zoomIn() {
        if (this.map) this.map.zoomIn();
    },

    zoomOut() {
        if (this.map) this.map.zoomOut();
    },

    // Buka Modal Detail Gedung Lengkap (Ketentuan Bagian 3)
    showBuildingDetailModal(idGedung) {
        idGedung = parseInt(idGedung);
        const g = UNIBA_GEDUNG_LIST.find(b => b.id_gedung === idGedung);
        if (!g) return;

        let modalEl = document.getElementById('modalDetailGedungLengkap');
        if (!modalEl) {
            // Buat modal dinamis jika belum ada di DOM
            const modalDiv = document.createElement('div');
            modalDiv.className = 'modal fade uniba-modal';
            modalDiv.id = 'modalDetailGedungLengkap';
            modalDiv.tabIndex = -1;
            modalDiv.innerHTML = `
                <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header border-bottom">
                            <div>
                                <span class="badge bg-success-subtle text-success mb-1" id="mdlBldBadge">Gedung Kampus</span>
                                <h5 class="modal-title fw-bold text-dark mb-0" id="mdlBldTitle">Detail Gedung</h5>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4" id="mdlBldBody">
                            <!-- Dimuat via JS -->
                        </div>
                        <div class="modal-footer border-top py-2 d-flex justify-content-between">
                            <button class="btn btn-success" id="mdlBldBtnDenah">
                                <i class="bi bi-diagram-3-fill me-1"></i>Buka Denah Gedung Ini
                            </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modalDiv);
            modalEl = modalDiv;
        }

        document.getElementById('mdlBldTitle').textContent = g.nama_gedung;
        document.getElementById('mdlBldBadge').textContent = `${g.alias} • ${g.jumlah_lantai} Lantai`;

        const bldDenahData = DENAH_SPASIAL_DATA[idGedung];
        let roomsCount = 0;
        let floorListHtml = '';
        if (bldDenahData && bldDenahData.lantai) {
            for (const fNum in bldDenahData.lantai) {
                const fl = bldDenahData.lantai[fNum];
                roomsCount += fl.ruangan.length;
                floorListHtml += `
                    <div class="p-2 border rounded-3 bg-light mb-2">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="fw-bold small text-dark"><i class="bi bi-layers me-1 text-success"></i>${fl.nama_lantai}</span>
                            <span class="badge bg-white text-secondary border">${fl.ruangan.length} Ruangan</span>
                        </div>
                        <small class="text-muted d-block mb-2">${fl.deskripsi || ''}</small>
                        <div class="d-flex flex-wrap gap-1">
                            ${fl.ruangan.map(r => `
                                <span class="badge bg-white text-dark border" style="font-size:0.72rem; cursor:pointer;" onclick="bootstrap.Modal.getInstance(document.getElementById('modalDetailGedungLengkap')).hide(); App.navigateToDenahGedung(${idGedung}, ${fNum}, ${r.id});" title="Klik untuk lihat di denah">
                                    ${r.kode} - ${r.nama}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        }

        const fasList = (g.fasilitas_utama || []).map(f => `
            <div class="col-6 col-md-4">
                <div class="p-2 border rounded-3 bg-light d-flex align-items-center gap-2">
                    <i class="bi bi-check2-circle text-success fs-5"></i>
                    <span class="small fw-semibold text-dark">${f}</span>
                </div>
            </div>
        `).join('');

        document.getElementById('mdlBldBody').innerHTML = `
            <div class="row g-4 mb-4">
                <div class="col-md-5">
                    <img src="${g.foto}" alt="${g.nama_gedung}" class="img-fluid rounded-4 shadow-sm border w-100" style="max-height: 240px; object-fit: cover;">
                </div>
                <div class="col-md-7">
                    <span class="badge bg-success-subtle text-success px-3 py-1 rounded-pill mb-2">${g.kategori}</span>
                    <h4 class="fw-bold text-dark mb-1">${g.nama_gedung}</h4>
                    <p class="text-muted small mb-3">${g.deskripsi}</p>
                    <div class="row g-2">
                        <div class="col-6">
                            <div class="p-2 border rounded-3 text-center bg-light">
                                <small class="text-muted d-block">Jumlah Lantai</small>
                                <span class="fw-bold fs-5 text-dark">${g.jumlah_lantai} Lantai</span>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-2 border rounded-3 text-center bg-light">
                                <small class="text-muted d-block">Total Ruangan</small>
                                <span class="fw-bold fs-5 text-success">${roomsCount || g.jumlah_ruangan} Ruangan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <h6 class="fw-bold text-dark mb-2"><i class="bi bi-star-fill text-warning me-1"></i>Fasilitas Utama Gedung:</h6>
                <div class="row g-2">${fasList}</div>
            </div>

            <div class="mb-2">
                <h6 class="fw-bold text-dark mb-2"><i class="bi bi-diagram-2 me-1 text-primary"></i>Daftar Lantai &amp; Ruangan:</h6>
                ${floorListHtml}
            </div>
        `;

        const btnDenah = document.getElementById('mdlBldBtnDenah');
        if (btnDenah) {
            btnDenah.onclick = () => {
                const bsModal = bootstrap.Modal.getInstance(modalEl);
                if (bsModal) bsModal.hide();
                App.navigateToDenahGedung(idGedung);
            };
        }

        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    },

    // Bottom Sheet Mobile saat gedung diklik pada layar kecil
    showMobileBuildingSheet(g) {
        if (window.innerWidth >= 768) return;

        let sheet = document.getElementById('uniba-mobile-bld-sheet');
        if (!sheet) {
            sheet = document.createElement('div');
            sheet.id = 'uniba-mobile-bld-sheet';
            sheet.className = 'uniba-mobile-bld-sheet';
            document.body.appendChild(sheet);
        }

        sheet.innerHTML = `
            <div class="mobile-sheet-header">
                <span class="sheet-drag-handle"></span>
                <button class="btn-close btn-sm" onclick="document.getElementById('uniba-mobile-bld-sheet').classList.remove('show');"></button>
            </div>
            <div class="d-flex gap-3 align-items-center mb-2">
                <img src="${g.foto}" alt="${g.nama_gedung}" style="width:65px; height:65px; border-radius:12px; object-fit:cover;" class="border">
                <div>
                    <span class="badge bg-success-subtle text-success small mb-1">${g.kategori}</span>
                    <h6 class="fw-bold mb-0 text-dark">${g.nama_gedung}</h6>
                    <small class="text-muted">${g.jumlah_lantai} Lantai &bull; ${g.jumlah_ruangan} Ruangan</small>
                </div>
            </div>
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-sm btn-success fw-bold flex-grow-1" onclick="document.getElementById('uniba-mobile-bld-sheet').classList.remove('show'); App.navigateToDenahGedung(${g.id_gedung});">
                    <i class="bi bi-diagram-3-fill me-1"></i>Lihat Denah
                </button>
                <button class="btn btn-sm btn-outline-success fw-semibold" onclick="document.getElementById('uniba-mobile-bld-sheet').classList.remove('show'); MapKampus.showBuildingDetailModal(${g.id_gedung});">
                    Detail
                </button>
                <button class="btn btn-sm btn-outline-dark fw-semibold" onclick="document.getElementById('uniba-mobile-bld-sheet').classList.remove('show'); MapKampus.openBuildingRoomSelector(${g.id_gedung});">
                    Rute
                </button>
            </div>
        `;

        sheet.classList.add('show');
    },

    // ===================================================================
    // FITUR RUTE SINGKAT (ALGORITMA DIJKSTRA)
    // ===================================================================

    // Menampilkan Rute Singkat di Peta Kampus
    showRoute(startId = 'gerbang_utama', targetId = 'akses_gedung_a', targetRoomObj = null) {
        if (!this.map) return;
        this.clearRoute();

        let route = null;
        if (targetRoomObj) {
            route = DijkstraRute.calculateRouteToRoom(startId, targetRoomObj);
        } else {
            route = DijkstraRute.findShortestPath(startId, targetId);
        }

        if (!route) {
            this.showRouteNotFoundNotification(startId, targetId, targetRoomObj);
            return;
        }

        this.activeRoute = route;

        // 1. Gambar Polyline Rute di atas Peta Spasial Lokal
        if (route.coordinates && route.coordinates.length >= 2) {
            // Glow effect outer line
            const glowLine = L.polyline(route.coordinates, {
                color: '#10b981',
                weight: 9,
                opacity: 0.5,
                lineCap: 'round',
                lineJoin: 'round'
            });

            // Inner directional stroke
            const mainLine = L.polyline(route.coordinates, {
                color: '#047857',
                weight: 4.5,
                opacity: 0.95,
                dashArray: '8, 8',
                className: 'leaflet-route-polyline'
            });

            this.routeLayer = L.featureGroup([glowLine, mainLine]).addTo(this.map);

            // Pasang Marker Titik Awal (Start: Pin Hijau)
            const startCoord = route.coordinates[0];
            const startNode = DijkstraRute.nodes[startId] || { nama: 'Titik Awal', label: 'Titik Awal' };
            const startIcon = L.divIcon({
                html: `<div style="background:#047857; color:#fff; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.3); border:2.5px solid #fff; font-size:14px; font-weight:800;">📍</div>`,
                className: 'route-start-pin',
                iconSize: [34, 34],
                iconAnchor: [17, 17]
            });
            const startMarker = L.marker(startCoord, { icon: startIcon })
                .bindPopup(`<b>Lokasi Awal:</b><br>${startNode.nama}`)
                .addTo(this.map);
            this.routeMarkers.push(startMarker);

            // Pasang Marker Titik Akhir Luar (End: Pin Target Emas)
            const endCoord = route.coordinates[route.coordinates.length - 1];
            const targetLabel = targetRoomObj
                ? `${targetRoomObj.nama_gedung} &bull; ${targetRoomObj.kode_ruangan || targetRoomObj.kode || ''} ${targetRoomObj.nama_ruangan || targetRoomObj.nama || ''}`
                : (DijkstraRute.nodes[targetId]?.nama || 'Tujuan');

            const endIcon = L.divIcon({
                html: `<div style="background:#d97706; color:#fff; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.3); border:2.5px solid #fff; font-size:14px; font-weight:800;">🎯</div>`,
                className: 'route-end-pin',
                iconSize: [34, 34],
                iconAnchor: [17, 17]
            });
            const endMarker = L.marker(endCoord, { icon: endIcon })
                .bindPopup(`<b>Tujuan:</b><br>${targetLabel}<br><small class="text-muted">Total Jarak: ± ${route.totalDistance}m</small>`)
                .addTo(this.map);
            this.routeMarkers.push(endMarker);

            // Pusatkan ke garis rute
            this.map.fitBounds(this.routeLayer.getBounds(), { padding: [60, 60], maxZoom: 2 });
        }

        // 2. Tampilkan Floating Route Info Panel di Peta Kampus
        const startNodeObj = DijkstraRute.nodes[startId] || { label: 'Titik Awal', nama: 'Titik Awal' };
        const targetLabel = targetRoomObj
            ? (targetRoomObj.kode_ruangan || targetRoomObj.kode || '') + ' - ' + (targetRoomObj.nama_ruangan || targetRoomObj.nama || '')
            : (DijkstraRute.nodes[targetId]?.nama || 'Tujuan');

        this.renderRouteFloatingCard(route, startNodeObj.label, targetLabel, targetRoomObj);
    },

    // Notifikasi jika tidak ada jalur
    showRouteNotFoundNotification(startId, targetId, targetRoomObj) {
        let panel = document.getElementById('map-route-floating-panel');
        if (!panel) return;
        panel.classList.remove('d-none');
        panel.innerHTML = `
            <div class="alert alert-warning mb-0 border-0 shadow-sm p-3 rounded-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="fw-bold text-dark mb-0"><i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>Jalur Belum Tersedia</h6>
                    <button class="btn-close btn-sm" onclick="MapKampus.clearRoute()"></button>
                </div>
                <p class="small text-muted mb-2">
                    Koneksi jalur spasial antara titik awal dan tujuan yang dipilih belum terdaftar dalam jaringan rute.
                </p>
                <button class="btn btn-sm btn-outline-secondary w-100" onclick="MapKampus.clearRoute()">Tutup</button>
            </div>
        `;
    },

    // Menghapus rute dari peta
    clearRoute() {
        if (this.routeLayer && this.map) {
            this.map.removeLayer(this.routeLayer);
            this.routeLayer = null;
        }
        if (this.routeMarkers.length && this.map) {
            this.routeMarkers.forEach(m => this.map.removeLayer(m));
            this.routeMarkers = [];
        }
        this.activeRoute = null;

        const floatingCard = document.getElementById('map-route-floating-panel');
        if (floatingCard) floatingCard.classList.add('d-none');
    },

    // Render Panel Informasi Hasil Navigasi (Sesuai Ketentuan Bagian 8)
    renderRouteFloatingCard(route, startName, targetName, targetRoomObj) {
        let panel = document.getElementById('map-route-floating-panel');
        if (!panel) return;

        panel.classList.remove('d-none');

        const stepBadges = route.steps.map((st, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === route.steps.length - 1;
            const cls = isFirst ? 'step-start' : (isLast ? 'step-end' : '');
            const num = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩'][idx] || `(${idx+1})`;
            return `<span class="route-step-badge ${cls}">${num} ${st}</span>`;
        }).join(' <span class="route-step-arrow">&rarr;</span> ');

        let bldName = targetRoomObj ? targetRoomObj.nama_gedung : targetName;
        let floorNum = targetRoomObj ? (targetRoomObj.id_lantai || targetRoomObj.nomor_lantai || 1) : 1;
        let rCode = targetRoomObj ? (targetRoomObj.kode_ruangan || targetRoomObj.kode || '') : '';
        let rName = targetRoomObj ? (targetRoomObj.nama_ruangan || targetRoomObj.nama || '') : '';
        let safeRoomName = (rCode ? rCode + ' - ' : '') + rName;

        const stepGuidesHtml = (route.stepGuides && route.stepGuides.length)
            ? `<div class="bg-white p-2 rounded-3 border mb-2">
                <div class="small fw-bold text-success mb-1"><i class="bi bi-signpost-split me-1"></i>Petunjuk Perjalanan Bertahap:</div>
                <ol class="small text-muted mb-0 ps-3" style="line-height: 1.55;">
                    ${route.stepGuides.map(g => `<li class="mb-1">${g}</li>`).join('')}
                </ol>
               </div>`
            : '';

        let bldId = targetRoomObj ? targetRoomObj.id_gedung : (route.pathNodes && route.pathNodes.length ? route.pathNodes[route.pathNodes.length - 1].gedung_id || 1 : 1);
        const rId = targetRoomObj ? (targetRoomObj.id || targetRoomObj.id_ruangan || 0) : 0;

        const actionButtonsHtml = `
            <div class="row g-2 pt-2 border-top">
                <div class="col-6">
                    <button class="btn btn-sm btn-primary fw-semibold w-100 shadow-sm" onclick="MapKampus.focusOnRoute()" title="Pusatkan Tampilan Garis Rute di Peta">
                        <i class="bi bi-eye-fill me-1"></i>Lihat Rute
                    </button>
                </div>
                <div class="col-6">
                    <button class="btn btn-sm btn-outline-danger fw-semibold w-100 shadow-sm" onclick="MapKampus.clearRoute()" title="Hapus Garis Rute dari Peta">
                        <i class="bi bi-x-circle-fill me-1"></i>Hapus Rute
                    </button>
                </div>
                <div class="col-6">
                    <button class="btn btn-sm btn-success fw-semibold w-100 shadow-sm" onclick="App.navigateToDenahGedung(${bldId}, ${floorNum}, ${rId}, { routeStart: '${startName.replace(/'/g, "\\'")}', roomName: '${safeRoomName.replace(/'/g, "\\'")}' })" title="Buka Denah Gedung &amp; Sorot Ruangan">
                        <i class="bi bi-diagram-3-fill me-1"></i>Kembali ke Denah
                    </button>
                </div>
                <div class="col-6">
                    ${targetRoomObj ? `
                    <button class="btn btn-sm btn-outline-success fw-semibold w-100 shadow-sm" onclick="MapDenah.showRoomDetailModal(MapDenah.findRoomObject(${rId}))" title="Buka Informasi Lengkap Ruangan">
                        <i class="bi bi-info-circle-fill me-1"></i>Detail Ruangan
                    </button>
                    ` : `
                    <button class="btn btn-sm btn-outline-success fw-semibold w-100 shadow-sm" onclick="MapKampus.showBuildingDetailModal(${bldId})" title="Buka Informasi Lengkap Gedung">
                        <i class="bi bi-info-circle-fill me-1"></i>Detail Gedung
                    </button>
                    `}
                </div>
            </div>
        `;

        panel.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <span class="badge bg-success-subtle text-success mb-1" style="font-size:0.72rem;">Hasil Navigasi &bull; Algoritma Dijkstra</span>
                    <h6 class="fw-bold mb-0 text-dark">${startName} &rarr; ${targetRoomObj ? safeRoomName : targetName}</h6>
                </div>
                <button class="btn-close btn-sm" onclick="MapKampus.clearRoute()" title="Tutup Panel Rute"></button>
            </div>

            <!-- Rincian Identitas Navigasi -->
            <div class="route-summary-grid bg-white p-2 rounded-3 border mb-2">
                <div class="row g-2 small">
                    <div class="col-6">
                        <span class="text-muted d-block" style="font-size:0.72rem;">Lokasi Awal:</span>
                        <span class="fw-bold text-dark">📍 ${startName}</span>
                    </div>
                    <div class="col-6">
                        <span class="text-muted d-block" style="font-size:0.72rem;">Gedung Tujuan:</span>
                        <span class="fw-bold text-dark">🏢 ${bldName}</span>
                    </div>
                    ${targetRoomObj ? `
                    <div class="col-6">
                        <span class="text-muted d-block" style="font-size:0.72rem;">Lantai:</span>
                        <span class="fw-bold text-dark">📶 Lantai ${floorNum}</span>
                    </div>
                    <div class="col-6">
                        <span class="text-muted d-block" style="font-size:0.72rem;">Ruangan Tujuan:</span>
                        <span class="fw-bold text-success">🎯 ${safeRoomName}</span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <div class="d-flex gap-3 text-muted small py-2 border-top border-bottom mb-2 flex-wrap">
                <span><i class="bi bi-signpost-2-fill text-success me-1"></i>Jarak: <b>± ${route.totalDistance} meter</b></span>
                <span><i class="bi bi-clock-fill text-warning me-1"></i>Estimasi: <b>± ${route.estimatedMinutes} menit</b></span>
                <span><i class="bi bi-geo-alt-fill text-primary me-1"></i><b>${route.steps.length} Titik Jalur</b></span>
            </div>

            ${stepGuidesHtml}

            <div class="small text-muted mb-2">
                <span class="fw-bold d-block mb-1 text-dark" style="font-size:0.74rem;">Urutan Perjalanan (${route.steps.length} Titik):</span>
                <div class="d-flex flex-wrap align-items-center gap-1" style="max-height: 55px; overflow-y: auto;">
                    ${stepBadges}
                </div>
            </div>

            ${actionButtonsHtml}
        `;
    },

    // Fokuskan peta ke garis rute (fitBounds)
    focusOnRoute() {
        if (this.routeLayer && this.map) {
            this.map.fitBounds(this.routeLayer.getBounds(), { padding: [60, 60], maxZoom: 2 });
            if (this.routeMarkers && this.routeMarkers.length > 1) {
                this.routeMarkers[this.routeMarkers.length - 1].openPopup();
            }
        }
    },

    // Modal Pemilihan Ruangan & Navigasi Rute
    openBuildingRoomSelector(idGedung) {
        idGedung = parseInt(idGedung);
        this.currentSelectedBuildingId = idGedung;

        const bldData = DENAH_SPASIAL_DATA[idGedung];
        if (!bldData) return;

        const modalEl = document.getElementById('modalPilihRuanganGedung');
        if (!modalEl) return;

        const titleEl = document.getElementById('modalPilihGedungTitle');
        const badgeEl = document.getElementById('modalPilihGedungBadge');
        const openDenahBtn = document.getElementById('modalPilihGedungBtnOpenDenah');

        if (titleEl) titleEl.textContent = `Pilih Ruangan & Navigasi - ${bldData.nama_gedung}`;
        if (badgeEl) badgeEl.textContent = `${bldData.alias} • ${Object.keys(bldData.lantai).length} Lantai`;
        if (openDenahBtn) {
            openDenahBtn.onclick = () => {
                const bsModal = bootstrap.Modal.getInstance(modalEl);
                if (bsModal) bsModal.hide();
                App.navigateToDenahGedung(idGedung);
            };
        }

        const filterSelect = document.getElementById('modalPilihGedungFilterLantai');
        if (filterSelect) {
            let options = '<option value="">Semua Lantai</option>';
            const floorKeys = Object.keys(bldData.lantai).sort((a, b) => parseInt(a) - parseInt(b));
            floorKeys.forEach(fNum => {
                options += `<option value="${fNum}">${bldData.lantai[fNum].nama_lantai}</option>`;
            });
            filterSelect.innerHTML = options;
            filterSelect.value = '';
        }

        this.renderBuildingRoomsInModal(bldData, '');

        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    },

    filterBuildingRoomsModal(floorNum) {
        if (!this.currentSelectedBuildingId) return;
        const bldData = DENAH_SPASIAL_DATA[this.currentSelectedBuildingId];
        if (!bldData) return;
        this.renderBuildingRoomsInModal(bldData, floorNum);
    },

    renderBuildingRoomsInModal(bldData, filterFloor) {
        const container = document.getElementById('modalPilihGedungRoomsList');
        if (!container) return;

        let html = '';
        const floorKeys = Object.keys(bldData.lantai).sort((a, b) => parseInt(a) - parseInt(b));

        let roomCount = 0;
        floorKeys.forEach(fNum => {
            if (filterFloor && String(fNum) !== String(filterFloor)) return;

            const fl = bldData.lantai[fNum];
            fl.ruangan.forEach(r => {
                roomCount++;
                const colors = ROOM_TYPE_COLORS[r.jenis] || ROOM_TYPE_COLORS['Ruang Kelas'];
                html += `
                    <div class="col-12 col-md-6">
                        <div class="p-3 border rounded-3 bg-white h-100 d-flex flex-column justify-content-between shadow-xs">
                            <div>
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <span class="badge ${colors.badge}" style="font-size:0.72rem;">${r.jenis}</span>
                                    <span class="badge bg-light text-secondary border" style="font-size:0.72rem;">${fl.nama_lantai}</span>
                                </div>
                                <h6 class="fw-bold text-dark mb-1">${r.kode} - ${r.nama}</h6>
                                <p class="small text-muted mb-2"><i class="bi bi-people me-1"></i>Kapasitas: ${r.kapasitas} orang</p>
                            </div>
                            <div class="d-flex gap-1 pt-2 border-top">
                                <button class="btn btn-sm btn-success flex-grow-1 fw-bold" onclick="MapKampus.selectRoomForRoute(${this.currentSelectedBuildingId}, ${fNum}, ${r.id})">
                                    <i class="bi bi-signpost-2-fill me-1"></i>Tampilkan Rute
                                </button>
                                <button class="btn btn-sm btn-outline-success" onclick="MapKampus.navigateToDenahFromSelector(${this.currentSelectedBuildingId}, ${fNum}, ${r.id})" title="Lihat Denah">
                                    <i class="bi bi-diagram-3"></i> Denah
                                </button>
                                <button class="btn btn-sm btn-outline-secondary" onclick="MapKampus.openRoomDetailFromSelector(${r.id})" title="Detail Ruangan">
                                    <i class="bi bi-info-circle"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        });

        if (roomCount === 0) {
            html = `<div class="col-12 text-center py-4 text-muted small">Tidak ada ruangan pada lantai ini.</div>`;
        }

        container.innerHTML = html;
    },

    selectRoomForRoute(idGedung, floorNum, roomId) {
        const modalEl = document.getElementById('modalPilihRuanganGedung');
        if (modalEl) {
            const bsModal = bootstrap.Modal.getInstance(modalEl);
            if (bsModal) bsModal.hide();
        }

        const startSelect = document.getElementById('modalPilihGedungStartPoint');
        const startId = startSelect ? startSelect.value : 'gerbang_utama';

        const roomObj = MapDenah.findRoomObject(roomId);
        if (roomObj) {
            this.showRoute(startId, null, roomObj);
        }
    },

    navigateToDenahFromSelector(idGedung, floorNum, roomId) {
        const modalEl = document.getElementById('modalPilihRuanganGedung');
        if (modalEl) {
            const bsModal = bootstrap.Modal.getInstance(modalEl);
            if (bsModal) bsModal.hide();
        }
        App.navigateToDenahGedung(idGedung, floorNum, roomId);
    },

    openRoomDetailFromSelector(roomId) {
        const roomObj = MapDenah.findRoomObject(roomId);
        if (roomObj) {
            MapDenah.showRoomDetailModal(roomObj);
        }
    },

    openQuickRouteModal() {
        this.openBuildingRoomSelector(this.currentSelectedBuildingId || 1);
    }
};
