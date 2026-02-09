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
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

// Mapping Tailwind slate colors to Hex for html2canvas compatibility (avoids oklch error)
const COLORS = {
  slate900: '#0f172a',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748b',
  slate400: '#94a3b8',
  slate200: '#e2e8f0',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
  white: '#ffffff',
  yellow500: '#eab308',
  yellow600: '#ca8a04',
};

const PrintLayout = forwardRef(({ data }, ref) => {
  const { profile, stats } = data;

  return (
    <div className="w-full flex justify-center p-8 bg-gray-100 min-h-screen">
      {/* A4 Container */}
      <div 
        ref={ref}
        className="shadow-2xl relative overflow-hidden text-slate-900"
        style={{ 
          width: '210mm', 
          height: '297mm', 
          padding: '12mm', 
          backgroundColor: COLORS.white,
          color: COLORS.slate900
        }}
      >
        {/* Decorative Header Bar */}
        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: COLORS.slate900 }} />

        {/* Header Section */}
        <header className="flex justify-between items-start mb-12 pb-6 border-b-2" style={{ borderColor: COLORS.slate900 }}>
          <div className="flex gap-6 items-center">
            <img 
              src={profile.avatar} 
              alt={profile.username}
              className="w-24 h-24 rounded-full border-4 grayscale"
              style={{ borderColor: COLORS.slate900 }}
            />
            <div>
              <h1 className="text-4xl font-black tracking-tight uppercase" style={{ color: COLORS.slate900 }}>{profile.name}</h1>
              <p className="text-xl font-mono" style={{ color: COLORS.slate500 }}>@{profile.username}</p>
              <div className="flex gap-4 mt-3 text-sm font-medium" style={{ color: COLORS.slate600 }}>
                <span className="flex items-center gap-1"><MapPin size={14}/> {profile.location || 'Remote'}</span>
                <span className="flex items-center gap-1"><Calendar size={14}/> Since {profile.joined}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: COLORS.slate400 }}>Annual Report</h2>
            <p className="text-4xl font-black" style={{ color: COLORS.slate900 }}>{new Date().getFullYear()}</p>
          </div>
        </header>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-3 gap-6 h-[75%]">
          
          {/* Column 1: Core Stats */}
          <div className="col-span-1 flex flex-col gap-6">
            <div className="p-6 border rounded-lg" style={{ backgroundColor: COLORS.slate50, borderColor: COLORS.slate200 }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLORS.slate400 }}>Profile</h3>
              <p className="text-sm leading-relaxed font-serif italic" style={{ color: COLORS.slate700 }}>
                "{profile.bio || 'No bio provided.'}"
              </p>
            </div>

            <div className="p-6 rounded-lg text-white" style={{ backgroundColor: COLORS.slate900 }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: COLORS.slate400 }}>Impact</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-black flex items-center gap-2">
                    <Users size={24} style={{ color: COLORS.slate400 }} /> {profile.followers}
                  </div>
                  <div className="text-xs uppercase tracking-wider mt-1" style={{ color: COLORS.slate500 }}>Followers</div>
                </div>
                <div>
                  <div className="text-3xl font-black flex items-center gap-2">
                    <Star size={24} style={{ color: COLORS.yellow500 }} /> {stats.totalStars}
                  </div>
                  <div className="text-xs uppercase tracking-wider mt-1" style={{ color: COLORS.slate500 }}>Total Stars</div>
                </div>
                <div>
                  <div className="text-3xl font-black flex items-center gap-2">
                    <GitFork size={24} style={{ color: COLORS.slate400 }} /> {stats.totalForks}
                  </div>
                  <div className="text-xs uppercase tracking-wider mt-1" style={{ color: COLORS.slate500 }}>Total Forks</div>
                </div>
              </div>
            </div>

            {stats.crownJewel && (
              <div className="p-6 rounded-lg border-2 flex-1" style={{ borderColor: COLORS.slate900 }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: COLORS.yellow600 }}>
                  <Award size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">Crown Jewel</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{stats.crownJewel.name}</h3>
                <p className="text-xs mb-4 line-clamp-3" style={{ color: COLORS.slate600 }}>{stats.crownJewel.description}</p>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="px-2 py-1 rounded" style={{ backgroundColor: COLORS.slate100 }}>{stats.crownJewel.language}</span>
                  <span className="flex items-center gap-1"><Star size={12}/> {stats.crownJewel.stars}</span>
                </div>
              </div>
            )}
          </div>

          {/* Column 2 & 3: Deep Dive */}
          <div className="col-span-2 flex flex-col gap-6">
            
            <div className="bg-white border p-6 rounded-lg shadow-sm" style={{ borderColor: COLORS.slate200 }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: COLORS.slate400 }}>
                <Code2 size={16} /> Language DNA
              </h3>
              <div className="space-y-4">
                {stats.topLanguages.map((lang, idx) => (
                  <div key={lang.name} className="flex items-center gap-4">
                    <span className="w-24 text-sm font-bold text-right">{lang.name}</span>
                    <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.slate100 }}>
                      <div 
                        className="h-full" 
                        style={{ 
                          width: `${(lang.count / stats.topLanguages[0].count) * 100}%`,
                          backgroundColor: COLORS.slate900
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono w-8" style={{ color: COLORS.slate400 }}>{lang.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1">
              <div className="border p-6 rounded-lg" style={{ borderColor: COLORS.slate200 }}>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: COLORS.slate400 }}>
                  <Clock size={16} /> Circadian Rhythm
                </h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.clockData}>
                      <Bar dataKey="count" fill={COLORS.slate900} radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                  <p className="text-xs uppercase" style={{ color: COLORS.slate500 }}>Peak Productivity</p>
                  <p className="text-lg font-bold">{stats.peakHour}</p>
                </div>
              </div>

              <div className="p-6 rounded-lg flex flex-col justify-center items-center text-center" style={{ backgroundColor: COLORS.slate50 }}>
                <div className="mb-6">
                  <Zap size={48} className="mb-2 mx-auto" style={{ color: COLORS.slate200 }} />
                  <p className="text-xs uppercase" style={{ color: COLORS.slate500 }}>Most Active Day</p>
                  <p className="text-2xl font-black">{stats.peakDay}</p>
                </div>
                <div className="w-full border-t pt-6" style={{ borderColor: COLORS.slate200 }}>
                  <p className="text-xs uppercase" style={{ color: COLORS.slate500 }}>Public Repos</p>
                  <p className="text-4xl font-black" style={{ color: COLORS.slate900 }}>{profile.publicRepos}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-12 right-12 border-t-2 pt-4 flex justify-between items-center text-xs font-mono" style={{ borderColor: COLORS.slate900, color: COLORS.slate400 }}>
          <span>Generated by GitPrint</span>
          <span>github.com/{profile.username}</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
});

export default PrintLayout;