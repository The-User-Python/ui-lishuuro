import { useUser } from "@/store/useUser";
import { useHomeChat } from "@/store/useHomeChat";
import { useHomeLobby } from "@/store/useHomeLobby";
import { useShuuroStore2 } from "@/store/useShuuroStore2";
import { useNews } from "@/store/useNews";
import { useTvStore } from "@/store/useTvStore";

export const ws = new WebSocket("ws://localhost:8080/ws/");

export function SEND(msg: any) {
  ws.send(JSON.stringify(msg));
}

ws.onerror = function (event) {
  console.log(event);
};

ws.onopen = function (event) {
  console.log(event);
};

ws.onmessage = function (event) {
  const user = useUser();
  const homeChat = useHomeChat();
  const homeLobby = useHomeLobby();
  const shuuroStore = useShuuroStore2();
  const newsStore = useNews();
  const tvStore = useTvStore();

  const msg = JSON.parse(event.data);
  console.log(msg);
  switch (msg.t) {
    case "active_players_count":
      user.updatePlCount(msg.cnt);
      break;
    case "active_games_count":
      user.updateGamesCount(msg.cnt);
      break;
    case "live_chat_message":
      if (msg.id == "home") {
        homeChat.sendMessage(msg);
      }
      else {
        homeChat.addGameMessageChat(msg);
      }
      break;
    case "live_chat_full":
      if (msg.id == "home") {
        homeChat.setHomeChat(msg.lines);
      }
      else {
        homeChat.setGameChat(msg.lines);

      }
      break;
    case "home_lobby_full":
      homeLobby.setHomeLobby(msg.lobbyGames);
      break;
    case "home_lobby_add":
      delete msg["t"];
      homeLobby.addGameToLobby(msg);
      break;
    case "home_lobby_remove":
      delete msg["t"];
      homeLobby.removeLobbyGame(msg);
      break;
    case "home_news":
      delete msg["t"];
      newsStore.setNews(msg.news);
      break;
    case "home_lobby_remove_user":
      delete msg["t"];
      homeLobby.removeLobbyGameByUser(msg.username);
      break;
    case "live_game_start":
      msg["game_info"]["game_id"] = msg["game_id"];
      shuuroStore.fromServer(msg["game_info"], user.$state.username);
      break;
    case "live_game_spectators_count":
      delete msg["t"];
      shuuroStore.updateWatchCount(msg);
      break;
    case "live_game_hand":
      delete msg["t"];
      shuuroStore.setShuuroHand(msg.hand, user.$state.username);
      break;
    case "live_game_place":
      delete msg["t"];
      shuuroStore.serverPlace(msg);
      break;
    case "live_game_play":
      delete msg["t"];
      shuuroStore.serverMove2(msg);
      break;
    case "live_game_confirmed":
      delete msg["t"];
      shuuroStore.setConfirmed(msg.confirmed);
      break;
    case "live_game_draw":
      delete msg["t"];
      shuuroStore.gameDraw(msg, user.$state.username);
      break;
    case "live_game_resign":
      delete msg["t"];
      shuuroStore.gameResign(msg, user.$state.username);
      break;
    case "live_game_sfen":
      delete msg["t"];
      tvStore.setProfileGame(msg);
      break;

    case "pause_confirmed":
      delete msg["t"];
      shuuroStore.pauseConfirmed(msg.confirmed);
    case "redirect":
      delete msg["t"];
      shuuroStore.redirect(msg.path);
      break;
    case "redirect_deploy":
      delete msg["t"];
      shuuroStore.redirectDeploy(msg);
      break;
  }
};
