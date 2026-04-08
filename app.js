var map;
const latDep = 50.4044627; const lngDep = 4.5230877;

// GPS ACCUEIL
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
        const d = (6371 * 2 * Math.atan2(Math.sqrt(Math.sin(((latDep - pos.coords.latitude) * Math.PI/180)/2)**2 + Math.cos(pos.coords.latitude * Math.PI/180) * Math.cos(latDep * Math.PI/180) * Math.sin(((lngDep - pos.coords.longitude) * Math.PI/180)/2)**2), Math.sqrt(1-(Math.sin(((latDep - pos.coords.latitude) * Math.PI/180)/2)**2 + Math.cos(pos.coords.latitude * Math.PI/180) * Math.cos(latDep * Math.PI/180) * Math.sin(((lngDep - pos.coords.longitude) * Math.PI/180)/2)**2))));
        document.getElementById('distance-gps').innerText = `À ${d.toFixed(1)} km de votre prochaine émotion`;
    });
}

function allerAuDepart() {
    window.open(`https://www.google.com/maps?daddr=${latDep},${lngDep}`, '_blank');
}

// ANIMATION DE TRANSITION (VORTEX)
function lancerVoyage() {
    const trans = document.getElementById('transition-voyage');
    const vortex = document.getElementById('vortex-map');
    const explorer = document.getElementById('ui-explorer');
    window.scrollTo(0,0);
    trans.style.display = 'block';
    explorer.style.opacity = '0';
    setTimeout(() => {
        vortex.style.opacity = '1';
        vortex.style.transition = "transform 3s ease-in, opacity 1s";
        vortex.style.transform = "scale(3)";
        setTimeout(() => {
            document.getElementById('map').style.display = 'block';
            document.getElementById('btn-quitter-carte').style.display = 'block';
            initMap();
            trans.style.display = 'none';
            document.body.style.overflow = "hidden";
        }, 2800);
    }, 100);
}

function initMap() {
    if (map) return;
    map = L.map('map', { zoomControl: false }).setView([50.407, 4.522], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    var trace = [[50.404741, 4.523157], [50.405149, 4.524318], [50.406281, 4.526237], [50.406527, 4.525638], [50.40675, 4.524963], [50.407117, 4.523852], [50.40651, 4.523013], [50.406253, 4.522654], [50.406561, 4.522122], [50.406818, 4.521565], [50.408204, 4.523373], [50.408706, 4.522609], [50.408878, 4.521914], [50.40911, 4.521411], [50.409005, 4.520713], [50.408489, 4.520219], [50.407981, 4.519698], [50.407497, 4.518906], [50.407638, 4.518756], [50.406828, 4.519497], [50.406623, 4.519893], [50.406276, 4.52026], [50.405674, 4.521287], [50.405391, 4.52133], [50.404547, 4.521566], [50.404603, 4.522819], [50.404492, 4.523032]];
    L.polyline(trace, {color: '#007AFF', weight: 6, opacity: 0.8}).addTo(map);

    var pts = [
        { latlng: [50.4044627, 4.5230877], t: "I. L'Éveil du Coq", file: "coq-ar.html" },
        { latlng: [50.4067226, 4.5250463], t: "II. Berceau de Lumière", file: "maison-ar.html" },
        { latlng: [50.4069696, 4.5217572], t: "III. Murmures d'Ouvriers", file: "etape2.html" },
        { latlng: [50.4082915, 4.5205504], t: "IV. Le Miroir de Sambre", file: "sambre-ar.html" },
        { latlng: [50.4046263, 4.5221912], t: "V. Le Souffle du Fer", file: "etape4.html" }
    ];

    pts.forEach((pt, i) => {
        let m = L.circleMarker(pt.latlng, {radius: 12, color: '#000', fillColor: '#97f097', fillOpacity: 1}).addTo(map);
        
        // ANIMATION SUR CLIC : La caméra zoome doucement sur le point avant d'ouvrir la popup
        m.on('click', function(e) {
            map.flyTo(e.latlng, 18, { animate: true, duration: 1.5 });
        });

        m.bindPopup(`<div style="color:black; text-align:center;">
            <b>${pt.t}</b><br>
            <button class="btn-action" onclick="window.location.href='${pt.file}'">DÉCOUVRIR L'ART</button>
        </div>`);
        
        L.marker(pt.latlng, { icon: L.divIcon({ className: 'label-etape', html: (i+1), iconSize: [24, 24], iconAnchor: [12, 12] }) }).addTo(map);
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
