const goBack = () => {
  document.getElementById('leaveModal').style.display = 'flex';
}
const confirmLeave = () => {
  window.location.href = '../dashboard/dashboard.html';
}
const cancelLeave = () => {
  document.getElementById('leaveModal').style.display = 'none';
}
const playSound1 = () => {
  new Audio("../../../Audio/Single vowel/kr-m-zy-a.mp3").play();
}

const continueToLessonTwo = () => {
  window.location.href = 'lesson-5.html';
}

const playVideo = () => {
  document.getElementById('video').play();
}