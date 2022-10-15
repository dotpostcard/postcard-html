<svelte:options tag="postcard-display" />

<script lang="ts">
  import { fetchPostcard } from '@dotpostcard/postcards'
  import { ShowSides } from './types'
  import { imageDescription, cssSize, parsePercent, svgPoints, cssSizeWithMargins } from './helpers'

  // The source of the .postcard file to display
  export let src: string
  export let show: ShowSides = ShowSides.BothFrontFirst
  export let scale: string = "100%"
  export let width: number = undefined
  export let height: number = undefined

  const scalePc = parsePercent(scale) || 1
  const sides = show.split(' ')
  let flipped: boolean = false

  const pcProm = fetchPostcard(src).then((pc: any) => {
    pc.metadata.size.setBounds((width || height) ? {w: width, h: height} : scalePc)
    return pc
  })
  const metaProm = pcProm.then(({ metadata }: any) => metadata)

  const bytesToUrl = (bytes: Uint8Array): string => URL.createObjectURL(new Blob([bytes]))

  const sideProms = sides.map(side => pcProm
    .then((pc: any) => (pc[`${side}Data`].then(bytes => ({ metadata: pc.metadata, bytes }))))
    .then(({metadata, bytes}) => ({
      src: bytesToUrl(bytes),
      size: side === 'front' ? metadata.size.front() : metadata.size.back(),
      secrets: metadata[side].secrets || [],
      ...imageDescription(metadata[side]),
    }))
  )

  const isFront = (i: number): boolean => sides[i] === ShowSides.FrontOnly
</script>

<style type="text/scss">
  .postcard {
    position: relative;
    perspective: 1000px;
    display: inline-block;
  }

  .side {
    position: absolute;

    backface-visibility: hidden;
    transition: transform 1s ease-out;
    transform-style: preserve-3d filter;

    * {
      width: 100%;
      height: 100%;
    }

    cursor: pointer;
    filter: drop-shadow(5px 5px 5px #777);

    svg {
      position: absolute;
      top: 0;
      left: 0;

      polygon {
        opacity: 0;
        transition: opacity 0.2s ease-in-out;

        &:hover {
          opacity: 1;
        }
      }
    }
  }

  .postcard.flipped.flip-book .side:first-child { transform: rotateY(180deg) }
  .postcard:not(.flipped).flip-book .side:last-child { transform: rotateY(180deg) }
  .postcard.flipped.flip-book .side:last-child { transform: rotateY(360deg) }

  .postcard.flipped.flip-left-hand .side:first-child { transform: rotate3d(1,-1,0,180deg) }
  .postcard:not(.flipped).flip-left-hand .side:last-child { transform: rotate3d(1,-1,0,-180deg) }
  .postcard.flipped.flip-left-hand .side:last-child { transform: rotate3d(1,-1,0,0deg) }
  
  .postcard.flipped.flip-calendar .side:first-child { transform: rotateX(180deg) }
  .postcard:not(.flipped).flip-calendar .side:last-child { transform: rotateX(180deg) }
  .postcard.flipped.flip-calendar .side:last-child { transform: rotateX(360deg) }

  .postcard.flipped.flip-right-hand .side:first-child { transform: rotate3d(1,1,0,180deg) }
  .postcard:not(.flipped).flip-right-hand .side:last-child { transform: rotate3d(1,1,0,-180deg) }
  .postcard.flipped.flip-right-hand .side:last-child { transform: rotate3d(1,1,0,0deg) }
  
</style>

{#await metaProm}
<div class="postcard loading" />
{:then metadata}
  <div class="postcard flip-{metadata.flip}" class:flipped={flipped} on:click={() => flipped = !flipped} style={cssSize(metadata.size.outer())}>

  {#each sideProms as sideProm, i}
    <div class="side" style={cssSizeWithMargins(metadata.size, isFront(i))}>
    {#await sideProm then side}
      <img src={side.src} alt={side.description} lang={side.locale}} />
      {#if side.secrets.length > 0}
        <svg>
          <defs>
            <linearGradient id="secret" x1="0" x2="2" y1="2" y2="0" gradientUnits="userSpaceOnUse" spreadMethod="reflect" vector-effect="non-scaling-size">
              <stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
              <stop offset="100%" stop-color="rgba(200,200,200,0.4)" />
              <animate attributeName="x1" dur="700ms" from="0" to="8" repeatCount="indefinite" />
              <animate attributeName="x2" dur="700ms" from="2" to="10" repeatCount="indefinite" />
            </linearGradient>
          </defs>
          {#each side.secrets as secret}
            <polygon points={svgPoints(secret, side.size)} style="fill:url(#secret); vector-effect: non-scaling-size;"/>
          {/each}
        </svg>
      {/if}
    {:catch error}
      <p>{error.message}</p>
    {/await}
    </div>

  {/each}

  </div>
{:catch error}
<div class="postcard error">  
  <p style="color: red">Metadata: {error.message}</p>
</div>
{/await}
