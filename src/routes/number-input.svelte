<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { cn } from '$lib/utils';
  import type { Booleanish } from 'svelte/elements';

  interface Props {
    value: number;
    id: string;
    ariaInvalid?: Booleanish;
    errors?: string[] | undefined;
    label: string;
    tooltip?: string | undefined;
    min?: number;
    constraints: any;
    class?: string;
  }

  let {
    value = $bindable(),
    id,
    ariaInvalid = 'false',
    errors = undefined,
    label,
    tooltip = undefined,
    min = 0,
    constraints,
    class: className = '',
  }: Props = $props();

  const handleInput = (e: any) => {
    value = +e.target.value;
  };
</script>

<div class={cn('flex flex-col gap-1 items-start', className)}>
  <Label for={id} class="flex flex-col gap-1">
    {#if tooltip}
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>
            {label}
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>
              {tooltip}
            </p>
          </Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    {:else}
      {label}
    {/if}
  </Label>
  <Input
    type="number"
    bind:value
    name={id}
    {min}
    aria-invalid={ariaInvalid}
    oninput={handleInput}
    pattern="[0-9]*"
    class={cn('text-base focus:text-base', { 'border-destructive': errors && errors.length > 0 })}
    {...constraints}
  />
  {#if errors && errors.length > 0}
    <Label for={id} class="flex flex-col gap-1 text-destructive text-xs mx-1">
      {errors[0]}
    </Label>
  {/if}
</div>
