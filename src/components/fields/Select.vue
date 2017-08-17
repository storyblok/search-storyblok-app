<template>
  <el-select v-bind:value="value" v-on:input="updateValue" :placeholder="placeholder">
    <el-option :key="option.value" v-for="option in options" :label="option.label" :value="option.value"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'v-crud-select',
  props: ['options', 'placeholder', 'value'],
  methods: {
    updateValue (v) {
      this.$emit('input', v)
    }
  }
}
</script>
