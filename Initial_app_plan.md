> _**Editorial Intelligence**_

Full Stack App designed to summarize, save and showcase the summary in a neatly arranged UI.

**Frontend**

Target was to make something that would stand out, since the app in itself isnt that complicated, the standout feature had to be an eye catching UI.
Stack- NextJS for its simplicity and my familiarability with the Framework in general, Animation was handled by Motion by FramerMotion and ofc Typescript and Tailwind.

**Backend**

Auth was a big thing in here since i wanted to use a third party hosted auth like clerk but didnt wanna stick with their default login/signup style of pages so everything related to it was custome designed and imtegrated with the hooks that clerk provides for custom flows.

Server was handled by NextJS inbuild server routes and server actions.

Prisma and NeonDB as a ORM and Database.

Workflow simplification was a major requirement in this since web scrapper takes a toll on vercel's hosting so i had to figure out a clever way to offload the heavy usage from vercel, logical option was to use inngest as a workflow management server alongside with another service that'd handle the scrapping of the data using puppeteer on their servers since doing that on vercel wouldve resulted in a timeout.

**AI Agent**

Since the whole point of the app is to summarize the articles, i went with something that'd allow me to showcase this feature as much as possible without drilling a hole in my wallet so gemini and ollama's local LLM have been tested in this app and since its using AI-SDK, plug and play is their general MO.

**Pages**

- Landing Page
- SignIn/Signup
- All Blog Pages
- Single Blog Page
- Settings Page

**Duration**

- 2 Weeks is what it took me (On/Off) to complete this app however the initial plan was to complete this in 1 week but whatever, it is what it is.
