<template>
  <round-player0>
    <div class="player-data">
      <i-side id="player0" class="icon" :class="cssOnline()" />
      <player>
        <router-link class="user-link m-ul" :to="`/@/${player}`"
          ><player-title />{{ player }}</router-link
        ><rating />
      </player>
    </div>
  </round-player0>
</template>
<script setup lang="ts">
const props = defineProps({ player: String, online: Boolean });
function cssOnline(): string {
  if (props.online!) {
    return `icon-online`;
  }
  return `icon-offline`;
}
</script>

<style>
@media (max-width: 720px) {
  .m-ul {
    font-size: 1.2em;
  }
}
</style>
