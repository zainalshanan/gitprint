import React, { forwardRef } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  GitFork, 
  Code2, 
  Clock, 
  Zap,
  Award
} from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const PrintLayout = forwardRef(({ data }, ref) => {
  const { profile, stats } = data;

  return (
    <div className="w-full flex justify-center p-8 bg-gray-100 min-h-screen">
      {/* A4 Container - exact dimensions for print */}
      <div 
        ref={ref}
        className="bg-white text-slate-900 shadow-2xl relative overflow-hidden"
        style={{ width: '210mm', height: '297mm', padding: '12mm' }}
      >
        {/* Decorative Header Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-900" />

        {/* Header Section */}
        <header className="flex justify-between items-start mb-12 border-b-2 border-slate-900 pb-6">
          <div className="flex gap-6 items-center">
            <img 
              src={profile.avatar} 
              alt={profile.username}
              className="w-24 h-24 rounded-full border-4 border-slate-900 grayscale"
            />
            <div>
              <h1 className="text-4xl font-black tracking-tight uppercase">{profile.name}</h1>
              <p className="text-xl text-slate-500 font-mono">@{profile.username}</p>
              <div className="flex gap-4 mt-3 text-sm font-medium text-slate-600">
                <span className="flex items-center gap-1"><MapPin size={14}/> {profile.location || 'Remote'}</span>
                <span className="flex items-center gap-1"><Calendar size={14}/> Since {profile.joined}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Annual Report</h2>
            <p className="text-4xl font-black text-slate-900">{new Date().getFullYear()}</p>
          </div>
        </header>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-3 gap-6 h-[75%]">
          
          {/* Column 1: Core Stats */}
          <div className="col-span-1 flex flex-col gap-6">
            {/* Bio Card */}
            <div className="bg-slate-50 p-6 border border-slate-200 rounded-lg">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Profile</h3>
              <p className="text-sm leading-relaxed font-serif italic text-slate-700">
                "{profile.bio || 'No bio provided.'}"
              </p>
            </div>

            {/* Impact Numbers */}
            <div className="bg-slate-900 text-white p-6 rounded-lg">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Impact</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-black flex items-center gap-2">
                    <Users size={24} className="text-slate-400" /> {profile.followers}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Followers</div>
                </div>
                <div>
                  <div className="text-3xl font-black flex items-center gap-2">
                    <Star size={24} className="text-yellow-500" /> {stats.totalStars}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Total Stars</div>
                </div>
                <div>
                  <div className="text-3xl font-black flex items-center gap-2">
                    <GitFork size={24} className="text-slate-400" /> {stats.totalForks}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">Total Forks</div>
                </div>
              </div>
            </div>

            {/* Crown Jewel */}
            {stats.crownJewel && (
              <div className="border-2 border-slate-900 p-6 rounded-lg flex-1">
                <div className="flex items-center gap-2 mb-2 text-yellow-600">
                  <Award size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">Crown Jewel</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{stats.crownJewel.name}</h3>
                <p className="text-xs text-slate-600 mb-4 line-clamp-3">{stats.crownJewel.description}</p>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="bg-slate-100 px-2 py-1 rounded">{stats.crownJewel.language}</span>
                  <span className="flex items-center gap-1"><Star size={12}/> {stats.crownJewel.stars}</span>
                </div>
              </div>
            )}
          </div>

          {/* Column 2 & 3: Deep Dive */}
          <div className="col-span-2 flex flex-col gap-6">
            
            {/* Top Languages Bar */}
            <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Code2 size={16} /> Language DNA
              </h3>
              <div className="space-y-4">
                {stats.topLanguages.map((lang, idx) => (
                  <div key={lang.name} className="flex items-center gap-4">
                    <span className="w-24 text-sm font-bold text-right">{lang.name}</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-900" 
                        style={{ width: `${(lang.count / stats.topLanguages[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-400 w-8">{lang.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Clock & Productivity */}
            <div className="grid grid-cols-2 gap-6 flex-1">
              <div className="border border-slate-200 p-6 rounded-lg">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                  <Clock size={16} /> Circadian Rhythm
                </h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.clockData}>
                      <Bar dataKey="count" fill="#0f172a" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                  <p className="text-xs text-slate-500 uppercase">Peak Productivity</p>
                  <p className="text-lg font-bold">{stats.peakHour}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg flex flex-col justify-center items-center text-center">
                <div className="mb-6">
                  <Zap size={48} className="text-slate-300 mb-2 mx-auto" />
                  <p className="text-xs text-slate-500 uppercase">Most Active Day</p>
                  <p className="text-2xl font-black">{stats.peakDay}</p>
                </div>
                <div className="w-full border-t border-slate-200 pt-6">
                  <p className="text-xs text-slate-500 uppercase">Public Repos</p>
                  <p className="text-4xl font-black text-slate-900">{profile.publicRepos}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-12 right-12 border-t-2 border-slate-900 pt-4 flex justify-between items-center text-xs font-mono text-slate-400">
          <span>Generated by GitPrint</span>
          <span>github.com/{profile.username}</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
});

export default PrintLayout;
