<template>
  <div class="bubble-container">
    <div 
      v-for="(item, index) in bubbleData" 
      :key="index" 
      class="bubble"
      :style="{
        width: item.size + 'px',
        height: item.size + 'px',
        left: item.x + 'px',
        top: item.y + 'px',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: '100% 100%'
      }"
    >
      <div class="bubble-content">
        <div class="bubble-name">{{ item.name }}</div>
        <div class="bubble-value">{{ item.value }} {{ item.percent }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch, onBeforeUnmount } from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  backgroundImage: {
    type: String,
    default: ''
  },
  sizeMultiplier: {
    type: Number,
    default: 0.2
  },
  minSize: {
    type: Number,
    default: 100
  },
  maxSize: {
    type: Number,
    default: 150
  }
});

const bubbleData = ref([]);

// Function to calculate bubble positions without overlap
const calculateBubblePositions = () => {
  const containerEl = document.querySelector('.bubble-container');
  if (!containerEl || !props.data.length) return;
  
  const containerWidth = containerEl.clientWidth;
  const containerHeight = containerEl.clientHeight;
  
  // Calculate total value for percentage calculation
  const totalValue = props.data.reduce((sum, item) => sum + item.value, 0);
  
  // Convert props.data to bubble data with calculated sizes
  const bubbles = props.data.map(item => {
    // Calculate percentage based on value
    const percent = Math.round((item.value / totalValue) * 100);
    
    return {
      name: item.name,
      value: item.value,
      percent,
      size: Math.max(props.minSize, Math.min(props.maxSize, item.value * props.sizeMultiplier)),
      x: 0,
      y: 0
    };
  });
  
  // Sort bubbles by size (largest first)
  bubbles.sort((a, b) => b.size - a.size);
  
  // Place bubbles avoiding overlap
  const placeBubble = (bubble, index) => {
    let attempts = 0;
    let overlap = true;
    
    while (overlap && attempts < 100) {
      // Generate random position within container bounds
      bubble.x = Math.random() * (containerWidth - bubble.size);
      bubble.y = Math.random() * (containerHeight - bubble.size);
      
      // Check overlap with previously placed bubbles
      overlap = false;
      for (let i = 0; i < index; i++) {
        const existingBubble = bubbles[i];
        const dx = bubble.x + bubble.size/2 - (existingBubble.x + existingBubble.size/2);
        const dy = bubble.y + bubble.size/2 - (existingBubble.y + existingBubble.size/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (bubble.size + existingBubble.size) / 2;
        
        if (distance < minDistance) {
          overlap = true;
          break;
        }
      }
      
      attempts++;
    }
  };
  
  // Place each bubble
  bubbles.forEach((bubble, index) => placeBubble(bubble, index));
  
  bubbleData.value = bubbles;
};

// Watch for changes in data
watch(() => props.data, () => {
  setTimeout(calculateBubblePositions, 100);
}, { deep: true });

// Recalculate on window resize
const handleResize = () => {
  calculateBubblePositions();
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  calculateBubblePositions();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
.bubble-container {
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.bubble {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.05);
  }
}

.bubble-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bubble-name {
  font-size: 16px;
  font-weight: bold;
}

.bubble-value {
  font-size: 14px;
  margin-top: 4px;
}
</style> 