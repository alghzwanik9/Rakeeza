import { motion } from 'framer-motion';
import { SignInButton } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Target, Trophy, CalendarClock, BrainCircuit, ArrowRight, ShieldCheck, CheckCircle2, FileText, Globe } from 'lucide-react';

const LandingPage = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';

  const content = {
    en: {
      heroBadge: 'AI-Powered Productivity',
      heroTitle: 'Master Your Day, ',
      heroTitleHighlight: 'Achieve Your Goals',
      heroSubtitle: 'Rakeeza is your personal workspace combining smart task management, gamification, and an AI advisor to keep you at peak performance.',
      ctaPrimary: 'Get Started for Free',
      ctaSecondary: 'Sign In',
      featuresTitle: 'Everything you need to stay focused',
      featuresSubtitle: 'We combined the best productivity frameworks into one seamless experience.',
      features: [
        { icon: <Target className="w-6 h-6 text-accent" />, title: 'Smart Task Manager', desc: 'Create checklists or time-boxed sprints to maximize your focus.' },
        { icon: <BrainCircuit className="w-6 h-6 text-accent" />, title: 'AI Advisor', desc: 'Get personalized insights and workflow optimization from your AI coach.' },
        { icon: <Trophy className="w-6 h-6 text-accent" />, title: 'Gamified Progress', desc: 'Earn points, unlock badges, and build streaks as you complete tasks.' },
        { icon: <CalendarClock className="w-6 h-6 text-accent" />, title: 'Unified Schedule', desc: 'Plan meetings, deadlines, and review sessions in one place.' },
        { icon: <FileText className="w-6 h-6 text-accent" />, title: 'AI Resume Builder', desc: 'Automatically generate a professional resume based on your tasks and skills.' },
        { icon: <Globe className="w-6 h-6 text-accent" />, title: 'AI Portfolio Generator', desc: 'Create a beautiful, standalone HTML portfolio page with a single click.' }
      ],
      gamificationTitle: 'Build Habits That Last',
      gamificationText: 'Turn your productivity into a rewarding journey. Watch your streak grow, unlock exclusive badges, and stay motivated every single day.',
      gamificationBullets: [
        'Daily streaks and momentum tracking',
        'Achievement badges for reaching milestones',
        'Points system to quantify your productivity'
      ],
      bottomCtaTitle: 'Ready to transform your workflow?',
      bottomCtaText: 'Join Rakeeza today and take the first step towards a more productive you.',
    },
    ar: {
      heroBadge: 'إنتاجية مدعومة بالذكاء الاصطناعي',
      heroTitle: 'نظّم يومك، ',
      heroTitleHighlight: 'وحقق أهدافك',
      heroSubtitle: 'ركيزة هي مساحة عملك الشخصية التي تجمع بين الإدارة الذكية للمهام، ونظام التحفيز، والمستشار الذكي لتبقيك في قمة أدائك.',
      ctaPrimary: 'ابدأ مجاناً',
      ctaSecondary: 'تسجيل الدخول',
      featuresTitle: 'كل ما تحتاجه لتبقى مركزاً',
      featuresSubtitle: 'جمعنا أفضل أطر الإنتاجية في تجربة واحدة سلسة.',
      features: [
        { icon: <Target className="w-6 h-6 text-accent" />, title: 'مدير مهام ذكي', desc: 'أنشئ قوائم أو مهام محددة بوقت لزيادة تركيزك لأقصى حد.' },
        { icon: <BrainCircuit className="w-6 h-6 text-accent" />, title: 'مستشار ذكي', desc: 'احصل على رؤى مخصصة وتحسين لسير عملك من مدربك الذكي.' },
        { icon: <Trophy className="w-6 h-6 text-accent" />, title: 'تقدم محفز', desc: 'اكسب النقاط، افتح الأوسمة، وابنِ سلسلة نجاحاتك مع كل مهمة تنجزها.' },
        { icon: <CalendarClock className="w-6 h-6 text-accent" />, title: 'جدول موحد', desc: 'خطط لاجتماعاتك والمواعيد النهائية وجلسات المراجعة في مكان واحد.' },
        { icon: <FileText className="w-6 h-6 text-accent" />, title: 'سيرة ذاتية بالذكاء الاصطناعي', desc: 'قم بتوليد سيرة ذاتية احترافية تلقائياً بناءً على مهامك ومهاراتك.' },
        { icon: <Globe className="w-6 h-6 text-accent" />, title: 'محفظة أعمال ذكية', desc: 'أنشئ صفحة HTML مستقلة وجميلة لملفك الشخصي بنقرة واحدة.' }
      ],
      gamificationTitle: 'ابنِ عادات تدوم',
      gamificationText: 'حوّل إنتاجيتك إلى رحلة ممتعة. شاهد سلسلة إنجازاتك تنمو، وافتح أوسمة حصرية، وابقَ متحفزاً كل يوم.',
      gamificationBullets: [
        'تتبع سلسلة الأيام والزخم اليومي',
        'أوسمة إنجاز عند الوصول إلى أهداف محددة',
        'نظام نقاط لقياس مدى إنتاجيتك'
      ],
      bottomCtaTitle: 'هل أنت مستعد لتحويل طريقة عملك؟',
      bottomCtaText: 'انضم إلى ركيزة اليوم واتخذ الخطوة الأولى نحو نسخة أكثر إنتاجية منك.',
    }
  };

  const t = content[lang];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full max-w-6xl mx-auto px-4 py-24 sm:py-32 flex flex-col items-center text-center">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm mb-8 ring-1 ring-accent/20">
            <Sparkles className="w-4 h-4" />
            {t.heroBadge}
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-ink mb-6 leading-tight">
            {t.heroTitle}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
              {t.heroTitleHighlight}
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-steel mb-10 max-w-2xl leading-relaxed">
            {t.heroSubtitle}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4">
            <SignInButton mode="modal">
              <button className="rounded-xl bg-accent px-8 py-4 font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-accent/30 flex items-center gap-2">
                {t.ctaPrimary}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </SignInButton>
            <SignInButton mode="modal">
              <button className="rounded-xl bg-surface px-8 py-4 font-semibold text-ink transition-all hover:bg-surface/80 active:scale-95 ring-1 ring-ink/10 flex items-center gap-2">
                {t.ctaSecondary}
              </button>
            </SignInButton>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-surface py-24 border-y border-ink/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">{t.featuresTitle}</h2>
            <p className="text-lg text-steel max-w-2xl mx-auto">{t.featuresSubtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-canvas p-6 rounded-2xl ring-1 ring-ink/5 hover:ring-accent/50 transition-all hover:shadow-xl hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-ink mb-3">{feature.title}</h3>
                <p className="text-steel leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-24 sm:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-ink leading-tight">
              {t.gamificationTitle}
            </h2>
            <p className="text-lg text-steel leading-relaxed">
              {t.gamificationText}
            </p>
            <ul className="space-y-4">
              {t.gamificationBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                  <span className="text-ink font-medium">{bullet}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full max-w-md"
          >
            {/* Abstract visual representing gamification */}
            <div className="relative aspect-square w-full rounded-3xl bg-gradient-to-br from-accent/20 to-secondary/20 p-8 ring-1 ring-ink/10 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-canvas/40 backdrop-blur-[2px]"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-canvas shadow-xl flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-warning" />
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-accent shadow-xl flex items-center justify-center text-white font-bold text-2xl">
                    +50
                  </div>
                </div>
                <div className="bg-canvas px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 w-full">
                  <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center">
                    <span className="text-xl">🔥</span>
                  </div>
                  <div>
                    <div className="font-bold text-ink">7 Day Streak!</div>
                    <div className="text-sm text-steel">Keep it up!</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full bg-gradient-to-r from-accent to-secondary py-20 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <ShieldCheck className="w-16 h-16 text-white/90 mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t.bottomCtaTitle}
          </h2>
          <p className="text-xl text-white/80 mb-10">
            {t.bottomCtaText}
          </p>
          <SignInButton mode="modal">
            <button className="rounded-xl bg-white px-10 py-4 font-bold text-accent transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10">
              {t.ctaPrimary}
            </button>
          </SignInButton>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
