import 'bootstrap/dist/css/bootstrap.min.css';
import LayoutUI from "../../components/LayoutUI";

export const metadata = {
  title: "Trends Fashion store",
  description: "India's one of trending online fashion store",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <LayoutUI>{children}</LayoutUI>
      </body>
    </html>
  );
}
