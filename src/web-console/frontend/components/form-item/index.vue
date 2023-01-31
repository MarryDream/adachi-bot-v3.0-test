<template>
	<el-form-item class="form-item" :label="label">
		<div class="form-item-content" :class="{ 'no-desc': !desc || !showDesc }">
			<slot/>
		</div>
		<span class="form-item-desc" v-if="desc && showDesc">{{ desc }}</span>
	</el-form-item>
</template>

<script lang="ts">
import { defineComponent, watch, reactive, ref, toRefs, nextTick } from "vue";

export default defineComponent( {
	name: "FormItem",
	emits: [ "update:modelValue", "change" ],
	props: {
		label: {
			type: String,
			default: ""
		},
		desc: {
			type: String,
			default: ""
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	setup( props, { emit } ) {
		const state = reactive( {
			open: false,
			showDesc: true,
			formValue: ""
		} );

		watch( () => props.modelValue, value => {
			state.formValue = value;
		}, { immediate: true } )

		function changeDescDisplay( value ) {
			state.showDesc = value;
		}

		/* 点击展开项 */
		function spreadItem() {
			if ( state.open || props.disabled ) return;
			state.open = true;
		}

		/* 保存数据 */
		function saveValue() {
			emit( "update:modelValue", state.formValue );
			emit( "change" );
			state.open = false;
		}

		return {
			...toRefs( state ),
			changeDescDisplay,
			spreadItem,
			saveValue
		}
	}
} )
</script>

<style lang="scss">
.form-item {
	flex-wrap: wrap;
	margin: 1px 0;
	padding: 3px 5px;

	> ::v-deep(.el-form-item__label) {
		justify-content: flex-start;
		align-items: center;
		width: 140px;
		font-size: 12px;
		line-height: 18px;
		color: #666;
		text-align: left;
	}

	> ::v-deep(.el-form-item__content) {
		width: 70%;
		font-size: 12px;
		line-height: 0;
		flex: 0 0 auto;
	}

	.form-item-content {
		margin-right: 10px;

		&.no-desc {
			margin-right: 0;
			width: 100%;
		}
	}

	.form-item-desc {
		color: #9ba3af;
		font-size: 12px;
		line-height: 18px;
	}

	.el-input,
	.el-radio__label {
		font-size: 12px;
	}
}

@media (max-width: 768px) {
	.form-item {
		.form-item-content {
			margin-right: 0;
			width: 100%;
		}
	}
}
</style>
