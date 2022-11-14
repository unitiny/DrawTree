<script setup>
import {watch, ref, onMounted} from "vue";

const props = defineProps({
  attribute: {
    type: Object,
    default: {}
  }
})
const style = ref("")

const setStyle = (attribute) => {
  style.value = `width: ${attribute.width}px;
      transform: rotate(${attribute.rotate}deg);
      top: ${attribute.top}px;
      left: ${attribute.left}px;`
}

watch(
    () => props.attribute,
    () => {
      setStyle(props.attribute)
    },
    {
      deep: true
    }
)

onMounted(() => {
  setStyle(props.attribute)
})
</script>

<template>
  <div class="line" :style="style"></div>
</template>

<style scoped lang="scss">
.line {
  z-index: -1;
  position: absolute;
  transform-origin: 0 0;
  top: 20px;
  left: 30px;
  border: 1px;
  background: white;
  width: 20px;
  height: 1px;
}
</style>
