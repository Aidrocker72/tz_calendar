<template>
  <div class="calendar">
    <header class="calendar__header">
      <button class="calendar__nav" @click="prevMonth">
        <
      </button>
      <transition :name="transitionName" mode="out-in">
        <div 
          class="calendar__title" 
          :key="currentMonth + '-' + currentYear + locale"
        >
          {{ months[currentMonth] }}
          {{ currentYear }}
        </div>
      </transition>
     
      <button class="calendar__nav" @click="nextMonth">
        >
      </button>
    </header>

    <div class="calendar__weekdays">
      <div 
        class="calendar__weekday"
        v-for="(day, i) in weekDays"
        :key="i"
      >
        {{ day }}
      </div>
    </div>

    <div
      class="calendar__grid-wrapper" 
    >
      <transition :name="transitionName" mode="out-in">
        <div
          class="calendar__grid"
          :key="currentMonth + '-' + currentYear + locale"
        >
          <div
            v-for="cell in cells"
            :key="cell.key"
            :class="[
              'calendar__cell',
              {
                'calendar__cell--other': cell.otherMonth,
                'calendar__cell--today': isToday(cell.date),
                'calendar__cell--selected': isSelected(cell.date),
              }
            ]"
            @click="selectDate(cell.date)"
            @keydown.enter.prevent="selectDate(cell.date)"
          >
            <span class="calendar__cell-label">
              {{ cell.date.getDate() }}
            </span>
          </div>
        </div>
      </transition>
     
    </div>
   
  </div>

</template>

<script setup>
import { computed, ref, defineEmits, defineProps, watch } from 'vue';
import { CALENDAR_CELLS_COUNT } from '@/constants/calendar';
import { LOCALES } from '@/constants/locales';
import { parseDateString } from '@/utils/parseDateString';
import { toFormatISO } from '@/utils/toFormatISO';

  const props = defineProps({
    initialDate: { type: String, default: '' },
    locale: { type: [String, Object], default: 'ru' },
  });

  const emits = defineEmits(['date-selected']);

  const today = new Date();
  const initial = parseDateString(props.initialDate) || today;
  const locales = LOCALES;

  const selected = ref(new Date(initial));
  const currentYear = ref(initial.getFullYear());
  const currentMonth = ref(initial.getMonth());
  const direction = ref(null);
  const transitionName = computed(() =>
    direction.value === 'next' ? 'slide-left' : 'slide-right'
  )

  const localeDate = computed(() => {
    if(typeof props.locale === 'string') {
      return locales[props.locale] || locales.en;
    }

    return props.locale
  });

  const months = computed(() => localeDate.value.months);
  const weekDays = computed(() => localeDate.value.weekDays);

  const cells = computed(() => {
    const firstDay = new Date(currentYear.value, currentMonth.value, 1);
    const startOffset = firstDay.getDay() - 1;

    if(selectDate < 0) startOffset = 6;
    
    const gridStart = new Date(currentYear.value, currentMonth.value, 1 - startOffset);
    const arr = [];

    for(let i = 0; i < CALENDAR_CELLS_COUNT; i++) {
      const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      
      arr.push({
        date: d,
        otherMonth: d.getMonth() !== currentMonth.value,
        key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      });
    }

    return arr;
  });

  watch(
    () => props.initialDate,
    (val) => {
      const parsed = parseDateString(val);
      if(parsed) {
        selected.value = parsed;
        currentYear.value = parsed.getFullYear();
      }
    },
  );

  const prevMonth = () => {
    direction.value = 'prev';
    if(currentMonth.value === 0) {
      currentMonth.value = 11;
      currentYear.value--;
    }else {
      currentMonth.value--;
    }
  };

  const nextMonth = () => {
    direction.value = 'next';
    if(currentMonth.value === 11) {
      currentMonth.value = 0;
      currentYear.value++;
    }else {
      currentMonth.value++;
    }
  };

  const selectDate = (date) => {
    selected.value = new Date(date);
    currentMonth.value = date.getMonth();
    currentYear.value = date.getFullYear();

    emits('date-selected', toFormatISO(date));
  };

  const isToday = (comeDate) => {
    const todayDate = new Date();
    return (
      comeDate.getFullYear() === todayDate.getFullYear() &&
      comeDate.getMonth() === todayDate.getMonth() &&
      comeDate.getDate() === today.getDate()
    );
  };


  const isSelected = (dateToCheck) => {
    return (
      dateToCheck.getFullYear() === selected.value.getFullYear() &&
      dateToCheck.getMonth() === selected.value.getMonth() &&
      dateToCheck.getDate() === selected.value.getDate()
    );
  };
</script>

<style lang="scss">
.calendar {
  width: 320px;
  border: 1px solid #e0e0;
  border-radius: 8px;
  padding: 8px;
  background: #fff;
  max-height: min-content;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  &__title {
    color: #000;
    font-weight: bold;
  }

  &__nav {
    border: none;
    background: transparent;
    color: #000;
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
  }

  &__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-size: 12px;
    color: #666;
    margin-bottom: 6px;
  }

  &__weekday {
    text-transform: uppercase;
  }

  &__grid-wrapper {
    position: relative;
    height: 280px;
    overflow: hidden;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: 40px;
    gap: 4px;
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;

    
  }

  &__cell {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.2s;
    color: #000;

    &:hover {
      background: rgba(25, 118, 210, 0.1);
    }

    &--other {
      opacity: 0.45;
    }

    &--today {
      box-shadow: inset 0 0 0 2px rgba(25, 118, 210, 0.3);
    }

    &--selected {
      background: #1976d2;
      color: #fff;
    }

    &-label {
      user-select: none;
    }
  }
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.25s ease-in-out;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
    

</style>