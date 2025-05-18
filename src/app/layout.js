import "./app.scss";
import AuthProvider from '@/provider/AuthProvider'

export const metadata = {
  title: "SS Green Batters",
  description: "SS Green Batters show details and edit details",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

