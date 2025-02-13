import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const plans = [
  {
    name: 'Basic',
    price: '$9',
    description: 'Essential features for small teams',
    features: [
      'Up to 5 users',
      'Basic analytics',
      'Email support',
      '5GB storage',
    ],
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'Perfect for growing businesses',
    features: [
      'Up to 20 users',
      'Advanced analytics',
      'Priority support',
      '50GB storage',
      'Custom integrations',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited users',
      'Custom analytics',
      '24/7 support',
      'Unlimited storage',
      'Custom development',
      'SLA guarantee',
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Pricing Plans</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Choose the perfect plan for your needs
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-3xl font-bold">{plan.price}</div>
                <div className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}