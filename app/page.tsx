import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Layout } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
    <BackgroundGradientAnimation>
      <section className="absolute z-50 inset-0 pointer-events-none w-full h-full flex justify-center items-center">
        <div className="relative z-10 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full p-4 bg-white bg-opacity-20 backdrop-blur-2xl">
              <Layout className="w-12 h-12 text-primary" />
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 animate-fade-in-up">
            Welcome to KanbanFlow
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-150">
            Visualize your workflow, optimize your processes, and skyrocket your
            productivity with our intuitive Kanban board solution.
          </p>
          <div className="flex justify-center space-x-4 animate-fade-in-up animation-delay-300 pointer-events-auto">
            <Button asChild size="lg" className="">
              <Link href="/auth" className="flex items-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-gray-900"
            >
              <Link href="/auth">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </BackgroundGradientAnimation>
  );
}
