import Header from './Header';
import Footer from './Footer';

export function Layout({children, title}) {
  return (
    <div className="flex flex-col min-h-screen antialiased bg-neutral-50">
      <Header title={title} />

      <main
        role="main"
        id="mainContent"
        // className="flex-grow p-6 md:p-8 lg:p-12"
        className="flex-grow "
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
