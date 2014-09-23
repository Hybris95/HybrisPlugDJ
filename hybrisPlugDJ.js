/**
Copyright © Hybris95
Contact : hybris_95@hotmail.com
Firefox:
Add the following line as a bookmark :
javascript:(function(){$.getScript('https://raw.githubusercontent.com/Hybris95/HybrisPlugDJ/master/hybrisPlugDJ.js');}());
Chrome:
Add the following line as a bookmark :
javascript:(function(){$.getScript('https://rawgit.com/Hybris95/HybrisPlugDJ/master/hybrisPlugDJ.js');}());
 ** Usage Method :
 ** copy/paste the entire script into the Firefox/Chrome Console (Ctrl+Shift+C Shortcut)
 ** For Firefox users (if you want notice sound) :
 ** about:config -> security.mixed_content.block_active_content = false
*/

/**
 * Global Vars
 */
var debug = false;
var ownUserName = API.getUser().username;
var lastTimeStamp = false;
var loadedSound = new Audio(decodeURIComponent("https://gmflowplayer.googlecode.com/files/notify.ogg"));

var autoW = false;
var autoNotice = false;
var autoJoinLeaveNotice = false;
/**
 * ADVANCE EVENT :
 * AutoWoot Only -> http://pastebin.com/qNV6T6pq
 */
function autowoot(){
    if(autoW){
        $("#woot").click();
    }
}
/**
 * JOIN EVENT :
 * AutoJoinNotice
 */
function someoneJoined(user){
    API.chatLog(user.username + " joined the room", true);
}
/**
 * LEAVE EVENT :
 * AutoLeaveNotice
 */
function someoneLeft(user){
    API.chatLog(user.username + " left the room", false);
}
/**
 * CHAT EVENT :
 * AutoNotice Only -> http://pastebin.com/Hsi2YMDH
 */
function analyseChat(chat){
    var message = chat.message;
    var username = chat.un;
    var type = chat.type;
    var uid = chat.uid;
    var cid = chat.cid;
    var timestamp = chat.timestamp;
    
    // Recover the latest timestamp for the user
    if(username == ownUserName){
        lastTimeStamp = timestamp;
    }
    
    // Watch PMs
    if(message.match("@" + ownUserName))
    {
        if(debug){console.log(username + " told me : " + message);}
        // AutoNotice
        if(autoNotice){
            loadedSound.play();
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
    API.off(API.USER_JOIN);
    API.off(API.USER_LEAVE);
    if(autoW){
        API.on(API.ADVANCE, autowoot);
    }
    if(autoNotice){
        API.on(API.CHAT, analyseChat);
    }
    if(autoJoinLeaveNotice){
        API.on(API.USER_JOIN, someoneJoined);
    }
    if(autoJoinLeaveNotice){
        API.on(API.USER_LEAVE, someoneLeft);
    }
}
function startAutoWoot(){
    autoW = true;
    $("#hybrisAutoWoot").css("background-color", "#105D2F");
    autowoot();
    refreshAPIStatus();
}
function stopAutoWoot(){
    autoW = false;
    $("#hybrisAutoWoot").css("background-color", "#5D102F");
    refreshAPIStatus();
}
function switchAutoWoot(){
    if(autoW){
        stopAutoWoot();
    }else{
        startAutoWoot();
    }
}
function startAutoNotice(){
    autoNotice = true;
	$("#hybrisMention").css("background-color", "#105D2F");
    refreshAPIStatus();
}
function stopAutoNotice(){
    autoNotice = false;
	$("#hybrisMention").css("background-color", "#5D102F");
    refreshAPIStatus();
}
function switchAutoNotice(){
	if(autoNotice){
		stopAutoNotice();
	}else{
		startAutoNotice();
	}
}
function startAutoNoticeJoinersLeavers(){
    autoJoinLeaveNotice = true;
    $("#hybrisJoiners").css("background-color", "#105D2F");
    refreshAPIStatus();
}
function stopAutoNoticeJoinersLeavers(){
    autoJoinLeaveNotice = false;
    $("#hybrisJoiners").css("background-color", "#5D102F");
    refreshAPIStatus();
}
function switchAutoNoticeJoinersLeavers(){
    if(autoJoinLeaveNotice){
        stopAutoNoticeJoinersLeavers();
    }else{
        startAutoNoticeJoinersLeavers();
    }
}
function main(){
    // PlugCubed compatibility - has to be loaded BEFORE PlugCubed
    $("#chat-messages").css("height", "685px");// This resizes the messages area to make place for Hybris Toolbar
    $("#chat-input").css("bottom", "46px");// This makes the ChatInput go a lil more up to make place for Hybris Toolbar
    if($("#hybrisHeader").length == 0){
        $("#chat").append("<div id=\"hybrisHeader\"><div class=\"divider\" /></div>");
    }
    $("#hybrisHeader").css("position", "absolute");
    $("#hybrisHeader").css("height", "46px");
    $("#hybrisHeader").css("bottom", "0px");
    $("#hybrisHeader").css("left", "10px");
    $("#hybrisHeader").css("width", "100%");
    
    if($("#hybrisAutoWoot").length == 0){
        $("#hybrisHeader").append("<div id=\"hybrisAutoWoot\" class=\"chat-header-button\"><i class=\"icon icon-hybris-autowoot\"></i></div>");
    }
    $(".icon-hybris-autowoot").css("background", "url('https://cdn.plug.dj/_/static/images/icons.5f9a8e66-2aff-4176-96b8-7859f92becfc.png')");
    $(".icon-hybris-autowoot").css("background-position", "-105px -280px");
    $("#hybrisAutoWoot").unbind('click.hybris');
    $("#hybrisAutoWoot").bind('click.hybris', switchAutoWoot);
    stopAutoWoot();
    
    if($("#hybrisMention").length == 0){
        $("#hybrisHeader").append("<div id=\"hybrisMention\" class=\"chat-header-button\"><i class=\"icon icon-hybris-mention\"></i></div>");
    }
    $(".icon-hybris-mention").css("background", "url('https://cdn.plug.dj/_/static/images/icons.5f9a8e66-2aff-4176-96b8-7859f92becfc.png')");
    $(".icon-hybris-mention").css("background-position", "-140px 0px");
    $("#hybrisMention").unbind('click.hybris');
    $("#hybrisMention").bind('click.hybris', switchAutoNotice);
    startAutoNotice();
    
    if($("#hybrisJoiners").length == 0){
        $("#hybrisHeader").append("<div id=\"hybrisJoiners\" class=\"chat-header-button\"><i class=\"icon icon-hybris-joiners\"></i></div>");
    }
    $(".icon-hybris-joiners").css("background", "url('https://cdn.plug.dj/_/static/images/icons.5f9a8e66-2aff-4176-96b8-7859f92becfc.png')");
    $(".icon-hybris-joiners").css("background-position", "-245px 0px");
    $("#hybrisJoiners").unbind('clic.hybris');
    $("#hybrisJoiners").bind('click.hybris', switchAutoNoticeJoinersLeavers);
    stopAutoNoticeJoinersLeavers();
}
$(document).ready(main);
