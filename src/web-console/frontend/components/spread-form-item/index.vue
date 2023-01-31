<template>
	<form-item ref="spreadRef" class="spread-form-item" :class="{ open: open, disabled: disabled }" :label="label" :desc="desc" @click="spreadItem">
	<span
		v-if="!open"
		:class="{ password: showBtnStyle }"
		class="spread-show-text"
	>
		{{ spreadShowText }}
	</span>
		<template v-else>
			<div class="input-content">
				<el-input-number
					v-if="type === 'number'"
					ref="inputRef"
					v-model="formValue"
					:min="0"
					:controls="false"
					:placeholder="placeholder"
					:disabled="disabled"
					@keyup.enter="saveValue"
				/>
				<Tags
					v-else-if="type === 'list'"
					v-model="formValue"
					:type="type"
					:disabled="disabled"
					:limit="1"
				/>
				<el-input
					v-else
					ref="inputRef"
					v-model="formValue"
					:type="type === 'textarea' ? 'textarea' : 'test'"
					:rows="rows"
					:placeholder="placeholder"
					:disabled="disabled"
					:show-password="type === 'password'"
					@keyup.enter="type === 'textarea' ? '' : saveValue()"
					clearable
				/>
				<span class="spread-warn-msg" v-if="showErrMsg">{{ verifyMsg }}</span>
			</div>
			<div class="btn-list">
				<el-button type="primary" size="small" @click.stop="saveValue">确认</el-button>
				<el-button size="small" @click.stop="packUpItem">取消</el-button>
			</div>
		</template>
	</form-item>
</template>

<script lang="ts">
import FormItem from "&/components/form-item/index.vue";
import Tags from "&/components/tags/index.vue";
import { defineComponent, getCurrentInstance, watch, reactive, ref, toRefs, nextTick, computed, Ref } from "vue";
import { ElInput } from "element-plus";

export default defineComponent( {
	name: "SpreadFormItem",
	components: {
		FormItem,
		Tags
	},
	emits: [ "update:modelValue", "change", "open", "close" ],
	props: {
		modelValue: {
			default: ""
		},
		/* 当前展开的组件id */
		activeSpread: {
			type: Number,
			default: ""
		},
		label: {
			type: String,
			default: ""
		},
		placeholder: {
			type: String,
			default: ""
		},
		type: {
			default: "normal",
			validator( value: any ) {
				return [ "normal", "number", "password", "list", "textarea" ].includes( value );
			}
		},
		desc: {
			type: String,
			default: ""
		},
		/* 行数，仅当 type 为 textarea 时有效 */
		rows: {
			type: Number,
			default: 6
		},
		/* 当 type 为 password 时，该配置无效 */
		hideContent: {
			type: Boolean,
			default: false
		},
		/* 校验，可为返回值为 Boolean 的方法或正则字符串 */
		verifyReg: {
			default: ""
		},
		/* 校验错误提示文字 */
		verifyMsg: {
			type: String,
			default: "请检查填写内容"
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	setup( props, { emit } ) {
		const state = reactive( {
			open: false,
			showErrMsg: false,
			formValue: ""
		} );

		const inputRef: Ref<ElInput | null> = ref( null );
		const spreadRef: Ref<FormItem | null> = ref( null );

		const uid = getCurrentInstance()!.uid;

		watch( () => props.modelValue, value => {
			state.formValue = value;
		}, { immediate: true } );

		/* 当前展开项切换时，若非本组件，收起 */
		watch( () => props.activeSpread, value => {
			if ( value !== uid ) {
				packUpItem();
			}
		} );

		watch( () => state.open, value => {
			resetData();
			if ( spreadRef.value ) {
				spreadRef.value.changeDescDisplay( !value );
			}
		} );

		/* 是否在未开启时展示按钮效果 */
		const showBtnStyle = computed( () => {
			return props.hideContent || props.type === "password" || state.formValue.length === 0
		} );

		const spreadShowText = computed( () => {
			return showBtnStyle.value
				? "点击设置"
				: state.formValue instanceof Array
					? state.formValue.join( "、" )
					: state.formValue
		} );

		/* 点击展开项 */
		function spreadItem() {
			if ( state.open || props.disabled ) return;
			emit( "open", uid );
			state.open = true;
			nextTick( () => {
				inputRef.value.focus();
			} );
		}

		/* 收起展开项 */
		function packUpItem() {
			emit( "close" );
			state.open = false;
		}

		/* 保存数据 */
		function saveValue() {
			/* type为number时禁止为空 */
			if ( props.type === "number" && state.formValue === null ) {
				state.showErrMsg = true;
				return;
			}
			const verify = props.verifyReg;
			if ( verify ) {
				if ( typeof verify === "function" ) {
					if ( !verify( state.formValue ) ) {
						state.showErrMsg = true;
						return;
					}
				} else {
					const reg = new RegExp( `^${verify}$` );
					if ( reg && !reg.test( state.formValue ) ) {
						state.showErrMsg = true;
						return;
					}
				}
			}
			if ( state.formValue !== props.modelValue ) {
				emit( "update:modelValue", state.formValue );
				emit( "change", state.formValue );
			}
			packUpItem();
		}

		/* 重置数据 */
		function resetData() {
			state.showErrMsg = false;
			state.formValue = props.type === "password" ? "" : props.modelValue;
		}

		return {
			...toRefs( state ),
			inputRef,
			spreadRef,
			showBtnStyle,
			spreadShowText,
			spreadItem,
			packUpItem,
			saveValue
		}
	}
} )
</script>

<style lang="scss">
.spread-form-item {
	&:not([class*="open"]) {
		cursor: pointer;
		&:hover {
			background-color: #f6f6f6;
		}
	}
	&.open {
		background-color: #f6f6f6;
	}
	.spread-show-text {
		display: inline-block;
		padding: 7px 0;
		max-width: 310px;
		height: 32px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 12px;
		line-height: 18px;
		color: #444;
		box-sizing: border-box;
		&.password {
			color: var(--el-color-primary);
		}
	}
	.input-content {
		display: flex;
		flex-wrap: wrap;
		row-gap: 5px;
		column-gap: 10px;
		align-items: center;
	}
	.btn-list {
		margin-top: 10px;
	}
	el-input,
	.el-input-number {
		width: 270px;
	}
	.el-input-number {
		::v-deep(.el-input__inner) {
			text-align: left;
		}
	}
	.spread-warn-msg {
		line-height: 1.15;
		color: red;
	}
}

@media (max-width: 768px) {
	.form-item {
		> ::v-deep(.el-form-item__content) {
			width: 100%;
		}
	}
}
</style>
