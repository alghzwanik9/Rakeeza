import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { generateAdvisorResponse } from '../lib/aiAdvisorHelper.js'

const TypingIndicator = () => (
  <div className="flex gap-1.5 p-2">
    {[0, 1, 2].map((dot) => (
      <motion.div
        key={dot}
        className="h-2 w-2 rounded-full bg-accent"
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: dot * 0.15,
        }}
      />
    ))}
  </div>
)

const AiAdvisor = ({ tasks = [], events = [], profile = {} }) => {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([
    { id: 'm1', author: t('advisor.name'), text: t('advisor.welcome'), isAi: true },
  ])
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const submitMessage = (event) => {
    event.preventDefault()
    if (!draft.trim() || isTyping) return

    const userMessage = { id: `u-${Date.now()}`, author: 'You', text: draft.trim(), isAi: false }
    setMessages((prev) => [...prev, userMessage])
    setDraft('')
    setIsTyping(true)

    generateAdvisorResponse(userMessage.text, { tasks, events, profile })
      .then((response) => {
        setMessages((prev) => [...prev, { id: `a-${Date.now()}`, author: t('advisor.name'), text: response, isAi: true }])
      })
      .catch((error) => {
        console.error("Advisor error:", error)
        setMessages((prev) => [...prev, { id: `a-${Date.now()}`, author: t('advisor.name'), text: 'حدث خطأ غير متوقع.', isAi: true }])
      })
      .finally(() => {
        setIsTyping(false)
      })
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-whisper bg-surface/80 p-6 shadow-diffused backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] font-medium text-steel">{t('tabs.advisor')}</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">{t('advisor.name')}</h2>
            <p className="mt-2 text-steel">{t('advisor.subtitle')}</p>
          </div>
          <div className="rounded-3xl bg-accent/10 px-4 py-3 text-accent ring-1 ring-accent/20">
            <p className="text-xs uppercase tracking-[0.24em] font-medium text-accent/80">AI</p>
            <p className="mt-1 text-sm font-semibold">Gemini-style</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-[500px] rounded-3xl border border-whisper bg-surface/80 shadow-diffused backdrop-blur-md overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full ${message.isAi ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl p-5 ${
                  message.isAi
                    ? 'bg-canvas border border-whisper text-ink rounded-tl-sm'
                    : 'bg-accent text-white rounded-tr-sm shadow-lg shadow-accent/20'
                }`}
              >
                <p className={`text-xs font-medium mb-2 ${message.isAi ? 'text-steel' : 'text-white/80'}`}>
                  {message.author}
                </p>
                <p className={`whitespace-pre-line leading-relaxed ${message.isAi ? 'text-ink' : 'text-white'}`}>
                  {message.text}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="max-w-[85%] rounded-3xl p-5 bg-canvas border border-whisper rounded-tl-sm">
                <p className="text-xs font-medium mb-2 text-steel">{t('advisor.name')}</p>
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={submitMessage} className="border-t border-whisper bg-surface/95 p-4 sm:p-6 flex gap-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('advisor.placeholder')}
            disabled={isTyping}
            className="flex-1 rounded-2xl border border-whisper bg-canvas px-5 py-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isTyping || !draft.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <Send className="h-5 w-5" />
            <span className="hidden sm:inline">{t('advisor.send')}</span>
          </button>
        </form>
      </div>
    </section>
  )
}

export default AiAdvisor
