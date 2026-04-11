// CONFIGURATION DU PARCOURS PONT-DE-LOUP
const departPontDeLoup = [50.417276, 4.543625];
let map2;

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

// 3. LANCEMENT DU VOYAGE (La fonction intelligente qui crée la vidéo si besoin)
function lancerVoyage2() {
    let transition = document.getElementById('transition-voyage');
    let video = document.getElementById('video-vortex');
    const ui = document.getElementById('ui-explorer');

    // SÉCURITÉ : Si on vient de l'index principal, le vortex n'existe pas, on le crée
    if (!video || video.id === "vortex-map") { 
        // On crée un nouvel écran noir spécifique pour Pont-de-Loup
        transition = document.createElement('div');
        transition.style = "position:fixed; top:0; left:0; width:100%; height:100%; z-index:9999; background:#000; display:flex; justify-content:center; align-items:center;";
        
        video = document.createElement('video');
        video.src = 'tour-ancienne.mp4';
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.style = "width:100%; height:100%; object-fit:cover;";
        
        transition.appendChild(video);
        document.body.appendChild(transition);
    }

    // On affiche et on joue
    transition.style.display = 'flex';
    video.play().catch(e => console.log("Lecture auto assistée"));

    setTimeout(() => {
        transition.style.display = 'none';
        if (ui) ui.style.display = 'none';
        
        const mapDiv = document.getElementById('map');
        if (mapDiv) {
            mapDiv.style.display = 'block';
            mapDiv.style.visibility = 'visible';
        }
        
        document.getElementById('btn-quitter-carte').style.display = 'block';
        document.getElementById('poetic-footer').style.display = 'block';

        initMap2();
    }, 4000); 
}

// 4. CARTE LEAFLET
function initMap2() {
    if (map2) return;
    map2 = L.map('map').setView(departPontDeLoup, 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map2);

    const tracePoints = [
        [50.417269, 4.543662], [50.417471, 4.543954], [50.417655, 4.543911],
        [50.417976, 4.543862], [50.418168, 4.543653], [50.418246, 4.543846]
    ];
    L.polyline(tracePoints, {color: '#8cb6d1', weight: 6}).addTo(map2);
    L.marker(departPontDeLoup).addTo(map2).bindPopup("La Tour de Pont-de-Loup");
    setTimeout(() => { map2.invalidateSize(); }, 200);
}

scriptDistance2();
