import Link from "next/link";

const FEATURES = [
  {
    title: "Email Generator",
    description: "Describe your purpose and recipient and get a complete, polished email in seconds.",
    color: "bg-indigo-50 text-indigo-600",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    title: "Email Rewriter",
    description: "Paste any email and instantly improve professionalism, clarity, or grammar.",
    color: "bg-blue-50 text-blue-600",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    title: "Tone Changer",
    description: "Switch between professional, friendly, formal, casual, persuasive, and more.",
    color: "bg-purple-50 text-purple-600",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
  {
    title: "Subject Line Generator",
    description: "Get 5 to 10 high-converting subject line options for any email context.",
    color: "bg-amber-50 text-amber-600",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "AI Reply Generator",
    description: "Paste a received email and generate positive, neutral, rejection, or follow-up replies.",
    color: "bg-pink-50 text-pink-600",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6M3 10l6-6" />
      </svg>
    ),
  },
  {
    title: "Thread Summarizer",
    description: "Turn long email threads into key points, action items, and important dates.",
    color: "bg-teal-50 text-teal-600",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    number: "01",
    title: "Pick a tool",
    description: "Choose from 6 AI-powered tools built specifically for email tasks.",
  },
  {
    number: "02",
    title: "Add your details",
    description: "Tell it the purpose, paste an email, or describe the context, whatever the tool needs.",
  },
  {
    number: "03",
    title: "Get instant results",
    description: "Gemini AI generates polished output in seconds, ready to copy and send.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-white" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-medium text-gray-600 mb-8 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Powered by Gemini AI
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 tracking-tight leading-[1.05] mb-6">
            Write better emails,
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              in seconds.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate, rewrite, and perfect professional emails with AI. Change tone,
            craft subject lines, summarize threads, and draft replies, all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all"
            >
              Try it free
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-7 py-3.5 rounded-xl border border-gray-200 transition-all"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>

          <p className="text-xs text-gray-400 mt-8">
            No sign-up required. No credit card. Just write.
          </p>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">6</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">AI-powered tools</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">&lt;5s</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">Average generation time</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">100%</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">Free, open source</div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Everything you need to communicate better
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Six AI-powered tools built for students, professionals, and job-seekers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-0.5 hover:border-transparent transition-all duration-300"
            >
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              How it works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Three steps from blank page to a finished email.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-10">
            {STEPS.map((step) => (
              <div key={step.number} className="text-center sm:text-left">
                <div className="text-4xl font-bold text-indigo-100 mb-3">{step.number}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">
          Built with
        </p>
        <div className="flex items-center justify-center gap-8 flex-wrap text-gray-400 text-sm font-medium">
          <span>Next.js</span>
          <span className="text-gray-200">•</span>
          <span>React</span>
          <span className="text-gray-200">•</span>
          <span>Tailwind CSS</span>
          <span className="text-gray-200">•</span>
          <span>FastAPI</span>
          <span className="text-gray-200">•</span>
          <span>Gemini AI</span>
          <span className="text-gray-200">•</span>
          <span>SQLite</span>
        </div>
      </section>

      <section className="bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to write your next email?
          </h2>
          <p className="text-indigo-100 mb-9 max-w-lg mx-auto">
            No sign-up required. Jump straight into the dashboard and start generating.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Open Dashboard
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      <footer className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
          Built with Next.js, FastAPI and Gemini AI. MailMind AI (c) 2026
        </div>
      </footer>
    </div>
  );
}