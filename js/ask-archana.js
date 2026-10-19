/* Ask Archana — chat widget
   Preview mode: answers come from a small local demo script below.
   Production mode: set AA_CONFIG.apiUrl to the live backend endpoint,
   and this file will call it instead (see sendMessage()).
*/
(function () {
  const AA_CONFIG = {
    apiUrl: null, // e.g. "https://ask-archana.yourname.workers.dev/chat" — once set, demo answers are skipped
    avatarUrl: "/images/Archana-profile.jpg",
  };

  const SUGGESTIONS = [
    "How did you go from dev to design?",
    "What do you think about AI taking over design?",
    "Tell me about the RSA project",
    "How do you use AI day to day?",
  ];

  // Demo-only canned answers so you can see the widget working before the
  // real backend is wired up. Replace with live API once AA_CONFIG.apiUrl is set.
  const DEMO_QA = [
    {
      match: /dev.*design|front.?end.*design|became a designer|dev to design/i,
      answer: "I started as a front-end developer for about two years. I liked making things look and feel right more than wiring up the logic behind them, so I moved into design at Box8 in 2019 — and immediately got to build a design system, which was a steep but useful start. The engineering background still helps: I can talk to developers in their language and I know what's actually feasible to ship.",
    },
    {
      match: /ai.*(take over|replace|taking over)|will ai/i,
      answer: "I don't think AI takes over design, but it does take over a lot of the production work that used to eat a designer's week. The judgment — what problem is worth solving, what trade-off to make, what 'good' looks like for this specific user — still has to come from a person. My view is closer to \"designing with AI, not through it.\"",
    },
    {
      match: /use ai|day.to.day|daily.*ai|ai.*workflow/i,
      answer: "Day to day, I use AI to speed up research synthesis, early prototyping, and iteration — the parts that used to take hours of repetitive work. I still own the judgment and the final call myself.",
    },
    {
      match: /rsa|roadside/i,
      answer: "RSA was a 0-to-1 project at Acko: turning a phone-dependent roadside assistance service into something self-serve. The real problem wasn't the app, it was trust — people didn't believe help would actually come. We cut the intake questions from 14 to 6, made live tracking central, and it launched handling 2,188 cases with resolution time cut in half. Want the full case study? [View it here](/Works/rsa.html)",
    },
    {
      match: /new car|funnel/i,
      answer: "The new car insurance journey was converting only 21% of visitors to a quote. The issue wasn't friction, it was that we were treating very different users the same way — someone two weeks from delivery and someone who just started browsing. We forked the journey by purchase intent and took E2Q to 65%, a 3x lift. [Full case study](/Works/new-car.html)",
    },
    {
      match: /slice|onboarding|kyc/i,
      answer: "Slice's onboarding was losing over half of users, mostly at document upload steps. We moved to an approval-first flow — show the credit limit before asking for the hard stuff — and worked with legal to keep it RBI-compliant. Completion went from 45% to 82%. [Full case study](/Works/onboarding.html)",
    },
  ];

  const FALLBACK =
    "That's a good one, and I'd rather give you a real answer than a guess. Let's connect directly — email me at archanakumaribarik@gmail.com or message me on LinkedIn, and I'll get back to you.";

  function logQuestion(question, answered) {
    // Placeholder for now — once the backend is live, this becomes a fetch()
    // to the logging endpoint so Archana gets the weekly "what people asked" digest.
    console.log("[ask-archana] logged:", { question, answered, ts: new Date().toISOString() });
  }

  function getDemoAnswer(question) {
    for (const entry of DEMO_QA) {
      if (entry.match.test(question)) {
        return { text: entry.answer, answered: true };
      }
    }
    return { text: FALLBACK, answered: false };
  }

  async function getAnswer(question) {
    if (AA_CONFIG.apiUrl) {
      try {
        const res = await fetch(AA_CONFIG.apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: question }),
        });
        const data = await res.json();
        return { text: data.reply, answered: data.answered };
      } catch (e) {
        return { text: FALLBACK, answered: false };
      }
    }
    // demo mode
    await new Promise((r) => setTimeout(r, 650 + Math.random() * 500));
    return getDemoAnswer(question);
  }

  function buildWidget() {
    const launcher = document.createElement("button");
    launcher.id = "aa-launcher";
    launcher.setAttribute("aria-label", "Chat with Archana's AI assistant");
    launcher.innerHTML = `
      <svg class="aa-chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
      <svg class="aa-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    `;

    const panel = document.createElement("div");
    panel.id = "aa-panel";
    panel.innerHTML = `
      <div id="aa-header">
        <img src="${AA_CONFIG.avatarUrl}" alt="Archana Kumari" onerror="this.style.display='none'">
        <div id="aa-header-text">
          <p id="aa-header-title">Ask Archana</p>
          <p id="aa-header-sub"><span class="aa-dot"></span>AI version · usually accurate, always honest</p>
        </div>
      </div>
      <div id="aa-messages"></div>
      <div id="aa-suggestions"></div>
      <div id="aa-input-row">
        <textarea id="aa-input" rows="1" placeholder="Ask me anything..."></textarea>
        <button id="aa-send" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
      <div id="aa-footer"><span>This is an AI version of me — conversations may be reviewed to improve it.</span></div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    const messagesEl = panel.querySelector("#aa-messages");
    const suggestionsEl = panel.querySelector("#aa-suggestions");
    const inputEl = panel.querySelector("#aa-input");
    const sendBtn = panel.querySelector("#aa-send");

    function addMessage(text, who) {
      const div = document.createElement("div");
      div.className = `aa-msg ${who}`;
      div.textContent = text;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    function addMarkdownBotMessage(text) {
      const div = document.createElement("div");
      div.className = "aa-msg bot";
      const linked = text.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" style="color:inherit;text-decoration:underline;">$1</a>'
      );
      div.innerHTML = linked;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
      const div = document.createElement("div");
      div.className = "aa-msg typing";
      div.innerHTML = "<span></span><span></span><span></span>";
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    function renderSuggestions() {
      suggestionsEl.innerHTML = "";
      SUGGESTIONS.forEach((q) => {
        const chip = document.createElement("button");
        chip.className = "aa-suggestion-chip";
        chip.textContent = q;
        chip.addEventListener("click", () => handleSend(q));
        suggestionsEl.appendChild(chip);
      });
    }

    async function handleSend(textOverride) {
      const text = (textOverride ?? inputEl.value).trim();
      if (!text) return;
      inputEl.value = "";
      inputEl.style.height = "auto";
      suggestionsEl.innerHTML = "";
      addMessage(text, "user");
      const typingEl = showTyping();
      sendBtn.disabled = true;

      const { text: answer, answered } = await getAnswer(text);
      logQuestion(text, answered);

      typingEl.remove();
      addMarkdownBotMessage(answer);
      sendBtn.disabled = false;
      inputEl.focus();
    }

    sendBtn.addEventListener("click", () => handleSend());
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
    inputEl.addEventListener("input", () => {
      inputEl.style.height = "auto";
      inputEl.style.height = Math.min(inputEl.scrollHeight, 90) + "px";
    });

    launcher.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("open");
      launcher.classList.toggle("open", isOpen);
      if (isOpen) inputEl.focus();
    });

    // greet on first open
    let greeted = false;
    launcher.addEventListener("click", () => {
      if (!greeted && panel.classList.contains("open")) {
        greeted = true;
        addMessage(
          "Hi, I'm an AI version of Archana. Ask me about my projects, how I think about AI in design, or anything else you're curious about.",
          "bot"
        );
        renderSuggestions();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildWidget);
  } else {
    buildWidget();
  }
})();
