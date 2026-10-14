/**
 * Controller Admin Dashboard & CRUD Manajemen Data Kampus UNIBA
 */

const AdminApp = {
    currentUser: null,
    currentTab: 'gedung',

    // Cek Sesi Login Admin
    checkSession() {
        const sessionStr = localStorage.getItem('uniba_admin_session');
        if (sessionStr) {
            this.currentUser = JSON.parse(sessionStr);
            this.updateAdminHeader();
            return true;
        }
        return false;
    },

    updateAdminHeader() {
        const nameEl = document.getElementById('admin-logged-name');
        if (nameEl && this.currentUser) {
            nameEl.textContent = this.currentUser.nama_lengkap || this.currentUser.username;
        }
    },

    // Proses Login
    async handleLogin(username, password) {
        const result = await DataStore.adminLogin(username, password);
        if (result.success) {
            this.currentUser = result.data;
            this.updateAdminHeader();
            App.navigateTo('admin-dashboard');
            this.initDashboard();
            return { success: true };
        } else {
            return { success: false, message: result.message };
        }
    },

    // Logout
    logout() {
        localStorage.removeItem('uniba_admin_session');
        this.currentUser = null;
        App.navigateTo('admin-login');
    },

    // Inisialisasi Dashboard Admin
    async initDashboard() {
        if (!this.checkSession()) {
            App.navigateTo('admin-login');
            return;
        }

        // 1. Update Statistik Ringkasan
        const gedungs = await DataStore.getGedungs();
        const ruangans = await DataStore.getRuangans();
        const fasilitas = await DataStore.getFasilitas();
        const beritas = await DataStore.getBerita();

        let totalLantai = 0;
        for (const gId in DENAH_SPASIAL_DATA) {
            totalLantai += Object.keys(DENAH_SPASIAL_DATA[gId].lantai).length;
        }

        document.getElementById('stat-total-gedung').textContent = gedungs.length;
        document.getElementById('stat-total-lantai').textContent = totalLantai || 18;
        document.getElementById('stat-total-ruangan').textContent = ruangans.length;
        document.getElementById('stat-total-fasilitas').textContent = fasilitas.length;

        // 2. Render Tabel Menu Aktif
        this.switchTab(this.currentTab);
    },

    // Berpindah Tab Admin
    switchTab(tabName) {
        this.currentTab = tabName;
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
        });

        document.querySelectorAll('.admin-tab-pane').forEach(pane => {
            pane.classList.add('d-none');
        });

        const activePane = document.getElementById(`pane-${tabName}`);
        if (activePane) activePane.classList.remove('d-none');

        if (tabName === 'gedung') this.renderGedungTable();
        else if (tabName === 'ruangan') this.renderRuanganTable();
        else if (tabName === 'fasilitas') this.renderFasilitasTable();
        else if (tabName === 'berita') this.renderBeritaTable();
        else if (tabName === 'denah') this.renderDenahEditor();
        else if (tabName === 'rute') this.renderRuteManager();
    },

    // ==========================================
    // 1. KELOLA GEDUNG
    // ==========================================
    async renderGedungTable() {
        const tbody = document.getElementById('table-admin-gedung-tbody');
        if (!tbody) return;

        const gedungs = await DataStore.getGedungs();
        let html = '';
        gedungs.forEach((g, idx) => {
            html += `
                <tr>
                    <td class="text-center">${idx + 1}</td>
                    <td class="fw-bold text-success">${g.kode_gedung}</td>
                    <td class="fw-semibold">${g.nama_gedung}</td>
                    <td>${g.kategori}</td>
                    <td>${g.jumlah_lantai} Lantai</td>
                    <td>${g.total_ruangan || 20} Ruang</td>
                    <td><span class="badge" style="background-color:${g.warna_peta || '#059669'}">${g.warna_peta || '#059669'}</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="AdminApp.editGedung(${g.id_gedung})">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="AdminApp.deleteGedung(${g.id_gedung})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    openAddGedungModal() {
        document.getElementById('formGedung').reset();
        document.getElementById('formGedungId').value = '';
        document.getElementById('modalGedungTitle').textContent = 'Tambah Gedung Baru';
        new bootstrap.Modal(document.getElementById('modalFormGedung')).show();
    },

    async editGedung(id) {
        const g = await DataStore.getGedungById(id);
        if (!g) return;

        document.getElementById('formGedungId').value = g.id_gedung;
        document.getElementById('formGedungKode').value = g.kode_gedung;
        document.getElementById('formGedungNama').value = g.nama_gedung;
        document.getElementById('formGedungAlias').value = g.alias || '';
        document.getElementById('formGedungKategori').value = g.kategori || 'Akademik';
        document.getElementById('formGedungLantai').value = g.jumlah_lantai || 1;
        document.getElementById('formGedungWarna').value = g.warna_peta || '#059669';
        document.getElementById('formGedungDeskripsi').value = g.deskripsi || '';
        if (document.getElementById('formGedungFoto')) {
            document.getElementById('formGedungFoto').value = g.foto || '';
        }
        if (document.getElementById('formGedungFasilitas')) {
            document.getElementById('formGedungFasilitas').value = g.fasilitas || '';
        }

        document.getElementById('modalGedungTitle').textContent = 'Edit Data Gedung';
        new bootstrap.Modal(document.getElementById('modalFormGedung')).show();
    },

    async submitGedungForm() {
        const id = document.getElementById('formGedungId').value;
        const fotoVal = document.getElementById('formGedungFoto')?.value || 'assets/img/buildings/gedung_deramista.svg';
        const fasilitasVal = document.getElementById('formGedungFasilitas')?.value || '';
        const data = {
            id_gedung: id ? parseInt(id) : null,
            kode_gedung: document.getElementById('formGedungKode').value,
            nama_gedung: document.getElementById('formGedungNama').value,
            alias: document.getElementById('formGedungAlias').value,
            kategori: document.getElementById('formGedungKategori').value,
            jumlah_lantai: parseInt(document.getElementById('formGedungLantai').value) || 1,
            warna_peta: document.getElementById('formGedungWarna').value,
            deskripsi: document.getElementById('formGedungDeskripsi').value,
            foto: fotoVal,
            fasilitas: fasilitasVal,
            latitude: -7.0135,
            longitude: 113.8305
        };

        await DataStore.saveGedung(data);
        bootstrap.Modal.getInstance(document.getElementById('modalFormGedung')).hide();
        this.renderGedungTable();
        alert('Data gedung berhasil disimpan!');
    },

    async deleteGedung(id) {
        if (confirm('Yakin ingin menghapus gedung ini beserta seluruh denah dan ruangannya?')) {
            await DataStore.deleteItem('gedung', id);
            this.renderGedungTable();
        }
    },

    // ==========================================
    // 2. KELOLA RUANGAN
    // ==========================================
    async renderRuanganTable() {
        const tbody = document.getElementById('table-admin-ruangan-tbody');
        if (!tbody) return;

        const ruangans = await DataStore.getRuangans();
        let html = '';
        ruangans.forEach((r, idx) => {
            html += `
                <tr>
                    <td class="text-center">${idx + 1}</td>
                    <td class="fw-bold text-success">${r.kode_ruangan}</td>
                    <td class="fw-semibold">${r.nama_ruangan}</td>
                    <td>${r.nama_gedung}</td>
                    <td>${r.nama_lantai}</td>
                    <td><span class="badge bg-light text-dark border">${r.jenis_ruangan}</span></td>
                    <td>${r.kapasitas} org</td>
                    <td>${r.penanggung_jawab || '-'}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="AdminApp.editRuangan(${r.id_ruangan})">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="AdminApp.deleteRuangan(${r.id_ruangan})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    openAddRuanganModal() {
        document.getElementById('formRuangan').reset();
        document.getElementById('formRuanganId').value = '';
        document.getElementById('modalRuanganTitle').textContent = 'Tambah Ruangan Baru';
        this.populateGedungSelectInModal();
        new bootstrap.Modal(document.getElementById('modalFormRuangan')).show();
    },

    async populateGedungSelectInModal() {
        const sel = document.getElementById('formRuanganGedung');
        if (!sel) return;
        const gedungs = await DataStore.getGedungs();
        let html = '<option value="">-- Pilih Gedung --</option>';
        gedungs.forEach(g => {
            html += `<option value="${g.id_gedung}">${g.nama_gedung}</option>`;
        });
        sel.innerHTML = html;
    },

    async editRuangan(id) {
        const r = await DataStore.getRuanganById(id);
        if (!r) return;

        await this.populateGedungSelectInModal();

        document.getElementById('formRuanganId').value = r.id_ruangan;
        document.getElementById('formRuanganKode').value = r.kode_ruangan;
        document.getElementById('formRuanganNama').value = r.nama_ruangan;
        document.getElementById('formRuanganGedung').value = r.id_gedung;
        document.getElementById('formRuanganLantai').value = r.id_lantai || 1;
        document.getElementById('formRuanganJenis').value = r.jenis_ruangan;
        document.getElementById('formRuanganKapasitas').value = r.kapasitas;
        document.getElementById('formRuanganFasilitas').value = r.fasilitas || '';
        document.getElementById('formRuanganPic').value = r.penanggung_jawab || '';
        document.getElementById('formRuanganJam').value = r.jam_operasional || '07.30 - 17.00 WIB';
        document.getElementById('formRuanganDeskripsi').value = r.deskripsi || '';
        if (document.getElementById('formRuanganNodeAkses')) {
            document.getElementById('formRuanganNodeAkses').value = r.node_akses_id || '';
        }

        document.getElementById('modalRuanganTitle').textContent = 'Edit Data Ruangan';
        new bootstrap.Modal(document.getElementById('modalFormRuangan')).show();
    },

    async submitRuanganForm() {
        const id = document.getElementById('formRuanganId').value;
        const gSelect = document.getElementById('formRuanganGedung');
        const gName = gSelect.options[gSelect.selectedIndex]?.text || 'Gedung UNIBA';
        const fNum = document.getElementById('formRuanganLantai').value || 1;
        const nodeAksesVal = document.getElementById('formRuanganNodeAkses')?.value || null;

        const data = {
            id_ruangan: id ? parseInt(id) : null,
            id_gedung: parseInt(gSelect.value),
            id_lantai: parseInt(fNum),
            kode_ruangan: document.getElementById('formRuanganKode').value,
            nama_ruangan: document.getElementById('formRuanganNama').value,
            jenis_ruangan: document.getElementById('formRuanganJenis').value,
            kapasitas: parseInt(document.getElementById('formRuanganKapasitas').value) || 30,
            fasilitas: document.getElementById('formRuanganFasilitas').value,
            penanggung_jawab: document.getElementById('formRuanganPic').value,
            jam_operasional: document.getElementById('formRuanganJam').value,
            deskripsi: document.getElementById('formRuanganDeskripsi').value,
            node_akses_id: nodeAksesVal,
            nama_gedung: gName,
            nama_lantai: `Lantai ${fNum}`,
            denah_x: 60,
            denah_y: 60,
            denah_w: 200,
            denah_h: 130
        };

        await DataStore.saveRuangan(data);
        bootstrap.Modal.getInstance(document.getElementById('modalFormRuangan')).hide();
        this.renderRuanganTable();
        alert('Data ruangan berhasil disimpan!');
    },

    async deleteRuangan(id) {
        if (confirm('Yakin ingin menghapus ruangan ini?')) {
            await DataStore.deleteItem('ruangan', id);
            this.renderRuanganTable();
        }
    },

    // ==========================================
    // 3. KELOLA FASILITAS
    // ==========================================
    async renderFasilitasTable() {
        const tbody = document.getElementById('table-admin-fasilitas-tbody');
        if (!tbody) return;

        const fasilitas = await DataStore.getFasilitas();
        let html = '';
        fasilitas.forEach((f, idx) => {
            html += `
                <tr>
                    <td class="text-center">${idx + 1}</td>
                    <td class="fw-semibold"><i class="bi ${f.ikon} text-success me-2"></i>${f.nama_fasilitas}</td>
                    <td><span class="badge bg-light text-dark border">${f.kategori}</span></td>
                    <td>${f.lokasi}</td>
                    <td class="small text-muted text-truncate" style="max-width:240px;">${f.deskripsi}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-danger" onclick="AdminApp.deleteFasilitas(${f.id_fasilitas})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    async deleteFasilitas(id) {
        if (confirm('Yakin ingin menghapus fasilitas ini?')) {
            await DataStore.deleteItem('fasilitas', id);
            this.renderFasilitasTable();
        }
    },

    // ==========================================
    // 4. KELOLA BERITA
    // ==========================================
    async renderBeritaTable() {
        const tbody = document.getElementById('table-admin-berita-tbody');
        if (!tbody) return;

        const beritas = await DataStore.getBerita();
        let html = '';
        beritas.forEach((b, idx) => {
            html += `
                <tr>
                    <td class="text-center">${idx + 1}</td>
                    <td class="fw-bold">${b.judul}</td>
                    <td><span class="badge bg-success-subtle text-success">${b.kategori}</span></td>
                    <td>${b.tanggal}</td>
                    <td>${b.penulis}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-danger" onclick="AdminApp.deleteBerita(${b.id_berita})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    async deleteBerita(id) {
        if (confirm('Yakin ingin menghapus pengumuman ini?')) {
            await DataStore.deleteItem('berita', id);
            this.renderBeritaTable();
        }
    },

    // ==========================================
    // 5. KELOLA DENAH (VISUAL PREVIEW)
    // ==========================================
    async renderDenahEditor() {
        const preview = document.getElementById('admin-denah-preview-canvas');
        if (!preview) return;

        preview.innerHTML = `
            <div class="card border rounded-3 p-4 bg-light text-center">
                <i class="bi bi-diagram-3 fs-1 text-success mb-2"></i>
                <h5 class="fw-bold">Visual Floor Plan Mapper</h5>
                <p class="text-muted small mb-3">Pilih gedung dan lantai untuk menginspeksi koordinat spasial (X, Y, Width, Height) ruangan.</p>
                <div class="d-flex justify-content-center gap-2">
                    <button class="btn btn-success" onclick="App.navigateToDenahGedung(1, 1)">
                        <i class="bi bi-eye me-1"></i>Buka Editor Denah Gedung A
                    </button>
                    <button class="btn btn-outline-primary" onclick="App.navigateToDenahGedung(2, 2)">
                        <i class="bi bi-eye me-1"></i>Buka Editor Denah Gedung B (Lab FST)
                    </button>
                </div>
            </div>
        `;
    },

    // ==========================================
    // 6. KELOLA JARINGAN RUTE (DIJKSTRA)
    // ==========================================
    async renderRuteManager() {
        const nodes = await DataStore.getNodes();
        const edges = await DataStore.getEdges();

        // Update Counter
        const nodeCountEl = document.getElementById('admin-node-count');
        const edgeCountEl = document.getElementById('admin-edge-count');
        if (nodeCountEl) nodeCountEl.textContent = nodes.length;
        if (edgeCountEl) edgeCountEl.textContent = edges.length;

        // 1. Populate Dropdown Uji Rute
        this.populateRuteTesterDropdowns(nodes);

        // 2. Render Tabel Node
        const nodeTbody = document.getElementById('table-admin-nodes-tbody');
        if (nodeTbody) {
            let html = '';
            const typeBadges = {
                outdoor: 'bg-success-subtle text-success',
                entrance: 'bg-primary-subtle text-primary',
                corridor: 'bg-info-subtle text-info',
                stairs: 'bg-warning-subtle text-warning',
                room_access: 'bg-secondary-subtle text-dark',
                facility: 'bg-dark-subtle text-dark'
            };

            nodes.forEach(n => {
                const badgeCls = typeBadges[n.jenis_node] || 'bg-light text-dark';
                const bldText = n.gedung_id ? `Gd.${n.gedung_id} Lt.${n.lantai || 1}` : 'Outdoor';
                html += `
                    <tr>
                        <td><code class="fw-bold text-success">${n.id_node}</code></td>
                        <td>
                            <div class="fw-semibold text-dark">${n.nama_node}</div>
                            <small class="text-muted">${bldText}</small>
                        </td>
                        <td><span class="badge ${badgeCls}">${n.jenis_node}</span></td>
                        <td><code>${n.x}, ${n.y}</code></td>
                        <td class="text-end">
                            <button class="btn btn-xs btn-outline-primary me-1" onclick="AdminApp.openAddNodeModal('${n.id_node}')" title="Edit Node">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-xs btn-outline-danger" onclick="AdminApp.deleteNode('${n.id_node}')" title="Hapus Node">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            nodeTbody.innerHTML = html;
        }

        // 3. Render Tabel Edge
        const edgeTbody = document.getElementById('table-admin-edges-tbody');
        if (edgeTbody) {
            let html = '';
            edges.forEach(e => {
                html += `
                    <tr>
                        <td><code class="text-dark">${e.node_awal}</code></td>
                        <td><code class="text-dark">${e.node_tujuan}</code></td>
                        <td><b class="text-success">${e.jarak}m</b></td>
                        <td><span class="badge bg-light text-secondary border">${e.jenis_jalur}</span></td>
                        <td class="text-end">
                            <button class="btn btn-xs btn-outline-primary me-1" onclick="AdminApp.openAddEdgeModal(${e.id_edge})" title="Edit Edge">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-xs btn-outline-danger" onclick="AdminApp.deleteEdge(${e.id_edge})" title="Hapus Edge">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            edgeTbody.innerHTML = html;
        }
    },

    populateRuteTesterDropdowns(nodes) {
        const startSel = document.getElementById('adminRuteTestStart');
        const targetSel = document.getElementById('adminRuteTestTarget');
        if (!startSel || !targetSel) return;

        let startHtml = '';
        let targetHtml = '<optgroup label="Ruangan Kuliah & Laboratorium">';

        // Tambah target ruangan dari denah spasial
        for (const gId in DENAH_SPASIAL_DATA) {
            const bld = DENAH_SPASIAL_DATA[gId];
            for (const fNum in bld.lantai) {
                const fl = bld.lantai[fNum];
                fl.ruangan.forEach(r => {
                    targetHtml += `<option value="room_${r.id}">${bld.nama_gedung} - Lt.${fNum} - ${r.kode} ${r.nama}</option>`;
                });
            }
        }
        targetHtml += '</optgroup><optgroup label="Node Titik Jalur / Landmark">';

        nodes.forEach(n => {
            const isStartCandidate = n.jenis_node === 'outdoor' || n.jenis_node === 'facility' || n.jenis_node === 'entrance';
            if (isStartCandidate) {
                startHtml += `<option value="${n.id_node}" ${n.id_node === 'gerbang_utama' ? 'selected' : ''}>${n.nama_node} (${n.id_node})</option>`;
            }
            targetHtml += `<option value="${n.id_node}">${n.nama_node} (${n.id_node})</option>`;
        });
        targetHtml += '</optgroup>';

        startSel.innerHTML = startHtml;
        targetSel.innerHTML = targetHtml;
    },

    // Modal Add / Edit Node
    async openAddNodeModal(nodeId = null) {
        document.getElementById('formNode').reset();
        const idField = document.getElementById('formNodeId');
        const origIdField = document.getElementById('formNodeOriginalId');
        const titleEl = document.getElementById('modalNodeTitle');

        if (nodeId) {
            const nodes = await DataStore.getNodes();
            const n = nodes.find(item => item.id_node === nodeId);
            if (n) {
                origIdField.value = n.id_node;
                idField.value = n.id_node;
                document.getElementById('formNodeNama').value = n.nama_node;
                document.getElementById('formNodeJenis').value = n.jenis_node;
                document.getElementById('formNodeGedung').value = n.gedung_id || '';
                document.getElementById('formNodeLantai').value = n.lantai || 1;
                document.getElementById('formNodeX').value = n.x;
                document.getElementById('formNodeY').value = n.y;
                if (titleEl) titleEl.textContent = 'Edit Node Jaringan';
            }
        } else {
            origIdField.value = '';
            if (titleEl) titleEl.textContent = 'Tambah Node Jaringan Baru';
        }

        new bootstrap.Modal(document.getElementById('modalFormNode')).show();
    },

    async submitNodeForm() {
        const origId = document.getElementById('formNodeOriginalId').value;
        const nodeId = document.getElementById('formNodeId').value.trim();
        const nodeData = {
            id_node: nodeId,
            nama_node: document.getElementById('formNodeNama').value.trim(),
            jenis_node: document.getElementById('formNodeJenis').value,
            gedung_id: document.getElementById('formNodeGedung').value ? parseInt(document.getElementById('formNodeGedung').value) : null,
            lantai: parseInt(document.getElementById('formNodeLantai').value) || 1,
            x: parseInt(document.getElementById('formNodeX').value) || 0,
            y: parseInt(document.getElementById('formNodeY').value) || 0
        };

        await DataStore.saveNode(nodeData);

        // Jika ID diubah, sinkronkan edge
        if (origId && origId !== nodeId) {
            await DataStore.deleteNode(origId);
        }

        bootstrap.Modal.getInstance(document.getElementById('modalFormNode')).hide();
        this.renderRuteManager();
        alert('Data node berhasil disimpan!');
    },

    async deleteNode(nodeId) {
        if (confirm(`Yakin ingin menghapus node [${nodeId}]? Seluruh edge yang terhubung juga akan dihapus.`)) {
            await DataStore.deleteNode(nodeId);
            this.renderRuteManager();
        }
    },

    // Modal Add / Edit Edge
    async openAddEdgeModal(edgeId = null) {
        document.getElementById('formEdge').reset();
        const nodes = await DataStore.getNodes();
        const awalSel = document.getElementById('formEdgeNodeAwal');
        const tujuanSel = document.getElementById('formEdgeNodeTujuan');
        const origIdField = document.getElementById('formEdgeOriginalId');
        const titleEl = document.getElementById('modalEdgeTitle');

        let options = '<option value="">-- Pilih Node --</option>';
        nodes.forEach(n => {
            options += `<option value="${n.id_node}">${n.nama_node} (${n.id_node})</option>`;
        });
        awalSel.innerHTML = options;
        tujuanSel.innerHTML = options;

        if (edgeId) {
            const edges = await DataStore.getEdges();
            const e = edges.find(item => item.id_edge === edgeId);
            if (e) {
                origIdField.value = e.id_edge;
                awalSel.value = e.node_awal;
                tujuanSel.value = e.node_tujuan;
                document.getElementById('formEdgeJarak').value = e.jarak;
                document.getElementById('formEdgeJenis').value = e.jenis_jalur;
                if (titleEl) titleEl.textContent = 'Edit Edge Penghubung';
            }
        } else {
            origIdField.value = '';
            if (titleEl) titleEl.textContent = 'Tambah Edge Penghubung Baru';
        }

        new bootstrap.Modal(document.getElementById('modalFormEdge')).show();
    },

    async submitEdgeForm() {
        const origId = document.getElementById('formEdgeOriginalId').value;
        const edgeData = {
            id_edge: origId ? parseInt(origId) : Date.now(),
            node_awal: document.getElementById('formEdgeNodeAwal').value,
            node_tujuan: document.getElementById('formEdgeNodeTujuan').value,
            jarak: parseFloat(document.getElementById('formEdgeJarak').value) || 10,
            jenis_jalur: document.getElementById('formEdgeJenis').value
        };

        if (edgeData.node_awal === edgeData.node_tujuan) {
            alert('Node awal dan node tujuan tidak boleh sama!');
            return;
        }

        await DataStore.saveEdge(edgeData);
        bootstrap.Modal.getInstance(document.getElementById('modalFormEdge')).hide();
        this.renderRuteManager();
        alert('Data edge penghubung berhasil disimpan!');
    },

    async deleteEdge(edgeId) {
        if (confirm('Yakin ingin menghapus edge penghubung ini?')) {
            await DataStore.deleteEdge(edgeId);
            this.renderRuteManager();
        }
    },

    // Uji Rute Dijkstra di Admin Dashboard
    testAdminDijkstraRoute() {
        const startId = document.getElementById('adminRuteTestStart').value;
        const targetVal = document.getElementById('adminRuteTestTarget').value;
        const resultContainer = document.getElementById('adminRuteTestResult');
        if (!resultContainer) return;

        resultContainer.classList.remove('d-none');

        let route = null;
        let isRoom = targetVal.startsWith('room_');

        if (isRoom) {
            const roomId = parseInt(targetVal.replace('room_', ''));
            const roomObj = MapDenah.findRoomObject(roomId);
            if (roomObj) {
                route = DijkstraRute.calculateRouteToRoom(startId, roomObj);
            }
        } else {
            route = DijkstraRute.findShortestPath(startId, targetVal);
        }

        if (route) {
            const stepItems = route.steps.map((st, i) => `<li><span class="badge bg-success-subtle text-success me-1">${i+1}</span> ${st}</li>`).join('');
            const guides = (route.stepGuides && route.stepGuides.length)
                ? `<div class="mt-2 pt-2 border-top">
                     <span class="fw-bold small text-success">Petunjuk Terinci:</span>
                     <ol class="small text-muted mb-0 ps-3">
                       ${route.stepGuides.map(g => `<li>${g}</li>`).join('')}
                     </ol>
                   </div>`
                : '';

            resultContainer.innerHTML = `
                <div class="alert alert-success border-success mb-0">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="fw-bold"><i class="bi bi-check-circle-fill me-1"></i>Rute Terhubung Valid (Dijkstra Selesai)</span>
                        <span class="badge bg-success">Jarak: ${route.totalDistance}m &bull; ±${route.estimatedMinutes} menit</span>
                    </div>
                    <div class="small mb-1"><b>Urutan Titik Perjalanan (${route.steps.length} Titik):</b></div>
                    <ul class="list-unstyled small mb-0 ps-1" style="line-height: 1.6;">
                        ${stepItems}
                    </ul>
                    ${guides}
                </div>
            `;
        } else {
            resultContainer.innerHTML = `
                <div class="alert alert-danger mb-0">
                    <div class="fw-bold mb-1"><i class="bi bi-exclamation-triangle-fill me-1"></i>Rute Tidak Ditemukan!</div>
                    <p class="small mb-0">Tidak ada jaringan edge penghubung yang menghubungkan <b>${startId}</b> dengan target yang dipilih. Pastikan telah menambahkan edge dua arah atau edge koridor yang relevan.</p>
                </div>
            `;
        }
    },

    // Periksa Konektivitas Jaringan Keseluruhan
    async checkNetworkConnectivity() {
        const nodes = await DataStore.getNodes();
        const startId = 'gerbang_utama';

        let connectedCount = 0;
        let disconnected = [];

        nodes.forEach(n => {
            if (n.id_node === startId) {
                connectedCount++;
                return;
            }
            const r = DijkstraRute.findShortestPath(startId, n.id_node);
            if (r) {
                connectedCount++;
            } else {
                disconnected.push(n.id_node);
            }
        });

        const percent = Math.round((connectedCount / nodes.length) * 100);
        let msg = `Konektivitas Jaringan: ${connectedCount} dari ${nodes.length} node terhubung (${percent}%).`;
        if (disconnected.length > 0) {
            msg += `\nNode belum terhubung: ${disconnected.slice(0, 5).join(', ')}${disconnected.length > 5 ? '...' : ''}`;
        } else {
            msg += `\nSemua titik jalur kampus, gedung, dan ruangan saling terhubung secara penuh!`;
        }
        alert(msg);
    }
};
