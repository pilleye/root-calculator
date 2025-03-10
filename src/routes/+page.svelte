<script lang="ts">
  import { AlertTriangleIcon, Loader2 } from 'lucide-svelte';
  import { defaults } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms/client';
  import { zod } from 'sveltekit-superforms/adapters';

  import { calculate } from '$lib/calculator';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Label } from '$lib/components/ui/label';
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import NumberInput from './number-input.svelte';
  import ThemeSwitch from './theme-switch.svelte';
  import { inputSchema } from './schema';

  const { form, errors, constraints, enhance, allErrors, submitting } = superForm(
    defaults(zod(inputSchema)),
    {
      SPA: true,
      taintedMessage: null,
      validators: zod(inputSchema),
      resetForm: false,
      async onUpdate({ form }) {
        if (!form.valid) {
          return;
        }

        const {
          attackers,
          attackerCardboard,
          defenders,
          defenderCardboard,
          againstWoodland,
          attackerDamageBonus,
          attackerShieldBonus,
          defenderDamageBonus,
          defenderShieldBonus,
          numBattles,
        } = form.data;

        results = calculate(
          {
            pieces: {
              attackers,
              attackerCardboard,
              defenders,
              defenderCardboard,
            },
          },
          {
            againstWoodland,
            attackerDamageBonus,
            attackerShieldBonus,
            defenderDamageBonus,
            defenderShieldBonus,
          },
          numBattles,
        );

        dialogOpen = true;
      },
    },
  );

  let valid = $derived($allErrors.length === 0);

  let dialogOpen: boolean = $state(false);
  let results: string = $state('');
</script>

<div class="block mx-auto container max-w-lg">
  <div class="flex justify-between items-center mt-6 mb-4">
    <h1 class="scroll-m-20 text-2xl font-extrabold tracking-tight">Root Dice Roll Calculator</h1>
    <ThemeSwitch />
  </div>
  <form class="grid grid-cols-2 gap-4" use:enhance method="POST">
    {#if $errors._errors?.length && $errors._errors.length > 0}
      <div
        class="col-span-2 bg-brand-red flex w-full items-center gap-3 px-3 py-2 text-sm font-semibold text-white"
      >
        <AlertTriangleIcon class="h-6 w-6 shrink-0" />
        <span>{$errors._errors[0]}</span>
      </div>
    {/if}
    <div class="col-span-2 text-lg font-bold tracking-tight">Attackers</div>
    <NumberInput
      id="attackers"
      bind:value={$form.attackers}
      errors={$errors.attackers}
      ariaInvalid={$errors.attackers ? 'true' : 'false'}
      label="Attackers"
      tooltip="Number of Attackers"
      constraints={$constraints.attackers}
    />
    <NumberInput
      id="attackerCardboard"
      bind:value={$form.attackerCardboard}
      errors={$errors.attackerCardboard}
      ariaInvalid={$errors.attackerCardboard ? 'true' : 'false'}
      label="Cardboard"
      tooltip="Number of attacker cardboard pieces"
      constraints={$constraints.attackerCardboard}
    />
    <NumberInput
      id="attackerDamageBonus"
      bind:value={$form.attackerDamageBonus}
      errors={$errors.attackerDamageBonus}
      label="Damage Bonus"
      tooltip="Damage bonus inflicted by the attacker every round (i.e. Rat's Wrathful)"
      constraints={$constraints.attackerDamageBonus}
    />
    <NumberInput
      id="attackerShieldBonus"
      bind:value={$form.attackerShieldBonus}
      errors={$errors.attackerShieldBonus}
      label="Shielding Bonus"
      tooltip="Damage ignored by the attacker every round (i.e. Rat's Stubborn)"
      constraints={$constraints.attackerShieldBonus}
    />
    <div class="col-span-2 text-lg font-bold tracking-tight">Defenders</div>
    <NumberInput
      id="defenders"
      bind:value={$form.defenders}
      errors={$errors.defenders}
      label="Defenders"
      tooltip="Number of Defenders"
      constraints={$constraints.defenders}
    />
    <NumberInput
      id="defenderCardboard"
      bind:value={$form.defenderCardboard}
      errors={$errors.defenderCardboard}
      label="Cardboard"
      tooltip="Number of defender cardboard pieces"
      constraints={$constraints.defenderCardboard}
    />
    <NumberInput
      id="defenderDamageBonus"
      bind:value={$form.defenderDamageBonus}
      errors={$errors.defenderDamageBonus}
      label="Damage Bonus"
      tooltip="Damage bonus inflicted by the defender every round (i.e. Mouse Partisans)"
      constraints={$constraints.defenderDamageBonus}
    />
    <NumberInput
      id="defenderShieldBonus"
      bind:value={$form.defenderShieldBonus}
      errors={$errors.defenderShieldBonus}
      label="Shielding Bonus"
      tooltip="Damage ignored by the defender every round (i.e. Rat's Stubborn)"
      constraints={$constraints.defenderShieldBonus}
    />
    <div class="flex items-center space-x-2 ml-1 col-span-2">
      <Checkbox
        id="againstWoodland"
        bind:checked={$form.againstWoodland}
        aria-labelledby="againstWoodland-label"
        {...$constraints.againstWoodland}
      />
      <Label
        id="againstWoodland-label"
        for="againstWoodland"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >Defender Takes High Roll</Label
      >
    </div>
    <NumberInput
      id="numBattles"
      bind:value={$form.numBattles}
      errors={$errors.numBattles}
      label="Number of Battles"
      min={1}
      tooltip="Number of battles to simulate"
      constraints={$constraints.numBattles}
      class="col-span-2"
    />
    <Button type="submit" disabled={!valid || $submitting} class="col-span-2">
      {#if $submitting}
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        Calculating
      {:else}
        Calculate
      {/if}
    </Button>
    <Dialog.Root bind:open={dialogOpen}>
      <Dialog.Trigger />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Battle Results</Dialog.Title>
        </Dialog.Header>
        <p
          class="bg-muted text-muted-foreground p-4 text-sm font-mono whitespace-pre-line rounded-sm"
        >
          {results}
        </p>
      </Dialog.Content>
    </Dialog.Root>
  </form>
</div>
