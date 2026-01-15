import { Octokit } from "octokit";

const octokit = new Octokit();

export const fetchGitHubData = async (username) => {
  try {
    // 1. Fetch User Profile
    const { data: user } = await octokit.request('GET /users/{username}', {
      username,
    });

    // 2. Fetch Repos (up to 100 recent ones for stats)
    const { data: repos } = await octokit.request('GET /users/{username}/repos', {
      username,
      sort: 'pushed',
      per_page: 100,
    });

    // 3. Fetch Recent Activity (Events)
    // Note: Public API only returns last 90 days / 300 events
    const { data: events } = await octokit.request('GET /users/{username}/events', {
      username,
      per_page: 100,
    });

    return { user, repos, events };
  } catch (error) {
    console.error("GitHub API Error:", error);
    throw error;
  }
};

export const analyzeData = (user, repos, events) => {
  // --- 1. Language Stats ---
  const languages = {};
  let totalSize = 0;

  repos.forEach(repo => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1; // Count by repo for simplicity in free tier
    }
  });

  const topLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  // --- 2. Activity / "The Clock" ---
  // Analyze push events to find commit times
  const hours = Array(24).fill(0);
  const weekDays = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }; // 0 = Sun
  
  let totalCommits = 0;

  events.forEach(event => {
    if (event.type === 'PushEvent') {
      const date = new Date(event.created_at);
      const hour = date.getHours();
      const day = date.getDay();
      
      const commitCount = event.payload.size || 1;
      hours[hour] += commitCount;
      weekDays[day] += commitCount;
      totalCommits += commitCount;
    }
  });

  const clockData = hours.map((count, hour) => ({ hour, count }));
  
  // Find "Peak Hour"
  const peakHourIndex = hours.indexOf(Math.max(...hours));
  const peakHour = `${peakHourIndex}:00 - ${peakHourIndex + 1}:00`;

  // Find "Productive Day"
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const peakDayIndex = Object.keys(weekDays).reduce((a, b) => weekDays[a] > weekDays[b] ? a : b);
  
  // --- 3. "Crown Jewel" Repo ---
  const topRepo = repos.sort((a, b) => b.stargazers_count - a.stargazers_count)[0];

  return {
    profile: {
      name: user.name || user.login,
      username: user.login,
      bio: user.bio,
      avatar: user.avatar_url,
      location: user.location,
      joined: new Date(user.created_at).getFullYear(),
      followers: user.followers,
      publicRepos: user.public_repos,
    },
    stats: {
      topLanguages,
      clockData,
      peakHour,
      peakDay: days[peakDayIndex],
      totalStars: repos.reduce((acc, r) => acc + r.stargazers_count, 0),
      totalForks: repos.reduce((acc, r) => acc + r.forks_count, 0),
      crownJewel: topRepo ? {
        name: topRepo.name,
        description: topRepo.description,
        stars: topRepo.stargazers_count,
        language: topRepo.language
      } : null
    }
  };
};
