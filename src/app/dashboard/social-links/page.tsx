import { getAllSocialLinks } from '@/lib/data/social-links'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { SocialLinksManager } from './SocialLinksManager'

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
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Social Links</h1>
      </div>

      <div className="card">
        <SocialLinksManager
          existingLinks={existingLinks}
          platforms={SOCIAL_PLATFORMS}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
