import CardFanDeck from "./CardFanDeck";

const REASONS = [
  {
    title: "A prompt is the new editing skill",
    text: "AI video tools build exactly what you type — word for word. Missing a camera angle, lighting cue, or subject detail is what causes warped faces, floaty motion, and that obvious \"AI look.\" Always specify: shot type (close-up, wide, tracking), lighting (golden hour, studio, neon), subject action, and mood — in that order — and your output quality jumps immediately, even on the same free tool you're already using.",
  },
  {
    title: "Why our prompts actually work",
    text: "Every prompt here is run against the real video before it's posted, then trimmed of anything that didn't visibly change the output — so you're not copying dead weight. We also keep hashtags and captions out of the prompt itself, since stuffing a prompt with unrelated keywords is one of the most common reasons generations come back inconsistent between takes.",
  },
  {
    title: "Copy it, and you have a real video",
    text: "Paste the prompt as-is for your first generation to see the baseline result, then change ONE variable at a time — outfit, location, or camera move — for your next video. That single habit is what separates people who post one AI video and quit from people who build a consistent, recognizable style across dozens of videos.",
  },
  {
    title: "Built for beginners, not just editors",
    text: "No jargon assumed: every tutorial explains what each part of the prompt is doing and why, not just what to paste. You'll learn to read a prompt the way an editor reads a shot list — camera, light, subject, motion — so within a few videos you're editing our prompts confidently instead of just copying them.",
  },
];

/**
 * SEO/intro copy explaining why AI prompts matter and why Ahmad YT
 * Tutorial's are worth using — placed above the tutorial grid so both
 * visitors and search engines see the "why" before the "what."
 */
export default function WhyOurPrompts() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 pb-4">
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-semibold tracking-widest text-[#ff8a1c] uppercase mb-4">
          Why This Channel
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-5">
          Why AI Prompts Matter — And Why Ours Work
        </h2>
        <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
          Ahmad YT Tutorial exists for one reason: to help anyone start their
          YouTube journey using AI, even with zero budget, zero equipment,
          and zero editing experience. Every tutorial on this site comes
          with the exact prompt used to make it — free to copy, free to
          reuse, and free to build your own channel on — so you can start
          creating your own AI videos, Shorts, and content today instead of
          spending months guessing what actually works.
        </p>
        <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed mt-4">
          If you've ever typed a prompt into an AI video tool and gotten
          back something blurry, weird, or nothing like what you imagined,
          you already know the real problem — it was never the AI tool
          itself. It was the prompt. The same tool that produces a
          throwaway clip for one person produces a cinematic, scroll-
          stopping video for another, purely because of how the prompt was
          written. That gap is exactly what this channel closes.
        </p>
      </div>

      <CardFanDeck items={REASONS} />

      <div className="max-w-3xl mx-auto mt-10 space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">
          Why Most AI Videos Look Fake — And How to Fix That
        </h3>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed">
          Scroll through YouTube Shorts or Reels for five minutes and you'll
          see it instantly: some AI-made videos look like real cinema, and
          others look broken, warped, and obviously fake. The difference
          almost never comes down to which AI model was used. Both creators
          might be using the exact same tool — Veo, Sora, Runway, Kling, it
          doesn't matter which. What separates them is the prompt. A
          detailed, well-structured prompt tells the model exactly what
          camera angle to use, how the light should fall, how the subject
          should move, and what mood the scene should carry. A short, lazy
          prompt leaves all of that up to chance, and chance is exactly why
          so many AI videos look inconsistent from shot to shot.
        </p>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed">
          This is the exact gap Ahmad YT Tutorial was built to close. Every
          single tutorial published on this channel comes with the complete,
          word-for-word prompt used to generate that video — not a
          simplified summary, not a "similar" prompt, the actual one. You
          are not just watching a finished video and guessing how it was
          made. You're getting the real recipe, free, so you can reproduce
          that same quality in your own videos, on your own channel, in your
          own niche.
        </p>

        <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-2 pt-4">
          Who This Channel Is Actually For
        </h3>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed">
          This site is built for the person who wants to start a YouTube
          channel but doesn't know where to begin. Maybe you've thought
          about starting a faceless YouTube channel but didn't have a
          camera, a face you wanted to show, or the budget for editing
          software. Maybe you already have a channel that's stuck at a few
          hundred views and you're looking for a way to level up your visual
          quality without hiring an editor. Maybe you just want to learn how
          AI video tools actually work, beyond the surface-level "type
          something and see what happens" approach most people use. Whoever
          you are, if the goal is making real videos with AI — not just
          experimenting with it — Ahmad YT Tutorial is written for you.
        </p>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed">
          We specifically focus on AI video editing, faceless YouTube
          content, Shorts and Reels formats, thumbnail ideas, and channel
          growth tips that actually apply to AI-generated content — not
          generic advice copied from traditional YouTuber playbooks. AI
          content has its own rules: pacing matters differently, hook
          timing matters differently, and prompt consistency across a
          series of videos matters more than almost anything else if you
          want your channel to feel like one cohesive brand instead of a
          random collection of unrelated clips.
        </p>

        <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-2 pt-4">
          Free, Because a Real Starting Point Should Be
        </h3>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed">
          This isn't a paid course, a locked Discord server, or a "prompt
          pack" you have to buy before you can use it. Every prompt, every
          tutorial, and every tool recommendation on Ahmad YT Tutorial is
          published for free, because the whole point of this channel is to
          remove the barrier to entry that stops most people from ever
          starting. We know what it feels like to want to make something
          and not know where to even begin — that's exactly the starting
          point we wish we'd had when we started, and it's what we're
          building here for you: real, working prompts, explained simply,
          with a new one added every time a new video goes up.
        </p>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed">
          You're also not locked into copying prompts exactly forever. Once
          you start using the prompts on this site and see how they're
          structured — the way camera direction, lighting, subject
          description and motion are all written together — you'll start
          noticing the pattern. That pattern is the real skill. Once you
          have it, you can start adjusting prompts for your own ideas,
          your own characters, and your own niche, and you stop needing
          this site as a crutch and start using it as a reference.
        </p>
        <p className="text-center text-white/60 text-sm sm:text-base leading-relaxed pt-2">
          Browse the tutorials below, pick one that matches the kind of
          video you want to make, copy the prompt, and go create. That's
          it — that's the whole system.
        </p>
      </div>
    </section>
  );
}
