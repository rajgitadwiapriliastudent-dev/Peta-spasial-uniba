/**
 * Master Application Coordinator & Single Page Navigation Controller
 * Sistem Informasi Spasial UNIBA Madura
 */

const App = {
    currentView: 'home',

    init() {
        console.log('🚀 Menginisialisasi Sistem Informasi Spasial UNIBA Madura...');

        // 1. Setup Global Header Search Listener
        this.setupHeaderSearch();

        // 2. Setup Mobile Navigation Toggle
        this.setupMobileNav();

        // 3. Setup Hash Router (opsional jika link menggunakan #view)
        window.addEventListener('hashchange', () => this.handleHashChange());

        // Inisialisasi Tampilan Awal (Home)
        const initialHash = window.location.hash.replace('#', '') || 'home';
        this.navigateTo(initialHash);
    },

    // Router Navigasi Antar Halaman
    navigateTo(viewName, params = {}) {
        this.currentView = viewName;
        window.location.hash = viewName;

        // 1. Sembunyikan semua section view
        document.querySelectorAll('.view-section').forEach(sec => {
            sec.classList.remove('active-view');
        });

        // 2. Aktifkan view yang dituju
        const targetSection = document.getElementById(`view-${viewName}`);
        if (targetSection) {
            targetSection.classList.add('active-view');
        }

        // 3. Update Active State di Sidebar Navigation
        this.updateSidebarActive(viewName);

        // 4. Tutup Sidebar Mobile jika terbuka
        this.closeMobileNav();

        // 5. Scroll ke atas
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 6. Jalankan Inisialisasi Khusus Tiap View
        this.onViewActivated(viewName, params);
    },

    // Hook saat halaman diaktifkan
    onViewActivated(viewName, params) {
        if (viewName === 'home') {
            MapKampus.initPreviewMap('home-map-preview');
            if (typeof HomeRoutePreview !== 'undefined') {
                HomeRoutePreview.init();
            }
        } else if (viewName === 'map-kampus') {
            setTimeout(() => {
                MapKampus.initMainMap('map-kampus-leaflet');
                if (params.buildingId) {
                    MapKampus.focusBuilding(params.buildingId);
                } else if (params.routeStart) {
                    MapKampus.showRoute(params.routeStart, params.routeEnd, params.routeRoom);
                }
            }, 50);
        } else if (viewName === 'denah-gedung') {
            const bldId = params.buildingId || 1;
            const floorNum = params.floor || 1;
            const roomId = params.roomId || null;
            const routeInfo = params.routeInfo || null;
            MapDenah.loadBuilding(bldId, floorNum, roomId, routeInfo);
        } else if (viewName === 'search') {
            setTimeout(() => {
                SearchView.initSearchMap('search-map-leaflet');
                if (params.query) {
                    SearchView.executeSearch(params.query);
                }
            }, 50);
        } else if (viewName === 'informasi-ruangan') {
            CatalogView.initRoomCatalog();
        } else if (viewName === 'fasilitas') {
            CatalogView.initFacilitiesPage();
        } else if (viewName === 'berita') {
            CatalogView.initNewsPage();
        } else if (viewName === 'admin-dashboard') {
            AdminApp.initDashboard();
        }
    },

    // Update kelas active pada link sidebar
    updateSidebarActive(viewName) {
        document.querySelectorAll('.sidebar-link').forEach(link => {
            const linkView = link.getAttribute('data-view');
            link.classList.toggle('active', linkView === viewName);
        });
    },

    // Listener Global Search Bar di Header
    setupHeaderSearch() {
        const input = document.getElementById('global-header-search');
        if (!input) return;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const q = input.value.trim();
                if (q) {
                    this.navigateTo('search', { query: q });
                }
            }
        });
    },

    // Setup Drawer Mobile Navigation
    setupMobileNav() {
        const toggleBtn = document.getElementById('mobile-sidebar-toggle');
        const sidebar = document.getElementById('uniba-sidebar');
        const overlay = document.getElementById('sidebar-backdrop');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
                if (overlay) overlay.classList.toggle('d-none');
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.closeMobileNav());
        }
    },

    closeMobileNav() {
        const sidebar = document.getElementById('uniba-sidebar');
        const overlay = document.getElementById('sidebar-backdrop');
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.add('d-none');
    },

    // Handle Perubahan URL Hash
    handleHashChange() {
        const hash = window.location.hash.replace('#', '') || 'home';
        if (hash !== this.currentView) {
            this.navigateTo(hash);
        }
    },

    // Helper: Navigasi Langsung ke Peta Kampus
    navigateToCampusMap(buildingId = null) {
        this.navigateTo('map-kampus', { buildingId });
    },

    // Helper: Navigasi Langsung ke Denah Gedung Tertentu
    navigateToDenahGedung(buildingId, floor = 1, roomId = null, routeInfo = null) {
        this.navigateTo('denah-gedung', { buildingId, floor, roomId, routeInfo });
    }
};

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
