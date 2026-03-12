<script>
    import { onMount, onDestroy } from "svelte";

    export let target = null;
    export let targetText = null;
    export let label = null;

    function getTimeLeft() {
        const diff = Math.max(0, target - new Date());
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
    }

    const units = [
        { key: "days", pad: 3, sublabel: "días", scale: 1 },
        { key: "hours", pad: 2, sublabel: "horas", scale: 0.7 },
        { key: "minutes", pad: 2, sublabel: "minutos", scale: 0.7 },
        { key: "seconds", pad: 2, sublabel: "segundos", scale: 0.7 },
    ];

    function pad(val, width) {
        return String(val).padStart(width, "0").split("");
    }

    // For each unit×digit we store: { from, to, flipping }
    // 'from' = digit shown in the static background + flap-top (old value)
    // 'to'   = digit shown in the flap-bottom (new value, revealed by animation)
    // These are only updated AFTER the animation finishes, keeping DOM stable.
    let slots = units.map((u) => {
        const ds = pad(getTimeLeft()[u.key], u.pad);
        return ds.map((d) => ({ from: d, to: d, flipping: false }));
    });

    function update() {
        const next = getTimeLeft();

        units.forEach((u, ui) => {
            const nextDigits = pad(next[u.key], u.pad);

            nextDigits.forEach((newD, di) => {
                const slot = slots[ui][di];
                if (newD === slot.from) return; // nothing changed

                // Freeze 'to' as the incoming digit and start animation.
                // 'from' stays as-is so the static background keeps the old digit.
                slots[ui][di] = { from: slot.from, to: newD, flipping: true };

                // After animation completes, promote 'to' → 'from' and stop flip.
                setTimeout(() => {
                    slots[ui][di] = { from: newD, to: newD, flipping: false };
                    slots = [...slots];
                }, 700);
            });
        });

        slots = [...slots];
    }

    let interval;
    let visible = false;

    onMount(() => {
        setTimeout(() => {
            visible = true;
            interval = setInterval(update, 1000);
        }, 600);
    });

    onDestroy(() => clearInterval(interval));

    let containerWidth = 0;
    let containerHeight = 0;

    const totalCards = 9;
    const totalSeps = 3;
    const gapCard = 3;
    const gapGroup = 8;
    const sepWidth = 20;

    $: cardHeight = Math.min(
        containerHeight * 0.8,
        (containerWidth -
            totalSeps * sepWidth -
            (totalCards - 1) * gapCard -
            totalSeps * gapGroup) /
            totalCards /
            0.68,
    );

    $: cardWidth = cardHeight * 0.68;
    $: fontSize = cardHeight * 0.72;
    $: sublabelHeight = (scale) => Math.max(9, cardHeight * scale * 0.18) + 6;
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Lato:wght@600;700&family=Oswald:wght@600&display=swap"
        rel="stylesheet"
    />
</svelte:head>

