import SmoothScroll from '@/components/SmoothScroll';
import Cursor from '@/components/Cursor';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Statement from '@/components/Statement';
import Product from '@/components/Product';
import Rails from '@/components/Rails';
import Features from '@/components/Features';
import Security from '@/components/Security';
import Developers from '@/components/Developers';
import Metrics from '@/components/Metrics';
import Access from '@/components/Access';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SmoothScroll />
      <Cursor />
      <Nav />
      <main id="main">
        <Hero />
        <Statement />
        <Product />
        <Rails />
        <Features />
        <Security />
        <Developers />
        <Metrics />
        <Access />
      </main>
      <Footer />
    </>
  );
}
