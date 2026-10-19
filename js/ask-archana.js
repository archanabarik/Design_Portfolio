/* Ask Archana — chat widget
   Preview mode: answers come from a small local demo script below.
   Production mode: set AA_CONFIG.apiUrl to the live backend endpoint,
   and this file will call it instead (see sendMessage()).
*/
(function () {
  const AA_CONFIG = {
    apiUrl: null, // e.g. "https://ask-archana.yourname.workers.dev/chat" — once set, demo answers are skipped
    // Set to a real avatar image path once you've sent one — e.g.
    // "/images/ai-avatar.png" — and it'll replace the animated gradient
    // orb automatically, in both the launcher and the chat header.
    avatarUrl: "",
  };

  // Suggestion chips change based on which page the widget is loaded on,
  // so a visitor reading a specific case study sees questions about that
  // project instead of generic ones. Matched against the URL path.
  const SUGGESTION_SETS = [
    {
      match: /rsa\.html/i,
      questions: [
        "What problem were you actually trying to solve?",
        "What was the thinking behind your approach?",
        "What was the toughest call you had to make?",
        "How many rounds did this go through?",
      ],
    },
    {
      match: /new-car\.html/i,
      questions: [
        "What problem were you actually trying to solve?",
        "What was the thinking behind your approach?",
        "What was the toughest call you had to make?",
        "How many rounds did this go through?",
      ],
    },
    {
      match: /onboarding\.html/i,
      questions: [
        "What problem were you actually trying to solve?",
        "What was the thinking behind your approach?",
        "What was the toughest call you had to make?",
        "How many rounds did this go through?",
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
      match: /problem.*(solv|were.*(trying|actually))|problem statement/i,
      page: /rsa\.html/i,
      answer:
        "On paper, the brief said the app needed improving. But when I actually went through thousands of real support calls, a different problem showed up: most people didn't even know the service existed, and the ones who did didn't trust that help would actually come. So the problem I ended up solving wasn't \"fix the app\" — it was \"make someone stranded on a dark road believe help is on its way, before they've even finished asking for it.\"",
    },
    {
      match: /thinking behind|psychology|approach.*(behind|you used)/i,
      page: /rsa\.html/i,
      answer:
        "The thinking came from one idea: a person calling for roadside help usually isn't thinking clearly, they're anxious, sometimes scared. So everything was built around three things — confirm that help is coming almost immediately, because uncertainty at that moment isn't just bad UX, it's a trust failure; show live tracking and real technician details so the anxiety has somewhere to go; and remove every decision that wasn't essential, because a stressed person shouldn't have to choose what kind of tow truck they need.",
    },
    {
      match: /toughest call|difficult call|pushback|disagree/i,
      page: /rsa\.html/i,
      answer:
        "The sharpest disagreement was over the intake form. Operations wanted 14 data points for accurate dispatch. I pushed back, because I didn't believe someone stranded at night, possibly scared, would patiently answer 14 questions. We went through the list together, found only 6 were genuinely decision-critical, and shipped with those. Ops still got the data they needed to dispatch properly — that was the fight worth having.",
    },
    {
      match: /iteration|rounds|evolve/i,
      page: /rsa\.html/i,
      answer:
        "It went through four real rounds. First was mapping the actual service — reading call records and reframing what the problem even was. Second was service flows and structure, where the question list got cut from 14 to 6. Third was high-fidelity screens and edge cases, including what to do when we legally couldn't help someone — like towing after an accident without a police report. Fourth is what actually shipped. It wasn't a straight line; the \"custody towing as default\" idea, for instance, only came up after we realized most users genuinely couldn't answer basic questions like what kind of tow truck their car needed.",
    },

    // -- new car insurance --
    {
      match: /new car|funnel/i,
      answer:
        "Acko's new car insurance journey was only converting 21% of visitors to a quote, and the obvious read was \"too many steps, simplify it.\" But when I dug into the data, I found two very different people being shown the exact same journey — someone who'd just started browsing cars, and someone picking theirs up from the dealer tomorrow. No wonder it wasn't working for either of them. So instead of trimming steps, we split the journey by intent. That structural change, not interface polish, is what actually moved the number — E2Q went from 21% to 65%, a 3x lift. [Read the full story](/Works/new-car.html)",
    },
    {
      match: /problem.*(solv|were.*(trying|actually))|problem statement/i,
      page: /new-car\.html/i,
      answer:
        "On the surface it looked like a funnel problem — only 21% of visitors turned into a quote, so the obvious fix was \"remove friction, cut steps.\" But when I actually looked at the data, I found two completely different people being shown the exact same journey: someone who'd just started browsing cars, weeks from any decision, and someone picking theirs up from the dealer tomorrow. The real problem wasn't friction, it was that one experience was trying to serve two very different moments at once.",
    },
    {
      match: /thinking behind|psychology|approach.*(behind|you used)/i,
      page: /new-car\.html/i,
      answer:
        "The core idea was that intent should decide the experience, not one generic flow for everyone. So early on, we asked a simple question: where are you in buying this car — booked, finalised but not booked, or still deciding? Each answer sent the person down a different path, built for what they actually needed at that moment instead of asking everyone to answer the same questions regardless of how ready they were.",
    },
    {
      match: /toughest call|difficult call|pushback|disagree/i,
      page: /new-car\.html/i,
      answer:
        "The toughest call was killing a landing page we'd specifically built to counter dealer misinformation — built with real settlement data and named garages, the kind of thing people usually get attached to. At a 1% rollout, the data showed almost nobody was scrolling past the top of it. It was tempting to keep tweaking it instead of admitting it wasn't working, but the signal was clear, so we cut it rather than polish something that wasn't earning its place.",
    },
    {
      match: /iteration|rounds|evolve/i,
      page: /new-car\.html/i,
      answer:
        "We ran it as three staged releases rather than one big launch. At 1% of traffic, it actually performed worse than the old baseline — that's where we caught the landing page problem and some confusing plan naming. At 50%, after fixing those, it finally beat baseline for the first time. At full rollout, it stabilised at 65%, three times where it started. The useful part of going slow wasn't what worked, it was catching what didn't, early enough to fix.",
    },

    // -- slice onboarding --
    {
      match: /slice|onboarding|kyc/i,
      answer:
        "Slice's onboarding had two things pulling in opposite directions: RBI's KYC rules required full documentation, and our own data showed that exact documentation step was where more than half of users dropped off. It would have been easy to treat that as unsolvable. Instead, I worked with legal early, and we found that nothing required all the KYC to happen upfront, just before the card was issued. So we flipped the order — show people their approved credit limit first, so they had a reason to push through the paperwork, and automated as much of the paperwork as we could. Completion went from 45% to 82%, without bending on compliance. [Read the full story](/Works/onboarding.html)",
    },
    {
      match: /problem.*(solv|were.*(trying|actually))|problem statement/i,
      page: /onboarding\.html/i,
      answer:
        "It looked like a trade-off between following RBI's KYC rules and keeping users from leaving — and over half of people were abandoning before they even got activated. But the real problem wasn't the rules themselves, it was that we were asking people to hand over sensitive documents before giving them any reason to trust us back, like proof they'd actually been approved. That's the gap I ended up solving for.",
    },
    {
      match: /thinking behind|psychology|approach.*(behind|you used)/i,
      page: /onboarding\.html/i,
      answer:
        "The psychology was simple, and it came straight from user interviews: people said being asked for documents before any sign of approval felt unfair, almost like being judged before being heard. So the idea was to show them a win early — their actual approved credit limit — before asking for the harder paperwork. Once someone has something real to lose, they're far more willing to push through a tedious step.",
    },
    {
      match: /toughest call|difficult call|pushback|disagree/i,
      page: /onboarding\.html/i,
      answer:
        "The toughest call was choosing to bring legal into the conversation early instead of treating compliance as something to work around later. It would've been easier to just redesign the screens and hope for the best. Instead, that early conversation is what revealed we had more flexibility on sequencing than anyone assumed — KYC just had to be complete before the card was issued, not before the user saw any value.",
    },
    {
      match: /iteration|rounds|evolve/i,
      page: /onboarding\.html/i,
      answer:
        "I explored four different directions before landing on one. Full KYC upfront was the safe, compliant option, but it kept the same drop-offs. A shortened form helped a little but left the real friction untouched. Parallel credit-check-and-KYC was faster on paper, but if either step failed, the user walked away with nothing — a worse failure mode than what we had. The one we shipped was approval-first with automated KYC steps: it removed the three highest-drop-off steps while staying fully compliant, which is why it's the one that actually moved the number.",
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

  // Builds the avatar markup used in both the launcher and the chat header.
  // Starts as an animated gradient orb (no real photo needed) and swaps to
  // the real image once AA_CONFIG.avatarUrl successfully loads — so this
  // works today and just gets better once a real avatar image is added.
  function avatarHTML(sizeClass) {
    const img = AA_CONFIG.avatarUrl
      ? `<img src="${AA_CONFIG.avatarUrl}" alt="" style="display:none"
             onload="this.style.display='block'; this.parentElement.classList.remove('aa-avatar-fallback');"
             onerror="this.remove();">`
      : "";
    return `<span class="aa-avatar aa-avatar-fallback ${sizeClass}">${img}</span>`;
  }

  function buildWidget() {
    const launcher = document.createElement("button");
    launcher.id = "aa-launcher";
    launcher.setAttribute("aria-label", "Chat with Archana's AI assistant");
    launcher.innerHTML = `
      ${avatarHTML("")}
      <span class="aa-close-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </span>
    `;

    const panel = document.createElement("div");
    panel.id = "aa-panel";
    panel.innerHTML = `
      <div id="aa-header">
        ${avatarHTML("")}
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
