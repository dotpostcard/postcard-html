<svelte:options tag="postcard-info" />

<script lang="ts">
  import type { Metadata } from "@dotpostcard/postcards";
  import { dateString } from "./helpers";

  export let downloadable: boolean = false
  // instead of `export let for: string` because for is a protected word, and can't be a variable name
  let { for: targetName } = $$props;

  const showDownloadLink = (
    typeof downloadable === 'boolean'
  ) ? downloadable : true

  const target = document.querySelector(`postcard-display[name="${targetName}"`)
  if (!target) {
    console.error(`No element <postcard-display name="${targetName}"> found to attach to from <postcard-info for="${targetName}">.`)
  }
  let metadata: Metadata
  let showingSide: string

  target?.addEventListener('postcard-loaded', (e: CustomEvent) => {
    metadata = e.detail.metadata
    showingSide = e.detail.showingSide
  })
  target?.addEventListener('postcard-flipped', (e: CustomEvent) => showingSide = e.detail.showingSide)

  $: context = metadata?.context?.description && metadata.context.description
  $: size = metadata?.size?.physical

  $: side = metadata && metadata[showingSide]
  $: description = side?.description && side.description
  $: transcription = side?.transcription && side.transcription
</script>

{#if context}<p lang={metadata.locale}><strong>Context:</strong> {context}</p>{/if}

{#if size}<p><strong>Physical size (front):</strong> {size}</p>{/if}
{#if metadata?.sentOn}<p><strong>Date:</strong> <time datetime={dateString(metadata?.sentOn)}>{dateString(metadata?.sentOn)}</time></p>{/if}

{#if metadata?.location?.name}<p><strong>Location:</strong> {metadata.location.name}</p>{/if}

{#if description || transcription}
  On the {showingSide}:

  {#if description}<p lang={metadata.locale}><strong>Description:</strong> {description}</p>{/if}
  {#if transcription}<p lang={metadata.locale}><strong>Transcription:</strong> {transcription}</p>{/if}
{/if}

{#if showDownloadLink}<a href={target?.getAttribute('src')}>Download postcard</a>{/if}
