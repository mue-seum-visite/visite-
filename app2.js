// CONFIGURATION DU PARCOURS PONT-DE-LOUP
const departPontDeLoup = [50.417276, 4.543625];
let map2;

// 1. OUVRE GOOGLE MAPS POUR ALLER AU DÉPART (CORRIGÉ)
function allerAuDepart2() {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${departPontDeLoup[0]},${departPontDeLoup[1]}`;
    window.open(url, '_blank');
}

// 2. CALCUL DE LA DISTANCE GPS
function scriptDistance2() {
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition((position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            
            const R = 6371; 
            const dLat = (userLat - departPontDeLoup[0]) * Math.PI / 180;
            const dLon = (userLon - departPontDeLoup[1]) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(departPontDeLoup[0] * Math.PI / 180) * Math.cos(userLat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const d = R * c;

            const el = document.getElementById("distance-gps");
            if (el) {
                el.innerHTML = `📍 Vous êtes à <b>${d.toFixed(1)} km</b> de cette émotion`;
            }
        }, (error) => {
            console.log("Erreur GPS :", error);
        }, { enableHighAccuracy: true });
    }
}

// 3. LANCEMENT DU VOYAGE AVEC LA VIDÉO
function lancerVoyage2() {
    const transition = document.getElementById('transition-voyage');
    const video = document.getElementById('video-vortex');
    const ui = document.getElementById('ui-explorer');
    
    // On affiche l'écran de transition
    if (transition) {
        transition.style.display = 'flex';
    }
    
    // On force le lancement de la vidéo
    if (video) {
        video.muted = true; // Obligatoire pour le lancement auto sur mobile
        video.play().catch(error => console.log("Lancement vidéo bloqué"));
    }
    
    // Basculement vers la carte après 4 secondes
    setTimeout(() => {
        if (transition) transition.style.display = 'none';
        if (ui) ui.style.display = 'none';
        
        const mapDiv = document.getElementById('map');
        if (mapDiv) {
            mapDiv.style.display = 'block';
            mapDiv.style.visibility = 'visible';
        }
        
        const btnQuitter = document.getElementById('btn-quitter-carte');
        if (btnQuitter) btnQuitter.style.display = 'block';
        
        const footer = document.getElementById('poetic-footer');
        if (footer) footer.style.display = 'block';

        initMap2();
    }, 4000); 
}

// 4. INITIALISATION DE LA CARTE (COMPLÉTÉE)
function initMap2() {
    if (map2) return;

    map2 = L.map('map').setView(departPontDeLoup, 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map2);

    const tracePoints = [
        [50.417269, 4.543662],
        [50.417471, 4.543954],
        [50.417655, 4.543911],
        [50.417976, 4.543862],
        [50.418168, 4.543653],
        [50.418246, 4.543846]
    ];

    L.polyline(tracePoints, {color: '#8cb6d1', weight: 6, opacity: 0.8}).addTo(map2);
    
    L.marker(departPontDeLoup).addTo(map2)
        .bindPopup("<b>La Tour de Pont-de-Loup</b><br>Le voyage commence ici.")
        .openPopup();

    setTimeout(() => { map2.invalidateSize(); }, 200);
}

// Lancement automatique du calcul de distance
scriptDistance2();
