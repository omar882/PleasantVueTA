<script>
	import { session } from '$lib/stores/session.js'
	import { onDestroy, onMount } from 'svelte'
    import MissingData from '$lib/components/MissingData.svelte';
    import { browser } from '$app/environment';

    let map;
    let L;

    const roomLocations = {
        LOCKER_ROOM_MALE: [37.66885,-121.87506],
        LOCKER_ROOM_FEMALE: [37.66833,-121.87463],
        GYM: [37.6688376, -121.8753378],
        "SMALL GYM": [37.66830,-121.87443],
        OFFICE: [37.66772,-121.87401],
        THEATRE: [37.66818,-121.87405],
        "CAFE NORTH": [37.66834,-121.87477],
        "CAFE SOUTH": [37.66683,-121.87489],
        B1: [37.6674119, -121.8738049],
        B2: [37.6674242, -121.8739149],
        B3: [37.6674353, -121.8740276],
        B4: [37.6674521, -121.8741503],
        B5: [37.6674666, -121.8742659],
        B6: [37.66748, -121.87438],
        B7: [37.66749, -121.87447],
        B8: [37.66751, -121.87459],
        C1: [37.66718, -121.87384],
        C2: [37.66719, -121.87395],
        C3: [37.66721, -121.87408],
        C4: [37.66723, -121.87425],
        C5: [37.66724, -121.87441],
        C6: [37.66727, -121.87461],
        D1: [37.66703, -121.87463],
        D2: [37.66702, -121.87445],
        D3: [37.66700, -121.87425],
        D4: [37.66691, -121.87427],
        D5: [37.66694, -121.87445],
        D6: [37.66695, -121.87462],
        D7: [37.66699, -121.87412],
        D8: [37.66690, -121.87411],
        D9: [37.66689, -121.87393],
        D10: [37.66680, -121.87396],
        D11: [37.66699, -121.87392],
        D12: [37.66686, -121.87384],
        E1: [37.66681, -121.87449],
        E2: [37.66676, -121.87426],
        E3: [37.66669, -121.87428],
        E4: [37.66669, -121.87428],
        E5: [37.66669, -121.87428],
        MP: [37.66682, -121.87509],
        F1: [37.66665,-121.87518],
        G1: [37.66682,-121.87549],
        G2: [37.66677,-121.87538],
        G3: [37.66666,-121.87540],
        G4: [37.66666,-121.87553],
        G5: [37.66675,-121.87552],
        H1: [37.66743,-121.87525],
        H2: [37.66738,-121.87535],
        H3: [37.66730,-121.87537],
        H4: [37.66718,-121.87537],
        H5: [37.66744,-121.87536],
        H6: [37.66739,-121.87541],
        H7: [37.66729,-121.87543],
        H8: [37.66719,-121.87545],
        H9: [37.66721,-121.87555],
        H10: [37.66730,-121.87552],
        H11: [37.66740,-121.87551],
        H12: [37.66746,-121.87550],
        I1: [37.66774,-121.87564],
        I2: [37.66767,-121.87566],
        I3: [37.66760,-121.87568],
        I4: [37.66752,-121.87570],
        I5: [37.66744,-121.87572],
        I6: [37.66746,-121.87584],
        I7: [37.66754,-121.87582],
        I8: [37.66762,-121.87580],
        I9: [37.66770,-121.87578],
        I10: [37.66778,-121.87576],
        J1: [37.66771,-121.87546],
        J2: [37.66781,-121.87544],
        J3: [37.66792,-121.87542],
        J4: [37.66803,-121.87540],
        J5: [37.66802,-121.87528],
        J6: [37.66801,-121.87516],
        J7: [37.66801,-121.87506],
        J8: [37.66799,-121.87495],
        MUSIC: [37.66852,-121.87561],
        LIBRARY: [37.66777,-121.87513],
        WELLNESS: [37.66791,-121.87496],
        L1: [37.66802,-121.87565],
        L2: [37.66812,-121.87563],
        L3: [37.66822,-121.87562],
        L4: [37.66804,-121.87575],
        L5: [37.66814,-121.87573],
        L6: [37.66824,-121.87572],
        M1: [37.66847,-121.87511],
        M2: [37.66836,-121.87512],
        M3: [37.66827,-121.87514],
        M4: [37.66817,-121.87519],
        M5: [37.66819,-121.87530],
        M6: [37.66820,-121.87538],
        M7: [37.66828,-121.87532],
        M8: [37.66839,-121.87530],
        M9: [37.66848,-121.87528],
        "BOYS LOCKER": [37.66886,-121.87507],
        "GIRLS LOCKER": [37.66833,-121.87465],
        P1: [37.66938,-121.87507],
        P2: [37.66937,-121.87499],
        P3: [37.66936,-121.87489],
        P4: [37.66935,-121.87480],
        P5: [37.66934,-121.87471],
        P6: [37.66933,-121.87463],
        P7: [37.66932,-121.87454],
        P9: [37.66788,-121.87572],
        Q101: [37.66853,-121.87412],
        Q102: [37.66852,-121.87397],
        Q103: [37.66862,-121.87409],
        Q104: [37.66861,-121.87395],
        Q105: [37.66870,-121.87408],
        Q106: [37.66870,-121.87394],
        Q107: [37.66890,-121.87411],
        Q108: [37.66897,-121.87400],
        Q109: [37.66896,-121.87417],
        Q110: [37.66904,-121.87406],
        Q111: [37.66903,-121.87423],
        Q112: [37.66910,-121.87411],
        Q201: [37.66853,-121.87412],
        Q202: [37.66852,-121.87397],
        Q203: [37.66862,-121.87409],
        Q204: [37.66861,-121.87395],
        Q205: [37.66870,-121.87408],
        Q206: [37.66870,-121.87394],
        Q207: [37.66890,-121.87411],
        Q208: [37.66897,-121.87400],
        Q209: [37.66896,-121.87417],
        Q210: [37.66904,-121.87406],
        Q211: [37.66903,-121.87423],
        Q212: [37.66910,-121.87411],
        R101: [37.66699,-121.87531],
        R102: [37.66700,-121.87541],
        R103: [37.66701,-121.87551],
        R120: [37.66702,-121.87561],
        R121: [37.66703,-121.87571],
        R123: [37.66704,-121.87581],
        R124: [37.66705,-121.87591],
        R201: [37.66699,-121.87531],
        R202: [37.66700,-121.87541],
        R203: [37.66701,-121.87551],
        R210: [37.66702,-121.87561],
        R213: [37.66703,-121.87571],
        R211: [37.66704,-121.87581],
        R212: [37.66705,-121.87591],
    }

    const indicator = (i) => {
        i = Math.abs(i)
        var cent = i % 100
        if (cent >= 10 && cent <= 20) return 'th'
        var dec = i % 10
        if (dec === 1) return 'st'
        if (dec === 2) return 'nd'
        if (dec === 3) return 'rd'
        return 'th'
    }

    const ordinal = (i) => {
        if (typeof i !== 'number') throw new TypeError('Expected Number, got ' + (typeof i) + ' ' + i)

        if (!Number.isFinite(i)) return i
        return i + indicator(i)
    }

    onDestroy(() => {
        if (browser) {
            map.remove();
        }
    })

    async function loadMap() {
        await import("leaflet/dist/leaflet.css");
        L = (await import("leaflet")).default;
        // alert(window.screen.width);
        map = L.map("map", {
            maxBounds: L.latLngBounds(L.latLng(37.67080,-121.87760),L.latLng(37.66583,-121.87245)),
            minZoom: 16,
            maxBoundsViscosity: 1,
        }).setView([37.66800,-121.87494], 18);
        map.attributionControl.setPrefix("Leaflet");
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '© OpenStreetMap Contributors',
        }).addTo(map);

        if ($session?.gradebook) {
            for (const course of ($session?.gradebook?.Courses?.[0]?.Course) || []) {
                const normalizedName = course?.$?.Room?.toUpperCase?.().replace("-", "");
                if (normalizedName in roomLocations) {
                    // L.marker(roomLocations[course.$.Room.toUpperCase()]).addTo(map)
                    const tooltip = L.tooltip(roomLocations[normalizedName], {permanent:true})
                    // console.log([normalizedName.includes("GYM") && $session?.student?.Gender?.[0]]);
                    if (normalizedName.includes("GYM") && $session?.student?.Gender?.[0]) {
                        if ($session?.student?.Gender?.[0] === "Male" || $session?.student?.Gender?.[0] === "Spider") {
                            const tooltip_locker_room = L.tooltip(roomLocations.LOCKER_ROOM_MALE, {permanent:true});
                            tooltip_locker_room.setContent(`<span>Locker Room</span>`);
                            tooltip_locker_room.addTo(map);
                        } else if ($session?.student?.Gender?.[0] == "Female") {
                            const tooltip_locker_room = L.tooltip(roomLocations.LOCKER_ROOM_FEMALE, {permanent:true});
                            tooltip_locker_room.setContent(`<span>Locker Room</span>`);
                            tooltip_locker_room.addTo(map);
                        }
                    }
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
	<title>Map - PleasantVue</title>
</svelte:head>

<div class="layout" data-sveltekit-prefetch>
    {#if $session.student?.CurrentSchool?.[0] && !($session.student.CurrentSchool[0].includes("Amador"))}
		<h1>Map</h1>
        <MissingData message={"We are missing map data for your school!"} />
    {:else}
    <div class="grid-heading-container">
		<h1 class="map-header">Map of AVHS</h1>
	</div>
	<div class="content">
		<div id="map"></div>
	</div>
    {/if}
</div>

<style lang="scss">

    .content {
        height: calc(100vh - 40px);
    }
    .map-header {
        margin: 0;
        padding: 0;
    }

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
        justify-items: end;
        margin-right: 10px;
        align-items: center;
        padding: 10px;
        border-radius: 10px;
        gap: 10px;
        background-color: rgb(255 255 255 / 40%);
    }

    .content {
        grid-column: 1/2;
        grid-row: 1/3;
    }
    
	#map {
        // pointer-events: none;
        height: 100%;
    }
	
</style>
