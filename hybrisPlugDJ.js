/**
Copyright © Hybris95
Contact : hybris_95@hotmail.com
 ** Usage Method :
 ** copy/paste the entire script into the Firefox/Chrome Console (Ctrl+Shift+C Shortcut)
 ** For Firefox users :
 ** about:config -> security.mixed_content.block_active_content = false
*/

/**
 * Global Vars
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
        $("#woot.selected").css("background-color", "#10AD2F");
    }
}

/**
 * JOIN EVENT :
 * AutoJoinNotice
 */
var autoJoinNotice = false;

function someoneJoined(user){
    API.chatLog(user.username + " joined the room", true);
}
/**
 * LEAVE EVENT :
 * AutoLeaveNotice
 */
var autoLeaveNotice = false;

function someoneLeft(user){
    API.chatLog(user.username + " left the room", false);
}
/**
 * CHAT EVENT :
 * AutoNotice - http://pastebin.com/BVDgf6W0 -> http://pastebin.com/Hsi2YMDH
 */
var autoNotice = false;

var ownUserName = API.getUser().username;
var lastTimeStamp = false;
var loadedSound = new Audio(decodeURIComponent("https://gmflowplayer.googlecode.com/files/notify.ogg"));

function analyseChat(chat){
    var message = chat.message;
    var username = chat.un;
    var type = chat.type;
    var uid = chat.uid;
    var cid = chat.cid;
    var timestamp = chat.timestamp;
    
    // Recover the latest timestamp for the user
    if(username == ownUserName)
    {
        lastTimeStamp = timestamp;
    }
    
    // Watch PMs
    if(message.match("@" + ownUserName))
    {
        if(debug)
        {
            console.log(username + " told me : " + message);
        }
        // AutoNotice
        if(autoNotice)
        {
            loadedSound.play();
        }
    }
}

/**
 * Events Management and default status configuration
 #woot .bottom, #woot.selected {
    background: none repeat scroll 0% 0% #10AD2F;
}
 */
function refreshAPIStatus()
{
    API.off(API.ADVANCE);
    API.off(API.CHAT);
    API.off(API.USER_JOIN);
    API.off(API.USER_LEAVE);
    if(autoW)
    {
        API.on(API.ADVANCE, autowoot);
    }
    if(autoNotice)
    {
        API.on(API.CHAT, analyseChat);
    }
    if(autoJoinNotice)
    {
        API.on(API.USER_JOIN, someoneJoined);
    }
    if(autoLeaveNotice)
    {
        API.on(API.USER_LEAVE, someoneLeft);
    }
}
function startAutoWoot(){
    autoW = true;
    autowoot();
    refreshAPIStatus();
}
function stopAutoWoot(){
    autoW = false;
    $("#woot.selected").css("background-color", "#90AD2F");
    refreshAPIStatus();
}
var wootClicks = 0;
function doubleClick(){
    wootClicks++;
    if(debug)console.log(wootClicks);
    if(wootClicks == 2)
    {
        wootClicks = 0;
        if(autoW)
        {
            stopAutoWoot();
        }
        else
        {
            startAutoWoot();
        }
    }
    setTimeout(function(){wootClicks = 0}, 800);
}
$("#woot").bind('click', doubleClick);
function startAutoNotice(){
    autoNotice = true;
    refreshAPIStatus();
}
function stopAutoNotice(){
    autoNotice = false;
    refreshAPIStatus();
}
function switchAutoNotice(){
	if(autoNotice)
	{
		stopAutoNotice();
	}
	else
	{
		startAutoNotice();
	}
}
startAutoNotice();
$("#chat-sound-button").bind('click', switchAutoNotice);
function startAutoNoticeJoinersLeavers(){
    autoJoinNotice = true;
    autoLeaveNotice = true;
    refreshAPIStatus();
}
function stopAutoNoticeJoinersLeavers(){
    autoJoinNotice = false;
    autoLeaveNotice = false;
    refreshAPIStatus();
}
startAutoNoticeJoinersLeavers();
