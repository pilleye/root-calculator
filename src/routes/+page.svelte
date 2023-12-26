<script lang="ts">
	import { Loader2 } from 'lucide-svelte';

	import { calculate } from '$lib/calculator';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import NumberInput from './number-input.svelte';

	let attackers: number = 0;
	let attackerCardboard: number = 0;
	let attackerDamageBonus: number = 0;
	let attackerShieldBonus: number = 0;
	let defenders: number = 0;
	let defenderCardboard: number = 0;
	let defenderDamageBonus: number = 0;
	let defenderShieldBonus: number = 0;
	let numBattles: number = 1;
	let againstWoodland: boolean = false;

	let calculating: boolean = false;
	let dialogOpen: boolean = false;
	let results: string = '';

	function toInt(value: string | number): number {
		return parseInt(value.toString() || '0');
	}

	function runCalculate() {
		calculating = true;

		const result = calculate(
			{
				pieces: {
					attackers: toInt(attackers),
					attackerCardboard: toInt(attackerCardboard),
					defenders: toInt(defenders),
					defenderCardboard: toInt(defenderCardboard)
				}
			},
			{
				againstWoodland,
				attackerDamageBonus: toInt(attackerDamageBonus),
				attackerShieldBonus: toInt(attackerShieldBonus),
				defenderDamageBonus: toInt(defenderDamageBonus),
				defenderShieldBonus: toInt(defenderShieldBonus)
			},
			toInt(numBattles.toString() || '1')
		);

		results = result;
		dialogOpen = true;
		calculating = false;
	}
</script>

<div class="block mx-auto container max-w-lg">
	<h1 class="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl mt-8 mb-4">
		Root Dice Roll Calculator
	</h1>
	<div class="flex flex-col gap-4">
		<NumberInput
			id="attackers"
			bind:value={attackers}
			label="Attackers"
			tooltip="Number of Attackers"
		/>
		<NumberInput
			id="attackerCardboard"
			bind:value={attackerCardboard}
			label="Attacker Cardboard"
			tooltip="Number of attacker cardboard pieces"
		/>
		<NumberInput
			id="attackerDamageBonus"
			bind:value={attackerDamageBonus}
			label="Attacker Damage Bonus"
			tooltip="Damage bonus inflicted by the attacker every round (i.e. Rat's Wrathful)"
		/>
		<NumberInput
			id="attackerShieldBonus"
			bind:value={attackerShieldBonus}
			label="Attacker Shielding Bonus"
			tooltip="Damage ignored by the attacker every round (i.e. Rat's Stubborn)"
		/>
		<NumberInput
			id="defenders"
			bind:value={defenders}
			label="Defenders"
			tooltip="Number of Defenders"
		/>
		<NumberInput
			id="defenderCardboard"
			bind:value={defenderCardboard}
			label="Defender Cardboard"
			tooltip="Number of defender cardboard pieces"
		/>
		<NumberInput
			id="defenderDamageBonus"
			bind:value={defenderDamageBonus}
			label="Defender Damage Bonus"
			tooltip="Damage bonus inflicted by the defender every round (i.e. Mouse Partisans)"
		/>
		<NumberInput
			id="defenderShieldBonus"
			bind:value={defenderShieldBonus}
			label="Defender Shielding Bonus"
			tooltip="Damage ignored by the defender every round (i.e. Rat's Stubborn)"
		/>
		<div class="flex items-center space-x-2 ml-1">
			<Checkbox
				id="againstWoodland"
				bind:checked={againstWoodland}
				aria-labelledby="againstWoodland-label"
			/>
			<Label
				id="againstWoodland-label"
				for="againstWoodland"
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>Defender Takes High Roll (i.e. Fighting Woodland)</Label
			>
		</div>
		<NumberInput id="numBattles" bind:value={numBattles} label="Number of Battles" min={1} />

		<Dialog.Root bind:open={dialogOpen}>
			<Dialog.Trigger />
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Battle Results</Dialog.Title>
				</Dialog.Header>
				<p class="bg-muted text-muted-foreground p-4 text-sm font-mono whitespace-pre-line">
					{results}
				</p>
			</Dialog.Content>
		</Dialog.Root>
		<Button type="button" on:click={runCalculate} disabled={calculating}>
			{#if calculating}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				Calculating
			{:else}
				Calculate
			{/if}
		</Button>
	</div>
</div>
