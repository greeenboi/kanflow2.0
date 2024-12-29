'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Check, X, AlertCircle, Sparkles } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { toast } from 'sonner'


const plans = [
  {
    name: 'Free',
    price: 0,
    subtitle: 'For Personal Projects',
    features: {
      overview: {
        users: '1 users per team'
      },
      included: ['Basic feature set', 'Up to 1 projects', '∞ Boards', 'Community support'],
      notIncluded: ['Priority support', 'Custom integrations']
    },
    value: 'free',
    icon: (
      <Image src="/logo.png" alt='logo' width={40} height={40} priority/>
    )
  },
  {
    name: 'Basic',
    price: 50,
    subtitle: 'For open source projects',
    features: {
      overview: {
        users: '10 users'
      },
      included: ['Advanced features', 'Up to 10 projects', '∞ Boards', 'Email support'],
      notIncluded: ['Custom integrations']
    },
    value: 'basic',
    icon: (
      <Image src="/logo.png" alt='logo' width={40} height={40} priority/>
    )
  },
  {
    name: 'Team',
    price: 100,
    subtitle: 'For small teams',
    features: {
      overview: {
        users: '50 users'
      },
      included: ['All Basic features', 'Priority support', '∞ Boards', 'Team collaboration'],
      notIncluded: ['Enterprise features']
    },
    value: 'team',
    recommended: true,
    icon: (
      <Image src="/logo.png" alt='logo' width={40} height={40} priority/>
    )
  },
  {
    name: 'Enterprise',
    price: 200,
    subtitle: 'For large teams',
    features: {
      overview: {
        users: 'Unlimited users'
      },
      included: ['All Team features', 'Custom integrations', 'Dedicated support', 'SLA guarantee'],
      notIncluded: []
    },
    value: 'enterprise',
    icon: (
      <Image src="/logo.png" alt='logo' width={40} height={40} priority/>
    )
  }
]

export default function PlanSettings() {
  const [selectedPlan, setSelectedPlan] = useState('free')
  const [tempSelectedPlan, setTempSelectedPlan] = useState('free')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)

  const handlePlanChange = (value: string) => {
    if (selectedPlan === 'free' && value !== 'free') {
      toast.custom(t => (
        <div className="w-[var(--width)] rounded-lg border border-border bg-background px-4 py-3">
          <div className="flex gap-2">
            <div className="flex grow gap-3">
              <Sparkles
                className="mt-0.5 shrink-0 text-blue-500"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              <div className="flex grow justify-between gap-12">
                <p className="text-sm">Coming soon!</p>
                <div className="whitespace-nowrap text-sm">
                  <button
                    type="button"
                    className="text-sm font-medium hover:underline"
                    onClick={() => toast.dismiss(t)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
              onClick={() => toast.dismiss(t)}
              aria-label="Close banner"
            >
              <X
                size={16}
                strokeWidth={2}
                className="opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      ));
      return;
    }

    setTempSelectedPlan(value);
    setIsDialogOpen(true);
  }

  const confirmPlanChange = () => {
    setSelectedPlan(tempSelectedPlan)
    console.log(`Plan updated to ${tempSelectedPlan}`)
    setIsDialogOpen(false)
  }

  const cancelPlanChange = () => {
    setTempSelectedPlan(selectedPlan)
    setIsDialogOpen(false)
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
        <p className="text-muted-foreground mb-8">Choose the perfect plan for your needs</p>
        <div className="flex items-center justify-center gap-2">
          <Label htmlFor="annual">Annual billing</Label>
          <Switch
            id="annual"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
        </div>
      </div>

      <RadioGroup 
        value={selectedPlan} 
        onValueChange={handlePlanChange} 
        className="grid gap-6 md:grid-cols-4"
      >
        {plans.map((plan) => (
          <Card 
            key={plan.value} 
            className={`relative overflow-hidden transition-all cursor-pointer hover:border-primary/50
              ${selectedPlan === plan.value ? 'border-primary shadow-lg scale-105' : ''}
            `}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-2 py-1">
                Recommended
              </div>
            )}
            <CardHeader className="text-center">
              <div className="mx-auto text-muted-foreground">{plan.icon}</div>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.subtitle}</CardDescription>
              <div className="text-3xl font-bold mt-4">
                ${isAnnual ? plan.price * 10 : plan.price}
                <span className="text-sm font-normal text-muted-foreground">/monthly</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handlePlanChange(plan.value)}
              >
                Get started for free
              </Button>
              
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-3">OVERVIEW</h3>
                <p className="text-sm">{plan.features.overview.users}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-3">HIGHLIGHTS</h3>
                <ul className="space-y-2">
                  {plan.features.included.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="w-4 h-4 mr-2 text-primary" />
                      {feature}
                    </li>
                  ))}
                  {plan.features.notIncluded.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-muted-foreground">
                      <X className="w-4 h-4 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <RadioGroupItem value={plan.value} id={plan.value} className="sr-only" />
            </CardContent>
          </Card>
        ))}
      </RadioGroup>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Plan Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change your plan to {plans.find(p => p.value === tempSelectedPlan)?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelPlanChange}>
              Cancel
            </Button>
            <Button onClick={confirmPlanChange}>
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-6 flex items-center justify-center">
        <div className="flex items-center text-warning">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="text-sm">Prices shown in USD. Changes will be reflected on your next billing cycle.</span>
        </div>
      </div>
    </div>
  )
}

