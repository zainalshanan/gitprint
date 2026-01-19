import React, { useState, useRef } from 'react';
import { Search, Download, Printer, Github, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PrintLayout from './components/PrintLayout';
import { fetchGitHubData, analyzeData } from './services/github';
import { MOCK_USER } from './utils/mockData';

function App() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null); // Set to MOCK_USER to test immediately if needed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const printRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Check for mock trigger
      if (username.toLowerCase() === 'demo') {
        setTimeout(() => {
          setData(MOCK_USER);
          setLoading(false);
        }, 1000);
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
    if (!printRef.current) return;

    const canvas = await html2canvas(printRef.current, {
      scale: 2, // Higher resolution
      useCORS: true, // Allow fetching images (avatars)
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${data.profile.username}-gitprint.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-xl tracking-tight">
            <Github className="w-8 h-8" />
            GitPrint
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900">About</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900">GitHub</a>
          </div>
        </div>
      </nav>

      {/* Hero / Search */}
      <div className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-slate-900">
            Your Code, <span className="text-slate-400">On Paper.</span>
          </h1>
          <p className="text-lg text-slate-500 mb-8">
            Generate a beautiful, A4-printable annual report of your GitHub activity. 
            Perfect for resumes, portfolios, or your office wall.
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub Username (e.g., 'torvalds')"
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-slate-200 focus:border-slate-900 focus:outline-none text-lg font-medium transition-colors"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-6 rounded-full font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Generate'}
            </button>
          </form>
          <p className="mt-4 text-xs text-slate-400 font-medium">
            Try <button onClick={() => { setUsername('demo'); handleSearch({ preventDefault: () => {} }) }} className="underline hover:text-slate-900">demo</button> to see an example.
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200 sticky top-20 z-40">
              <h2 className="font-bold text-slate-900">Preview</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                >
                  <Printer size={18} /> Print
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-bold transition-colors shadow-lg shadow-slate-900/20"
                >
                  <Download size={18} /> Download PDF
                </button>
              </div>
            </div>

            {/* Print Preview Canvas */}
            <div className="overflow-auto pb-12">
              <div className="min-w-[210mm] flex justify-center scale-[0.5] sm:scale-[0.7] md:scale-[0.85] lg:scale-100 origin-top transition-transform duration-500">
                <PrintLayout ref={printRef} data={data} />
              </div>
            </div>
          </div>
        )}

        {!data && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white rounded-lg border border-slate-200 border-dashed flex items-center justify-center">
                <span className="text-slate-300 font-bold text-lg">Example Preview</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;