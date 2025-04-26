const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');

const commands = {
  "help": `
    • <b>help</b> — Show command list<br>
    • <b>about</b> — Learn about SmartBot<br>
    • <b>contact</b> — Contact support<br>
    • <b>features</b> — View bot features<br>
    • <b>courses</b> — View available courses<br>
    • <b>fees</b> — View fee details<br>
    • <b>clear</b> — Clear chat
  `,
  "about": "I am <b>SmartBot</b>, your AI-powered virtual assistant created with HTML, CSS, and JS!",
  "contact": "You can reach us at: <b>support@example.com</b>",
  "features": `
    <b>SmartBot Features:</b><br>
    • Voice to Text<br>
    • Typewriter Animation<br>
    • Dark/Light Mode Toggle<br>
    • Copy / Save / Load / Clear Chat<br>
    • Command Support<br>
  `,
  "courses": `
    <b>Available Courses:</b><br>
    • Computer Science Engineering (CSE)<br>
    • Mechanical Engineering (ME)<br>
    • Civil Engineering (CE)<br>
    • Electrical Engineering (EE)<br>
    • Electronics & Communication Engineering (ECE)
  `,
  "fees": `
    <b>Fee Structure:</b><br>
    • Admission Fee: ₹5000/-<br>
    • Tuition Fee: ₹20,000/- per year<br>
    • Hostel Fee (optional): ₹30,000/- per year<br>
    • Exam Fee: ₹1000/- per semester
  `,
  "clear": "Chat cleared. Start fresh!"
};

function appendBotMessage(content) {
  const wrapper = document.createElement('div');
  wrapper.className = 'bot-wrapper';

  const emoji = document.createElement('div');
  emoji.className = 'bot-emoji';
  emoji.textContent = '🤖';

  const text = document.createElement('div');
  text.className = 'bot-text';

  wrapper.appendChild(emoji);
  wrapper.appendChild(text);
  chat.appendChild(wrapper);
  chat.scrollTop = chat.scrollHeight;

  let i = 0;
  const typing = setInterval(() => {
    text.innerHTML = content.substring(0, i++);
    if (i > content.length) clearInterval(typing);
  }, 20);
}

function appendUserMessage(content) {
  const wrapper = document.createElement('div');
  wrapper.className = 'user-wrapper';

  const text = document.createElement('div');
  text.className = 'user-text';
  text.textContent = content;

  wrapper.appendChild(text);
  chat.appendChild(wrapper);
  chat.scrollTop = chat.scrollHeight;
}

function sendMessage() {
  const input = userInput.value.trim();
  if (!input) return;
  appendUserMessage(input);
  userInput.value = '';

  const lower = input.toLowerCase();

  const thinkingWrapper = document.createElement('div');
  thinkingWrapper.className = 'bot-wrapper';

  const emoji = document.createElement('div');
  emoji.className = 'bot-emoji';
  emoji.textContent = '🤖';

  const thinking = document.createElement('div');
  thinking.className = 'bot-thinking';
  thinking.innerHTML = '<span class="dots"><span>.</span><span>.</span><span>.</span></span>';

  thinkingWrapper.appendChild(emoji);
  thinkingWrapper.appendChild(thinking);
  chat.appendChild(thinkingWrapper);
  chat.scrollTop = chat.scrollHeight;

  setTimeout(() => {
    thinkingWrapper.remove();

    if (commands[lower]) {
      if (lower === "clear") chat.innerHTML = '';
      appendBotMessage(commands[lower]);
    } else if (["hi", "hello", "hii", "hey"].includes(lower)) {
      appendBotMessage("Hi there! 👋 How can I assist you today?");
    } else if (lower.includes("admission")) {
      appendBotMessage("Need help with <b>admission</b>? Visit our portal or type <b>contact</b> to get in touch!");
    } else if (lower.includes("course") || lower.includes("courses")) {
      appendBotMessage(commands["courses"]);
    } else if (lower.includes("fee") || lower.includes("fees")) {
      appendBotMessage(commands["fees"]);
    } else {
      const suggestion = Object.keys(commands).map(c => `<b>${c}</b>`).join(', ');
      appendBotMessage(`Sorry, I didn’t understand that.<br>Try: ${suggestion}`);
    }
  }, 800);
}

document.getElementById('toggleMode').onclick = () => {
  document.body.classList.toggle('light-mode');
};

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    userInput.value = transcript;
  };

  recognition.onerror = (e) => {
    alert("Voice recognition error: " + e.error);
  };
}

// Copy Chat
function copyChat() {
  const chatContent = chat.innerText;
  navigator.clipboard.writeText(chatContent)
    .then(() => {
      alert('Chat copied to clipboard!');
    })
    .catch(err => {
      alert('Failed to copy chat: ' + err);
    });
}

// Save Chat
function saveChat() {
  const chatContent = chat.innerHTML;
  localStorage.setItem('savedChat', chatContent);
  alert('Chat saved!');
}

// Load Chat
function loadChat() {
  const savedChat = localStorage.getItem('savedChat');
  if (savedChat) {
    chat.innerHTML = savedChat;
    alert('Chat loaded!');
  } else {
    alert('No saved chat found.');
  }
}

// Clear Chat
function clearChat() {
  if (confirm("Are you sure you want to clear the chat?")) {
    chat.innerHTML = `
      <div class="bot-wrapper">
        <span class="bot-emoji">🤖</span>
        <p class="bot-text">Hi there! 👋 How can I assist you today?</p>
      </div>
    `;
  }
}