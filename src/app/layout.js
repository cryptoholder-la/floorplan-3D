import './globals.css'

export const metadata = {
  title: 'Floorplan 3D - Design & CNC',
  description: 'Advanced 3D floorplan design, visualization, and CNC manufacturing platform',
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {children}
        </div>
      </body>
    </html>
  )
}
