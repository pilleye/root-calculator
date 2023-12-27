export interface Pieces {
	attackers: number;
	attackerCardboard: number;
	defenders: number;
	defenderCardboard: number;
}

export interface Config {
	attackerDamageBonus: number;
	attackerShieldBonus: number;
	defenderDamageBonus: number;
	defenderShieldBonus: number;
	againstWoodland: boolean;
}

export type Situation = {
	pieces: Pieces;
};

const possibleRolls = [
	[3, 3],
	[3, 2],
	[3, 1],
	[3, 0],
	[2, 3],
	[2, 2],
	[2, 1],
	[2, 0],
	[1, 3],
	[1, 2],
	[1, 1],
	[1, 0],
	[0, 3],
	[0, 2],
	[0, 1],
	[0, 0]
];

function runRolls(situation: Situation, config: Config) {
	if (hasWon(situation) || hasLost(situation)) {
		return possibleRolls.map(() => situation);
	}

	const { attackers, attackerCardboard, defenderCardboard, defenders } = situation.pieces;

	const rolls = possibleRolls.map(([dieA, dieB]) => {
		let attackerDamageBonus = config.attackerDamageBonus;
		if (attackers === 0) {
			attackerDamageBonus = 0;
		}
		let attackerShieldBonus = config.attackerShieldBonus;

		let defenderDamageBonus = config.defenderDamageBonus;
		if (defenders === 0) {
			defenderDamageBonus = 0;
		}
		let defenderShieldBonus = config.defenderShieldBonus;

		let defenselessBonus = 0;
		if (defenders === 0) {
			defenselessBonus = 1;
		}

		let highRoll = Math.max(Math.max(dieA, dieB), 0);
		let lowRoll = Math.max(Math.min(dieA, dieB), 0);

		let attackerRoll, defenderRoll;
		if (config.againstWoodland) {
			attackerRoll = lowRoll;
			defenderRoll = highRoll;
		} else {
			attackerRoll = highRoll;
			defenderRoll = lowRoll;
		}

		let attackerHits = Math.max(
			Math.min(attackerRoll, attackers) +
				attackerDamageBonus +
				defenselessBonus -
				defenderShieldBonus,
			0
		);

		let defenderHits = Math.max(
			Math.min(defenderRoll, defenders) + defenderDamageBonus - attackerShieldBonus,
			0
		);

		let attackerTotal = attackers + attackerCardboard - defenderHits;
		let defenderTotal = defenders + defenderCardboard - attackerHits;

		let newAttacker = Math.max(attackerTotal - attackerCardboard, 0);
		let newAttackerPieces = Math.max(Math.min(attackerTotal, attackerCardboard), 0);

		let newDefender = Math.max(defenderTotal - defenderCardboard, 0);
		let newDefenderPieces = Math.max(Math.min(defenderTotal, defenderCardboard), 0);

		let pieces = {
			attackers: newAttacker,
			attackerCardboard: newAttackerPieces,
			defenders: newDefender,
			defenderCardboard: newDefenderPieces
		};

		let situation: Situation = {
			pieces
		};

		return situation;
	});

	return rolls;
}

function hasWon(situation: Situation) {
	return situation.pieces.defenders === 0 && situation.pieces.defenderCardboard === 0;
}

function hasLost(situation: Situation) {
	return situation.pieces.attackers === 0;
}

export function calculate(situation: Situation, config: Config, numBattles: number) {
	let situations = [situation];
	let resultString = '';

	for (let i = 0; i < numBattles; i++) {
		let newSituations = situations.flatMap((situation) => runRolls(situation, config));
		situations = newSituations;

		let won = situations.filter(hasWon).length;

		resultString += `Simulating round ${i + 1}, win %: ${
			Math.round((won / situations.length) * 10000) / 100
		}%\n`;
	}

	resultString += '\n';

	let averageAttackerRemaining =
		situations.reduce((acc, situation) => {
			return acc + situation.pieces.attackers;
		}, 0) / situations.length;
	averageAttackerRemaining = Math.round(averageAttackerRemaining * 100) / 100;
	resultString += `Average attackers remaining: ${averageAttackerRemaining}\n`;

	let averageDefenderRemaining =
		situations.reduce((acc, situation) => {
			return acc + situation.pieces.defenders;
		}, 0) / situations.length;
	averageDefenderRemaining = Math.round(averageDefenderRemaining * 100) / 100;
	resultString += `Average defenders remaining: ${averageDefenderRemaining}\n`;

	return resultString;
}
