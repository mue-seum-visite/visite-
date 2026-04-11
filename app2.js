// CONFIGURATION DU PARCOURS PONT-DE-LOUP
const departPontDeLoup = [50.417276, 4.543625];
let map2;

// 1. OUVRE GOOGLE MAPS (Lien corrigé pour mobile)
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

// 3. LANCEMENT DU VOYAGE (Version optimisée anti-conflit)
function lancerVoyage2() {
    let trans = document.getElementById('transition-voyage');
    let video = document.getElementById('video-vortex');
    const explorer = document.getElementById('ui-explorer');

    // SÉCURITÉ : Nettoyage immédiat pour éviter les interférences avec app.js
    if (explorer) {
        explorer.style.transition = "opacity 0.5s";
        explorer.style.opacity = '0';
    }
    
    // Si la zone de transition n'existe pas du tout (cas rare), on la crée
    if (!trans) {
        trans = document.createElement('div');
        trans.id = 'transition-voyage';
        trans.style = "position:fixed; top:0; left:0; width:100%; height:100%; z-index:10000; background:#000; display:none; justify-content:center; align-items:center;";
        document.body.appendChild(trans);
    }

    // SÉCURITÉ VIDÉO : Si on vient de l'index principal, on injecte la vidéo de force
    if (!video || video.id === "vortex-map") { 
        console.log("Préparation du portail Pont-de-Loup...");
        trans.innerHTML = `<video id="video-vortex" playsinline muted autoplay loop style="width: 100%; height: 100%; object-fit: cover;">
                             <source src="tour-ancienne.mp4" type="video/mp4">
                           </video>`;
        video = document.getElementById('video-vortex');
    }

    // DÉMARRAGE VISUEL
    trans.style.display = 'flex';
    
    if (video) {
        video.currentTime = 0; // On repart du début
        video.play().catch(err => console.log("Erreur lecture vidéo:", err));
    }

    // TRANSITION VERS LA CARTE APRÈS 4 SECONDES
    setTimeout(() => {
        if (explorer) explorer.style.display = 'none';
        
        const mapDiv = document.getElementById('map');
        if (mapDiv) {
            mapDiv.style.display = 'block';
            mapDiv.style.visibility = 'visible';
        }
        
        const btnQuitter = document.getElementById('btn-quitter-carte');
        if (btnQuitter) btnQuitter.style.display = 'block';
        
        const footer = document.getElementById('poetic-footer');
        if (footer) footer.style.display = 'block';

        // LANCEMENT DE LA CARTE 2
        initMap2(); 
        
        // On masque la vidéo proprement
        trans.style.display = 'none';
    }, 4000); 
}

// 4. INITIALISATION CARTE PONT-DE-LOUP
function initMap2() {
    if (map2) return;
    map2 = L.map('map', { zoomControl: false }).setView(departPontDeLoup, 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map2);

    const tracePoints = [
        [50.417269, 4.543662], [50.417471, 4.543954], [50.417655, 4.543911],
        [50.417976, 4.543862], [50.418168, 4.543653], [50.418246, 4.543846]
    ];
    
    L.polyline(tracePoints, {color: '#8cb6d1', weight: 6, opacity: 0.9}).addTo(map2);
    
    L.marker(departPontDeLoup).addTo(map2)
        .bindPopup("<b style='color:#000'>La Tour de Pont-de-Loup</b><br>Le voyage commence ici.");

    setTimeout(() => { map2.invalidateSize(); }, 300);
}

// Lancement automatique du calcul de distance
scriptDistance2();
