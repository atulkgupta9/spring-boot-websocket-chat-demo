'use strict';
$(document).ready(function () {

    var c = [];
    var d = [];
    var e = [];

    function plotmylife(alpha,beta,gamma){
        var set2 = {};
        c.push(alpha);
        d.push(beta);
        e.push(gamma);
        set2['x'] = c;
        set2['y'] = d;
        set2['z'] = e;
        console.log(c,d,e);
        set2['mode'] = 'lines+markers';
        set2['marker'] = {
            color: 'rgb(255, 0, 0)',
            size: 8
        };
        set2['name'] = "Convex Polygon that enclosed these points";
        set2['line'] = {
            color: 'rgb(128, 0, 128)',
            width: 2
        };
        set2['type'] = 'scatter3d';
        var pos = [set2];
        var layout = {
            title: 'Points convered by device'
        };
        Plotly.newPlot('myDiv', pos, layout, {showSendToCloud: false})
    }
    plotmylife(0,0,0);

    // original content
    var usernamePage = document.querySelector('#username-page');
    var chatPage = document.querySelector('#chat-page');
    var usernameForm = document.querySelector('#usernameForm');
    var messageForm = document.querySelector('#messageForm');
    var messageInput = document.querySelector('#message');
    var messageArea = document.querySelector('#messageArea');
    var connectingElement = document.querySelector('.connecting');

    var stompClient = null;
    var username = null;

    var colors = [
        '#2196F3', '#32c787', '#00BCD4', '#ff5652',
        '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
    ];

    function connect(event) {
        username = document.querySelector('#name').value.trim();

        if (username) {
            usernamePage.classList.add('hidden');
            chatPage.classList.remove('hidden');

            var socket = new SockJS('/ws');
            stompClient = Stomp.over(socket);

            stompClient.connect({}, onConnected, onError);
        }
        event.preventDefault();
    }


    function onConnected() {
        // Subscribe to the Public Topic
        stompClient.subscribe('/topic/public', onMessageReceived);

        // Tell your username to the server
        stompClient.send("/app/chat.addUser",
            {},
            JSON.stringify({sender: username, type: 'JOIN'})
        )

        connectingElement.classList.add('hidden');
    }


    function onError(error) {
        connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
        connectingElement.style.color = 'red';
    }


    function sendMessage(event) {
        var messageContent = messageInput.value.trim();

        if (messageContent && stompClient) {
            var chatMessage = {
                sender: username,
                content: messageInput.value,
                type: 'CHAT'
            };

            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            messageInput.value = '';
        }
        event.preventDefault();
    }


    function onMessageReceived(payload) {
        var message = JSON.parse(payload.body);
        console.log(message);
        let arr = message.content.split(",");
        let alpha = arr[0];
        let beta = arr[1];
        let gamma = arr[2];
        console.log("alpha ", alpha, " beta ", beta, "gamma", gamma);
        plotmylife(alpha,beta,gamma);
    }


    function getAvatarColor(messageSender) {
        var hash = 0;
        for (var i = 0; i < messageSender.length; i++) {
            hash = 31 * hash + messageSender.charCodeAt(i);
        }

        var index = Math.abs(hash % colors.length);
        return colors[index];
    }

    usernameForm.addEventListener('submit', connect, true)
    messageForm.addEventListener('submit', sendMessage, true)





})
