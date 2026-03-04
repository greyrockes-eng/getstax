"use client";
import { useState, useEffect, useRef } from "react";

// ── TOOL DATABASE ──────────────────────────────────────────────
const TOOLS = [
  { id:1,  name:"Claude",         cat:"Writing & Reasoning",  tags:["writing","analysis","code","research","business","legal","email","strategy","reasoning","documents","thinking"],  desc:"Best for complex thinking, long docs & nuanced writing", url:"claude.ai",          logo:"🧠", color:"#FF6B35", tier:"essential" },
  { id:2,  name:"ChatGPT",        cat:"Writing & Reasoning",  tags:["writing","code","research","general","images","plugins","chatbot","gpt"],                                          desc:"Versatile AI with the largest plugin ecosystem",         url:"chat.openai.com",    logo:"💬", color:"#10A37F", tier:"essential" },
  { id:3,  name:"Perplexity",     cat:"Research",             tags:["research","search","news","citations","facts","web","realtime","information"],                                     desc:"AI search with real-time web access & citations",        url:"perplexity.ai",      logo:"🔍", color:"#20B2AA", tier:"core"      },
  { id:4,  name:"Midjourney",     cat:"Image Generation",     tags:["images","art","design","marketing","product","creative","visual","brand","graphics","logo"],                      desc:"Highest quality AI art & photorealistic images",         url:"midjourney.com",     logo:"🎨", color:"#9B59B6", tier:"essential" },
  { id:5,  name:"DALL-E 3",       cat:"Image Generation",     tags:["images","design","marketing","quick","visual","graphics","illustrations"],                                         desc:"Fast image generation built into ChatGPT",               url:"openai.com",         logo:"🖼️", color:"#412991", tier:"core"      },
  { id:6,  name:"Runway",         cat:"Video",                tags:["video","editing","film","social","animation","reels","tiktok","youtube","content"],                               desc:"Professional AI video editing & generation",             url:"runwayml.com",       logo:"🎬", color:"#E74C3C", tier:"core"      },
  { id:7,  name:"ElevenLabs",     cat:"Voice & Audio",        tags:["voice","audio","podcast","narration","cloning","speech","tts","sound"],                                           desc:"Hyper-realistic AI voice generation & cloning",          url:"elevenlabs.io",      logo:"🎙️", color:"#F39C12", tier:"core"      },
  { id:8,  name:"n8n",            cat:"Automation",           tags:["automation","workflows","integration","self-hosted","no-code","backend","advanced","developer"],                  desc:"Open-source workflow automation you can self-host",       url:"n8n.io",             logo:"⚙️", color:"#FF6600", tier:"essential" },
  { id:9,  name:"Zapier",         cat:"Automation",           tags:["automation","integration","apps","no-code","connect","workflows","easy","beginners"],                             desc:"Connect 6,000+ apps without writing code",               url:"zapier.com",         logo:"⚡", color:"#FF4A00", tier:"essential" },
  { id:10, name:"Make",           cat:"Automation",           tags:["automation","visual","workflows","complex","integration","advanced","triggers"],                                  desc:"Visual workflow builder for complex automations",         url:"make.com",           logo:"🔧", color:"#6C3483", tier:"core"      },
  { id:11, name:"Cursor",         cat:"Coding",               tags:["code","development","ide","programming","refactor","ai-native","build","app","software"],                         desc:"AI-native code editor that rewrites entire codebases",    url:"cursor.sh",          logo:"💻", color:"#2ECC71", tier:"essential" },
  { id:12, name:"GitHub Copilot", cat:"Coding",               tags:["code","programming","ide","autocomplete","developer","github","software"],                                        desc:"AI pair programmer inside your existing IDE",            url:"github.com/copilot", logo:"🐙", color:"#6e40c9", tier:"core"      },
  { id:13, name:"Vercel v0",      cat:"UI Generation",        tags:["code","ui","frontend","react","design","no-code","components","website","landing page"],                          desc:"Generate full UI components from text prompts",           url:"v0.dev",             logo:"▲", color:"#fff",    tier:"core"      },
  { id:14, name:"Notion AI",      cat:"Productivity",         tags:["notes","documents","project","team","wiki","organize","planning","business","docs"],                              desc:"AI built into your workspace for docs & planning",        url:"notion.so",          logo:"📋", color:"#fff",    tier:"essential" },
  { id:15, name:"Otter.ai",       cat:"Meetings",             tags:["meetings","transcription","notes","zoom","calls","record","summary","team"],                                      desc:"Real-time meeting transcription & smart summaries",       url:"otter.ai",           logo:"🦦", color:"#1A73E8", tier:"core"      },
  { id:16, name:"HeyGen",         cat:"Video Avatars",        tags:["video","avatar","presentations","training","marketing","face","spokesperson","youtube"],                          desc:"Create AI avatar spokesperson videos instantly",          url:"heygen.com",         logo:"🎭", color:"#FF3366", tier:"specialized"},
  { id:17, name:"Jasper",         cat:"Marketing Copy",       tags:["marketing","ads","email","social","seo","brand","copy","campaigns","ecommerce"],                                  desc:"Purpose-built for marketing teams & brand voice",         url:"jasper.ai",          logo:"✍️", color:"#FF6584", tier:"specialized"},
  { id:18, name:"Copy.ai",        cat:"Sales Copy",           tags:["marketing","ads","email","sales","cold outreach","leads","copy","b2b"],                                           desc:"Sales and marketing copy at scale",                       url:"copy.ai",            logo:"📝", color:"#7C3AED", tier:"specialized"},
  { id:19, name:"HubSpot AI",     cat:"CRM & Sales",          tags:["crm","sales","email","marketing","leads","pipeline","business","clients","real estate"],                          desc:"AI-powered CRM for sales and marketing teams",            url:"hubspot.com",        logo:"🏷️", color:"#FF7A59", tier:"specialized"},
  { id:20, name:"Descript",       cat:"Podcast & Video Edit", tags:["podcast","video","editing","transcription","audio","youtube","repurpose","content"],                              desc:"Edit video & audio like a text document",                 url:"descript.com",       logo:"✂️", color:"#5B4FFF", tier:"core"      },
  { id:21, name:"Synthesia",      cat:"Training Videos",      tags:["video","training","avatar","corporate","elearning","presentations","hr","onboarding"],                            desc:"Create training & explainer videos with AI avatars",      url:"synthesia.io",       logo:"🎓", color:"#00D4AA", tier:"specialized"},
  { id:22, name:"Framer AI",      cat:"Website Builder",      tags:["website","landing page","design","no-code","portfolio","startup","publish","online presence"],                    desc:"Build stunning websites from a text prompt",              url:"framer.com",         logo:"🖼️", color:"#0099FF", tier:"core"      },
  { id:23, name:"Replit",         cat:"Coding",               tags:["code","hosting","deploy","beginners","collaboration","app","build","prototype"],                                  desc:"Code, run and deploy apps from your browser",            url:"replit.com",         logo:"🔁", color:"#F26207", tier:"core"      },
  { id:24, name:"Suno",           cat:"Music Generation",     tags:["music","audio","song","creative","background","soundtrack","content","podcast"],                                  desc:"Create original songs from a text description",           url:"suno.ai",            logo:"🎵", color:"#FF1493", tier:"specialized"},
  { id:25, name:"Gamma",          cat:"Presentations",        tags:["presentations","slides","pitch","deck","business","design","ai","investor","sales"],                              desc:"AI-generated beautiful slide decks in seconds",           url:"gamma.app",          logo:"📊", color:"#6366F1", tier:"core"      },
  { id:26, name:"Loom AI",        cat:"Video Messaging",      tags:["video","async","communication","team","demos","sales","outreach","screen","record"],                              desc:"Record & share AI-enhanced video messages",               url:"loom.com",           logo:"🎥", color:"#625DF5", tier:"core"      },
  { id:27, name:"Beehiiv AI",     cat:"Newsletter",           tags:["newsletter","email","audience","creator","writing","subscribers","content","grow"],                               desc:"AI-powered newsletter platform for creators",             url:"beehiiv.com",        logo:"🐝", color:"#FFD23F", tier:"specialized"},
  { id:28, name:"Buffer AI",      cat:"Social Media",         tags:["social media","posting","schedule","instagram","twitter","marketing","content","creator"],                        desc:"AI-assisted social media scheduling & analytics",         url:"buffer.com",         logo:"📱", color:"#168EEA", tier:"core"      },
  { id:29, name:"Fireflies.ai",   cat:"Meeting Assistant",    tags:["meetings","transcription","notes","crm","sales","calls","follow-up","team"],                                      desc:"AI meeting assistant that records, transcribes & acts",   url:"fireflies.ai",       logo:"🦋", color:"#7C4DFF", tier:"core"      },
  { id:30, name:"Typeface",       cat:"Brand Content",        tags:["brand","marketing","content","enterprise","images","copy","campaigns","ecommerce"],                               desc:"Enterprise AI for on-brand content at scale",             url:"typeface.ai",        logo:"🎯", color:"#E91E8C", tier:"specialized"},
];

