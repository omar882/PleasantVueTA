<script>
	import { session } from '$lib/stores/session.js'
	import { onMount } from 'svelte'
    import ordinal from 'ordinal';

    let map;

    const roomLocations = {
        GYM: [37.6688376, -121.8753378],
        B1: [37.6674119, -121.8738049],
        B2: [37.6674242, -121.8739149],
        B3: [37.6674353, -121.8740276],
        B4: [37.6674521, -121.8741503],
        B5: [37.6674666, -121.8742659],
        B6: [],
        B7: [],
        B8: [],
        B9: [],
        
    }

    async function loadMap() {
        await import("leaflet/dist/leaflet.css");
        const L = await import("leaflet");
        // alert(window.screen.width);
        map = L.map("map", {
            maxBounds: L.latLngBounds(L.latLng(37.67080,-121.87760),L.latLng(37.66583,-121.87245)),
            minZoom: 16,
            maxBoundsViscosity: 1,
        }).setView([37.66862, -121.87452], 18);
        map.attributionControl.setPrefix("Leaflet");
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '© OpenStreetMap Contributors',
        }).addTo(map);

        if ($session?.gradebook) {
            for (const course of ($session?.gradebook?.Courses?.[0]?.Course) || []) {
                if (course?.$?.Room && course?.$?.Room?.toUpperCase?.() in roomLocations) {
                    // L.marker(roomLocations[course.$.Room.toUpperCase()]).addTo(map)
                    const tooltip = L.tooltip(roomLocations[course.$.Room.toUpperCase()])
                    if (course.$.Period) {
                        try {
                            const num = parseInt(course.$.Period);
                            tooltip.setContent(`<span>${ordinal(num)}: ${course.$.Room}</span>`)    
                        } catch (excpected) {
                            tooltip.setContent(`<span>${course.$.Period}: ${course.$.Room}</span>`)
                        }
                        
                    }
                    tooltip.addTo(map) // possible XSS?
                }
            }
        }
        
    }

    onMount(async () => {
        await loadMap();
    })

</script>

<svelte:head>
	<title>Map</title>
</svelte:head>

<div class="layout" data-sveltekit-prefetch>
	<div class="grid-heading-container">
		<h1>Map</h1>
	</div>
	<div class="content">
		<div id="map"></div>
	</div>
</div>

<style lang="scss">
    .layout {
        height: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 64px 1fr;
    }

    .grid-heading-container {
        grid-column: 1/2;
        grid-row: 1/2;
        z-index: 1000;
        position: absolute;
        
        justify-self: end;
        margin-right: 10px;
    }

    .content {
        grid-column: 1/2;
        grid-row: 1/3;
    }
    
	#map {
        height: 100%;
    }
	
</style>
