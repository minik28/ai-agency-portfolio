import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Menu, X, Zap, Database, Brain, Code, ChevronRight, Moon, Sun, Terminal, Sparkles, MessageSquare, Mail, Linkedin, Github } from 'lucide-react';

// Supabase Client Initialisierung
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

const Portfolio = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [demoStats, setDemoStats] = useState({});

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Supabase Realtime & Data Fetching
  useEffect(() => {
    const fetchDemoStats = async () => {
      const { data, error } = await supabase
        .from('demo_stats')
        .select('*');
      
      if (data && !error) {
        const statsMap = {};
        data.forEach(stat => {
          if (!statsMap[stat.demo_id]) {
            statsMap[stat.demo_id] = {};
          }
          statsMap[stat.demo_id][stat.metric_name] = stat.metric_value;
        });
        setDemoStats(statsMap);
      }
    };

    fetchDemoStats();

    const channel = supabase
      .channel('public:demo_stats')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'demo_stats' 
      }, (payload) => {
        fetchDemoStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const services = [
    { icon: Brain, title: 'AI Integration', description: 'Nahtlose Integration von LLMs und AI-Modellen in Ihre bestehenden Systeme' },
    { icon: Database, title: 'Datenautomatisierung', description: 'Intelligente Datenverarbeitung und -analyse mit modernen SQL-Datenbanken' },
    { icon: Code, title: 'Custom Workflows', description: 'Maßgeschneiderte Automatisierungslösungen für Ihre spezifischen Geschäftsprozesse' },
    { icon: Zap, title: 'Performance Optimization', description: 'Skalierbare und hochperformante Lösungen für Enterprise-Anwendungen' }
  ];

  const sqlDemos = [
    { id: 'analytics', title: 'Real-time Analytics Dashboard', description: 'Live SQL-Abfragen für Echtzeit-Geschäftsmetriken', query: 'SELECT date, SUM(revenue) as total FROM sales GROUP BY date ORDER BY date DESC LIMIT 30', defaultMetrics: { queries: '1.2M/day', latency: '< 50ms', uptime: '99.9%' } },
    { id: 'segmentation', title: 'Customer Segmentation', description: 'Intelligente Kundensegmentierung mit AI-gestützten SQL-Queries', query: 'SELECT segment, COUNT(*) as users, AVG(lifetime_value) FROM customers WHERE active = true GROUP BY segment', defaultMetrics: { segments: '12', accuracy: '94%', processing: '< 2s' } },
    { id: 'reporting', title: 'Automated Reporting', description: 'Automatisierte Berichtserstellung aus komplexen Datenquellen', query: 'WITH monthly_data AS (SELECT * FROM reports WHERE month = CURRENT_MONTH) SELECT category, metrics FROM monthly_data', defaultMetrics: { reports: '500+/mo', automation: '100%', time_saved: '200h' } }
  ];

  const currentDemo = sqlDemos[activeDemo];
  const currentMetrics = demoStats[currentDemo.id] || currentDemo.defaultMetrics;

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus('error');
      setTimeout(() => setFormStatus(''), 3000);
      return;
    }
    setFormStatus('sending');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus('success');
      setFormData({ name: '', email: '', company: '', message: '' });
      setTimeout(() => setFormStatus(''), 3000);
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus(''), 3000);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      <nav className="fixed w-full z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Agency</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Services</a>
            <a href="#demos" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Demos</a>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800">
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 text-center max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 dark:text-white">Transformieren Sie Ihr Business mit KI</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">Wir entwickeln maßgeschneiderte AI-Automatisierungslösungen.</p>
        <div className="flex justify-center space-x-4">
          <a href="#contact" className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium">Projekt starten</a>
        </div>
      </section>

      <section id="services" className="py-20 bg-white dark:bg-gray-900 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <div key={i} className="p-6 rounded-xl border dark:border-gray-700 dark:bg-gray-800">
              <s.icon className="w-12 h-12 mb-4 text-blue-600" />
              <h3 className="text-xl font-bold mb-2 dark:text-white">{s.title}</h3>
              <p className="dark:text-gray-400">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="demos" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          {sqlDemos.map((demo, idx) => (
            <button key={idx} onClick={() => setActiveDemo(idx)} className={`p-4 rounded-lg text-left ${activeDemo === idx ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'}`}>
              <h3 className="font-bold">{demo.title}</h3>
            </button>
          ))}
        </div>
        <div className="bg-black rounded-xl p-6 border border-gray-700">
          <pre className="text-green-400 mb-6">{currentDemo.query}</pre>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(currentMetrics).map(([k, v]) => (
              <div key={k} className="text-center">
                <div className="text-2xl font-bold text-blue-400">{v}</div>
                <div className="text-xs text-gray-400 uppercase">{k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t dark:border-gray-800 text-center dark:text-gray-400">
        © 2024 AI Automation Agency.
      </footer>
    </div>
  );
};

export default Portfolio;
