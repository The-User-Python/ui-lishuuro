<template>
  <div id="offer-dialog">
    <div class="reject" v-if="canDraw()" @click="rejectDraw()">
      <i class="icon icon-abort reject"></i>
    </div>

    <div class="text" v-if="canDraw()">Your opponent offers a draw</div>

    <div class="accept" v-if="canDraw()" @click="acceptDraw()">
      <i class="icon icon-check"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShuuroStore2 } from "../store/useShuuroStore2";
import { SEND } from "@/plugins/webSockets";

const store = useShuuroStore2();

function canDraw() {
  return store.$state.am_i_player && store.$state.offeredDraw!;
}

function rejectDraw() {
  store.$state.offeredDraw = false;
}

function acceptDraw() {
  SEND({ t: "live_game_draw", game_id: store.$state.game_id });
  store.$state.offeredDraw = false;
}
</script>

<style scoped>
.icon:hover {
  cursor: pointer;
}
</style>