const TIER_META = {
  essential:   { label:"Must Have",          bg:"rgba(255,107,53,0.15)",  border:"rgba(255,107,53,0.5)",  text:"#FF6B35" },
  core:        { label:"Core Pick",          bg:"rgba(6,255,165,0.1)",    border:"rgba(6,255,165,0.4)",   text:"#06FFA5" },
  specialized: { label:"Power Move",         bg:"rgba(99,102,241,0.12)",  border:"rgba(99,102,241,0.4)",  text:"#818CF8" },
};

const ACCENT_COLORS = ["#FF6B35","#FFD23F","#06FFA5","#00B4D8","#FF006E","#8338EC","#FB5607","#3A86FF"];

const SYSTEM_PROMPT = `You are Stax — the world's sharpest AI tool advisor. Your entire job is recommending the perfect AI stack for anyone who tells you their goal.

TOOL DATABASE (use ONLY these tool IDs):
${JSON.stringify(TOOLS.map(t=>({id:t.id,name:t.name,tags:t.tags,tier:t.tier})))}

ALWAYS respond with ONLY valid JSON — no extra text, no markdown backticks:
{
  "title": "Catchy 2-4 word stack name (e.g. 'The Creator Engine' or 'Solopreneur OS')",
  "summary": "One punchy sentence — what this stack unlocks for them",
  "tool_ids": [4-6 tool IDs ordered most-essential first],
  "message": "2-3 sentences. Be direct, confident, a little hyped. Explain WHY this stack works for their exact goal. No fluff."
}

Rules: Always return valid JSON only. Pick 4-6 tools. Be opinionated — recommend the BEST, not just any. If vague, make your best call and go.`;

