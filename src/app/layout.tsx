import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "House of Edtech - CRUD App",
  description: "A CRUD application for managing courses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased bg-slate-50">
        <main className="flex-1">{children}</main>
        <footer className="border-t bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 text-sm text-gray-600">
            <span>© {new Date().getFullYear()} House of Edtech</span>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/babluV"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub - babluV"
                className="text-gray-500 transition hover:text-gray-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.997.108-.775.418-1.305.76-1.605-2.665-.304-5.467-1.335-5.467-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.624-5.48 5.92.43.37.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.286 0 .32.19.694.8.576C20.565 21.796 24 17.297 24 12 24 5.37 18.63 0 12 0Z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/bablu-kumarmehta/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn - Bablu Kumar Mehta"
                className="text-gray-500 transition hover:text-gray-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452H16.89v-5.182c0-1.236-.025-2.828-1.722-2.828-1.722 0-1.985 1.347-1.985 2.74v5.27H9.626V9h3.41v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.6 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.988 1.988 0 1 1 0-3.976 1.988 1.988 0 0 1 0 3.976zM7.119 20.452H3.556V9h3.563v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.728v20.543C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.728C24 .774 23.2 0 22.222 0z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

