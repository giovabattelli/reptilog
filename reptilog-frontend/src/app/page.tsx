import Changelog from '@/components/Changelog';
import Header from '@/components/Header';
import { BlurFade } from '@/components/magicui/blur-fade';

export default function Home() {
  return (
    <div>
      <Header />
      <BlurFade delay={0.25} duration={0.4} inView>
        <div className="py-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Reptilog</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Providing changes and updates to your favorite applications
          </p>
        </div>
        <Changelog />
      </BlurFade>
    </div>
  );
}
