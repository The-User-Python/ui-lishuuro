<template>
  <div id="settings-panel">
    <button id="btn-settings">
      <div class="icon icon-cog" @click="store.toggle()"></div>
    </button>
    <div id="settings" style="display: flex" v-if="store.show">
      <div id="settings-main" v-if="store.clicked == ''" style="display: flex">
        <div id="settings-buttons" v-if="user.$state.reg">
          <button id="btn-logout">Log out</button>
        </div>
        <div id="settings-buttons">
          <button id="btn-background" @click="store.clicked = 'background'">
            Background
          </button>
          <button id="btn-board" @click="store.clicked = 'board'">
            Board Settings
          </button>
          <HeaderSettingsSaveAll
            v-if="user.username == 'iiiurosiii'"
            :username="user.username"
          />
        </div>
      </div>
      <div id="settings-sub" style="display: flex">
        <div
          v-if="store.clicked != ''"
          id="settings-background"
          style="display: flex"
        >
          <HeaderSettingsButton />

          <HeaderSettingsTheme v-if="store.clicked == 'background'" />
          <HeaderSettingsBoard v-else-if="store.clicked == 'board'" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useUser } from "@/store/useUser";
import HeaderSettingsTheme from "./HeaderSettingsTheme.vue";
import { useHeaderSettings } from "@/store/headerSettings";
import HeaderSettingsBoard from "./HeaderSettingsBoard.vue";
import HeaderSettingsButton from "./HeaderSettingsButton.vue";
import HeaderSettingsSaveAll from "./HeaderSettingsSaveAll.vue";
const user = useUser();
const store = useHeaderSettings();

onMounted(() => {
  let theme = store.getTheme();
  document.querySelector("html")?.setAttribute("data-theme", theme);
  setTimeout(store.zoom, 450);
});
</script>
<style>
.capitalize {
  text-transform: capitalize;
}
</style>
