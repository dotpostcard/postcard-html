<svelte:options tag="postcard-info" />

<script lang="ts">
  import type { Metadata } from "@dotpostcard/postcards";
  import { dateString, localizedText } from "./helpers";

  // instead of `export let for: string` because for is a protected word, and can't be a variable name
  let { for: targetName } = $$props;

  const target = document.querySelector(`postcard-display[name="${targetName}"`)
  if (!target) {
    console.error(`No element <postcard-display name="${targetName}"> found to attach to from <postcard-info for="${targetName}">.`)
  }
  let metadata: Metadata
  let showingSide: string

  target?.addEventListener('postcard-loaded', (e: CustomEvent) => {
    metadata = e.detail.metadata
    showingSide = e.detail.showingSide
    console.log(metadata)
  })
  target?.addEventListener('postcard-flipped', (e: CustomEvent) => showingSide = e.detail.showingSide)

  $: context = metadata?.context?.description && localizedText(metadata.context.description)
  $: size = metadata?.size?.physical

  $: side = metadata && metadata[showingSide]
  $: description = side?.description && localizedText(side.description, false)
  $: transcription = side?.transcription && localizedText(side.transcription, true)
  
</script>

{#if description}<p lang={description[1]}><strong>Description:</strong> {description[0]}</p>{/if}
{#if transcription}<p lang={transcription[1]}><strong>Transcription:</strong> {transcription[0]}</p>{/if}
{#if context}<p lang={context[1]}><strong>Context:</strong> {context[0]}</p>{/if}

{#if size}<p><strong>Physical size (front):</strong> {size}</p>{/if}
{#if metadata?.sentOn}<p><strong>Date:</strong> <time datetime={dateString(metadata?.sentOn)}>{dateString(metadata?.sentOn)}</time></p>{/if}

{#if metadata?.location}<p><strong>Location:</strong> {metadata.location.name}</p>{/if}
