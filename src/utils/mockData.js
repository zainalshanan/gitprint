export const MOCK_USER = {
  profile: {
    name: "Alex Dev",
    username: "alexdev",
    bio: "Full-stack enthusiast building tools for builders. Open source contributor.",
    avatar: "https://github.com/shadcn.png",
    location: "San Francisco, CA",
    joined: 2018,
    followers: 1240,
    publicRepos: 45
  },
  stats: {
    topLanguages: [
      { name: "TypeScript", count: 25 },
      { name: "Rust", count: 10 },
      { name: "Go", count: 5 },
      { name: "Python", count: 3 },
      { name: "Swift", count: 2 }
    ],
    clockData: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: (i > 9 && i < 18) ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 10)
    })),
    peakHour: "14:00 - 15:00",
    peakDay: "Tuesday",
    totalStars: 3450,
    totalForks: 420,
    crownJewel: {
      name: "awesome-react-tool",
      description: "A lightning fast CLI for scaffolding React apps with best practices.",
      stars: 1200,
      language: "TypeScript"
    }
  }
};
