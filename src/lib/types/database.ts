export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          type: number
          images: string[]
          gallery_images: string[]
          title_italic: string
          title_regular: string
          location: string
          year: string
          href: string
          show_marquee: boolean
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
          // Bilingual fields
          title_italic_en: string | null
          title_italic_ar: string | null
          title_regular_en: string | null
          title_regular_ar: string | null
          location_en: string | null
          location_ar: string | null
          category_en: string | null
          category_ar: string | null
          // Rich content fields
          description_en: string | null
          description_ar: string | null
          client_en: string | null
          client_ar: string | null
          area: string | null
          scope_en: string | null
          scope_ar: string | null
          challenge_en: string | null
          challenge_ar: string | null
          solution_en: string | null
          solution_ar: string | null
        }
        Insert: {
          id?: string
          type: number
          images?: string[]
          gallery_images?: string[]
          title_italic: string
          title_regular: string
          location: string
          year: string
          href: string
          show_marquee?: boolean
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Bilingual fields
          title_italic_en?: string | null
          title_italic_ar?: string | null
          title_regular_en?: string | null
          title_regular_ar?: string | null
          location_en?: string | null
          location_ar?: string | null
          category_en?: string | null
          category_ar?: string | null
          // Rich content fields
          description_en?: string | null
          description_ar?: string | null
          client_en?: string | null
          client_ar?: string | null
          area?: string | null
          scope_en?: string | null
          scope_ar?: string | null
          challenge_en?: string | null
          challenge_ar?: string | null
          solution_en?: string | null
          solution_ar?: string | null
        }
        Update: {
          id?: string
          type?: number
          images?: string[]
          gallery_images?: string[]
          title_italic?: string
          title_regular?: string
          location?: string
          year?: string
          href?: string
          show_marquee?: boolean
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Bilingual fields
          title_italic_en?: string | null
          title_italic_ar?: string | null
          title_regular_en?: string | null
          title_regular_ar?: string | null
          location_en?: string | null
          location_ar?: string | null
          category_en?: string | null
          category_ar?: string | null
          // Rich content fields
          description_en?: string | null
          description_ar?: string | null
          client_en?: string | null
          client_ar?: string | null
          area?: string | null
          scope_en?: string | null
          scope_ar?: string | null
          challenge_en?: string | null
          challenge_ar?: string | null
          solution_en?: string | null
          solution_ar?: string | null
        }
      }
      testimonials: {
        Row: {
          id: string
          name: string
          rating: number
          text: string
          image_url: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
          // Bilingual fields
          name_en: string | null
          name_ar: string | null
          text_en: string | null
          text_ar: string | null
        }
        Insert: {
          id?: string
          name: string
          rating: number
          text: string
          image_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Bilingual fields
          name_en?: string | null
          name_ar?: string | null
          text_en?: string | null
          text_ar?: string | null
        }
        Update: {
          id?: string
          name?: string
          rating?: number
          text?: string
          image_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Bilingual fields
          name_en?: string | null
          name_ar?: string | null
          text_en?: string | null
          text_ar?: string | null
        }
      }
      hero_slides: {
        Row: {
          id: string
          image_url: string
          alt_text: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
          // Bilingual fields
          alt_text_en: string | null
          alt_text_ar: string | null
        }
        Insert: {
          id?: string
          image_url: string
          alt_text?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Bilingual fields
          alt_text_en?: string | null
          alt_text_ar?: string | null
        }
        Update: {
          id?: string
          image_url?: string
          alt_text?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Bilingual fields
          alt_text_en?: string | null
          alt_text_ar?: string | null
        }
      }
      offices: {
        Row: {
          id: string
          city: string
          country: string
          phone: string
          phone_href: string
          email: string | null
          email_href: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
          // Bilingual fields
          city_en: string | null
          city_ar: string | null
          country_en: string | null
          country_ar: string | null
        }
        Insert: {
          id?: string
          city: string
          country: string
          phone: string
          phone_href: string
          email?: string | null
          email_href?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Bilingual fields
          city_en?: string | null
          city_ar?: string | null
          country_en?: string | null
          country_ar?: string | null
        }
        Update: {
          id?: string
          city?: string
          country?: string
          phone?: string
          phone_href?: string
          email?: string | null
          email_href?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Bilingual fields
          city_en?: string | null
          city_ar?: string | null
          country_en?: string | null
          country_ar?: string | null
        }
      }
      services: {
        Row: {
          id: string
          name: string
          icon: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
          // Bilingual fields
          name_en: string | null
          name_ar: string | null
          description_en: string | null
          description_ar: string | null
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Bilingual fields
          name_en?: string | null
          name_ar?: string | null
          description_en?: string | null
          description_ar?: string | null
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Bilingual fields
          name_en?: string | null
          name_ar?: string | null
          description_en?: string | null
          description_ar?: string | null
        }
      }
      work_stages: {
        Row: {
          id: string
          stage_number: string
          title: string
          description: string
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
          // Bilingual fields
          title_en: string | null
          title_ar: string | null
          description_en: string | null
          description_ar: string | null
        }
        Insert: {
          id?: string
          stage_number: string
          title: string
          description: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Bilingual fields
          title_en?: string | null
          title_ar?: string | null
          description_en?: string | null
          description_ar?: string | null
        }
        Update: {
          id?: string
          stage_number?: string
          title?: string
          description?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Bilingual fields
          title_en?: string | null
          title_ar?: string | null
          description_en?: string | null
          description_ar?: string | null
        }
      }
      team_info: {
        Row: {
          id: string
          title_lines: string[]
          description_paragraphs: string[]
          image_url: string
          years_experience: number
          projects_count: number
          countries_count: number
          created_at: string
          updated_at: string
          // Bilingual fields
          title_lines_en: string[] | null
          title_lines_ar: string[] | null
          description_paragraphs_en: string[] | null
          description_paragraphs_ar: string[] | null
        }
        Insert: {
          id?: string
          title_lines?: string[]
          description_paragraphs?: string[]
          image_url: string
          years_experience?: number
          projects_count?: number
          countries_count?: number
          created_at?: string
          updated_at?: string
          // Bilingual fields
          title_lines_en?: string[] | null
          title_lines_ar?: string[] | null
          description_paragraphs_en?: string[] | null
          description_paragraphs_ar?: string[] | null
        }
        Update: {
          id?: string
          title_lines?: string[]
          description_paragraphs?: string[]
          image_url?: string
          years_experience?: number
          projects_count?: number
          countries_count?: number
          created_at?: string
          updated_at?: string
          // Bilingual fields
          title_lines_en?: string[] | null
          title_lines_ar?: string[] | null
          description_paragraphs_en?: string[] | null
          description_paragraphs_ar?: string[] | null
        }
      }
      social_links: {
        Row: {
          id: string
          platform: string
          icon_url: string
          href: string
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
          // Bilingual fields
          platform_en: string | null
          platform_ar: string | null
        }
        Insert: {
          id?: string
          platform: string
          icon_url: string
          href: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Bilingual fields
          platform_en?: string | null
          platform_ar?: string | null
        }
        Update: {
          id?: string
          platform?: string
          icon_url?: string
          href?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Bilingual fields
          platform_en?: string | null
          platform_ar?: string | null
        }
      }
      form_submissions: {
        Row: {
          id: string
          object_location: string | null
          service: string
          user_name: string
          phone: string
          email: string
          status: 'new' | 'read' | 'replied' | 'archived'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          object_location?: string | null
          service: string
          user_name: string
          phone: string
          email: string
          status?: 'new' | 'read' | 'replied' | 'archived'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          object_location?: string | null
          service?: string
          user_name?: string
          phone?: string
          email?: string
          status?: 'new' | 'read' | 'replied' | 'archived'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Convenience type exports
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type Testimonial = Database['public']['Tables']['testimonials']['Row']
export type TestimonialInsert = Database['public']['Tables']['testimonials']['Insert']
export type TestimonialUpdate = Database['public']['Tables']['testimonials']['Update']

export type HeroSlide = Database['public']['Tables']['hero_slides']['Row']
export type HeroSlideInsert = Database['public']['Tables']['hero_slides']['Insert']
export type HeroSlideUpdate = Database['public']['Tables']['hero_slides']['Update']

export type Office = Database['public']['Tables']['offices']['Row']
export type OfficeInsert = Database['public']['Tables']['offices']['Insert']
export type OfficeUpdate = Database['public']['Tables']['offices']['Update']

export type Service = Database['public']['Tables']['services']['Row']
export type ServiceInsert = Database['public']['Tables']['services']['Insert']
export type ServiceUpdate = Database['public']['Tables']['services']['Update']

export type WorkStage = Database['public']['Tables']['work_stages']['Row']
export type WorkStageInsert = Database['public']['Tables']['work_stages']['Insert']
export type WorkStageUpdate = Database['public']['Tables']['work_stages']['Update']

export type TeamInfo = Database['public']['Tables']['team_info']['Row']
export type TeamInfoInsert = Database['public']['Tables']['team_info']['Insert']
export type TeamInfoUpdate = Database['public']['Tables']['team_info']['Update']

export type SocialLink = Database['public']['Tables']['social_links']['Row']
export type SocialLinkInsert = Database['public']['Tables']['social_links']['Insert']
export type SocialLinkUpdate = Database['public']['Tables']['social_links']['Update']

export type FormSubmission = Database['public']['Tables']['form_submissions']['Row']
export type FormSubmissionInsert = Database['public']['Tables']['form_submissions']['Insert']
export type FormSubmissionUpdate = Database['public']['Tables']['form_submissions']['Update']

export type SiteSetting = Database['public']['Tables']['site_settings']['Row']
export type SiteSettingInsert = Database['public']['Tables']['site_settings']['Insert']
export type SiteSettingUpdate = Database['public']['Tables']['site_settings']['Update']

// Locale type for bilingual support
export type Locale = 'en' | 'ar'

// Helper function to get localized field
export function getLocalizedField<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: Locale
): string {
  const localizedKey = `${field}_${locale}` as keyof T
  const fallbackKey = `${field}_en` as keyof T
  const legacyKey = field as keyof T

  return (item[localizedKey] as string) || (item[fallbackKey] as string) || (item[legacyKey] as string) || ''
}
