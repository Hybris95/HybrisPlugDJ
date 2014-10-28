// ==UserScript==
// @name            HybrisPlugDJ UserScript
// @namespace       https://github.com/Hybris95/HybrisPlugDJ
// @description     Autorun HybrisPlugDJ
// @icon            https://avatars3.githubusercontent.com/u/705741?v=2&s=40
// @include         https://plug.dj/*
// @exclude         https://plug.dj/dashboard
// @exclude         https://plug.dj/privacy
// @exclude         https://plug.dj/terms
// @exclude         https://plug.dj/communities
// @author          Christian "Hybris95" BUISSON
// @version         1.0
// ==/UserScript==

/* GNU GPLv3 Licensing :
Christian BUISSON French Developper contact by electronic mail: hybris_95@hotmail.com
Copyright © 2014 Christian BUISSON
    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software Foundation,
    Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
*/

(function(){
    var init = function(){
        if (!document.getElementById('room-loader')) {
            setTimeout(init,200);
        } else {
            loader();
        }
    },
    loader = function(){
        if (document.getElementById('room-loader')) {
            setTimeout(loader,200);
        } else {
            var script = document.createElement('script');
            script.textContent = "$.getScript('https://rawgit.com/Hybris95/HybrisPlugDJ/master/hybrisPlugDJ.js');";
            document.head.appendChild(script);
        }
    };
    init();
})();
