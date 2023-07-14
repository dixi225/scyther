let video=document.querySelector("video");
let recordBtnCont=document.querySelector(".record-btn-container");
let captureBtnCont=document.querySelector(".capture-btn-container");
let recordBtn=document.querySelector(".record-btn");
let captureBtn=document.querySelector(".capture-btn");
let recordFlag=false;
let chunks=[];
let recorder;
let constraints={
    video:true,
    audio:true
}
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>
{
    video.srcObject =stream;
    recorder=new MediaRecorder(stream);
    recorder.addEventListener("start",(e)=>
    {
        chunks=[];
    })
    recorder.addEventListener("dataavailable",(e)=>
    {
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e)=>
    {
        let blob=new Blob(chunks,{ type: "video/mp4" });
        let videoURL=URL.createObjectURL(blob);
        let a=document.createElement("a");
        a.href=videoURL;
        a.download="stream.mp4"
        a.click();
    })       

})
recordBtnCont.addEventListener("click", (e)=>{
    if(!recorder) return;
    recordFlag=!recordFlag;
    if(recordFlag)
    {
        recorder.start();
        recordBtn.classList.add("scale-record")
        startTimer();
    }
    else
    {
        recorder.stop();
        recordBtn.classList.remove("scale-record")
        stopTimer();    
    }
})
captureBtnCont.addEventListener("click",(e)=>
{

    let canvas= document.createElement("canvas");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    let tool=canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);
    let imageURL=canvas.toDataURL();
    let a=document.createElement("a");
    a.href=imageURL;
    a.download="image.jpg"
    a.click();
    captureBtn.classList.add("scale-capture");
})
let timerID;
let timer=document.querySelector(".timer");
let counter=0;
function startTimer()
{
    timer.style.display = "block";
    function displayTimer()
    {
        let hour=Number.parseInt(counter/3600);
        let totalSeconds=counter%3600;
        let min=Number.parseInt(totalSeconds/60);
        totalSeconds=counter%60;
        let seconds=totalSeconds;
        if(hour<10) hour=`0${hour}`;
        if(min<10) min=`0${min}`;
        if(seconds<10) seconds=`0${seconds}`;
        timer.innerText=`${hour}:${min}:${seconds}`    
        counter++;
    }
    timerID=setInterval(displayTimer,1000);
}
function stopTimer()
{
    clearInterval(timerID);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
}
