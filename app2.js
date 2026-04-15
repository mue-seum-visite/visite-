// CONFIGURATION DU PARCOURS PONT-DE-LOUP
const departPontDeLoup = [50.417276, 4.543625];
window.map2 = null; 

// 1. OUVRE GOOGLE MAPS
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
        }, (error) => console.log(error), { enableHighAccuracy: true });
    }
}

// 3. LANCEMENT DU VOYAGE (La vidéo du Vortex)
function lancerVoyage2() {
    const explorer = document.getElementById('ui-explorer');
    const trans = document.getElementById('transition-voyage');
    const video = document.getElementById('video-vortex');

    // On cache le menu avec un effet fondu
    if (explorer) explorer.style.opacity = '0';

    // On affiche l'écran de transition et on lance la vidéo
    if (trans) {
        trans.style.display = 'flex';
        trans.style.zIndex = '9999'; // LIGNE AJOUTÉE : Force la vidéo au premier plan
        if (video) {
            video.currentTime = 0;
            video.play();
        }
    }

    // Après 4 secondes (durée de ton animation)
    setTimeout(() => {
        if (explorer) explorer.style.display = 'none';
        
        // On affiche la carte et les boutons
        document.getElementById('map').style.display = 'block';
        document.getElementById('btn-quitter-carte').style.display = 'block';
        document.getElementById('poetic-footer').style.display = 'block';

        // INITIALISATION DE LA CARTE
        initMap2();

        // On cache la vidéo
        if (trans) trans.style.display = 'none';
    }, 4000); 
}

// 4. INITIALISATION CARTE
function initMap2() {
    // Si la carte existe déjà, on la rafraîchit simplement
    if (window.map2) {
        setTimeout(() => { window.map2.invalidateSize(); }, 100);
        return;
    }

    // Sinon, on la crée
    window.map2 = L.map('map', { zoomControl: false }).setView(departPontDeLoup, 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(window.map2);

    // Tracé du chemin bleu
    const tracePoints = [
        [50.417269, 4.543662], [50.417471, 4.543954], [50.417655, 4.543911],
        [50.417976, 4.543862], [50.418168, 4.543653], [50.418246, 4.543846]
    ];
    L.polyline(tracePoints, {color: '#8cb6d1', weight: 6, opacity: 0.9}).addTo(window.map2);

    // Étapes
    const pts2 = [
        { latlng: [50.417946, 4.543844], phrase: "L'histoire s'éveille sous vos pas...", file: "etape_pdl_1.html" },
        { latlng: [50.418151, 4.543544], phrase: "Une lueur du passé surgit...", file: "etape_pdl_2.html" },
        { latlng: [50.418301, 4.543802], phrase: "Le temps retrouve ses couleurs...", file: "etape_pdl_3.html" }
    ];

    pts2.forEach((pt, i) => {
        let m = L.circleMarker(pt.latlng, {
            radius: 18, color: '#fff', weight: 2, fillColor: '#8cb6d1', fillOpacity: 1
        }).addTo(window.map2);

        m.on('click', function() {
            const txt = document.getElementById('poetic-text');
            if(txt) { txt.innerText = pt.phrase; }
            window.map2.flyTo(pt.latlng, 19, { animate: true, duration: 1.2 });
            setTimeout(() => { window.location.href = pt.file; }, 1500);
        });

        L.marker(pt.latlng, { 
            icon: L.divIcon({ className: 'label-etape', html: (i+1), iconSize: [24, 24], iconAnchor: [12, 12] }),
            interactive: false 
        }).addTo(window.map2);
    });
    
    L.marker(departPontDeLoup).addTo(window.map2).bindPopup("<b>La Tour de Pont-de-Loup</b>");

    // GPS Utilisateur
    window.map2.locate({setView: false, watch: true});
    window.map2.on('locationfound', e => {
        if(!window.userMarker2) {
            window.userMarker2 = L.circleMarker(e.latlng, {radius: 9, color: '#fff', weight: 3, fillColor: '#007AFF', fillOpacity: 1}).addTo(window.map2);
        } else {
            window.userMarker2.setLatLng(e.latlng);
        }
    });

    // Forcer le rendu pour éviter l'écran blanc
    setTimeout(() => { window.map2.invalidateSize(); }, 500);
}

// 5. GESTION DU CHARGEMENT (Démarrage ou Retour de RA)
window.addEventListener('load', () => {
    scriptDistance2(); // On commence à calculer la distance direct

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('map') === 'true') {
        // CAS RETOUR : On saute la vidéo et on montre la carte
        document.getElementById('ui-explorer').style.display = 'none';
        document.getElementById('map').style.display = 'block';
        document.getElementById('btn-quitter-carte').style.display = 'block';
        document.getElementById('poetic-footer').style.display = 'block';
        initMap2();
    }
});
