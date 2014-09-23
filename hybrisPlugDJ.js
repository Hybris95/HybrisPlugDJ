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

/**
 * ADVANCE EVENT :
 * AutoWoot Only -> http://pastebin.com/qNV6T6pq
 */
var autoW = false;
function autowoot(advance){
    $("#woot").css("background-color", "");
    if(autoW){
        if(advance){
            if(advance.dj.username != ownUserName){
                $("#woot").click();
                $("#woot").css("background-color", "#10AD2F");
            }
        }else{
            $("#woot").click();
            $("#woot").css("background-color", "#10AD2F");
        }
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
 * AutoNotice Only -> http://pastebin.com/Hsi2YMDH
 */
var autoNotice = false;

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
    if(autoJoinNotice){
        API.on(API.USER_JOIN, someoneJoined);
    }
    if(autoLeaveNotice){
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
    $("#woot").css("background-color", "");
    refreshAPIStatus();
}
var wootClicks = 0;
function doubleClick(){
    wootClicks++;
    if(debug)console.log(wootClicks);
    if(wootClicks == 2)
    {
        wootClicks = 0;
        if(autoW){
            stopAutoWoot();
        }else{
            startAutoWoot();
        }
    }
    setTimeout(function(){wootClicks = 0}, 800);
}
function startAutoNotice(){
    autoNotice = true;
	$("#chat-sound-button").css("background-color", "#105D2F");
    refreshAPIStatus();
}
function stopAutoNotice(){
    autoNotice = false;
	$("#chat-sound-button").css("background-color", "#5D102F");
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
    autoJoinNotice = true;
    autoLeaveNotice = true;
    $("#hybrisJoiners").css("background-color", "#105D2F");
    refreshAPIStatus();
}
function stopAutoNoticeJoinersLeavers(){
    autoJoinNotice = false;
    autoLeaveNotice = false;
    $("#hybrisJoiners").css("background-color", "#5D102F");
    refreshAPIStatus();
}
function switchAutoNoticeJoinersLeavers(){
    if(autoJoinNotice){
        stopAutoNoticeJoinersLeavers();
    }else{
        startAutoNoticeJoinersLeavers();
    }
}
function main(){
    $("#woot").unbind('click.hybris');
    $("#woot").bind('click.hybris', doubleClick);
    $("#woot")[0].children[0].children[1].innerHTML = "x2Click";
    stopAutoWoot();
    
    $("#chat-sound-button").unbind('click.hybris');
    $("#chat-sound-button").bind('click.hybris', switchAutoNotice);
    startAutoNotice();
    
    if($("#hybrisJoiners").length == 0){
        $("#chat-header").append("<div id=\"hybrisJoiners\" class=\"chat-header-button\"><i class=\"icon icon-chat-joiners\"></i></div>");
        
    }
    $(".icon-chat-joiners").css("background", "url('https://cdn.plug.dj/_/static/images/icons.5f9a8e66-2aff-4176-96b8-7859f92becfc.png')");
    $("#hybrisJoiners").unbind('clic.hybris');
    $("#hybrisJoiners").bind('click.hybris', switchAutoNoticeJoinersLeavers);
    startAutoNoticeJoinersLeavers();
}
$(document).ready(main);
