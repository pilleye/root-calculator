import { z } from 'zod';

export const inputSchema = z.object({
	attackers: z.number().int().nonnegative(),
	attackerCardboard: z.number().int().nonnegative(),
	attackerDamageBonus: z.number().int().nonnegative(),
	attackerShieldBonus: z.number().int().nonnegative(),
	defenders: z.number().int().nonnegative(),
	defenderCardboard: z.number().int().nonnegative(),
	defenderDamageBonus: z.number().int().nonnegative(),
	defenderShieldBonus: z.number().int().nonnegative(),

	numBattles: z.number().int().positive().max(6).default(1),
	againstWoodland: z.boolean()
});

export type InputSchema = z.infer<typeof inputSchema>;
