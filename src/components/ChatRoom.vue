<template>
  <div id="roundchat" class="roundchat chat">
    <div class="chatroom">
      Chat room
      <input
        id="checkbox"
        title="Toggle the chat"
        name="checkbox"
        type="checkbox"
        @click="toggle"
      />
    </div>
    <ol id="lobbychat-messages">
      <div v-if="hiddenChat" id="messages">
        <li v-for="i in messages" :key="i.time" class="message">
          <div class="time">{{ fmtTime(i.time) }}</div>
          <span class="user">
            <router-link :to="`/@/${i.user}`">{{ i.user }}</router-link>
          </span>
          <span>{{ i.message }}</span>
        </li>
      </div>
    </ol>

    <input
      id="chat-entry"
      v-model="message"
      maxlength="50"
      type="text"
      name="entry"
      autocomplete="off"
      :placeholder="setPlaceholder()"
      :disabled="toDisableInput()"
      @keyup.enter="onEnter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import { useCookies } from "vue3-cookies";
import { useUser } from "@/store/useUser";
import { SEND } from "@/plugins/webSockets";

const props =
  defineProps<{ messages: ChatMessage[]; wsType: string; finished: number }>();
const message = ref("");
const hiddenChat = ref(true);
const cookie = useCookies().cookies;
const user = useUser();

function onEnter(): void {
  if (message.value.length > 0 && message.value.length < 80) {
    SEND({
      t: "live_chat_message",
      message: message.value,
      user: user.$state.username,
      time: "",
      id: props.wsType,
    });
    message.value = "";
  }
}

function setPlaceholder(): string {
  if (props.finished > -1) {
    return "Chat disabled for old games";
  } else if (user.$state.reg == false) {
    return "Sign in to chat";
  } else {
    return "Please be nice in the chat!";
  }
}

function toDisableInput() {
  if (props.finished > -1) {
    return true;
  }
  if (cookie.get("reg") == undefined || cookie.get("reg") == "false") {
    return true;
  }
  return false;
}

function fmtTime(time: string): string {
  let d = new Date(time);
  let hours: number | string = d.getHours();
  hours = hours.toString().length == 1 ? `0${hours}` : `${hours}`;
  let minutes: number | string = d.getMinutes();
  minutes = minutes.toString().length == 1 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minutes}`;
}

let toggle = (): void => {
  hiddenChat.value = !hiddenChat.value;
};

interface ChatMessage {
  time: string;
  user: string;
  message: string;
}
</script>

<style scoped>
.user {
  padding-right: 6px;
  font-weight: bold;
}
</style>
