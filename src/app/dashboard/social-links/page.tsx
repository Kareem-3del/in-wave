import { getAllSocialLinks } from '@/lib/data/social-links'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { SocialLinksManager } from './SocialLinksManager'

// Platform categories for better organization
export const PLATFORM_CATEGORIES = {
  social: {
    name: 'Social Networks',
    icon: 'mdi:account-group',
    platforms: ['facebook', 'instagram', 'twitter', 'linkedin', 'threads', 'snapchat']
  },
  media: {
    name: 'Media & Content',
    icon: 'mdi:play-circle',
    platforms: ['youtube', 'tiktok', 'twitch', 'vimeo', 'spotify', 'soundcloud']
  },
  design: {
    name: 'Design & Portfolio',
    icon: 'mdi:palette',
    platforms: ['behance', 'dribbble', 'deviantart', 'artstation', 'pixels', 'unsplash', 'flickr']
  },
  messaging: {
    name: 'Messaging',
    icon: 'mdi:message',
    platforms: ['whatsapp', 'telegram', 'discord', 'slack', 'skype']
  },
  developer: {
    name: 'Developer',
    icon: 'mdi:code-braces',
    platforms: ['github', 'gitlab', 'medium', 'reddit']
  },
  business: {
    name: 'Business & Shopping',
    icon: 'mdi:store',
    platforms: ['pinterest', 'etsy', 'shopify', 'amazon', 'ebay', 'patreon', 'kofi']
  },
  contact: {
    name: 'Contact & Other',
    icon: 'mdi:contacts',
    platforms: ['email', 'phone', 'website', 'rss', 'paypal', 'venmo', 'cashapp', 'tumblr']
  }
}

// Predefined social platforms with Iconify icons
export const SOCIAL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: 'mdi:facebook' },
  { id: 'instagram', name: 'Instagram', icon: 'mdi:instagram' },
  { id: 'twitter', name: 'Twitter/X', icon: 'ri:twitter-x-fill' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'mdi:linkedin' },
  { id: 'youtube', name: 'YouTube', icon: 'mdi:youtube' },
  { id: 'tiktok', name: 'TikTok', icon: 'ic:baseline-tiktok' },
  { id: 'pinterest', name: 'Pinterest', icon: 'mdi:pinterest' },
  { id: 'behance', name: 'Behance', icon: 'mdi:behance' },
  { id: 'dribbble', name: 'Dribbble', icon: 'mdi:dribbble' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'mdi:whatsapp' },
  { id: 'telegram', name: 'Telegram', icon: 'mdi:telegram' },
  { id: 'snapchat', name: 'Snapchat', icon: 'mdi:snapchat' },
  { id: 'threads', name: 'Threads', icon: 'ri:threads-fill' },
  { id: 'discord', name: 'Discord', icon: 'ic:baseline-discord' },
  { id: 'slack', name: 'Slack', icon: 'mdi:slack' },
  { id: 'github', name: 'GitHub', icon: 'mdi:github' },
  { id: 'gitlab', name: 'GitLab', icon: 'mdi:gitlab' },
  { id: 'medium', name: 'Medium', icon: 'mdi:medium' },
  { id: 'reddit', name: 'Reddit', icon: 'mdi:reddit' },
  { id: 'tumblr', name: 'Tumblr', icon: 'mdi:tumblr' },
  { id: 'twitch', name: 'Twitch', icon: 'mdi:twitch' },
  { id: 'vimeo', name: 'Vimeo', icon: 'mdi:vimeo' },
  { id: 'spotify', name: 'Spotify', icon: 'mdi:spotify' },
  { id: 'soundcloud', name: 'SoundCloud', icon: 'mdi:soundcloud' },
  { id: 'skype', name: 'Skype', icon: 'mdi:skype' },
  { id: 'flickr', name: 'Flickr', icon: 'mdi:flickr' },
  { id: 'deviantart', name: 'DeviantArt', icon: 'mdi:deviantart' },
  { id: 'artstation', name: 'ArtStation', icon: 'simple-icons:artstation' },
  { id: 'pixels', name: 'Pixels', icon: 'simple-icons:500px' },
  { id: 'unsplash', name: 'Unsplash', icon: 'simple-icons:unsplash' },
  { id: 'patreon', name: 'Patreon', icon: 'mdi:patreon' },
  { id: 'kofi', name: 'Ko-fi', icon: 'simple-icons:kofi' },
  { id: 'etsy', name: 'Etsy', icon: 'mdi:etsy' },
  { id: 'shopify', name: 'Shopify', icon: 'mdi:shopify' },
  { id: 'amazon', name: 'Amazon', icon: 'mdi:amazon' },
  { id: 'ebay', name: 'eBay', icon: 'mdi:ebay' },
  { id: 'paypal', name: 'PayPal', icon: 'mdi:paypal' },
  { id: 'venmo', name: 'Venmo', icon: 'simple-icons:venmo' },
  { id: 'cashapp', name: 'Cash App', icon: 'simple-icons:cashapp' },
  { id: 'email', name: 'Email', icon: 'mdi:email' },
  { id: 'phone', name: 'Phone', icon: 'mdi:phone' },
  { id: 'website', name: 'Website', icon: 'mdi:web' },
  { id: 'rss', name: 'RSS', icon: 'mdi:rss' },
]

async function handleSave(links: { platform: string; href: string; display_order: number }[]) {
  'use server'
  const supabase = await createClient()

  // Delete all existing links
  await supabase.from('social_links').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // Insert new links
  if (links.length > 0) {
    const insertData = links.map((link, index) => {
      const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform)
      return {
        platform: platform?.name || link.platform,
        icon_url: platform?.icon || 'mdi:link',
        href: link.href,
        display_order: index,
        is_active: true,
      }
    })

    await supabase.from('social_links').insert(insertData)
  }

  revalidatePath('/dashboard/social-links')
}

export default async function SocialLinksPage() {
  const links = await getAllSocialLinks()

  // Convert existing links to platform IDs
  const existingLinks = links.map(link => {
    const platform = SOCIAL_PLATFORMS.find(
      p => p.name.toLowerCase() === link.platform.toLowerCase() ||
           p.id === link.platform.toLowerCase()
    )
    return {
      platform: platform?.id || link.platform.toLowerCase(),
      href: link.href,
      display_order: link.display_order,
    }
  })

  return (
    <div className="fade-in social-links-page">
      {/* Page Header */}
      <div className="social-page-header">
        <div className="social-page-header-content">
          <div className="social-page-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
          </div>
          <div className="social-page-text">
            <h1 className="social-page-title">Social Links</h1>
            <p className="social-page-desc">
              Connect your social media profiles. These links appear in your website footer and contact sections.
              Drag to reorder, and they&apos;ll display in the same order on your site.
            </p>
          </div>
        </div>
        <div className="social-page-stats">
          <div className="social-stat">
            <span className="social-stat-value">{existingLinks.length}</span>
            <span className="social-stat-label">Active Links</span>
          </div>
          <div className="social-stat">
            <span className="social-stat-value">{SOCIAL_PLATFORMS.length - existingLinks.length}</span>
            <span className="social-stat-label">Available</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="social-links-container">
        <SocialLinksManager
          existingLinks={existingLinks}
          platforms={SOCIAL_PLATFORMS}
          categories={PLATFORM_CATEGORIES}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
