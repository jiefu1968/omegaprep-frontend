import 'katex/dist/katex.min.css'
import './globals.css'

export const metadata = {
  title: 'OmegaPrep — Aprovação nos melhores vestibulares',
  description: 'Preparação com IA para ITA, IME, FUVEST, ENEM e muito mais',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
