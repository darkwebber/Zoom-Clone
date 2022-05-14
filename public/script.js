const socket = io('/');
const MyVideo = document.createElement('video');
const VideoGrid = document.getElementById('video-grid');
MyVideo.muted = true;
var peer = new Peer(undefined,{
    path: "/peerjs",
    host: "/",
    port: '443'
});
let MyVideoStream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then( (stream)=>{
    MyVideoStream = stream;
    addVideoStream(MyVideo,stream);
    peer.on('call',(call)=>{
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream',(userVideoStream)=>{
            addVideoStream(video,userVideoStream);
        });
    });
    socket.on('user-connected',(userId)=>{
        console.log("Userrrrrrrr conned")
        setTimeout(connectToNewUser,1000,userId,stream)
    });
});
peer.on('open',(id)=>{
    socket.emit('join-room',ROOM_ID,id);
});
peer.on('diconnected',(id)=>{
    socket.emit('user-lost',id);
});
const connectToNewUser = (userId,stream)=>{
    console.log("userrr Caleeed");
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream',(userVideoStream)=>{
        console.log("User Streameddddd");
        addVideoStream(video,userVideoStream);
    });
};
const addVideoStream = (video,stream)=>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    });
    VideoGrid.append(video);
};
socket.on('recieve',(msg)=>{
    $('ul').append(`<li style="text-align:right"><b>other</b><br/>${msg}</li>`);
})
let message = $("input")
$('html').keydown((e)=>{
    if(e.which == 13 && message.val().length !==0){
        socket.emit('message',message.val(),ROOM_ID);
        $('ul').append(`<li><b>You</b><br/>${message.val()}</li>`);
        message.val('');
    }
});
const scrollToBottom = ()=>{
    let wind = $('.main__chat_window');
    wind.scrollTop(d.prop("scrollHeight"));
};
$(".chat").click((e)=>{
    $(".main__right").toggle();
    let chng = $(".main__left").css("flex")==0.8?1:0.8;
    $(".main__left").css("flex",chng);
});
const muteUnmute = ()=>{
    const enabled = MyVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        MyVideoStream.getAudioTracks()[0].enabled=false;
        $($(".main__mute_button")[0].children[1]).text('Unmute');
        $($(".main__mute_button")[0].children[0]).attr("class","fa-solid fa-microphone-slash");
    }else{
        MyVideoStream.getAudioTracks()[0].enabled=true;
        $($(".main__mute_button")[0].children[1]).text('Mute')
        $($(".main__mute_button")[0].children[0]).attr("class","fa-solid fa-microphone");
    }
};
const playStop = ()=>{
    let enabled = MyVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        MyVideoStream.getVideoTracks()[0].enabled=false;
        $($(".main__video_button")[0].children[1]).text('Show Video')
        $($(".main__video_button")[0].children[0]).attr("class","fa-solid fa-video-slash");
    }else{
        MyVideoStream.getVideoTracks()[0].enabled=true;
        $($(".main__video_button")[0].children[1]).text('Stop Video')
        $($(".main__video_button")[0].children[0]).attr("class","fa-solid fa-video");
    }
};