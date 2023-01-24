<template>
	<div class="character">
		<character-skill v-if="skill" :data="data"></character-skill>
		<character-normal v-else :data="data"></character-normal>
	</div>
</template>

<script lang="ts">
import CharacterNormal from "./character-normal.vue";
import CharacterSkill from "./character-skill.vue";

import { defineComponent } from "vue";

export default defineComponent( {
	name: "InfoCharacter",
	components: {
		CharacterNormal,
		CharacterSkill
	},
	props: {
		data: {
			type: Object,
			default: () => ( {
				birthday: "",
				element: "",
				cv: "",
				constellationName: "",
				rarity: null,
				mainStat: "",
				mainValue: "",
				baseHP: null,
				baseATK: null,
				baseDEF: null,
				ascensionMaterials: [],
				levelUpMaterials: [],
				talentMaterials: [],
				constellations: [],
				time: ""
			} )
		},
		skill: {
			type: Boolean,
			default: false
		}
	}
} );
</script>

<style lang="scss" scoped>

</style>