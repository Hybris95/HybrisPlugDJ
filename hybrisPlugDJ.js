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
var AFK_ANSWERS = ["@ChillBot Im not", "@ChillBot Im around", "Im not", "Im around"];

var RAFFLE_MESSAGE = "Congratulations, @.* has won the raffle! Type !raffle to get boosted to spot";
var RAFFLE_ANSWERS = ["Wooohooo raffle is for me!", "I guess I won :)", "Thanks!", "Raffle!!"];
var RAFFLE_LET_SOMEONE_ELSE_ANSWERS = ["@ChillBot I guess someone else can raffle on this ;)", "@ChillBot I pass my turn on this raffle", "@ChillBot Thanks but no thanks", "I guess someone else can raffle on this ;)", "I pass my turn on this raffle", "Thanks but no thanks"];

function randNumber(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}
function iWonRaffle(){
    var randAnswer = randNumber(0, RAFFLE_ANSWERS.length - 1);
    var answer = RAFFLE_ANSWERS[randAnswer];
    API.sendChat(answer);
    if(debug)
    {
        console.log("Won Raffle victory message : " + answer);
        console.log(randAnswer + "th answer");
    }
}
function respondRaffle(){
    if(API.getWaitListPosition() < 10)
    {
        var randAnswer = randNumber(0, RAFFLE_LET_SOMEONE_ELSE_ANSWERS.length - 1);
        var answer = RAFFLE_LET_SOMEONE_ELSE_ANSWERS[randAnswer];
        API.sendChat(answer);
        if(debug)
        {
            console.log("Won raffle but passing the turn message : " + answer);
            console.log(randAnswer + "th answer");
        }
    }
    else
    {
        API.sendChat("!raffle");
        var timeOut = randNumber(10000, 15000);
        setTimeout(iWonRaffle, timeOut);
        if(debug)
        {
            console.log("Autoraffle done, answer given in " + timeOut + "ms");
        }
    }
}
function imNotAfk(){
    var randAnswer = randNumber(0, AFK_ANSWERS.length - 1);
    var answer = AFK_ANSWERS[randAnswer];
    API.sendChat(answer);
    if(debug)
    {
        console.log("Answered as if not afk : " + answer);
        console.log(randAnswer + "th answer");
    }
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
                    var timeOut = randNumber(10000, 15000);
                    setTimeout(imNotAfk, timeOut);
                    if(debug)
                    {
                        console.log("Autoanswer asked in " + timeOut + "ms");
                    }
                }
                else if(message.match(AFK_MESSAGE_TWO))
                {
                    var timeOut = randNumber(10000, 15000);
                    setTimeout(imNotAfk, timeOut);
                    if(debug)
                    {
                        console.log("Autoanswer asked in " + timeOut + "ms");
                    }
                }
            }
            
            // AutoRaffle
            if(autoRaffle)
            {
                if(message.match(RAFFLE_MESSAGE))
                {
                    var timeOut = randNumber(10000, 15000);
                    setTimeout(respondRaffle, timeOut);
                    if(debug)
                    {
                        console.log("Autoraffle asked in " + timeOut + "ms");
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
