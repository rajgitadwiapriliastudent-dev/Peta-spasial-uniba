/**
 * Controller Denah 2D Top-View Interaktif Gedung & Ruangan
 * Sistem Informasi Spasial UNIBA Madura
 */

const MapDenah = {
    currentBuildingId: 1,
    currentFloorNumber: 1,
    currentFloorData: null,
    selectedRoomId: null,

    // Muat Gedung & Lantai Pertama
    async loadBuilding(idGedung, targetFloorNumber = 1, targetRoomId = null, routeInfo = null) {
        idGedung = parseInt(idGedung);
        this.currentBuildingId = idGedung;
        this.currentFloorNumber = parseInt(targetFloorNumber);
        this.selectedRoomId = targetRoomId ? parseInt(targetRoomId) : null;

        const bldData = DENAH_SPASIAL_DATA[idGedung];
        if (!bldData) {
            console.error('Data denah gedung tidak ditemukan untuk ID:', idGedung);
            return;
        }

        // 1. Update Header Denah
        const bldTitle = document.getElementById('denah-building-title');
        const bldSub = document.getElementById('denah-building-subtitle');
        if (bldTitle) bldTitle.textContent = bldData.nama_gedung;
        if (bldSub) bldSub.textContent = bldData.alias;

        // 2. Render Panel Informasi Gedung Samping
        this.renderBuildingInfoPanel(bldData);

        // 3. Render Tombol Pilihan Lantai (Lantai 1, 2, 3, 4)
        this.renderFloorTabs(bldData);

        // 4. Render Denah Lantai Aktif
        this.renderFloorPlan(this.currentFloorNumber);

        // 5. Render Banner Kedatangan Navigasi (Jika ada target ruangan)
        this.renderNavigationArrivalBanner(targetRoomId, routeInfo);
    },

    // Render Banner Kedatangan Navigasi
    renderNavigationArrivalBanner(roomId, routeInfo) {
        const container = document.getElementById('denah-arrival-banner-container');
        if (!container) return;

        if (!roomId && !routeInfo) {
            container.innerHTML = '';
            return;
        }

        const room = this.findRoomObject(roomId);
        const roomLabel = room ? `${room.kode} - ${room.nama}` : (routeInfo?.roomName || 'Ruangan Tujuan');
        const bldName = room ? room.nama_gedung : (DENAH_SPASIAL_DATA[this.currentBuildingId]?.nama_gedung || 'Gedung');

        container.innerHTML = `
            <div class="alert alert-success d-flex align-items-center justify-content-between p-3 mb-3 border-0 shadow-sm rounded-3 flex-wrap gap-2" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 5px solid #047857 !important;">
                <div class="d-flex align-items-center gap-3">
                    <div class="bg-success text-white p-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width:42px; height:42px;">
                        <i class="bi bi-geo-alt-fill fs-5"></i>
                    </div>
                    <div>
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge bg-success">Tiba di Ruangan Tujuan</span>
                            <span class="small text-muted">${bldName} &bull; Lantai ${this.currentFloorNumber}</span>
                        </div>
                        <h6 class="fw-bold text-dark mb-0 mt-1">${roomLabel}</h6>
                        <small class="text-success-emphasis">Ruangan telah disorot pada denah dengan border hijau berpendar (pulsing) dan pin target 🎯.</small>
                    </div>
                </div>
                <div class="d-flex gap-2 align-items-center">
                    ${room ? `<button class="btn btn-sm btn-success fw-semibold" onclick="MapDenah.onRoomClick(${room.id})"><i class="bi bi-info-circle me-1"></i>Detail Ruangan</button>` : ''}
                    <button class="btn btn-sm btn-outline-secondary" onclick="document.getElementById('denah-arrival-banner-container').innerHTML = '';" title="Tutup Notifikasi">&times;</button>
                </div>
            </div>
        `;
    },

    // Render Panel Informasi Gedung (Kanan)
    renderBuildingInfoPanel(bldData) {
        const container = document.getElementById('denah-building-info-container');
        if (!container) return;

        // Ambil info gedung dari GeoJSON/DataStore
        const geoFeature = UNIBA_GEDUNG_GEOJSON.features.find(f => f.properties.id_gedung === this.currentBuildingId);
        const foto = geoFeature ? geoFeature.properties.foto : 'assets/img/buildings/gedung_deramista.svg';
        const kategori = geoFeature ? geoFeature.properties.kategori : 'Akademik';
        const deskripsi = geoFeature ? geoFeature.properties.deskripsi : '';
        const fasilitas = geoFeature ? geoFeature.properties.fasilitas_utama : ['AC', 'Wi-Fi Kampus', 'Toilet', 'Akses Tangga/Lift'];

        let fasListHtml = fasilitas.map(f => `
            <span class="badge bg-light text-dark border p-2"><i class="bi bi-check-circle text-success me-1"></i>${f}</span>
        `).join('');

        // Hitung total ruangan di semua lantai
        let totalRuangan = 0;
        let totalLantai = Object.keys(bldData.lantai).length;
        for (const fl in bldData.lantai) {
            totalRuangan += bldData.lantai[fl].ruangan.length;
        }

        container.innerHTML = `
            <div class="building-summary-card mb-4">
                <img src="${foto}" alt="${bldData.nama_gedung}">
                <div class="building-summary-body">
                    <span class="badge bg-success-subtle text-success mb-2">${kategori}</span>
                    <h5 class="fw-bold mb-1">${bldData.nama_gedung}</h5>
                    <p class="small text-muted mb-3">${deskripsi}</p>

                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <div class="p-2 border rounded text-center bg-light">
                                <span class="d-block text-muted small">Total Lantai</span>
                                <span class="fw-bold fs-5 text-dark">${totalLantai} Lantai</span>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-2 border rounded text-center bg-light">
                                <span class="d-block text-muted small">Total Ruangan</span>
                                <span class="fw-bold fs-5 text-success">${totalRuangan} Ruang</span>
                            </div>
                        </div>
                    </div>

                    <h6 class="fw-bold small text-muted text-uppercase mb-2">Daftar Fasilitas Gedung</h6>
                    <div class="d-flex flex-wrap gap-1 mb-0">
                        ${fasListHtml}
                    </div>
                </div>
            </div>

            <!-- List Ruangan di Lantai Aktif -->
            <div class="floor-rooms-list-card">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="fw-bold mb-0">Ruangan di <span id="current-floor-label" class="text-success">Lantai ${this.currentFloorNumber}</span></h6>
                    <span class="badge bg-primary-subtle text-primary" id="current-floor-room-count">0 Ruang</span>
                </div>
                <input type="text" class="form-control form-control-sm mb-2" id="floor-room-search-input" placeholder="Cari ruangan di lantai ini..." oninput="MapDenah.filterFloorRooms(this.value)">
                <div class="room-items-container" id="floor-rooms-list-items">
                    <!-- Dinamis via JS -->
                </div>
            </div>
        `;
    },

    // Render Tombol Pilihan Lantai
    renderFloorTabs(bldData) {
        const container = document.getElementById('denah-floor-tabs-container');
        if (!container) return;

        let html = '';
        const floorKeys = Object.keys(bldData.lantai).sort((a, b) => parseInt(a) - parseInt(b));

        floorKeys.forEach(fNum => {
            const fData = bldData.lantai[fNum];
            const isActive = parseInt(fNum) === this.currentFloorNumber ? 'active' : '';
            html += `
                <button class="btn-floor-pill ${isActive}" onclick="MapDenah.switchFloor(${fNum})">
                    <i class="bi bi-layers me-1"></i>${fData.nama_lantai}
                </button>
            `;
        });

        container.innerHTML = html;
    },

    // Berpindah Lantai
    switchFloor(fNum) {
        this.currentFloorNumber = parseInt(fNum);
        const bldData = DENAH_SPASIAL_DATA[this.currentBuildingId];
        if (!bldData) return;

        this.renderFloorTabs(bldData);
        this.renderFloorPlan(this.currentFloorNumber);

        // Update panel samping
        const label = document.getElementById('current-floor-label');
        if (label) label.textContent = `Lantai ${this.currentFloorNumber}`;
    },

    // Render Denah 2D Top-View SVG Canvas
    renderFloorPlan(floorNumber) {
        const bldData = DENAH_SPASIAL_DATA[this.currentBuildingId];
        if (!bldData || !bldData.lantai[floorNumber]) return;

        const flData = bldData.lantai[floorNumber];
        this.currentFloorData = flData;

        const svgContainer = document.getElementById('denah-svg-canvas');
        if (!svgContainer) return;

        const W = flData.lebar_canvas || 800;
        const H = flData.tinggi_canvas || 480;

        // Gambar denah arsitektural 2D
        let svg = `
            <svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="background:#faf8f5;">
                <defs>
                    <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" stroke-width="0.8"/>
                    </pattern>
                    <filter id="roomShadow" x="-5%" y="-5%" width="110%" height="110%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1"/>
                    </filter>
                </defs>

                <!-- Grid Arsitektural Belakang -->
                <rect width="${W}" height="${H}" fill="url(#gridPattern)"/>

                <!-- Dinding Luar Bangunan -->
                <rect x="25" y="25" width="${W - 50}" height="${H - 50}" rx="14" fill="#ffffff" stroke="#94a3b8" stroke-width="4"/>

                <!-- Koridor / Lorong Utama -->
                <rect x="40" y="200" width="${W - 80}" height="60" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>
                <text x="${W / 2}" y="235" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#94a3b8" text-anchor="middle" letter-spacing="3">
                    &larr; KORIDOR UTAMA LANTAI ${floorNumber} &rarr;
                </text>

                <!-- Ruangan-ruangan Interaktif -->
                <g id="svg-rooms-group">
        `;

        flData.ruangan.forEach(r => {
            const colors = ROOM_TYPE_COLORS[r.jenis] || ROOM_TYPE_COLORS['Ruang Kelas'];
            const isSelected = this.selectedRoomId === r.id;
            const extraClass = isSelected ? 'active-selected' : '';

            svg += `
                <g class="room-interactive-item" id="room-g-${r.id}" onclick="MapDenah.onRoomClick(${r.id})">
                    <!-- Area Ruangan (Polygon / Rect) -->
                    <rect 
                        class="room-polygon ${extraClass}" 
                        id="room-rect-${r.id}"
                        x="${r.x}" 
                        y="${r.y}" 
                        width="${r.w}" 
                        height="${r.h}" 
                        rx="8" 
                        fill="${colors.fill}" 
                        stroke="${colors.stroke}" 
                        stroke-width="2.5"
                        filter="url(#roomShadow)"
                    />

                    <!-- Indikator Pintu Masuk Ruangan -->
                    <rect x="${r.x + (r.w / 2) - 15}" y="${r.y > 200 ? r.y - 3 : r.y + r.h - 3}" width="30" height="6" fill="#047857" rx="2" />

                    <!-- Label Ruangan -->
                    <text class="room-code-text" x="${r.x + (r.w / 2)}" y="${r.y + 24}">
                        ${r.kode}
                    </text>
                    <text class="room-label-text" x="${r.x + (r.w / 2)}" y="${r.y + 44}">
                        ${this.truncateText(r.nama, 22)}
                    </text>
                    <text x="${r.x + (r.w / 2)}" y="${r.y + r.h - 16}" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="600" fill="#64748b" text-anchor="middle">
                        <tspan fill="${colors.stroke}">&bull;</tspan> Kapasitas ${r.kapasitas} org
                    </text>

                    ${isSelected ? `
                    <!-- Target Pin Marker Navigasi -->
                    <g transform="translate(${r.x + (r.w / 2)}, ${r.y + (r.h / 2) + 2})">
                        <circle cx="0" cy="0" r="16" fill="#10b981" opacity="0.4">
                            <animate attributeName="r" values="12;20;12" dur="1.6s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.6s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx="0" cy="0" r="9" fill="#047857" stroke="#ffffff" stroke-width="2"/>
                        <text x="0" y="3.5" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="800" fill="#ffffff" text-anchor="middle">🎯</text>
                    </g>
                    ` : ''}
                </g>
            `;
        });

        // Simbol Arah Mata Angin
        svg += `
                </g>
                <!-- Kompas / Arah Utara -->
                <g transform="translate(${W - 70}, 45)">
                    <circle cx="20" cy="20" r="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
                    <polygon points="20,6 25,20 15,20" fill="#ef4444"/>
                    <polygon points="20,34 25,20 15,20" fill="#64748b"/>
                    <text x="20" y="4" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" fill="#ef4444" text-anchor="middle">U</text>
                </g>
            </svg>
        `;

        svgContainer.innerHTML = svg;

        // Update list ruangan di panel samping
        this.renderFloorRoomsList(flData.ruangan);
    },

    // Render Daftar Ruangan di Panel Samping
    renderFloorRoomsList(rooms) {
        const countBadge = document.getElementById('current-floor-room-count');
        if (countBadge) countBadge.textContent = `${rooms.length} Ruangan`;

        const container = document.getElementById('floor-rooms-list-items');
        if (!container) return;

        let html = '';
        rooms.forEach(r => {
            const colors = ROOM_TYPE_COLORS[r.jenis] || ROOM_TYPE_COLORS['Ruang Kelas'];
            const isSelected = this.selectedRoomId === r.id ? 'selected' : '';
            html += `
                <div class="floor-room-item ${isSelected}" id="list-room-${r.id}" onclick="MapDenah.onRoomClick(${r.id})">
                    <div class="d-flex align-items-center gap-2">
                        <span style="width:10px; height:10px; border-radius:50%; background-color:${colors.stroke};"></span>
                        <div>
                            <span class="fw-bold d-block small text-dark">${r.kode} - ${r.nama}</span>
                            <span class="text-muted" style="font-size:0.75rem;">${r.jenis} &bull; Kapasitas ${r.kapasitas}</span>
                        </div>
                    </div>
                    <i class="bi bi-chevron-right text-muted small"></i>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // Filter pencarian ruangan di lantai ini
    filterFloorRooms(keyword) {
        if (!this.currentFloorData) return;
        const q = keyword.toLowerCase().trim();
        const filtered = this.currentFloorData.ruangan.filter(r =>
            r.nama.toLowerCase().includes(q) ||
            r.kode.toLowerCase().includes(q) ||
            r.jenis.toLowerCase().includes(q)
        );
        this.renderFloorRoomsList(filtered);
    },

    // Helper truncate teks label
    truncateText(str, maxLen) {
        if (!str) return '';
        return str.length > maxLen ? str.substring(0, maxLen) + '...' : str;
    },

    // ==========================================
    // INTERAKSI DENAH: USER KLIK RUANGAN
    // ==========================================
    onRoomClick(roomId) {
        roomId = parseInt(roomId);
        this.selectedRoomId = roomId;

        // 1. Highlight visual pada denah SVG
        document.querySelectorAll('.room-polygon').forEach(el => el.classList.remove('active-selected'));
        const targetRect = document.getElementById(`room-rect-${roomId}`);
        if (targetRect) targetRect.classList.add('active-selected');

        // 2. Highlight visual pada panel daftar ruangan samping
        document.querySelectorAll('.floor-room-item').forEach(el => el.classList.remove('selected'));
        const targetListItem = document.getElementById(`list-room-${roomId}`);
        if (targetListItem) targetListItem.classList.add('selected');

        // 3. Ambil data ruangan dan BUKA DETAIL RUANGAN LENGKAP
        const roomObj = this.findRoomObject(roomId);
        if (roomObj) {
            this.showRoomDetailModal(roomObj);
        }
    },

    // Cari objek ruangan di semua lantai/gedung
    findRoomObject(roomId) {
        roomId = parseInt(roomId);
        for (const gId in DENAH_SPASIAL_DATA) {
            const bld = DENAH_SPASIAL_DATA[gId];
            for (const fNum in bld.lantai) {
                const fl = bld.lantai[fNum];
                const found = fl.ruangan.find(r => r.id === roomId);
                if (found) {
                    return {
                        ...found,
                        id_gedung: parseInt(gId),
                        id_lantai: parseInt(fNum),
                        nama_gedung: bld.nama_gedung,
                        alias_gedung: bld.alias,
                        nama_lantai: fl.nama_lantai
                    };
                }
            }
        }
        return null;
    },

    // Buka Modal Detail Ruangan Lengkap
    showRoomDetailModal(r) {
        const modalEl = document.getElementById('roomDetailModal');
        if (!modalEl) return;

        const colors = ROOM_TYPE_COLORS[r.jenis] || ROOM_TYPE_COLORS['Ruang Kelas'];

        // Populate elemen modal
        document.getElementById('modal-room-photo').src = r.foto || 'assets/img/rooms/kelas_standar.svg';
        document.getElementById('modal-room-name').textContent = r.nama;
        document.getElementById('modal-room-code').textContent = r.kode;
        
        const typeBadge = document.getElementById('modal-room-type');
        typeBadge.textContent = r.jenis;
        typeBadge.className = `badge ${colors.badge} fs-6 px-3 py-2`;

        document.getElementById('modal-room-location').textContent = `${r.nama_gedung} &mdash; ${r.nama_lantai}`;
        document.getElementById('modal-room-capacity').textContent = `${r.kapasitas} Orang`;
        document.getElementById('modal-room-pic').textContent = r.pic || 'Koordinator Sarpras Gedung';
        document.getElementById('modal-room-hours').textContent = r.jam || '07.30 - 17.00 WIB';
        document.getElementById('modal-room-description').textContent = r.deskripsi || '-';

        // Fasilitas chips
        const fasList = r.fasilitas ? r.fasilitas.split(',').map(s => s.trim()) : ['AC', 'Papan Tulis', 'Meja Kursi'];
        const fasContainer = document.getElementById('modal-room-facilities');
        if (fasContainer) {
            fasContainer.innerHTML = fasList.map(f => `
                <div class="col-6 col-md-4">
                    <div class="p-2 border rounded-3 bg-light d-flex align-items-center gap-2">
                        <i class="bi bi-check2-circle text-success fs-5"></i>
                        <span class="small fw-semibold text-dark">${f}</span>
                    </div>
                </div>
            `).join('');
        }

        // Action buttons
        const btnMap = document.getElementById('modal-btn-view-map');
        if (btnMap) {
            btnMap.onclick = () => {
                const bsModal = bootstrap.Modal.getInstance(modalEl);
                if (bsModal) bsModal.hide();
                App.navigateToCampusMap(r.id_gedung);
            };
        }

        const btnDenah = document.getElementById('modal-btn-view-denah');
        if (btnDenah) {
            btnDenah.onclick = () => {
                const bsModal = bootstrap.Modal.getInstance(modalEl);
                if (bsModal) bsModal.hide();
                App.navigateToDenahGedung(r.id_gedung, r.id_lantai, r.id);
            };
        }

        const btnRoute = document.getElementById('modal-btn-view-route');
        if (btnRoute) {
            btnRoute.onclick = () => {
                const bsModal = bootstrap.Modal.getInstance(modalEl);
                if (bsModal) bsModal.hide();
                App.navigateTo('map-kampus', {
                    routeStart: 'gerbang_utama',
                    routeRoom: r
                });
            };
        }

        // Tampilkan Modal Bootstrap
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
};
