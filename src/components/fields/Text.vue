<template>
  <div>
    {{ value }}
  </div>
</template>

<script>
export default {
  name: 'text',

  props: ['options', 'placeholder', 'value', 'rootModel', 'rootConfig']
}
</script>
