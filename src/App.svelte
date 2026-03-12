<script>
  import Globo from "$components/Globo.svelte";
  import Contador from "$components/Contador.svelte";

  let width = 0;
  let height = 575;
</script>

<div class="chart-container" bind:clientWidth={width}>
  <div class="globe-layout">
    <Globo {width} {height} />

    <div class="contador-wrapper">
      <Contador
        target={new Date("2026-12-01T12:00:00")}
        targetText="4 de diciembre, 12h00"
        label="Informe 2025"
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
    top: 50%;
    transform: translate(0%, -50%);
    width: 70%;
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
    .globe-layout {
      min-height: 420px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .globe-layout :global(svg) {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.6;
      pointer-events: none;
    }

    .contador-wrapper {
      position: relative;
      left: auto;
      top: auto;
      transform: none;
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
  }

  :global(body) {
    background: #f3f7fb;
  }
</style>
