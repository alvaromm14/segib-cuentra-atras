<!-- Globo.svelte -->
<script>
    import world from "$data/110m.json";
    import Glow from "$components/Glow.svelte";

    import * as topojson from "topojson-client";
    import { geoOrthographic, geoPath } from "d3-geo";
    import { timer } from "d3-timer";
    import { spring } from "svelte/motion";

    let countries = topojson.feature(world, world.objects.countries).features;
    let borders = topojson.mesh(
        world,
        world.objects.countries,
        (a, b) => a !== b,
    );

    export let width = 400;
    export let height = 400;

    $: isMobile = width < 600;

    $: cx = isMobile ? width / 2 : width / 3;
    $: radius = isMobile ? width / 2 : width / 3;

    $: projection = geoOrthographic()
        .scale(radius)
        .rotate([$rotation, 0])
        .translate([cx, height / 2]);

    $: path = geoPath(projection);

    let rotation = spring(0, { stiffness: 0.08, damping: 0.4 });
    let degreesPerFrame = 0.2;

    const t = timer(() => {
        $rotation -= degreesPerFrame;
    }, 0);
</script>

<div class="globe-container" bind:clientWidth={width}>
    <svg {width} {height}>
        <Glow />
        <circle
            {cx}
            cy={height / 2}
            r={radius}
            fill="#d2d5d5"
            filter="url(#glow)"
        />
        {#each countries as country}
            <path d={path(country)} fill="#e8ebeb" stroke="none" />
        {/each}
        <path
            d={path(borders)}
            fill="none"
            stroke="#e8ebeb"
            stroke-width="0.25"
        />
    </svg>
</div>

<style>
    svg {
        overflow: visible;
    }

    .globe-container {
        max-width: 820px;
    }
</style>
