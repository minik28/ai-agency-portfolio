import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, Database, Brain, Code, ChevronRight, Moon, Sun, Terminal, Sparkles, MessageSquare, Mail, Linkedin, Github } from 'lucide-react';

// Supabase Client über CDN
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Supabase Client wird dynamisch geladen
let supabase = null;

const initSupabase = () => {
  if (window.supabase && !supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
};

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

  // Supabase CDN Script dynamisch laden
  useEffect(() => {
    if (!document.getElementById('supabase-script')) {
      const script = document.createElement('script');
      script.id = 'supabase-script';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/supabase/2.39.0/supabase.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Supabase Realtime Subscription für demo_stats
  useEffect(() => {
    const client = initSupabase();
    
    if (!client) {
      console.warn('Supabase client nicht verfügbar. Bitte füge das Supabase CDN Script hinzu.');
      return;
    }

    // Initiale Daten laden
    const fetchDemoStats = async () => {
      const { data, error } = await client
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

    // Realtime Subscription einrichten
    const channel = client
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'demo_stats'
        },
        (payload) => {
          console.log('Realtime update:', payload);
          
          // State aktualisieren basierend auf dem Event
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const { demo_id, metric_name, metric_value } = payload.new;
            setDemoStats(prev => ({
              ...prev,
              [demo_id]: {
                ...prev[demo_id],
                [metric_name]: metric_value
              }
            }));
          } else if (payload.eventType === 'DELETE') {
            const { demo_id, metric_name } = payload.old;
            setDemoStats(prev => {
              const updated = { ...prev };
              if (updated[demo_id]) {
                delete updated[demo_id][metric_name];
              }
              return updated;
            });
          }
        }
      )
      .subscribe();

    // Cleanup bei Component Unmount
    return () => {
      client.removeChannel(channel);
    };
  }, []);

  const services = [
    {
      icon: Brain,
      title: 'AI Integration',
      description: 'Nahtlose Integration von LLMs und AI-Modellen in Ihre bestehenden Systeme'
    },
    {
      icon: Database,
      title: 'Datenautomatisierung',
      description: 'Intelligente Datenverarbeitung und -analyse mit modernen SQL-Datenbanken'
    },
    {
      icon: Code,
      title: 'Custom Workflows',
      description: 'Maßgeschneiderte Automatisierungslösungen für Ihre spezifischen Geschäftsprozesse'
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Skalierbare und hochperformante Lösungen für Enterprise-Anwendungen'
    }
  ];

  const sqlDemos = [
    {
      id: 'analytics',
      title: 'Real-time Analytics Dashboard',
      description: 'Live SQL-Abfragen für Echtzeit-Geschäftsmetriken',
      query: 'SELECT date, SUM(revenue) as total FROM sales GROUP BY date ORDER BY date DESC LIMIT 30',
      defaultMetrics: { queries: '1.2M/day', latency: '< 50ms', uptime: '99.9%' }
    },
    {
      id: 'segmentation',
      title: 'Customer Segmentation',
      description: 'Intelligente Kundensegmentierung mit AI-gestützten SQL-Queries',
      query: 'SELECT segment, COUNT(*) as users, AVG(lifetime_value) FROM customers WHERE active = true GROUP BY segment',
      defaultMetrics: { segments: '12', accuracy: '94%', processing: '< 2s' }
    },
    {
      id: 'reporting',
      title: 'Automated Reporting',
      description: 'Automatisierte Berichtserstellung aus komplexen Datenquellen',
      query: 'WITH monthly_data AS (SELECT * FROM reports WHERE month = CURRENT_MONTH) SELECT category, metrics FROM monthly_data',
      defaultMetrics: { reports: '500+/mo', automation: '100%', time_saved: '200h' }
    }
  ];

  // Aktuelle Demo mit Realtime-Daten oder Fallback auf Default-Metriken
  const currentDemo = sqlDemos[activeDemo];
  const currentMetrics = demoStats[currentDemo.id] || currentDemo.defaultMetrics;

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus('error');
      setTimeout(() => setFormStatus(''), 3000);
      return;
    }
    setFormStatus('sending');
    
    // API-Integration vorbereitet für Supabase/Vercel
    try {
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulierte Verzögerung
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
      {/* Navigation */}
      <nav className="fixed w-full z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Automation Agency
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">Services</a>
              <a href="#demos" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">Live Demos</a>
              <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">Kontakt</a>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
            <div className="px-4 py-4 space-y-3">
              <a href="#services" className="block text-gray-700 dark:text-gray-300">Services</a>
              <a href="#demos" className="block text-gray-700 dark:text-gray-300">Live Demos</a>
              <a href="#contact" className="block text-gray-700 dark:text-gray-300">Kontakt</a>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-8">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Enterprise AI Automation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            Transformieren Sie Ihr Business mit KI
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
            Wir entwickeln maßgeschneiderte AI-Automatisierungslösungen für moderne Unternehmen. 
            Von intelligenten Workflows bis zu Echtzeit-Datenanalyse.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center space-x-2"
            >
              <span>Projekt starten</span>
              <ChevronRight className="w-5 h-5" />
            </a>
            <a
              href="#demos"
              className="w-full sm:w-auto px-8 py-4 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition"
            >
              Live Demos ansehen
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            Unsere Services
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition group"
              >
                <service.icon className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live SQL Demos */}
      <section id="demos" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
              <Terminal className="w-4 h-4" />
              <span className="text-sm font-medium">Live Production Systems</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">SQL Demo Projekte</h2>
            <p className="text-gray-600 dark:text-gray-400">Echtzeitbeispiele unserer AI-gestützten Datenlösungen</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 mb-8">
            {sqlDemos.map((demo, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDemo(idx)}
                className={`p-4 rounded-lg text-left transition ${
                  activeDemo === idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <h3 className="font-semibold mb-1">{demo.title}</h3>
                <p className={`text-sm ${activeDemo === idx ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {demo.description}
                </p>
              </button>
            ))}
          </div>

          <div className="bg-gray-900 dark:bg-black rounded-xl border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-green-400" />
                <span className="text-sm font-mono text-green-400">supabase_production</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            <div className="p-6">
              <pre className="text-green-400 font-mono text-sm mb-6 overflow-x-auto">
                {currentDemo.query}
              </pre>
              
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(currentMetrics).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1 transition-all duration-300">
                      {value}
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">{key.replace('_', ' ')}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live from Supabase</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Starten Sie Ihr Projekt
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            Lassen Sie uns über Ihre Automatisierungsanforderungen sprechen
          </p>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition text-gray-900 dark:text-white"
                  placeholder="Max Mustermann"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">E-Mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition text-gray-900 dark:text-white"
                  placeholder="max@beispiel.de"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Unternehmen</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition text-gray-900 dark:text-white"
                placeholder="Ihre Firma GmbH"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Nachricht</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition text-gray-900 dark:text-white resize-none"
                placeholder="Erzählen Sie uns von Ihrem Projekt..."
              ></textarea>
            </div>

            <button
              onClick={handleSubmit}
              disabled={formStatus === 'sending'}
              className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition flex items-center justify-center space-x-2"
            >
              {formStatus === 'sending' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Wird gesendet...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5" />
                  <span>Nachricht senden</span>
                </>
              )}
            </button>

            {formStatus === 'success' && (
              <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-center">
                Nachricht erfolgreich gesendet! Wir melden uns in Kürze.
              </div>
            )}

            {formStatus === 'error' && (
              <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-center">
                Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-900 dark:text-white">AI Automation Agency</span>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            © 2024 AI Automation Agency. Bereit für Supabase & Vercel Deployment.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
