const video = document.getElementById('video')
let emotion;
var text = document.getElementById("text");

// video "hidden" van applicatie 
let happyvideo = document.getElementById("happyvideo").style.visibility = "hidden";
let sadvideo = document.getElementById("sadvideo").style.visibility = "hidden";
let neutralvideo = document.getElementById("neutralvideo").style.visibility = "hidden";
let angryvideo = document.getElementById("angryvideo").style.visibility = "hidden";
let surprisedvideo = document.getElementById("surprisedvideo").style.visibility = "hidden";
let fearfulvideo = document.getElementById("fearfulvideo").style.visibility = "hidden";
let disgustedvideo = document.getElementById("disgustedvideo").style.visibility = "hidden";
let reloadbutton = document.getElementById("reloadbutton").style.visibility = "hidden";



//Inladen modellen
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

//Opstarten video
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}
console.log("Video started!")


//Canvas aanmaken en hierin tekenen van detecties, landmarks en expressies
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  let interval = setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    emotion = resizedDetections
    setTimeout( () => showEmotion(emotion, canvas, interval), 5000 )
  }, 100)
  
  console.log("Face API started!")

})

//Verschillende berichten en videos bij verschillende emoties

async function showEmotion(emotion, canvas, interval) {
  clearInterval(interval)
  video.remove()
  canvas.remove()
  
  if(emotion[0].expressions.happy > 0.5) {
    text.innerHTML = 'Je bent blij, ga zo door, hier een toepasselijk nummer!'
    document.body.appendChild(text)
    console.log('happy')
    document.getElementById("happyvideo").style.visibility = "visible";
    document.getElementById("reloadbutton").style.visibility = "visible";
  } 

  if(emotion[0].expressions.sad > 0.5) {
    text.innerHTML = 'Je kijkt verdrietig, hier een video om je op te vrolijken!' 
    document.body.appendChild(text)
    console.log('sad')
    document.getElementById("sadvideo").style.visibility = "visible";
    document.getElementById("reloadbutton").style.visibility = "visible";
  }

  if(emotion[0].expressions.neutral > 0.5) {
    text.innerHTML = 'Ik kan je emotie niet echt peilen, hier een filmpje over het durven laten zien van je emoties, misschien helpt het!'
    document.body.appendChild(text);
    console.log('neutral')
    document.getElementById("neutralvideo").style.visibility = "visible";
    document.getElementById("reloadbutton").style.visibility = "visible";
  }

  if(emotion[0].expressions.angry > 0.5) {
    text.innerHTML = 'Je kijkt boos, hier iets om te kalmeren...'
    document.body.appendChild(text)
    console.log('angry')
    document.getElementById("angryvideo").style.visibility = "visible";
    document.getElementById("reloadbutton").style.visibility = "visible";
  }

  if(emotion[0].expressions.surprised > 0.5) {
    text.innerHTML = 'Je ziet er verrast uit, Pickachu ook!'
    document.body.appendChild(text)
    console.log('surprised')
    document.getElementById("surprisedvideo").style.visibility = "visible";
    document.getElementById("reloadbutton").style.visibility = "visible";
  }

  if(emotion[0].expressions.fearful > 0.5) {
    text.innerHTML = 'Volgensmij is er iets geshockeerds gebeurd, hier iets om je angst snel te onderdrukken'
    document.body.appendChild(text)
    console.log('fearful')
    document.getElementById("fearfulvideo").style.visibility = "visible";
    document.getElementById("reloadbutton").style.visibility = "visible";
  }

  if(emotion[0].expressions.disgusted > 0.5) {
    text.innerHTML = 'Waarom kijk je zo vies, hier de DISGUSTING meme'
    document.body.appendChild(text)
    console.log('disgusted')
    document.getElementById("reloadbutton").style.visibility = "visible";
  }

}
