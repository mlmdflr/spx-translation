<template>
  <div class="shortcut-key-input-father">
    <div
      ref="dom"
      class="shortcut-key-input"
      :class="{ cursor: focus, 'shortcut-key-input-overflow': multiple }"
      tabindex="0"
      @focus="handleFocus"
      @blur="focus = false"
      @keydown="handleKeydown"
    >
      <template v-if="(typeof hotkey === 'string' && hotkey) || hotkey?.size > 0">
        <template v-if="multiple">
          <template v-for="(item, index) in hotkey.keys()" :key="index">
            <span>
              {{ item }}
              <i @click="handleDeleteKey(item)"></i>
            </span>
          </template>
        </template>
        <template v-else>
          <span>
            {{ hotkey }}
            <i @click="handleDeleteKey(hotkey)"></i>
          </span>
        </template>
      </template>
      <div v-else class="placeholder">{{ placeholder }}</div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { getShortcutName } from '@/renderer/common/enhance/shortcut';
import { isBlank } from '@/lib/util';
export default defineComponent({
  props: {
    modelValue: {
      type: [String, Array, Set],
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: null
    },
    placeholder: {
      type: String,
      default: '请设置快捷键'
    }
  },
  setup(props, ctx) {
    let hotkey = props.modelValue
      ? ref(props.modelValue)
      : props.multiple
        ? ref(new Set())
        : ref(null);
    if (typeof props.modelValue !== 'string' && Array.isArray(props.modelValue)) {
      if (props.multiple && props.modelValue.length > 0) hotkey = ref(new Set(props.modelValue));
      else {
        hotkey = ref();
        console.error('multiple = false, modelValue type not [] , Please use String');
      }
    } else if (typeof props.modelValue !== 'string' && !props.multiple) {
      hotkey = ref();
      console.error('multiple = false, modelValue type not Set , Please use String');
    }

    if (!props.multiple) {
      if (!props.max) {
        console.error('not multiple , max is invalid !');
      }
    } else {
      if (props.max <= 0) {
        console.warn('max defaults is 3 , Please set');
      }
    }
    let focus = ref(false);
    const dom = ref(null);
    const handleKeydown = (e: KeyboardEvent) => {
      if (props.multiple) {
        if (!props.max && hotkey.value.size < 3) {
          if (!isBlank(getShortcutName(e))) hotkey.value.add(getShortcutName(e));
        } else {
          if (hotkey.value.size < props.max) { if (!isBlank(getShortcutName(e))) hotkey.value.add(getShortcutName(e)); }
          else
            dom.value.blur();
        }
      } else {
        if (!isBlank(getShortcutName(e))) hotkey.value = getShortcutName(e);
      }
    };
    const handleDeleteKey = (e: string) => {
      if (props.multiple) {
        hotkey.value.delete(e);
        return;
      }
      hotkey.value = null;
    };
    const handleFocus = () => {
      if (props.multiple) {
        focus.value = false;
        if (!props.max && hotkey.value.size < 3) {
          dom.value.focus();
        } else {
          if (hotkey.value.size < props.max) {
            dom.value.focus();
          } else dom.value.blur();
        }
      } else if (!hotkey.value) focus.value = true;
    };
    watch(
      hotkey,
      (e) => {
        if (props.multiple) {
          focus.value = false;
        } else {
          if (!e) focus.value = true;
          else focus.value = false;
        }
        ctx.emit('update:modelValue', e);
        ctx.emit('change', e);
      },
      { deep: true }
    );
    watch(
      () => props.modelValue,
      () => {
        hotkey.value = props.modelValue;
      },
      { deep: true }
    );
    return {
      dom,
      focus,
      hotkey,
      handleFocus,
      handleKeydown,
      handleDeleteKey
    };
  }
});
</script>


<style lang='scss' scoped>
@import "./scss/index";
</style>