{#if visible}
    <div
        class="countdown"
        bind:clientWidth={containerWidth}
        bind:clientHeight={containerHeight}
    >
        <p class="countdown-label">{label}</p>

        <div class="flip-clock">
            {#each units as unit, ui}
                <div class="unit">
                    <div class="cards">
                        {#each slots[ui] as slot, di}
                            <div
                                class="flip-card"
                                class:flipping={slot.flipping}
                                style="
                                    width:{cardWidth * unit.scale}px;
                                    height:{cardHeight * unit.scale}px;
                                    --card-h:{cardHeight * unit.scale}px;
                                    --font-size:{fontSize * unit.scale}px;
                                "
                            >
                                <!-- Static top: shows new digit (revealed as flap-top folds away) -->
                                <div class="static-top">
                                    <div class="static-digit">{slot.to}</div>
                                </div>
                                <!-- Static bottom: shows old digit (hidden behind flap-bottom until it falls) -->
                                <div class="static-bottom">
                                    <div class="static-digit">{slot.from}</div>
                                </div>

                                <div class="divider"></div>

                                <!-- Flap top: old digit, folds away -->
                                <div class="flap flap-top">
                                    <div class="static-digit">{slot.from}</div>
                                </div>

                                <!-- Flap bottom: NEW digit, falls in to reveal -->
                                <div class="flap flap-bottom">
                                    <div class="static-digit">{slot.to}</div>
                                </div>
                            </div>
                        {/each}
                    </div>

                    <p
                        class="sublabel"
                        style="font-size:{Math.max(
                            9,
                            cardHeight * unit.scale * 0.18,
                        )}px;"
                    >
                        {unit.sublabel}
                    </p>
                </div>

                {#if ui < units.length - 1}
                    <div
                        class="separator"
                        style="
                            font-size:{cardHeight *
                            units[ui + 1].scale *
                            0.5}px;
                            padding-bottom:{sublabelHeight(
                            units[ui + 1].scale,
                        )}px;
                        "
                    >
                        :
                    </div>
                {/if}
            {/each}
        </div>

        <hr class="target-divider" />

        <h5 class="target-date">
            {targetText}
        </h5>
    </div>
{/if}

<style>
    .countdown {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 0.5rem;
    }

    .countdown-label {
        color: #212c55;
        font-weight: 700;
        font-size: 2.5rem;
        line-height: 1.1;
        margin: 0 0 0.2em 0;
        text-align: left;
    }

    .flip-clock {
        display: flex;
        align-items: flex-end;
        gap: 8px;
    }

    .unit {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
    }

    .cards {
        display: flex;
        gap: 3px;
    }

    .sublabel {
        font-family: "Lato", sans-serif;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #888;
        margin: 0;
    }

    .flip-card {
        position: relative;
        perspective: 200px;
    }

    /* Two static background halves */
    .static-top,
    .static-bottom {
        position: absolute;
        left: 0;
        width: 100%;
        height: 50%;
        overflow: hidden;
        z-index: 0;
    }

    .static-top {
        top: 0;
        background: #212c55;
        border-radius: 5px 5px 0 0;
        box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.5);
    }

    .static-bottom {
        bottom: 0;
        background: #212c55;
        border-radius: 0 0 5px 5px;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.35);
    }

    /* The digit label, clipped to its half */
    .static-top .static-digit,
    .static-bottom .static-digit {
        height: var(--card-h);
        position: absolute;
        left: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Oswald", sans-serif;
        font-size: var(--font-size);
        font-weight: 600;
        color: #f3f7fb;
        line-height: 1;
    }

    .static-top .static-digit {
        top: 0;
    }
    .static-bottom .static-digit {
        top: calc(var(--card-h) * -0.5);
    }

    .divider {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 2px;
        background: #212c55;
        transform: translateY(-50%);
        z-index: 5;
    }

    .flap {
        position: absolute;
        left: 0;
        width: 100%;
        height: 50%;
        overflow: hidden;
        opacity: 0;
        backface-visibility: hidden;
        z-index: 3;
    }

    .flap-top {
        top: 0;
        background: #212c55;
        border-radius: 5px 5px 0 0;
        transform-origin: bottom center;
    }

    .flap-bottom {
        bottom: 0;
        background: #212c55;
        border-radius: 0 0 5px 5px;
        transform-origin: top center;
        transform: rotateX(-90deg);
        opacity: 0;
    }

    .flap .static-digit {
        height: var(--card-h);
        position: absolute;
        left: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: "Oswald", sans-serif;
        font-size: var(--font-size);
        font-weight: 600;
        color: #f3f7fb;
        line-height: 1;
        z-index: 3;
    }

    .flap-top .static-digit {
        top: 0;
    }
    .flap-bottom .static-digit {
        top: calc(var(--card-h) * -0.5);
    }

    /* Animations only trigger on .flipping cards */
    .flip-card.flipping .flap-top {
        opacity: 1;
        animation: flipTop 0.35s ease-in forwards;
    }

    .flip-card.flipping .flap-bottom {
        animation: flipBottom 0.35s ease-out 0.35s forwards;
    }

    @keyframes flipTop {
        from {
            transform: rotateX(0deg);
        }
        to {
            transform: rotateX(-90deg);
        }
    }

    @keyframes flipBottom {
        from {
            transform: rotateX(-90deg);
            opacity: 1;
        }
        to {
            transform: rotateX(0deg);
            opacity: 1;
        }
    }

    .target-divider {
        width: 20%;
        border: none;
        border-top: 1px solid rgba(33, 44, 85);
        margin: 0.75rem 0;
    }

    .target-date {
        color: #212c55;
        font-weight: 400;
        font-size: 1.375rem;
    }
</style>
