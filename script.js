const messages = [
  "Do the thing you’ve been avoiding.",
  "Start before you feel ready.",
  "Today might be better than you expect.",
  "Keep it moving.",
  "Make something happen today.",
  "You already know what you need to do.",
  "Don’t overthink the next move.",
  "One good decision can change the whole day.",
  "Go outside. It might help.",
  "Make today worth remembering.",

  "Less thinking. More doing.",
  "You can figure it out as you go.",
  "Do something your future self will thank you for.",
  "Take the chance.",
  "Send the message.",
  "Finish what you started.",
  "Don’t wait for the perfect timing.",
  "Today is a good day to try again.",
  "Move first. Motivation can catch up later.",
  "Make the next hour count.",

  "A little discipline goes a long way.",
  "Stop waiting for the mood.",
  "You’ve got more options than you think.",
  "Choose the harder right thing.",
  "Be where your feet are.",
  "Keep your standards high.",
  "You don’t need a sign. This is enough.",
  "Make a decision and back yourself.",
  "Do it properly or don’t do it.",
  "Let your actions speak today.",

  "Be curious today.",
  "Try something different.",
  "Change the scenery.",
  "Talk to someone new.",
  "Say yes to something unexpected.",
  "Take the longer route home.",
  "Notice what you normally miss.",
  "Make room for a good surprise.",
  "Do one thing just because you want to.",
  "Find something worth laughing about.",

  "Keep your head clear.",
  "Don’t give small problems big energy.",
  "Not everything deserves a reaction.",
  "Pick your battles.",
  "Stay calm and handle it.",
  "Protect your focus.",
  "Don’t let one bad moment own the whole day.",
  "Leave unnecessary drama where it belongs.",
  "Keep things simple.",
  "Focus on what you can actually control.",

  "You can change the plan.",
  "You can take a different route.",
  "A bad start doesn’t mean a bad day.",
  "Reset and keep going.",
  "Try again, but smarter.",
  "If it isn’t working, change something.",
  "Don’t stay stuck just because it’s familiar.",
  "You’re allowed to want something different.",
  "Take the lesson and move.",
  "You don’t need to repeat yesterday.",

  "Be serious about what matters to you.",
  "Put some effort behind what you say you want.",
  "Consistency looks boring until it works.",
  "Small moves still build momentum.",
  "Show up even when it feels ordinary.",
  "Make progress visible.",
  "Keep the promise you made to yourself.",
  "Get one thing done properly today.",
  "Your habits are voting for your future.",
  "Make today useful.",

  "Don’t confuse comfort with happiness.",
  "Your comfort zone is not a permanent address.",
  "Say what you actually mean.",
  "Ask the question.",
  "Take the risk you keep thinking about.",
  "You’ll learn more by trying.",
  "Make the call.",
  "Stop rehearsing and start.",
  "Confidence usually comes after action.",
  "Back yourself a little more.",

  "Do something that gives you a story to tell.",
  "Romanticize the boring parts a little.",
  "Take the photo.",
  "Go get the coffee.",
  "Play the song louder.",
  "Wear the thing you were saving.",
  "Make plans instead of saying we should sometime.",
  "Create something today.",
  "Make the ordinary feel less ordinary.",
  "Give yourself something to look forward to.",

  "Don’t spend the whole day in your head.",
  "Look around. Life is happening.",
  "Be present enough to notice the good parts.",
  "You don’t need to win every conversation.",
  "Listen before you react.",
  "Some things are clearer when you stop forcing them.",
  "Let people show you who they are.",
  "Pay attention to what feels easy.",
  "Keep what works. Drop what doesn’t.",
  "End the day knowing you actually lived it."
];

const messageButton = document.getElementById("messageButton");
const messageBox = document.getElementById("messageBox");
const dailyMessage = document.getElementById("dailyMessage");

function getTodayKey() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getRandomMessage(previousMessage) {
  let availableMessages = messages.filter(
    message => message !== previousMessage
  );

  if (availableMessages.length === 0) {
    availableMessages = messages;
  }

  const randomIndex = Math.floor(
    Math.random() * availableMessages.length
  );

  return availableMessages[randomIndex];
}

function getMessageForToday() {
  const today = getTodayKey();

  const savedDate = localStorage.getItem("messageDate");
  const savedMessage = localStorage.getItem("dailyMessage");
  const previousMessage = localStorage.getItem("previousMessage");

  if (savedDate === today && savedMessage) {
    return savedMessage;
  }

  if (savedMessage) {
    localStorage.setItem("previousMessage", savedMessage);
  }

  const lastMessage = savedMessage || previousMessage;

  const newMessage = getRandomMessage(lastMessage);

  localStorage.setItem("messageDate", today);
  localStorage.setItem("dailyMessage", newMessage);

  return newMessage;
}

function showMessage() {
  const message = getMessageForToday();

  dailyMessage.textContent = message;
  messageBox.classList.remove("hidden");

  messageButton.textContent = "You already opened today’s message";
  messageButton.classList.add("opened");
}

messageButton.addEventListener("click", showMessage);

function restoreTodayState() {
  const today = getTodayKey();

  const savedDate = localStorage.getItem("messageDate");
  const savedMessage = localStorage.getItem("dailyMessage");

  if (savedDate === today && savedMessage) {
    messageBox.classList.add("hidden");

    messageButton.textContent = "Open today’s message again";
    messageButton.classList.add("opened");
  }
}

restoreTodayState();
