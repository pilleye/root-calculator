<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Tooltip from '$lib/components/ui/tooltip';

	export let value: number;
	export let id: string;
	export let label: string;
	export let tooltip: string | undefined = undefined;
	export let min: number = 0;
</script>

<div class="flex flex-col gap-1 items-start">
	<Label for={id} class="flex flex-col gap-1">
		{#if tooltip}
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
		{:else}
			{label}
		{/if}
	</Label>
	<Input type="number" bind:value name={id} {min} />
</div>
