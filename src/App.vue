<script setup>
import { ref} from 'vue';
import Calendar from '@/components/Calendar.vue';
import { LANGUAGE } from '@/constants/language';

const language = LANGUAGE;
const locale = ref(language[0].value);

</script>

<template>
  <div class="app">
    <select v-model="locale" class="app__select">
      <option 
        :value="item.value"
        :key="item.id"
        v-for="item in language"
      >
        {{ item.label }}
      </option>
    </select>

    <Calendar :locale="locale"/>  
  </div>
  
</template>

<style lang="scss">
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;

  &__select {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
}
</style>
