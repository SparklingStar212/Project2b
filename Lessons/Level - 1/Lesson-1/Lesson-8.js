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
  new Audio("../../../Audio/Single vowel/kr-m-zy-e.mp3").play();
}
let userHasClicked = false;
const continueBtn = document.getElementById("continue");
continueBtn.disabled = true;
const nextLesson = () => {
  window.location.href = 'Lesson-9.html';
}

const pickOption = (event) => {
  if (userHasClicked) return;

  userHasClicked = true;
  document.querySelectorAll(".options").forEach(el => el.disabled = true);
  continueBtn.style.backgroundColor = "green";
  continueBtn.disabled = false;
  const value = event.target.getAttribute("value");
  if (value === "애") {
    new Audio("../../../Audio/Sound effects/correct-6033.mp3").play();
    document.getElementById("correct").style.borderColor = "green";
    document.getElementById("correct").style.boxShadow = "0 0 10px green";
  } else {
    new Audio("../../../Audio/Sound effects/error-04-199275.mp3").play();
    event.target.style.borderColor = "red";
    event.target.style.boxShadow = "0 0 10px red";
    document.getElementById("correct").style.borderColor = "green";
    document.getElementById("correct").style.boxShadow = "0 0 10px green";
  }
}