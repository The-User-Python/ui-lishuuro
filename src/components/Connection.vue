<template>
  <a id="reconnecting" class="link text" data-icon="p">
    {{ user.$state.conMsg }}
  </a>
</template>

<script setup lang="ts">
import { useUser } from "@/store/useUser";
const user = useUser();
</script>

<style scoped>
@keyframes reconnected {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(2.5rem);
  }
}

#reconnecting {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  font-size: 1.2em;
  font-weight: bold;
  position: fixed;
  background: #cc3333;
  color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  height: 2.5rem;
  padding: 1rem 1rem 1rem 1rem;
  border-top-right-radius: 3px;
  z-index: 105;
  opacity: 0;
  transform: translateY(2.5rem);
}

#reconnecting::before {
  font-size: 1.3em;
  content: "p";
  margin-right: 0.4em;
}

.offline #reconnecting {
  transform: translateY(0);
  opacity: 1;
}

.online.reconnected #reconnecting {
  background: #629924;
  animation: reconnected 2.5s ease-out 1.5s backwards;
}

.online.reconnected #reconnecting::before {
  content: "?";
}
</style>
