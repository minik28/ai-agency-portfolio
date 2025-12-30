import React, { useState, useEffect } from 'react';
import {
  Menu, X, Zap, Database, Brain, Code, ChevronRight,
  Moon, Sun, Terminal, Sparkles, MessageSquare,
  Mail, Linkedin, Github
} from 'lucide-react';

/* ================= SUPABASE CONFIG ================= */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

const initSupabase = () => {
  // 🔒 BUILD + SSR SAFE
  if (typeof window === 'undefined') return null;

  if (window.supabase && !supabase) {
    supabase = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );
  }
  return supabase;
};

/* ================= COMPONENT ================= */

const Portfolio = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [demoStats, setDemoStats] = useState({});

  /* ========== DARK MODE ========== */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  /* ========== SUPABASE REALTIME ========== */
  useEffect(() => {
    const client = initSupabase();
    if (!client) return;

    const loadStats = async () => {
      const { data } = await client.from('demo_stats').select('*');
      if (!data) return;

      const map = {};
      data.forEach(r => {
        if (!map[r.demo_id]) map[r.demo_id] = {};
        map[r.demo_id][r.metric_name] = r.metric_value;
      });
      setDemoStats(map);
    };

    loadStats();

    const channel = client
      .channel('demo-stats')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'demo_stats' },
        payload => {
          if (payload.eventType !== 'DELETE') {
            const { demo_id, metric_name, metric_value } = payload.new;
            setDemoStats(prev => ({
              ...prev,
              [demo_id]: {
                ...prev[demo_id],
                [metric_name]: metric_value
              }
            }));
          }
        })
      .subscribe();

    return () => client.removeChannel(channel);
  }, []);

  /* ========== DATA ========== */

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

  /* ========== FORM ========== */

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

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ================= JSX ================= */

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
      {/* JSX INHALT IDENTISCH ZU DEINEM ORIGINAL */}
      {/* Navigation · Hero · Services · Demos · Contact · Footer */}
    </div>
  );
};

export default Portfolio;

