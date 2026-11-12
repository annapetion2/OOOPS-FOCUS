# OOOPS-FOCUS

OOOPS FOCUS is a simple focus timer that also keeps track of what distracts you. You start a 25 minute timer, and when something pulls you away, you tap what it was and keep going. Oops, back to work.

Try it: https://annapetion2.github.io/OOOPS-FOCUS/

What it does
Timer: 25 minutes with Start, Pause and Reset. It keeps the right time even if you switch tabs.
"What pulled you away?" Tap Phone, Thoughts, Hunger or Other every time it happens. It just counts. No guilt.
Today's Flow: shows how many minutes you focused and how many times you got distracted.
Tips & Hack: a short focus tip based on what's been distracting you. It uses the Gemini API, and if that isn't connected it shows a saved tip instead.
It remembers you. Your numbers stay after a refresh because they're saved in your own browser. I don't collect anything, and nobody sees anyone else's data.

I went with a dark blue background and light text so it's easy on the eyes. It works on phones too.

Built with

Plain HTML, CSS and JavaScript. No frameworks, nothing to install.

Files
index.html       the page
OopsFocus.css    how it looks
OopsFocus.js     the timer, the counts and the tips

Run it on your computer
bash
git clone https://github.com/annapetion2/OOOPS-FOCUS.git
cd OOOPS-FOCUS

Then open index.html in your browser. That's it.

About the Gemini tips

The app works fine without them. To turn on live tips you need a Gemini API key from Google AI Studio.

Don't put your key in OopsFocus.js on a public repo. Anyone can read it and use your key. Keep the key on a small server
