<template>
  <div class="btn-controls">
    <div></div>
    <div></div>
    <button id="draw" @click="draw" v-if="canDR()" title="Draw">
      <i>½</i>
    </button>
    <button id="resign" v-if="canDR()" @click="resign" title="Resign">
      <i class="icon icon-flag-o"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useShuuroStore2 } from "@/store/useShuuroStore2";
import { SEND } from "@/plugins/webSockets";

function canDR(): boolean {
  return store.$state.status < 0 && store.$state.am_i_player!;
}

function draw() {
  let d = confirm("Are you sure you want to draw?");
  if (d) {
    SEND({ t: "live_game_draw", game_id: store.$state.game_id });
  }
}

function resign() {
  let r = confirm("Are you sure you want to resign?");
  if (r) {
    SEND({ t: "live_game_resign", game_id: store.$state.game_id });
  }
}

const store = useShuuroStore2();
</script>

<style></style>
