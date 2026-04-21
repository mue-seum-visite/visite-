var map;
const latDep = 50.4044627; const lngDep = 4.5230877;

// --- 1. MÉMOIRE DE NAVIGATION (Unique au P1) ---
window.onload = function() {
    // On utilise une clé spécifique 'carteOuverte_P1'
    if (localStorage.getItem('carteOuverte_P1') === 'true') {
        document.getElementById('ui-explorer').style.display = 'none';
        document.getElementById('map').style.display = 'block';
        document.getElementById('btn-quitter-carte').style.display = 'block';
        initMap();
    }
};

// --- GPS ACCUEIL (Calcul de distance) ---
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
        const R = 6371; 
        const dLat = (latDep - pos.coords.latitude) * Math.PI/180;
        const dLon = (lngDep - pos.coords.longitude) * Math.PI/180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(pos.coords.latitude * Math.PI/180) * Math.cos(latDep * Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        document.getElementById('distance-gps').innerText = `À ${d.toFixed(1)} km de votre prochaine émotion`;
    });
}

function allerAuDepart() {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latDep},${lngDep}`, '_blank');
}

// --- ANIMATION DE TRANSITION (VORTEX) ---
function lancerVoyage() {
    const trans = document.getElementById('transition-voyage');
    const vortex = document.getElementById('vortex-map');
    const explorer = document.getElementById('ui-explorer');

    // On marque cette carte précise comme ouverte
    localStorage.setItem('carteOuverte_P1', 'true');
    
    window.scrollTo(0,0);
    trans.style.display = 'block';
    explorer.style.opacity = '0';

    setTimeout(() => {
        vortex.style.opacity = '1';
        vortex.style.transition = "transform 3s ease-in, opacity 1s";
        vortex.style.transform = "scale(3)";
        
        setTimeout(() => {
            explorer.style.display = 'none';
            document.getElementById('map').style.display = 'block';
            document.getElementById('btn-quitter-carte').style.display = 'block';
            initMap();
            trans.style.display = 'none';
            document.body.style.overflow = "hidden";
        }, 2800);
    }, 100);
}

function quitterLaCarte() {
    // On efface seulement la mémoire du Parcours 1
    localStorage.removeItem('carteOuverte_P1');
    // On redirige proprement vers l'index sans paramètres
    window.location.replace('index.html');
}

// --- INITIALISATION DE LA CARTE ---
function initMap() {
    if (map) return;
    map = L.map('map', { zoomControl: false }).setView([50.407, 4.522], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    var trace = [[50.404741, 4.523157], [50.405149, 4.524318], [50.406281, 4.526237], [50.406527, 4.525638], [50.40675, 4.524963], [50.407117, 4.523852], [50.40651, 4.523013], [50.406253, 4.522654], [50.406561, 4.522122], [50.406818, 4.521565], [50.408204, 4.523373], [50.408706, 4.522609], [50.408878, 4.521914], [50.40911, 4.521411], [50.409005, 4.520713], [50.408489, 4.520219], [50.407981, 4.519698], [50.407497, 4.518906], [50.407638, 4.518756], [50.406828, 4.519497], [50.406623, 4.519893], [50.406276, 4.52026], [50.405674, 4.521287], [50.405391, 4.52133], [50.404547, 4.521566], [50.404603, 4.522819], [50.404492, 4.523032]];
    L.polyline(trace, {color: '#007AFF', weight: 6, opacity: 0.8}).addTo(map);

    var pts = [
        { latlng: [50.4044627, 4.5230877], t: "I. L'Éveil du Coq", phrase: "Le bronze s'éveille sous vos yeux...", file: "coq-ar.html", mode: "ar" },
        { latlng: [50.4067226, 4.5250463], t: "II. Les Racines du Maître", phrase: "Ici, Pierre Paulus a ouvert les yeux sur le monde...", file: null, mode: "info" },
        { latlng: [50.4069696, 4.5217572], t: "III. Murmures de 1910", phrase: "Âge d'Or", file: "etape2.html", mode: "ar" },
        { latlng: [50.4082915, 4.5205504], t: "IV. La Sambre de l'Âge d'Or", phrase: "L'eau reflète la puissance de l'industrie naissante...", file: "sambre-ar.html", mode: "ar" },
        { latlng: [50.4046263, 4.5221912], t: "V. Le Souffle du Fer", phrase: "Le métal bat au cœur de la ville...", file: "etape4.html", mode: "ar" }
    ];

    pts.forEach((pt, i) => {
        let m = L.circleMarker(pt.latlng, {
            radius: 18, color: '#fff', weight: 2, fillColor: '#97f097', fillOpacity: 1
        }).addTo(map);

        m.on('click', function() {
            const txt = document.getElementById('poetic-text');
            if(txt) { txt.innerText = pt.phrase; }
            map.flyTo(pt.latlng, 19, { animate: true, duration: 1.2 });

            if (pt.mode === "ar") {
                setTimeout(() => { window.location.href = pt.file; }, 1300);
            } else {
                m.bindPopup(`<div style="color:black; text-align:center; padding:8px;">
                    <b style="font-size:16px;">${pt.t}</b><br><br>
                    <p style="font-size:14px; line-height:1.5; margin:0;">C'est ici que Pierre Paulus a ouvert les yeux sur le monde.</p>
                </div>`).openPopup();
            }
        });

        L.marker(pt.latlng, { 
            icon: L.divIcon({ className: 'label-etape', html: (i+1), iconSize: [24, 24], iconAnchor: [12, 12] }),
            interactive: false 
        }).addTo(map);
    });

    map.locate({setView: false, watch: true});
    map.on('locationfound', e => {
        if(!window.userMarker) {
            window.userMarker = L.circleMarker(e.latlng, {radius: 9, color: '#fff', weight: 3, fillColor: '#007AFF', fillOpacity: 1}).addTo(map);
        } else {
            window.userMarker.setLatLng(e.latlng);
        }
    });
}
