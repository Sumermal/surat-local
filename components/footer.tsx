"use client"

import Link from "next/link"
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { translations } from "@/lib/translations"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">Surat Local</span>
                <span className="text-xs text-muted-foreground">सूरत लोकल</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your complete guide to discovering the best of Surat. Find restaurants, shops, services, and more.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/areas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("areas", translations.areas)}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("categories", translations.categories)}
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("search", translations.search)}
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("submitListing", translations.submitListing)}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("aboutUs", translations.aboutUs)}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("contactUs", translations.contactUs)}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("privacyPolicy", translations.privacyPolicy)}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("termsOfService", translations.termsOfService)}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Surat, Gujarat, India</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:info@suratlocal.com" className="hover:text-foreground transition-colors">
                  info@suratlocal.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-foreground transition-colors">
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Surat Local. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
