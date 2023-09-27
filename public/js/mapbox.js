/* eslint-disable */

export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicWl1eGFuIiwiYSI6ImNsbXk0eTZrdDE4d24ya250amYzMDZpNWkifQ.TviQi0qJYb8c1ZcizRBpfQ';// change to access token from your mapbox account
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/qiuxan/clmxypxhk022s01r68upre7rz',
        scrollZoom: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        //create marker
        const el = document.createElement('div');
        el.className = 'marker';

        //add marker to map
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates)
            .addTo(map);

        //add popup
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        //extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });

}

