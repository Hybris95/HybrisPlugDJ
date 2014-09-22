/**
Copyright © Hybris95
Contact : hybris_95@hotmail.com
*/

/**
 * Global Vars
 ** Usage Method :
 ** copy/paste the entire script into the Firefox/Chrome Console
 ** For Firefox users :
 ** about:config -> security.mixed_content.block_active_content = false
 */
var debug = true;

/**
 * ADVANCE EVENT :
 * AutoWoot - http://pastebin.com/UjA824Fj -> http://pastebin.com/qNV6T6pq
 */
var autoW = false;
function autowoot(){
    if(autoW){
        $("#woot").click();
    }
}

/**
 * CHAT EVENT :
 * AutoNotice - http://pastebin.com/BVDgf6W0 -> http://pastebin.com/Hsi2YMDH
 * AutoAnswer (Just a Chill room)
 * AutoRaffle (Just a Chill room)
 */
var autoNotice = false;
var autoAnswer = false;
var autoRaffle = false;

var ownUserName = API.getUser().username;
var loadedSound = new Audio(decodeURIComponent("https://gmflowplayer.googlecode.com/files/notify.ogg"));
var AFK_MESSAGE_ONE = "you have been AFK for .+m, please respond within 2 minutes or you will be removed";
var AFK_MESSAGE_TWO = ", you will be removed soon if you don't respond";
var RAFFLE_MESSAGE = "Congratulations, @.* has won the raffle! Type !raffle to get boosted to spot";

function randNumber(min, max){
    return Math.random() * (max - min) + min;
}
function iWonRaffle(){
    
}
function respondRaffle(){
    if(debug)
    {
        console.log("Autoraffle");
    }
    API.sendChat("!raffle");
    // TODO - Make a word about winning the raffle like "haha I won" etc.. and randomize it
}
function analyseChat(chat){
    var message = chat.message;
    var username = chat.un;
    var type = chat.type;
    var uid = chat.uid;
    var cid = chat.cid;
    var timestamp = chat.timestamp;
    
    if(message.match("@" + ownUserName))
    {
        if(debug)
        {
            API.chatLog("Received a PM from " + username);
        }
        // AutoNotice
        if(autoNotice)
        {
            loadedSound.play();
        }
        if(username.match("ChillBot"))
        {
            // AutoAnswer
            if(autoAnswer)
            {
                if(message.match(AFK_MESSAGE_ONE))
                {
                    // TODO - AutoAnswer like 5/10 seconds later with a random message
                    if(debug)
                    {
                        console.log("Should autoanswer here : " + message);
                    }
                }
                else if(message.match(AFK_MESSAGE_TWO))
                {
                    // TODO - AutoAnswer like 5/10 seconds later with a random message
                    if(debug)
                    {
                        console.log("Should autoanswer here : " + message);
                    }
                }
            }
            
            // AutoRaffle
            if(autoRaffle)
            {
                if(message.match(RAFFLE_MESSAGE))
                {
                    var timeOut = randNumber(5000, 15000);
                    setTimeout(respondRaffle, timeOut);
                    if(debug)
                    {
                        console.log("Autoraffle asked in " + timeOut);
                    }
                }
            }
        }
    }
}

/**
 * Events Management and default status configuration
 */
function refreshAPIStatus()
{
    API.off(API.ADVANCE);
    API.off(API.CHAT);
    if(autoW)
    {
        API.on(API.ADVANCE, autowoot);
    }
    if(autoAnswer || autoRaffle || autoNotice)
    {
        API.on(API.CHAT, analyseChat);
    }
}
function startAutoWoot(){
    autoW = true;
    autowoot();
    refreshAPIStatus();
}
function stopAutoWoot(){
    autoW = false;
    refreshAPIStatus();
}
function startAutoNotice(){
    autoNotice = true;
    refreshAPIStatus();
}
function stopAutoNotice(){
    autoNotice = false;
    refreshAPIStatus();
}
function startAutoAnswer(){
    autoAnswer = true;
    refreshAPIStatus();
}
function stopAutoAnswer(){
    autoAnswer = false;
    refreshAPIStatus();
}
function startAutoRaffle(){
    autoRaffle = true;
    refreshAPIStatus();
}
function stopAutoRaffle(){
    autoRaffle = false;
    refreshAPIStatus();
}
startAutoWoot();
startAutoNotice();
startAutoAnswer();
startAutoRaffle();
