import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Layout from '@/components/layout/Layout'
import GalleryPage from '@/pages/GalleryPage'
import AboutPage from '@/pages/AboutPage'
import ContributePage from '@/pages/ContributePage'
import FaqPage from '@/pages/FaqPage'
import NotFoundPage from '@/pages/NotFoundPage'
import { IllustrationProvider } from '@/context/IllustrationContext'
import { AccentProvider } from '@/context/AccentContext'
import { ThemeProvider } from '@/context/ThemeContext'
export default function App() {
  return (
    <>
      <ThemeProvider>
        <AccentProvider>
          <IllustrationProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<GalleryPage />} />
                  <Route path="/illustrations/:slug" element={<GalleryPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contribute" element={<ContributePage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </IllustrationProvider>
        </AccentProvider>
      </ThemeProvider>
      <Analytics />
    </>
  )
}
