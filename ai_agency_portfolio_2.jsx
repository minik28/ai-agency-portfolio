import React, { useState, useEffect } from 'react';
import {
  Menu, X, Zap, Database, Brain, Code,
  Moon, Sun, Sparkles
} from 'lucide-react';

const Portfolio = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [demoStats, setDemoStats] = useState({});

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const services = [
    { icon: Brain, title: 'AI Integration', description: 'LLMs & AI Systeme' },
    { icon: Database, title: 'Data Automation', description: 'SQL & Pipelines' },
    { icon: Code, title: 'Custom Workflows', description: 'Business Automation' },
    { icon: Zap, title: 'Performance', description: 'Skalierbare Systeme' }
  ];

  const sqlDemos = [
    {
      id: 'analytics',
      title: 'Realtime Analytics',
      description: 'Live SQL Queries',
      query: 'SELECT date, SUM(revenue) FROM sales GROUP BY date',
      defaultMetrics: { queries: '1.2M/day', latency: '<50ms', uptime: '99.9%' }
    },
    {
      id: 'segmentation',
      title: 'Segmentation',
      description: 'Customer Segments',
      query: 'SELECT segment, COUNT(*) FROM customers GROUP BY segment',
      defaultMetrics: { segments: '12', accuracy: '94%', processing: '<2s' }
    },
    {
      id: 'reporting',
      title: 'Reporting',
      description: 'Automated Reports',
      query: 'SELECT category, metrics FROM reports',
      defaultMetrics: { reports: '500/mo', automation: '100%', saved: '200h' }
    }
  ];

  const currentDemo = sqlDemos[activeDemo];
  const metrics = demoStats[currentDemo.id] || currentDemo.defaultMetrics;

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus('error');
      return;
    }

    setFormStatus('sending');
    await new Promise(r => setTimeout(r, 1500));
    setFormStatus('success');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

            {/* Desktop Navigation */}
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
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

      {/* Additional sections can be added below */}
      <main>
        {/* Other sections like 'services', 'demos', or 'contact' */}
      </main>
    </div>
  );
};

export default Portfolio;
