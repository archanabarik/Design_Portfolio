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

  // Suggestion chips change based on which page the widget is loaded on,
  // so a visitor reading a specific case study sees questions about that
  // project instead of generic ones. Matched against the URL path.
  const SUGGESTION_SETS = [
    {
      match: /rsa\.html/i,
      questions: [
        "What was the hardest part of this project?",
        "What was Acko actually asking you to fix?",
        "What are you most proud of here?",
        "Tell me the story behind this one",
      ],
    },
    {
      match: /new-car\.html/i,
      questions: [
        "What was the hardest part of this project?",
        "What was broken before you stepped in?",
        "Is this impact mostly design, or the business?",
        "Tell me the story behind this one",
      ],
    },
    {
      match: /onboarding\.html/i,
      questions: [
        "What was the hardest part of this project?",
        "How did you balance rules with user experience?",
        "What are you most proud of here?",
        "Tell me the story behind this one",
      ],
    },
    {
      match: /Works[\\/]design\.html/i, // work index / "all projects" page
      questions: [
        "Which project are you proudest of?",
        "What do these projects have in common?",
        "Tell me about the roadside assistance project",
        "Tell me about the new car insurance project",
      ],
    },
    {
      match: /about\.html/i,
      questions: [
        "Why did you move from development to design?",
        "What's your approach to design, in plain words?",
        "How do you mentor other designers?",
        "What do you think about AI and design?",
      ],
    },
    {
      match: /contact\.html/i,
      questions: [
        "Are you open to new opportunities?",
        "What kind of roles interest you?",
        "Why should someone hire you?",
        "What's the best way to reach you?",
      ],
    },
  ];

  const DEFAULT_SUGGESTIONS = [
    // shown on the homepage, or any page that doesn't match a set above —
    // a deliberate mix across projects, AI views, and background
    "Why did you move from development to design?",
    "What do you think about AI and design?",
    "Tell me about a project you're proud of",
    "How do you use AI in your everyday work?",
  ];

  function getSuggestionsForPage() {
    const path = window.location.pathname;
    const set = SUGGESTION_SETS.find((s) => s.match.test(path));
    return set ? set.questions : DEFAULT_SUGGESTIONS;
  }

  // Demo-only canned answers so you can see the widget working before the
  // real backend is wired up. Replace with live API once AA_CONFIG.apiUrl is set.
  // Answers are written as short stories (what was broken, what we did, what
  // happened) rather than bullet-style facts, so someone with no design
  // background can follow along. Entries with a `page` regex only fire on
  // that page — this lets a generic question like "what was the hardest
  // part?" resolve to the right project depending on where it's asked.
  const DEMO_QA = [
    // -- background & philosophy (no page restriction) --
    {
      match: /dev.*design|front.?end.*design|became a designer|move(d)?\s*from\s*development/i,
      answer:
        "It wasn't one lightning-bolt moment, more something I noticed slowly. I started as a front-end developer, and I genuinely liked the craft of it — but I kept noticing I was more excited by whether something felt right to use than by how clean the code behind it was. After about two years of that nagging feeling, I made the jump and joined Box8 as a designer in 2019. And almost immediately I was thrown into building a design system, which was a hard way to start, but it meant I learned structure early instead of picking it up later. The dev background never really left me, though — I still think in systems, and I can sit in a room with engineers and actually follow the constraints they're describing instead of just nodding along.",
    },
    {
      match: /ai.*(take over|replace|taking over)|ai and design/i,
      answer:
        "I get asked this a lot, and my honest take is that AI doesn't take over design — but it has quietly taken over a lot of the busywork that used to fill a designer's week, like the fifth version of a button or the fortieth layout variation. What it can't take over is judgment: deciding which problem is even worth solving, what trade-off to make when two good options conflict, what \"done\" actually looks like for a specific, messy, real user. That part still has to come from a person who's accountable for the outcome. I think of it less as AI replacing design, and more as designing with AI sitting next to me, not doing the thinking for me.",
    },
    {
      match: /use ai|day.to.day|daily.*ai|ai.*workflow|everyday work/i,
      answer:
        "Day to day it's less dramatic than people expect. I mostly use it to compress the slow parts — pulling patterns out of a pile of research notes, or getting a rough prototype up fast enough to react to instead of just imagining it in my head. What I still do myself is decide which of those directions is actually right, and why. That judgment call is where the real work still lives.",
    },
    {
      match: /approach to design|design philosophy/i,
      answer:
        "If I had to put it simply: I try not to design the interface first. My instinct is to go find out what's actually broken underneath — on the roadside assistance project, that meant reading through thousands of call records before sketching a single screen. Once I understand the real shape of the problem, the interface tends to follow naturally, almost like the last step rather than the first one.",
    },
    {
      match: /mentor/i,
      answer:
        "At Growth School I mentor early-career designers, and honestly, most of what I pass on is stuff I had to learn the hard way myself — how to defend a design decision with data instead of just taste, how to know when to push back on a stakeholder and when to let it go. It's less about teaching tools and more about teaching judgment.",
    },

    // -- cross-project questions (work index page) --
    {
      match: /proudest/i,
      answer:
        "That's a tough one to answer in one line, but if I had to pick, it's probably the roadside assistance project — not because the metrics were the biggest, but because it's the one where the stakes were most human. Someone calling in is usually having a genuinely bad day, and knowing the thing I built actually made that moment less scary means more to me than a usage number.",
    },
    {
      match: /in common/i,
      answer:
        "If there's a thread through all of them, it's that the brief I was handed was slightly wrong each time, and the real problem had to be discovered, not just taken at face value. Roadside assistance looked like an app-quality problem, but it was really a trust problem. The new car journey looked like a funnel problem, but it was really about intent. Onboarding looked like a compliance-versus-conversion trade-off, but it was really a sequencing problem. Most of my job is finding that gap before I design anything.",
    },

    // -- RSA (named explicitly, or generic phrase scoped to that page) --
    {
      match: /rsa|roadside/i,
      answer:
        "This one started at Acko, where roadside assistance already existed but almost nobody used it. The brief I was handed assumed the app itself was the problem — too clunky, needed fixing. But when I actually went through thousands of call records, the real story was different: most people didn't even know the service existed, and the ones who did didn't trust that help would actually show up. So the job wasn't to build a better form, it was to make someone stranded on the road, in the dark, actually feel like help was on the way. That shift changed everything downstream, right down to cutting the intake questions from 14 to 6, because nobody panicking on a highway is going to sit through 14 questions. It launched handling over 2,000 cases digitally, with resolution time cut in half. [Read the full story](/Works/rsa.html)",
    },
    {
      match: /hardest part|proud.*here|story behind|what was.*asking|broken before/i,
      page: /rsa\.html/i,
      answer:
        "Honestly, the hardest part wasn't the screens, it was realizing the problem itself had been misdiagnosed. The original brief said \"make the app better,\" but the data told a different story — people weren't struggling with the app, they simply didn't trust it enough to open it in an emergency. Once I reframed it that way, the real fight became cutting the intake form from 14 questions down to 6. Operations wanted all 14 for dispatch accuracy, but I kept asking: would someone stranded and scared actually answer 14 questions? We mapped which ones truly mattered, shipped with 6, and ops still got what they needed. It's a small decision on paper, but it's the kind of thing that changes whether a real person gets help faster.",
    },

    // -- new car insurance --
    {
      match: /new car|funnel/i,
      answer:
        "Acko's new car insurance journey was only converting 21% of visitors to a quote, and the obvious read was \"too many steps, simplify it.\" But when I dug into the data, I found two very different people being shown the exact same journey — someone who'd just started browsing cars, and someone picking theirs up from the dealer tomorrow. No wonder it wasn't working for either of them. So instead of trimming steps, we split the journey by intent. That structural change, not interface polish, is what actually moved the number — E2Q went from 21% to 65%, a 3x lift. [Read the full story](/Works/new-car.html)",
    },
    {
      match: /hardest part|broken before|business|what was broken/i,
      page: /new-car\.html/i,
      answer:
        "The hardest part was realizing this wasn't really a funnel problem, even though the data made it look like one. The brief said \"too many steps,\" but the real issue was that one journey was trying to serve two completely different people at once. Splitting it by purchase intent was the design call that unlocked most of the lift. That said, I'd be lying if I claimed it was all design — quote-to-sale stayed flat around 5% the whole time, because that depends on when someone's car physically arrives, not on how good the app is. Knowing which numbers design can actually move, and which ones it can't, is part of doing this work honestly.",
    },

    // -- slice onboarding --
    {
      match: /slice|onboarding|kyc/i,
      answer:
        "Slice's onboarding had two things pulling in opposite directions: RBI's KYC rules required full documentation, and our own data showed that exact documentation step was where more than half of users dropped off. It would have been easy to treat that as unsolvable. Instead, I worked with legal early, and we found that nothing required all the KYC to happen upfront, just before the card was issued. So we flipped the order — show people their approved credit limit first, so they had a reason to push through the paperwork, and automated as much of the paperwork as we could. Completion went from 45% to 82%, without bending on compliance. [Read the full story](/Works/onboarding.html)",
    },
    {
      match: /hardest part|balance rules|proud.*here/i,
      page: /onboarding\.html/i,
      answer:
        "The hardest part was that compliance and conversion looked like they were fighting each other. RBI's rules said we needed full KYC, and our drop-off data said that exact step was pushing people away. The breakthrough wasn't a clever screen, it was a conversation with legal that uncovered we had more room on sequencing than anyone assumed. Showing the approved credit limit before the hard paperwork gave people a reason to keep going, and that one reorder took completion from 45% to 82%.",
    },
  ];

  const FALLBACK =
    "That's a good one, and I'd rather give you a real answer than a guess. Let's connect directly — email me at archanakumaribarik@gmail.com or message me on LinkedIn, and I'll get back to you.";

  function logQuestion(question, answered) {
    // Placeholder for now — once the backend is live, this becomes a fetch()
    // to the logging endpoint so Archana gets the weekly "what people asked" digest.
    console.log("[ask-archana] logged:", { question, answered, ts: new Date().toISOString() });
  }

  function getDemoAnswer(question, path) {
    // page-scoped entries are checked first so a generic phrase ("hardest
    // part") resolves to the right project before falling through to
    // broader matches.
    const scoped = DEMO_QA.filter((e) => e.page);
    const unscoped = DEMO_QA.filter((e) => !e.page);
    for (const entry of scoped) {
      if (entry.page.test(path) && entry.match.test(question)) {
        return { text: entry.answer, answered: true };
      }
    }
    for (const entry of unscoped) {
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
    return getDemoAnswer(question, window.location.pathname);
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
      getSuggestionsForPage().forEach((q) => {
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