// ── MAIN APP ───────────────────────────────────────────────────
export default function Stax() {
  const [phase, setPhase] = useState("landing");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stack, setStack] = useState([]);
  const [stackTitle, setStackTitle] = useState("");
  const [stackSummary, setStackSummary] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [waitlistCount] = useState(Math.floor(Math.random()*800)+1200);
  const [mounted, setMounted] = useState(false);
  const [scrollX, setScrollX] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef(null);
  const cardRef = useRef(null);
  const animFrame = useRef<number>(0);
  useEffect(() => { (messagesEndRef.current as HTMLDivElement | null)?.scrollIntoView({behavior:"smooth"}); }, [messages]);
  useEffect(() => { setMounted(true); }, []);
  // Animate scrolling tool pills
  useEffect(() => {
    let x = 0;
    const tick = () => { x -= 0.4; setScrollX(x); animFrame.current = requestAnimationFrame(tick); };
    animFrame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame.current);
  }, []);

  const sendMessage = async (userText) => {
    if (!userText.trim() || loading) return;
    const newMessages = [...messages, {role:"user", content:userText}];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system: SYSTEM_PROMPT,
          messages: newMessages,
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      let parsed;
      try { parsed = JSON.parse(raw.replace(/```json|```/g,"").trim()); }
      catch { parsed = {title:"Your Stack",summary:"Built for your goals.",tool_ids:[1,7,9,14],message:"Here's a solid starting stack tailored for you!"}; }
      const recs = (parsed.tool_ids||[]).map(id=>TOOLS.find(t=>t.id===id)).filter(Boolean);
      setStack(recs);
      setStackTitle(parsed.title||"Your Stack");
      setStackSummary(parsed.summary||"");
      setAiMessage(parsed.message||"Here's your stack!");
      setMessages(prev=>[...prev,{role:"assistant",content:parsed.message||"Here's your stack!"}]);
      setTimeout(()=>setPhase("results"),300);
    } catch(e) {
      setMessages(prev=>[...prev,{role:"assistant",content:"Hit a snag — try describing your goal again!"}]);
    }
    setLoading(false);
  };

  const handleKey = (e) => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(input);} };

  const copyStack = () => {
    const lines = stack.map(t=>`  ${t.logo} ${t.name} — ${t.desc}`).join("\n");
    const text = `🔥 My AI Stack: "${stackTitle}"\n${stackSummary}\n\n${lines}\n\n→ Build yours free at stax.ai`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(()=>setCopied(false),2500);
  };

  const handleEmail = (e) => {
    e.preventDefault();
    if(email) { setEmailSent(true); }
  };

  const reset = () => { setPhase("landing"); setMessages([]); setStack([]); setStackTitle(""); setStackSummary(""); setAiMessage(""); setInput(""); };

  const SUGGESTIONS = [
    "I want to grow my business on social media 📣",
    "I'm a YouTuber and want to make videos faster 🎬",
    "I want to build an app but I can't code 💻",
    "I run a small business and want to save time ⏱️",
    "I want to start a podcast 🎙️",
    "I do real estate & property management 🏠",
    "I want to automate my email & follow-ups ⚡",
    "I need to do research & reports faster 🔬",
  ];

  const pillTools = [...TOOLS, ...TOOLS, ...TOOLS];

  return (
    <div style={{minHeight:"100vh",background:"#080808",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#fff",overflowX:"hidden",position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-7px)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .fadein{animation:fadeUp .55s cubic-bezier(.4,0,.2,1) both}
        .fadein-1{animation:fadeUp .55s .1s cubic-bezier(.4,0,.2,1) both}
        .fadein-2{animation:fadeUp .55s .2s cubic-bezier(.4,0,.2,1) both}
        .fadein-3{animation:fadeUp .55s .3s cubic-bezier(.4,0,.2,1) both}
        .fadein-4{animation:fadeUp .55s .4s cubic-bezier(.4,0,.2,1) both}
        .fadein-5{animation:fadeUp .55s .5s cubic-bezier(.4,0,.2,1) both}
        .tool-card:hover{background:rgba(255,255,255,0.07)!important;transform:translateY(-4px);border-color:rgba(255,255,255,0.2)!important}
        .sugg-pill:hover{background:rgba(255,107,53,.15)!important;border-color:rgba(255,107,53,.5)!important;color:#FF6B35!important}
        .cta-btn:hover{transform:scale(1.04);box-shadow:0 0 80px rgba(255,107,53,.5)!important}
        .ghost-btn:hover{background:rgba(255,255,255,.1)!important;color:#fff!important}
        .send-btn:hover:not(:disabled){transform:scale(1.08)}
        textarea:focus{border-color:rgba(255,107,53,.6)!important;outline:none}
        input:focus{border-color:rgba(255,107,53,.6)!important;outline:none}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:2px}
        .shimmer-text{background:linear-gradient(90deg,#FF6B35,#FFD23F,#06FFA5,#FF6B35);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite}
      `}</style>

      {/* Ambient blobs */}
      <div style={{position:"fixed",left:"10%",top:"15%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,.12) 0%,transparent 70%)",filter:"blur(80px)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",right:"5%",bottom:"20%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(131,56,236,.1) 0%,transparent 70%)",filter:"blur(80px)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",left:"50%",top:"60%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(6,255,165,.07) 0%,transparent 70%)",filter:"blur(60px)",pointerEvents:"none",zIndex:0}}/>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,padding:"0 32px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,.06)",background:"rgba(8,8,8,.85)",backdropFilter:"blur(24px)"}}>
        <button onClick={reset} style={{background:"none",border:"none",cursor:"pointer",padding:0}}>
          <span style={{fontSize:22,fontWeight:900,letterSpacing:"-.05em",background:"linear-gradient(135deg,#FF6B35,#FFD23F,#06FFA5)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>STAX</span>
        </button>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:".1em",textTransform:"uppercase"}}>Beta</span>
          {phase!=="landing"&&(
            <button onClick={()=>setPhase("chat")} style={{background:"linear-gradient(135deg,#FF6B35,#FFD23F)",border:"none",borderRadius:10,padding:"8px 20px",fontSize:13,fontWeight:800,color:"#080808",cursor:"pointer",fontFamily:"inherit"}}>
              Build My Stack
            </button>
          )}
        </div>
      </nav>

      {/* ══════════════ LANDING ══════════════ */}
      {phase==="landing"&&(
        <div style={{position:"relative",zIndex:10,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 24px 0",textAlign:"center"}}>

          {/* Live counter badge */}
          <div className="fadein" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:100,padding:"8px 18px",marginBottom:32,fontSize:13,fontWeight:600,color:"rgba(255,255,255,.6)"}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#06FFA5",display:"inline-block",animation:"pulse 2s ease-in-out infinite"}}/>
            {waitlistCount.toLocaleString()} people building their stack today
          </div>

          <h1 className="fadein-1" style={{fontSize:"clamp(3.2rem,9vw,7rem)",fontWeight:900,lineHeight:.95,letterSpacing:"-.05em",marginBottom:28}}>
            <span style={{color:"#fff"}}>Stop guessing.</span><br/>
            <span className="shimmer-text">Find your AI stack.</span>
          </h1>

          <p className="fadein-2" style={{fontSize:18,color:"rgba(255,255,255,.45)",maxWidth:460,lineHeight:1.7,marginBottom:48}}>
            Over 2,000 AI tools exist. Most people waste weeks figuring out which ones they actually need. Stax finds your perfect toolkit in 10 seconds — just tell us what you're trying to do.
          </p>

          <div className="fadein-3" style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:20}}>
            <button className="cta-btn" onClick={()=>setPhase("chat")} style={{background:"linear-gradient(135deg,#FF6B35,#FFD23F)",color:"#080808",border:"none",borderRadius:16,padding:"18px 48px",fontSize:18,fontWeight:900,cursor:"pointer",fontFamily:"inherit",letterSpacing:"-.02em",boxShadow:"0 0 60px rgba(255,107,53,.35)",transition:"all .2s"}}>
              Build My Stack — Free →
            </button>
          </div>
          <p className="fadein-3" style={{fontSize:12,color:"rgba(255,255,255,.2)",marginBottom:72}}>No signup required · Takes 10 seconds · Instant results</p>

          {/* Social proof */}
          <div className="fadein-4" style={{display:"flex",gap:8,marginBottom:72,flexWrap:"wrap",justifyContent:"center"}}>
            {["🚀 Replaces hours of research","🎯 Curated by AI, not ads","📋 Copy & share your stack","⚡ New tools added weekly"].map((t,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:100,padding:"8px 16px",fontSize:12,fontWeight:600,color:"rgba(255,255,255,.5)"}}>
                {t}
              </div>
            ))}
          </div>

          {/* Scrolling tool strip */}
          <div className="fadein-5" style={{width:"100vw",overflow:"hidden",maskImage:"linear-gradient(to right,transparent,black 8%,black 92%,transparent)",marginBottom:0,paddingBottom:48}}>
            <div style={{display:"flex",gap:12,width:"max-content",transform:`translateX(${scrollX % (TOOLS.length * 160)}px)`,willChange:"transform"}}>
              {pillTools.map((t,i)=>(
                <div key={i} style={{flexShrink:0,background:`${ACCENT_COLORS[i%ACCENT_COLORS.length]}15`,border:`1px solid ${ACCENT_COLORS[i%ACCENT_COLORS.length]}35`,borderRadius:100,padding:"9px 18px",fontSize:13,fontWeight:700,color:ACCENT_COLORS[i%ACCENT_COLORS.length],whiteSpace:"nowrap"}}>
                  {t.logo} {t.name}
                </div>
              ))}
            </div>
          </div>

          {/* Waitlist section */}
          <div style={{width:"100%",maxWidth:520,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:24,padding:"32px",marginTop:0,marginBottom:80}}>
            <div style={{fontSize:13,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",color:"#FFD23F",marginBottom:12}}>🔔 Get Early Access</div>
            <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>Stax Pro is coming soon</div>
            <p style={{fontSize:14,color:"rgba(255,255,255,.4)",marginBottom:24,lineHeight:1.6}}>Save your stacks, get weekly AI tool updates, and access the full tool database. Join the waitlist.</p>
            {!emailSent ? (
              <form onSubmit={handleEmail} style={{display:"flex",gap:10}}>
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="your@email.com" required style={{flex:1,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",borderRadius:12,padding:"12px 16px",color:"#fff",fontSize:14,fontFamily:"inherit",transition:"border-color .2s"}}/>
                <button type="submit" style={{background:"linear-gradient(135deg,#FF6B35,#FFD23F)",color:"#080808",border:"none",borderRadius:12,padding:"12px 24px",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                  Join Waitlist
                </button>
              </form>
            ) : (
              <div style={{textAlign:"center",padding:"16px",background:"rgba(6,255,165,.1)",border:"1px solid rgba(6,255,165,.3)",borderRadius:12,color:"#06FFA5",fontWeight:700,fontSize:15}}>
                ✓ You're on the list! We'll reach out soon.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ CHAT ══════════════ */}
      {phase==="chat"&&(
        <div style={{position:"relative",zIndex:10,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"100px 24px 60px"}}>
          <div style={{width:"100%",maxWidth:640}}>
            <div className="fadein" style={{textAlign:"center",marginBottom:40}}>
              <h2 style={{fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:900,letterSpacing:"-.04em",marginBottom:10}}>
                What are you trying<br/>to <span className="shimmer-text">accomplish?</span>
              </h2>
              <p style={{color:"rgba(255,255,255,.4)",fontSize:16}}>Just describe it — plain English, no jargon needed.</p>
            </div>

            {/* Suggestions */}
            {messages.length===0&&(
              <div className="fadein-1" style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:28,justifyContent:"center"}}>
                {SUGGESTIONS.map((s,i)=>(
                  <button key={i} className="sugg-pill" onClick={()=>sendMessage(s)} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:100,padding:"10px 18px",fontSize:13,fontWeight:600,color:"rgba(255,255,255,.6)",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            {messages.length>0&&(
              <div style={{maxHeight:320,overflowY:"auto",display:"flex",flexDirection:"column",gap:14,marginBottom:20,padding:"4px"}}>
                {messages.map((m,i)=>(
                  <div key={i} style={{maxWidth:"85%",padding:"13px 18px",borderRadius:m.role==="user"?"20px 20px 6px 20px":"20px 20px 20px 6px",fontSize:15,lineHeight:1.6,fontWeight:500,alignSelf:m.role==="user"?"flex-end":"flex-start",background:m.role==="user"?"linear-gradient(135deg,#FF6B35,#FFD23F)":"rgba(255,255,255,.07)",color:m.role==="user"?"#080808":"#fff",border:m.role==="user"?"none":"1px solid rgba(255,255,255,.08)"}}>
                    {m.content}
                  </div>
                ))}
                {loading&&(
                  <div style={{display:"flex",gap:5,padding:"14px 18px",background:"rgba(255,255,255,.07)",borderRadius:"20px 20px 20px 6px",alignSelf:"flex-start",border:"1px solid rgba(255,255,255,.08)"}}>
                    {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"rgba(255,255,255,.5)",animation:`bounce 1.2s ease-in-out ${i*.2}s infinite`}}/>)}
                  </div>
                )}
                <div ref={messagesEndRef}/>
              </div>
            )}

            {/* Input */}
            <div className="fadein-2" style={{display:"flex",gap:10,alignItems:"flex-end"}}>
              <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} placeholder="e.g. I run a small business and want to automate my marketing..." rows={2} autoFocus style={{flex:1,background:"rgba(255,255,255,.06)",border:"1.5px solid rgba(255,255,255,.12)",borderRadius:16,padding:"14px 18px",color:"#fff",fontSize:15,fontFamily:"inherit",resize:"none",maxHeight:120,lineHeight:1.5,transition:"border-color .2s"}}/>
              <button onClick={()=>sendMessage(input)} disabled={!input.trim()||loading} className="send-btn" style={{width:52,height:52,borderRadius:14,border:"none",background:input.trim()&&!loading?"linear-gradient(135deg,#FF6B35,#FFD23F)":"rgba(255,255,255,.08)",color:input.trim()&&!loading?"#080808":"rgba(255,255,255,.3)",fontSize:22,cursor:input.trim()&&!loading?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",flexShrink:0,fontFamily:"inherit"}}>
                →
              </button>
            </div>
            <p style={{textAlign:"center",fontSize:12,color:"rgba(255,255,255,.2)",marginTop:12}}>Press Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      )}

      {/* ══════════════ RESULTS ══════════════ */}
      {phase==="results"&&(
        <div style={{position:"relative",zIndex:10,padding:"100px 24px 80px",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{width:"100%",maxWidth:820}}>

            {/* Header */}
            <div className="fadein" style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",color:"#FFD23F",marginBottom:12}}>✦ YOUR STAX IS READY</div>
              <h2 style={{fontSize:"clamp(2.2rem,6vw,4rem)",fontWeight:900,letterSpacing:"-.05em",marginBottom:12,background:"linear-gradient(135deg,#FF6B35,#FFD23F,#06FFA5)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                {stackTitle}
              </h2>
              <p style={{color:"rgba(255,255,255,.5)",fontSize:17,maxWidth:480,margin:"0 auto",lineHeight:1.6}}>{stackSummary}</p>
            </div>

            {/* AI explanation bubble */}
            <div className="fadein-1" style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:18,padding:"18px 24px",marginBottom:36,display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{fontSize:24,flexShrink:0}}>💬</div>
              <p style={{fontSize:15,color:"rgba(255,255,255,.7)",lineHeight:1.7}}>{aiMessage}</p>
            </div>

            {/* Tool cards */}
            <div className="fadein-2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:16,marginBottom:40}}>
              {stack.map((tool,i)=>{
                const tier = TIER_META[tool.tier];
                return (
                  <a key={tool.id} href={`https://${tool.url}`} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                    <div className="tool-card" style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:20,padding:22,position:"relative",overflow:"hidden",transition:"all .2s ease",cursor:"pointer"}}>
                      {/* Top accent bar */}
                      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${tool.color},${tool.color}00)`}}/>
                      {/* Rank badge */}
                      <div style={{position:"absolute",top:16,right:16,width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"rgba(255,255,255,.3)"}}>
                        {i+1}
                      </div>
                      <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:12}}>
                        <div style={{fontSize:30,flexShrink:0}}>{tool.logo}</div>
                        <div>
                          <div style={{fontSize:17,fontWeight:800,letterSpacing:"-.02em",marginBottom:2}}>{tool.name}</div>
                          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.3)",letterSpacing:".08em",textTransform:"uppercase"}}>{tool.cat}</div>
                        </div>
                      </div>
                      <p style={{fontSize:13,color:"rgba(255,255,255,.55)",lineHeight:1.6,marginBottom:12}}>{tool.desc}</p>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <span style={{fontSize:10,fontWeight:800,letterSpacing:".08em",padding:"4px 12px",borderRadius:100,background:tier.bg,color:tier.text,border:`1px solid ${tier.border}`}}>
                          {tier.label}
                        </span>
                        <span style={{fontSize:12,color:"rgba(255,255,255,.25)",fontWeight:600}}>{tool.url} ↗</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Shareable card */}
            <div className="fadein-3" ref={cardRef} style={{background:"linear-gradient(135deg,#111 0%,#0d0d0d 100%)",border:"1px solid rgba(255,255,255,.1)",borderRadius:24,padding:32,marginBottom:32,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,53,.2),transparent 70%)"}}/>
              <div style={{position:"absolute",bottom:-40,left:-40,width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle,rgba(131,56,236,.15),transparent 70%)"}}/>
              <div style={{position:"relative",zIndex:2}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",color:"#FFD23F",marginBottom:6}}>MY AI STACK</div>
                    <div style={{fontSize:26,fontWeight:900,letterSpacing:"-.03em",background:"linear-gradient(135deg,#FF6B35,#FFD23F)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{stackTitle}</div>
                  </div>
                  <div style={{fontSize:20,fontWeight:900,letterSpacing:"-.04em",background:"linear-gradient(135deg,#FF6B35,#FFD23F,#06FFA5)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>STAX</div>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:20}}>
                  {stack.map(t=>(
                    <div key={t.id} style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",borderRadius:100,padding:"7px 14px"}}>
                      <span style={{fontSize:16}}>{t.logo}</span>
                      <span style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,.8)"}}>{t.name}</span>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,.25)",fontWeight:600}}>stax.ai · Build yours free</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="fadein-4" style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",marginBottom:48}}>
              <button onClick={copyStack} style={{background:copied?"rgba(6,255,165,.15)":"linear-gradient(135deg,#FF6B35,#FFD23F)",color:copied?"#06FFA5":"#080808",border:copied?"1px solid rgba(6,255,165,.4)":"none",borderRadius:14,padding:"14px 32px",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit",letterSpacing:"-.01em",transition:"all .2s",minWidth:220}}>
                {copied?"✓ Copied to clipboard!":"📋 Copy & Share My Stax"}
              </button>
              <button className="ghost-btn" onClick={()=>setPhase("chat")} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.6)",borderRadius:14,padding:"14px 24px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                Refine My Stack ↺
              </button>
              <button className="ghost-btn" onClick={reset} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.6)",borderRadius:14,padding:"14px 24px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                Start Over
              </button>
            </div>

            {/* Bottom waitlist CTA */}
            <div className="fadein-5" style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.08)",borderRadius:24,padding:32,textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:12}}>🚀</div>
              <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>Want your stack saved + updated?</div>
              <p style={{color:"rgba(255,255,255,.4)",fontSize:14,marginBottom:24,lineHeight:1.6}}>Join Stax Pro — save your stacks, get weekly new tool alerts, and compare costs across your entire toolkit.</p>
              {!emailSent?(
                <form onSubmit={handleEmail} style={{display:"flex",gap:10,maxWidth:420,margin:"0 auto"}}>
                  <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="your@email.com" required style={{flex:1,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.12)",borderRadius:12,padding:"12px 16px",color:"#fff",fontSize:14,fontFamily:"inherit",transition:"border-color .2s"}}/>
                  <button type="submit" style={{background:"linear-gradient(135deg,#FF6B35,#FFD23F)",color:"#080808",border:"none",borderRadius:12,padding:"12px 24px",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                    Join Free
                  </button>
                </form>
              ):(
                <div style={{padding:"14px",background:"rgba(6,255,165,.1)",border:"1px solid rgba(6,255,165,.3)",borderRadius:12,color:"#06FFA5",fontWeight:700,fontSize:15,maxWidth:420,margin:"0 auto"}}>
                  ✓ You're on the list! We'll be in touch.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
