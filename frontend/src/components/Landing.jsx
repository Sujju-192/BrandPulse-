import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Target, Users, BarChart, Globe, Zap, Rocket,
  Palette, MessageSquare, Search, ArrowRight, Star, TrendingUp, Shield, Cpu, Menu, X
} from 'lucide-react';

// Animated counter component (plain JS)
const AnimatedCounter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const numericValue = parseInt(value.replace('+', '').replace('K', '000').replace('x', ''));
  const isK = value.includes('K');
  const isX = value === '3x';
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = numericValue / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, numericValue]);
  
  let displayValue = count.toString();
  if (isK) displayValue = count.toLocaleString() + 'K';
  if (isX) displayValue = count + 'x';
  if (value === '95%') displayValue = count + '%';
  if (value === '40%') displayValue = count + '%';
  if (value === '10K+') displayValue = count.toLocaleString() + 'K+';
  
  return <span ref={ref}>{displayValue}</span>;
};

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-purple-500/20"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -30, 0], x: [0, 20, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

// Magnetic button component
const MagneticButton = ({ children, className, ...props }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.3;
    const y = (e.clientY - top - height / 2) * 0.3;
    setPosition({ x, y });
  };
  
  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });
  
  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Section wrapper with scroll animations
const Section = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered container
const StaggeredContainer = ({ children, className = "" }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Staggered card
const StaggeredCard = ({ children, className = "" }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 }
    }}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  
  const stats = [
    { value: '10K+', label: 'Campaigns Launched', icon: <Rocket className="w-4 h-4" />, color: "from-purple-500 to-pink-500" },
    { value: '95%', label: 'Client Satisfaction', icon: <Star className="w-4 h-4" />, color: "from-yellow-500 to-orange-500" },
    { value: '3x', label: 'Faster Creation', icon: <Zap className="w-4 h-4" />, color: "from-blue-500 to-cyan-500" },
    { value: '40%', label: 'Avg. Growth', icon: <TrendingUp className="w-4 h-4" />, color: "from-green-500 to-emerald-500" },
  ];

  const features = [
    {
      category: 'AI Strategy',
      items: [
        { icon: <Cpu className="w-5 h-5" />, title: 'Smart Brief Analyzer', desc: 'Transform ideas into structured strategy' },
        { icon: <Target className="w-5 h-5" />, title: 'Campaign Engine', desc: 'Autonomous theme & positioning' },
        { icon: <Users className="w-5 h-5" />, title: 'Multi-Agent AI', desc: 'Coordinated specialized agents' },
      ]
    },
    {
      category: 'Creative Generation',
      items: [
        { icon: <Palette className="w-5 h-5" />, title: 'Visual Identity', desc: 'Mood boards & brand assets' },
        { icon: <MessageSquare className="w-5 h-5" />, title: 'AI Copywriting', desc: 'Platform-specific content' },
        { icon: <Search className="w-5 h-5" />, title: 'Influencer Discovery', desc: 'Personalized outreach' },
      ]
    },
    {
      category: 'Advanced Tools',
      items: [
        { icon: <BarChart className="w-5 h-5" />, title: 'Competitor Insights', desc: 'Strategic differentiation' },
        { icon: <Shield className="w-5 h-5" />, title: 'Brand Guardrails', desc: 'Consistency checks' },
        { icon: <Globe className="w-5 h-5" />, title: 'Multi-Language', desc: 'Global campaign support' },
      ]
    }
  ];

  const processSteps = [
    { number: '01', title: 'Describe Your Vision', desc: 'Share your business story, goals, and audience.' },
    { number: '02', title: 'AI Strategy Session', desc: 'Our AI analyzes and crafts your unique growth plan.' },
    { number: '03', title: 'Launch & Scale', desc: 'Deploy ready-to-use campaigns and watch growth happen.' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-pink-900/20 rounded-full blur-3xl"
          animate={{ x: [0, -80, 0], y: [0, -40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <FloatingParticles />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-50 container mx-auto px-6 py-6"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Rocket className="w-6 h-6" />
            </div>
            <span className="text-2xl font-light tracking-tight">Campaign<span className="font-bold">AI</span></span>
          </motion.div>
          
          <div className="hidden lg:flex items-center gap-8">
            {['Features', 'Case Studies', 'Pricing'].map((item, i) => (
              <motion.a
                key={item}
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05, color: "#fff" }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
          
          <MagneticButton className="hidden lg:block px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium flex items-center gap-2 group">
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
          
          <button 
            className="lg:hidden p-2 rounded-lg bg-gray-800/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 py-4 border-t border-gray-800"
            >
              <div className="flex flex-col gap-4">
                {['Features', 'Case Studies', 'Pricing'].map((item) => (
                  <a key={item} href="#" className="text-gray-400 hover:text-white py-2">
                    {item}
                  </a>
                ))}
                <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 font-medium flex items-center justify-center gap-2 group">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="relative container mx-auto px-6 pt-20 pb-32"
        style={{ opacity, scale }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-800/30 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm">AI-Powered Growth Platform</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-light mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Describe your <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">business</span>
            <br />
            <span className="text-gray-300">Watch our AI</span> grow it
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            We transform your vision into complete marketing strategies, creative assets, and growth campaigns—all powered by artificial intelligence.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <MagneticButton className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl hover:shadow-purple-900/30 transition-all duration-300 text-lg font-medium flex items-center gap-3 group">
              <Sparkles className="w-5 h-5" />
              Start Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            <motion.button 
              className="px-8 py-3.5 rounded-full border border-gray-800 hover:border-gray-600 transition-colors duration-300 text-lg"
              whileHover={{ scale: 1.05, borderColor: "#8b5cf6" }}
              whileTap={{ scale: 0.95 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <Section className="relative container mx-auto px-6 -mt-10 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold">
                  <AnimatedCounter value={stat.value} />
                </div>
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Features Grid */}
      <section className="relative container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-light mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Everything you need to
            <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> scale smarter</span>
          </motion.h2>
          <motion.p 
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            From strategy to execution, our AI handles every aspect of campaign creation
          </motion.p>
        </div>

        <StaggeredContainer className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((category, categoryIndex) => (
            <StaggeredCard key={categoryIndex}>
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/10 backdrop-blur-sm rounded-3xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-500 h-full">
                <h3 className="text-xl font-semibold mb-6 text-gray-300">{category.category}</h3>
                <div className="space-y-6">
                  {category.items.map((item, itemIndex) => (
                    <motion.div 
                      key={itemIndex}
                      className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-800/30 transition-all duration-300 group cursor-pointer"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 5 }}
                      >
                        <div className="text-purple-400">
                          {item.icon}
                        </div>
                      </motion.div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </StaggeredCard>
          ))}
        </StaggeredContainer>
      </section>

      {/* Process Section */}
      <section className="relative container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-4xl font-light text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How it <span className="font-bold text-white">works</span>
          </motion.h2>
          
          <div className="relative">
            <motion.div 
              className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500 to-purple-500/0 hidden lg:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ originX: 0 }}
            />
            
            <div className="grid lg:grid-cols-3 gap-8 relative">
              {processSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <motion.div 
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 border-4 border-gray-800 flex items-center justify-center text-2xl font-bold text-purple-400 mx-auto mb-6 relative cursor-pointer"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {step.number}
                    <motion.div 
                      className="absolute -inset-2 rounded-full border border-purple-900/30"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-center relative overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="absolute inset-0 opacity-5"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }} />
            </motion.div>
            
            <div className="relative z-10">
              <motion.h2 
                className="text-4xl md:text-5xl font-light mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Ready to <span className="font-bold">transform</span> your growth?
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Join forward-thinking businesses already accelerating with AI-powered campaigns.
              </motion.p>
              
              <MagneticButton className="px-10 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-purple-900/40 transition-all duration-300 text-lg font-medium flex items-center gap-3 mx-auto group">
                <Rocket className="w-5 h-5" />
                Start Your 14-Day Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </MagneticButton>
              
              <motion.p 
                className="text-gray-500 mt-8 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                No credit card required • Full platform access • Cancel anytime
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        className="relative border-t border-gray-900 mt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-light">Campaign<span className="font-bold">AI</span></div>
                <div className="text-sm text-gray-500">AI-powered business growth</div>
              </div>
            </motion.div>
            
            <div className="text-center md:text-right">
              <div className="text-gray-500 text-sm mb-2">© 2024 CampaignAI. All rights reserved.</div>
              <div className="flex gap-6 text-gray-400 text-sm">
                {['Privacy', 'Terms', 'Contact'].map((item) => (
                  <motion.a 
                    key={item} 
                    href="#" 
                    className="hover:text-white transition-colors"
                    whileHover={{ x: 2 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.footer>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% auto;
        }
      `}</style>
    </div>
  );
}