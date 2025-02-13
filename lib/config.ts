export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "AuthSystem",
  description: "A secure authentication system for your next project",
  links: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/yourusername/project",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com/yourusername"
  }
}

export const walletsConfig = {
  itemsPerPage: 15,
  maxDisplayedPages: 5 // Optional: for limiting number of pagination buttons shown
}