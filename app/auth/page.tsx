'use client';

import { Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useContainerSize } from '@/hooks/use-container-size';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import FlickeringGrid from '@/components/ui/flickering-grid';
import ShineBorder from '@/components/ui/shine-border';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import LoginForm from '@/components/auth/login-form';
import RegisterForm from '@/components/auth/register-form';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerSize(containerRef);
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab') === 'register' ? 'register' : 'login';

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative min-h-screen w-full overflow-clip">
      <div className="absolute inset-0" ref={containerRef}>
        <FlickeringGrid
          className="w-full h-full [mask-image:radial-gradient(500px_circle_at_50%_50%,white,transparent)] md:[mask-image:radial-gradient(700px_circle_at_60%_50%,white,transparent)]"
          squareSize={5}
          gridGap={6}
          color="#60A5FA"
          maxOpacity={0.5}
          flickerChance={0.2}
          height={height}
          width={width}
        />
      </div>
      <div className="relative min-h-screen w-full grid place-items-center md:grid-cols-2 md:gap-4 px-4">
        <div className="md:col-start-2">
          <ShineBorder
            className="w-full max-w-lg mx-auto bg-card"
            color={['#60A5FA', '#A78BFA', '#34D399']}
          >
            <Card className="border-none bg-transparent w-full max-w-lg min-h-[605px]">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">
                  Welcome to Kanban
                </CardTitle>
                <CardDescription>
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent className="mx-auto">
                <Tabs
                  defaultValue={tab}
                  className="w-full max-w-lg mx-auto overflow-hidden px-0.5"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  <Suspense fallback={<RefreshCcw className="mx-auto animate-spin" />}>
                    <AnimatePresence mode="wait" initial={false}>
                      <TabsContent
                        value="login"
                        className="mt-6 h-[480px] w-[435px]"
                        key={tab}
                      >
                        <motion.div
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: { type: 'spring', stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                          }}
                          custom={-1}
                        >
                          <LoginForm />
                        </motion.div>
                      </TabsContent>
                      <TabsContent
                        value="register"
                        className="mt-6 h-[480px] w-[435px] mx-2 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent"
                        key={tab}
                      >
                        <motion.div
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: 'spring', stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 },
                        }}
                        custom={1}
                        >
                        <RegisterForm />
                        </motion.div>
                      </TabsContent>
                    </AnimatePresence>
                  </Suspense>
                </Tabs>
              </CardContent>
            </Card>
          </ShineBorder>
        </div>
      </div>
    </div>
  );
}
