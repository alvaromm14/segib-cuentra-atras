<script>
  import Globo from "$components/Globo.svelte";
  import Contador from "$components/Contador.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    function updateIframeHeight() {
      const height = Math.ceil(document.body.scrollHeight);
      const width = Math.ceil(document.body.scrollWidth);
      window.parent.postMessage(
        { type: "resize-iframe", value: height, width },
        "*",
      );
    }

    updateIframeHeight();

    if (window.ResizeObserver) {
      new ResizeObserver(() => updateIframeHeight()).observe(
        document.documentElement,
      );
    } else {
      window.addEventListener("resize", updateIframeHeight);
    }

    window.addEventListener("message", (event) => {
      if (event.data.type === "request-resize") updateIframeHeight();
    });
  });

  let width = 0;
  $: height = width ? (width < 600 ? width : Math.round(width * 0.7)) : 575;
</script>

<div class="chart-container" bind:clientWidth={width}>
  <div class="globe-layout" style:height="{height}px">
    <Globo {width} {height} />

    <div class="contador-wrapper">
      <Contador
        target={new Date("2026-12-03T12:00:00")}
        targetTitle="Cuenta atrás para el lanzamiento"
        targetDate="3 de diciembre · 12:00h"
        label="Informe de Cooperación Sur-Sur y Triangular en Iberoamérica 2026"
      />
    </div>
  </div>
</div>

<style>
  .chart-container {
    max-width: 820px;
    margin: 2rem auto;
  }

  .globe-layout {
    position: relative;
  }

  .globe-layout :global(svg) {
    opacity: 0.75;
  }

  .contador-wrapper {
    position: absolute;
    left: 40%;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    text-align: left;
    pointer-events: none;
    z-index: 10;
  }

  .contador-wrapper :global(.countdown-label) {
    text-shadow:
      0 0 20px rgba(243, 247, 251, 0.9),
      0 0 40px rgba(243, 247, 251, 0.8),
      0 0 60px rgba(243, 247, 251, 0.6);
  }

  @media (max-width: 600px) {
    .chart-container {
      margin: 0 auto;
      overflow: visible;
    }

    .globe-layout {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .globe-layout :global(svg) {
      position: relative;
      top: auto;
      left: auto;
      transform: none;
      width: 100%;
      height: auto;
      opacity: 0.6;
    }

    .contador-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      text-align: center;
      z-index: 10;
    }

    .contador-wrapper :global(.countdown) {
      align-items: center;
    }

    .contador-wrapper :global(.countdown-label) {
      text-align: center;
    }

    .contador-wrapper :global(.unit) {
      align-items: center;
    }

    .contador-wrapper :global(.line1) {
      font-size: 1.2rem;
    }

    .contador-wrapper :global(.line2) {
      font-size: 1rem;
    }
  }
</style>
