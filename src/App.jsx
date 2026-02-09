import React, { useState, useRef } from 'react';
import { Search, Download, Printer, Github, Loader2, Info, ExternalLink, Star, Code2, Zap, BarChart3, Layout, Smartphone } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PrintLayout from './components/PrintLayout';
import { fetchGitHubData, analyzeData } from './services/github';
import { MOCK_USER } from './utils/mockData';

function App() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  
  const printRef = useRef(null);
  const aboutRef = useRef(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      if (username.toLowerCase() === 'demo') {
        setTimeout(() => {
          setData(MOCK_USER);
          setLoading(false);
        }, 800);
        return;
      }

      const { user, repos, events } = await fetchGitHubData(username);
      const analyzed = analyzeData(user, repos, events);
      setData(analyzed);
    } catch (err) {
      setError(err.message || 'User not found or API rate limit exceeded.');
    } finally {
      if (username.toLowerCase() !== 'demo') setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current || downloading) return;

    setDownloading(true);
    try {
      await new Promise(r => setTimeout(r, 500));

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc, element) => {
          element.style.transform = 'none';
          element.style.display = 'block';
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      pdf.save(`${data.profile.username}-gitprint-report.pdf`);
    } catch (err) {
      console.error('PDF Error:', err);
      alert(`PDF Generation failed. Please use the "Print" button instead.`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 scroll-smooth">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <button 
            onClick={() => { setData(null); setUsername(''); window.scrollTo(0,0); }}
            className="flex items-center gap-2 font-black text-2xl tracking-tighter hover:opacity-70 transition-opacity"
          >
            <div className="bg-slate-900 text-white p-1 rounded-lg">
              <Github className="w-6 h-6" />
            </div>
            GitPrint
          </button>
          <div className="flex items-center gap-8">
            <button 
              onClick={() => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
            >
              About
            </button>
            <a 
              href="https://github.com/zainalshanan/gitprint" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
            >
              Source <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero / Search */}
      <div className="bg-white border-b border-slate-200 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(241,245,249,1)_0%,rgba(255,255,255,0)_100%)] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest mb-8">
            <Zap size={14} className="fill-current" /> Fast, Serverless & Free
          </div>
          <h1 className="text-6xl sm:text-7xl font-black tracking-tight mb-8 text-slate-900 leading-[0.9]">
            Your Code, <br/>
            <span className="text-slate-300 italic font-serif lowercase">on</span> Paper.
          </h1>
          <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-xl mx-auto">
            Generate an aesthetic, high-density A4 report of your GitHub career. 
            Designed for resumes, portfolio attachments, and office walls.
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-lg mx-auto group">
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub Username"
              className="w-full pl-14 pr-4 py-6 rounded-3xl border-4 border-slate-100 focus:border-slate-900 focus:outline-none text-xl font-bold transition-all shadow-sm group-hover:shadow-2xl group-hover:shadow-slate-200"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={32} />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 bg-slate-900 text-white px-10 rounded-2xl font-black hover:bg-slate-800 transition-all disabled:opacity-50 active:scale-95 text-sm tracking-widest"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'GENERATE'}
            </button>
          </form>
          <p className="mt-8 text-xs text-slate-400 font-bold tracking-widest uppercase">
            Quick Start: <button onClick={() => { setUsername('demo'); handleSearch(); }} className="text-slate-900 underline underline-offset-4 hover:text-blue-600 transition-colors">Load Demo Profile</button>
          </p>
          {error && (
            <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border-2 border-red-100 animate-bounce">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        {data ? (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20 sticky top-24 z-40 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                <div>
                  <h2 className="font-black text-slate-900 uppercase tracking-tighter text-lg">Report Generated</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">A4 Format • High Resolution</p>
                </div>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl font-black transition-all uppercase text-xs tracking-widest"
                >
                  <Printer size={20} /> Print
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-black transition-all shadow-xl shadow-slate-900/30 disabled:opacity-50 active:scale-95 uppercase text-xs tracking-widest"
                >
                  {downloading ? (
                    <><Loader2 size={20} className="animate-spin" /> Processing...</>
                  ) : (
                    <><Download size={20} /> Download PDF</>
                  )}
                </button>
              </div>
            </div>

            {/* Print Preview Canvas */}
            <div className="overflow-x-auto rounded-[3rem] pb-20 scrollbar-hide">
              <div className="min-w-[210mm] flex justify-center scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-top transition-all duration-1000 ease-out">
                <PrintLayout ref={printRef} data={data} />
              </div>
            </div>
          </div>
        ) : (
          <div ref={aboutRef} className="space-y-32 py-20">
            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-slate-900/20">
                  <BarChart3 size={32} />
                </div>
                <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">Deep Analytics</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  We don't just count repos. We analyze commit timestamps to map your 
                  <strong> Circadian Rhythm</strong> and visualize your <strong>Language DNA</strong>.
                </p>
              </div>
              <div className="space-y-6">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
                  <Layout size={32} />
                </div>
                <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">Print Perfect</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  Every report is rendered in a pixel-perfect <strong>A4 Aspect Ratio</strong>. 
                  Designed with professional typography and a Swiss-style grid.
                </p>
              </div>
              <div className="space-y-6">
                <div className="w-16 h-16 bg-rose-500 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-rose-500/20">
                  <Smartphone size={32} />
                </div>
                <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">Serverless</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  No databases. No logins. No API keys required. All data processing and PDF 
                  generation happens <strong>entirely in your browser</strong>.
                </p>
              </div>
            </section>

            {/* Tech Stack Section */}
            <section className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full -mr-48 -mt-48" />
              <div className="relative z-10 flex flex-col md:flex-row gap-16 items-center">
                <div className="flex-1 space-y-8">
                  <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Built for the <br/><span className="text-indigo-400">modern web.</span></h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    GitPrint utilizes the latest frontend technologies to ensure speed and precision. 
                    From React 19's concurrent rendering to Tailwind 4's high-performance styling engine.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {['React 19', 'Tailwind v4', 'Vite', 'Recharts', 'Octokit', 'html2canvas'].map(tech => (
                      <span key={tech} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-1/3 grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-white/5 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-4xl font-black text-white mb-2">0</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Server Cost</span>
                  </div>
                  <div className="aspect-square bg-indigo-500 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-4xl font-black text-white mb-2">100</span>
                    <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Privacy</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
          <div className="flex justify-center items-center gap-2 font-black text-2xl tracking-tighter">
            <div className="bg-slate-900 text-white p-1 rounded-lg">
              <Github className="w-6 h-6" />
            </div>
            GitPrint
          </div>
          <div className="flex justify-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
            <button onClick={() => window.scrollTo(0,0)} className="hover:text-slate-900 transition-colors">Home</button>
            <button onClick={() => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-slate-900 transition-colors">About</button>
            <a href="https://github.com/zainalshanan/gitprint" className="hover:text-slate-900 transition-colors">Source</a>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
            Open Source Project by Zain Alshanan • 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;