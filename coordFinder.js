var startingGame = 0;
var changingLobby = 0;
var socket;
var room;

$(window).on("unload",function(e) {
  if (socket !== undefined) {
    socket.once("disconnect", function() {
      socket.close();
    });
    socket.disconnect();
  }
});

var sT = document.createElement("script");
sT.id = "pC";
sT.text = "var workerId=null;var playerCoords=[];";
$("head")[0].appendChild(sT);

function updS() {
  sT.text = "var workerId='"+id+"';"+"var playerCoords="+JSON.stringify(pCoords)+";";
  $("#pC").remove();
  $("head").append(sT);
}
let pCoords = [];

function connectToServer() {
  socket = io.connect("http://" + ip + ":" + port, {
    reconnection: !0,
    forceNew: !1
  });
  setupSocket(socket);
  socket.once("connect", function() {
    startGame("player");
  });
}
var playerClassIndex;
var playerType;
var screenWidth;
var screenHeight;
var connections = 0;
function startGame(a) {
  connections++;
  connections>=pName.length ? connections = 0 : false;
  //startingGame || changingLobby || (startingGame = !0,
  playerName = pName.replace(/(<([^>]+)>)/ig, "").substring(0, 25),
  playerName = playerName.slice(0,connections) + playerName.charAt(connections).toUpperCase() + playerName.slice(connections+1,playerName.length),
  enterGame(a);
}
function enterGame(a) {
  playerClassIndex = 1;
  playerType = a;
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  if (swapS.length > 0) {socket.emit("create", {
      room: swapS[0],
      servPass: swapS[1],
      lgKey: "",
      userName: ""
  });
  }
  else {socket.emit("create")};
  socket.emit("respawn");
}



function receivePing() {
    var a = Date.now() - pingStart;
    pingText.innerHTML = "PING " + a
}

var id=null;
function setupSocket(a) {
    a.on("pong1", receivePing);
    a.on("yourRoom", function(a, d) {
        room = a;
        serverKeyTxt.innerHTML = d
    });
    a.on("welcome", function(b, d) {
        var player = {};
        id = b.id;
        player.id = b.id;
        player.room = b.room;
        room = player.room;
        player.name = playerName;
        player.classIndex = playerClassIndex;
        b.name = player.name;
        b.classIndex = playerClassIndex;
        a.emit("gotit", b, d, Date.now(), !1);
    });
    a.on("cSrvRes", function(a, d) {
        d ? (serverKeyTxt.innerHTML = a,
        serverCreateMessage.innerHTML = "Success. Created server with IP: " + a) : serverCreateMessage.innerHTML = a;
        reloadEventSafe = true;
    });
    a.on("gameSetup", function(a, d, e) {
        a = JSON.parse(a);
        if (d) {
            gameMap = a.mapData;
            gameMap.tiles = [];
            gameWidth = gameMap.width;
            gameHeight = gameMap.height;
            mapTileScale = a.tileScale;
            gameObjects = a.usersInRoom;
            pCoords = [];
            for (d = 0; d < gameObjects.length; ++d) {
                gameObjects[d].type = "player";
                pCoords.push(gameObjects[d]);
                //console.log(gameObjects[d]);
                //console.log(gameObjects[d].name,"coords:",gameObjects[d].x,gameObjects[d].y);
              }
            updS();
            socket.once("disconnect", function() {
              socket.close();
            });
            socket.disconnect();
            setTimeout(function(){conn()},50);
            return;
            gameMode = gameMap.gameMode;
            "blue" == a.you.team ? document.getElementById("gameModeText").innerHTML = gameMode.desc2 : document.getElementById("gameModeText").innerHTML = gameMode.desc1;
            currentLikeButton = "";
            var b = null;
            for (d = 0; d < gameMap.clutter.length; ++d)
                b = gameMap.clutter[d],
                b.type = "clutter",
                gameObjects.push(b);
            setupMap(gameMap);
            cachedMiniMap = null;
            deactivateSprays();
            for (d = 0; 100 > d; ++d)
                bullets.push(new Projectile)
        }
    });
}
var ip,port,swapS,pName;
function conn() {
  let obj = JSON.parse($("#data").text());
  ip = obj["ip"];
  port = obj["port"];
  swapS = obj["swapS"];
  pName = obj["pName"];
  if (ip !== null && port !== null && hackCfg.globalLocations) {
    connectToServer();
  }
  else {
    setTimeout(function(){conn()},100);
  }
}
$(document).ready(function() {
  conn();
});
