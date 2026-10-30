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
const storageNotice = document.getElementById("storageNotice");

// Keep an in-memory copy so blocked or full storage never prevents a reveal.
const memory = new Map();
let storageAvailable = true;
function readSaved(key) {
  if (storageAvailable) {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) memory.set(key, value);
      else memory.delete(key);
      return value;
    } catch {
      storageAvailable = false;
      storageNotice.classList.remove("hidden");
    }
  }
  return memory.get(key) ?? null;
}

function saveValue(key, value) {
  memory.set(key, value);
  if (storageAvailable) {
    try {
      localStorage.setItem(key, value);
    } catch {
      storageAvailable = false;
      storageNotice.classList.remove("hidden");
    }
  }
}

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getRandomMessage(previousMessage) {
  const available = messages.filter(message => message !== previousMessage);
  const pool = available.length ? available : messages;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getMessageForToday() {
  const today = getTodayKey();
  const savedDate = readSaved("messageDate");
  const savedMessage = readSaved("dailyMessage");
  const previousMessage = readSaved("previousMessage");
  if (savedDate === today && messages.includes(savedMessage)) return savedMessage;

  const lastMessage = savedMessage || previousMessage;
  const message = getRandomMessage(lastMessage);
  if (lastMessage) saveValue("previousMessage", lastMessage);
  // Store the message first so a failed write cannot mark an old message as today's.
  saveValue("dailyMessage", message);
  saveValue("messageDate", today);
  return message;
}

let displayedDate = getTodayKey();
function showMessage() {
  refreshDate();
  dailyMessage.textContent = getMessageForToday();
  messageBox.classList.remove("hidden");
  messageButton.setAttribute("aria-expanded", "true");
  messageButton.textContent = "Read today’s message again";
  messageButton.classList.add("opened");
}

function restoreTodayState() {
  const savedDate = readSaved("messageDate");
  const savedMessage = readSaved("dailyMessage");
  messageBox.classList.add("hidden");
  dailyMessage.textContent = "";
  messageButton.setAttribute("aria-expanded", "false");
  const opened = savedDate === getTodayKey() && messages.includes(savedMessage);
  messageButton.textContent = opened ? "Open today’s message again" : "Give me my message";
  messageButton.classList.toggle("opened", opened);
}

function refreshDate() {
  const today = getTodayKey();
  if (today !== displayedDate) {
    displayedDate = today;
    restoreTodayState();
  }
}

// Recalculate local midnight each time, including across daylight-saving changes.
let midnightTimer;
function scheduleMidnight() {
  clearTimeout(midnightTimer);
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  midnightTimer = setTimeout(() => {
    refreshDate();
    scheduleMidnight();
  }, midnight.getTime() - now.getTime() + 50);
}

messageButton.addEventListener("click", showMessage);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    refreshDate();
    scheduleMidnight();
  }
});
window.addEventListener("focus", () => {
  refreshDate();
  scheduleMidnight();
});
window.addEventListener("storage", event => {
  if (storageAvailable && (event.key === null || ["messageDate", "dailyMessage", "previousMessage"].includes(event.key))) {
    restoreTodayState();
  }
});
restoreTodayState();
scheduleMidnight();
