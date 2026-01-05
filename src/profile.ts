export type LinkedInProfile = {
  profileUrl: string
  name: string
  headline: string
  location?: string
  company?: string
  avatarUrl?: string
  bannerUrl?: string
}

export const linkedInProfile: LinkedInProfile = {
  profileUrl: 'https://www.linkedin.com/in/paul-g-beauchamp/',
  name: 'Paul Beauchamp',
  headline: 'Backend Software Engineer • 18 years experience',
  location: 'Burnaby, BC, Canada',
  company: 'Electronic Arts',
  avatarUrl: '/profile-image.jpeg',
  bannerUrl: '/background-linkedin.jpeg'
}
