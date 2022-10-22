<svelte:options tag="postcard-display" />

<script lang="ts">
  import { fetchPostcard } from '@dotpostcard/postcards'
  import styleToCss from 'style-object-to-css-string'
  import { ShowSides } from './types'
  import { imageDescription, svgPoints } from './helpers'
  import { createEventDispatcher } from "svelte"
  import { get_current_component } from "svelte/internal"
  import ErrorSVG from "../assets/error.svg"

  // The source of the .postcard file to display
  export let src: string
  // The name of the element, used exclusively for allowing automatic referencing 
  export let name: string | undefined = undefined
  export let show: ShowSides = ShowSides.BothFrontFirst

  const countWithName = name && document.querySelectorAll(`postcard-display[name="${name}"`).length
  if (countWithName && countWithName > 1) {
    console.warn(`There are ${countWithName} postcards with name="${name}". Any <postcard-info for="${name}"> elements will be attached to the first one only.`)
  }

  const sides = show.split(' ')
  let flipped: boolean = false

  // Complexity in events because of known Svelete bug: https://github.com/sveltejs/svelte/issues/3119
  const component = get_current_component()
  const svelteDispatch = createEventDispatcher()
  const dispatch = (eventName, detail) => {
    svelteDispatch(eventName, detail)
	  component.dispatchEvent && component.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true, detail }))
  }

  const bytesToUrl = (bytes: Uint8Array): string => URL.createObjectURL(new Blob([bytes]))
  const logError = (e) => { console.error(e); throw e }

  const pcProm = fetchPostcard(src)
  const metaProm = pcProm.then(({ metadata }: any) => metadata).catch(logError)

  metaProm.then((metadata) => {
    let a = 1, b = 1
    if (!metadata.size.isHeteroriented) {
      [a, b] = metadata.size.aspectRatio(isFront())
    }
    component.style.aspectRatio = `${a} / ${b}`
    dispatch('postcard-loaded', { name, metadata, showingSide: showingSide() })
  })

  const sideProms = sides.map(side => pcProm
    .then((pc: any) => (pc[`${side}Data`].then(bytes => ({ metadata: pc.metadata, bytes }))))
    .then(({metadata, bytes}) => ({
      src: bytesToUrl(bytes),
      secrets: metadata[side].secrets || [],
      description: imageDescription(metadata[side]),
    })).catch(logError)
  )

  const showingSide = (side: number = flipped ? 1 : 0): ShowSides => sides[side] as ShowSides
  const isFront = (side: number = flipped ? 1 : 0): boolean => showingSide(side) === ShowSides.FrontOnly
  const doFlip = () => {
    flipped = !flipped
    dispatch('postcard-flipped', { name, showingSide: showingSide() })
  }
</script>

<style type="text/scss">
  :host {
    display: block;
    width:100%;
    height: 100%;
  }

  .postcard {
    position: relative;
    perspective: 1000px;
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  .side {
    width: 100%;
    height: 100%;
    position: absolute;

    backface-visibility: hidden;
    transition: transform 1s ease-out;
    transform-style: preserve-3d;

    & > * {
      width: 100%;
      height: 100%;
    }

    cursor: pointer;
    filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.45));

    .secrets {
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

    .error {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border-radius: 2%;
      border: 2px dashed rgb(213, 161, 161);
      background-color: #f8f7f6;
      padding: 2% 4%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      svg {
        max-width: 128px;
        stroke: rgb(213, 161, 161);
      }
    }
  }

  .postcard.flipped.flip-book .side:first-child { transform: rotateY(180deg) }
  .postcard:not(.flipped).flip-book .side:nth-child(2) { transform: rotateY(180deg) }
  .postcard.flipped.flip-book .side:nth-child(2) { transform: rotateY(360deg) }

  .postcard.flipped.flip-left-hand .side:first-child { transform: rotate3d(1,-1,0,180deg) }
  .postcard:not(.flipped).flip-left-hand .side:nth-child(2) { transform: rotate3d(1,-1,0,-180deg) }
  .postcard.flipped.flip-left-hand .side:nth-child(2) { transform: rotate3d(1,-1,0,0deg) }
  
  .postcard.flipped.flip-calendar .side:first-child { transform: rotateX(180deg) }
  .postcard:not(.flipped).flip-calendar .side:nth-child(2) { transform: rotateX(180deg) }
  .postcard.flipped.flip-calendar .side:nth-child(2) { transform: rotateX(360deg) }

  .postcard.flipped.flip-right-hand .side:first-child { transform: rotate3d(1,1,0,180deg) }
  .postcard:not(.flipped).flip-right-hand .side:nth-child(2) { transform: rotate3d(1,1,0,-180deg) }
  .postcard.flipped.flip-right-hand .side:nth-child(2) { transform: rotate3d(1,1,0,0deg) }
</style>

{#await metaProm}
<div class="postcard loading" />
{:then metadata}
  <div class="postcard flip-{metadata.flip}" class:flipped={flipped}>

    {#each sideProms as sideProm, i}
      <div class="side" style={styleToCss(metadata.size.css(isFront(i)))} on:click={doFlip}>
      {#await sideProm then side}
        <img src={side.src} alt={side.description[0]} lang={side.description[1]} />
        {#if side.secrets.length > 0}
          <svg class="secrets" viewbox="0 0 1 1">
            <defs>
              <linearGradient id="secret" x1="0" x2="0.01" y1="0.01" y2="0" gradientUnits="userSpaceOnUse" spreadMethod="reflect" vector-effect="non-scaling-size">
                <stop offset="0%" stop-color="rgba(255,255,255,0.2)" />
                <stop offset="100%" stop-color="rgba(200,200,200,0.4)" />
                <animate attributeName="x1" dur="700ms" from="0" to="0.04" repeatCount="indefinite" />
                <animate attributeName="x2" dur="700ms" from="0.01" to="0.05" repeatCount="indefinite" />
              </linearGradient>
            </defs>
            {#each side.secrets as secret}
              <polygon points={svgPoints(secret)} style="fill:url(#secret); vector-effect: non-scaling-size;"/>
            {/each}
          </svg>
        {/if}
      {:catch error}
        <div class="error"><ErrorSVG /></div>
      {/await}
      </div>

    {/each}
  </div>
{:catch error}
<div class="postcard error">  
  <div class="error"><ErrorSVG /></div>
</div>
{/await}
