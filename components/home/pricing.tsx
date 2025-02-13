import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckIcon, MinusIcon } from "lucide-react";
import React from "react";

interface PlanFeature {
  type: string;
  features: {
    name: string;
    free: boolean;
    startup: boolean;
    team: boolean;
    enterprise: boolean;
  }[];
}

const planFeatures: PlanFeature[] = [
  {
    type: "Core Features",
    features: [
      {
        name: "Email Verification",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "Two-Factor Authentication",
        free: false,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "Device Fingerprinting",
        free: false,
        startup: true,
        team: true,
        enterprise: true,
      },
    ],
  },
  {
    type: "Security Features",
    features: [
      {
        name: "Rate Limiting",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "CSRF Protection",
        free: true,
        startup: true,
        team: true,
        enterprise: true,
      },
      {
        name: "Advanced Security Rules",
        free: false,
        startup: true,
        team: true,
        enterprise: true,
      },
    ],
  },
];

export default function PricingSectionCards() {
  const [isAnnual, setIsAnnual] = React.useState(false)

  return (
    <section className="py-24 lg:py-32">
      <div className="container max-w-[1400px] mx-auto px-8 lg:px-16">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose the plan that's right for you
          </p>
        </div>

        {/* Switch */}
        <div className="flex justify-center items-center mb-10">
          <Label htmlFor="payment-schedule" className="me-3">
            Monthly
          </Label>
          <Switch 
            id="payment-schedule"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <Label htmlFor="payment-schedule" className="relative ms-3">
            Annual
            <span className="absolute -top-10 start-auto -end-28">
              <span className="flex items-center">
                <svg
                  className="w-14 h-8 -me-6"
                  width={45}
                  height={25}
                  viewBox="0 0 45 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                    fill="currentColor"
                    className="text-muted-foreground"
                  />
                </svg>
                <Badge className="mt-3 uppercase">Save up to 10%</Badge>
              </span>
            </span>
          </Label>
        </div>

        {/* Grid */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {/* Free Card */}
          <Card className="flex flex-col">
            <CardHeader className="text-center pb-2">
              <CardTitle className="mb-4">Free</CardTitle>
              <div className="font-bold text-5xl">$0</div>
              <CardDescription className="mt-2">
                Perfect for side projects
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-primary" />
                  <span>Email verification</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-primary" />
                  <span>Basic rate limiting</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-primary" />
                  <span>CSRF protection</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full" variant="outline">
                Get Started
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Card */}
          <Card className="flex flex-col border-primary">
            <CardHeader className="text-center pb-2">
              <div className="mb-3">
                <Badge className="uppercase">Popular</Badge>
              </div>
              <CardTitle className="mb-4">Premium</CardTitle>
              <div className="font-bold text-5xl">
                ${isAnnual ? '108' : '10'}
              </div>
              <CardDescription className="mt-2">
                {isAnnual ? 'Billed annually' : 'Billed monthly'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-primary" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-primary" />
                  <span>Two-factor authentication</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-primary" />
                  <span>Device fingerprinting</span>
                </li>
                <li className="flex space-x-2">
                  <CheckIcon className="flex-shrink-0 h-5 w-5 text-primary" />
                  <span>Advanced security rules</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button className="w-full">
                Get Started
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Comparison Table */}
        <div className="mt-20 max-w-4xl mx-auto">
          <Table className="hidden lg:table">
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="w-1/2">Features</TableHead>
                <TableHead className="text-center">Free</TableHead>
                <TableHead className="text-center">Premium</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planFeatures.map((featureType) => (
                <React.Fragment key={featureType.type}>
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={3} className="font-bold">
                      {featureType.type}
                    </TableCell>
                  </TableRow>
                  {featureType.features.map((feature) => (
                    <TableRow key={feature.name}>
                      <TableCell>{feature.name}</TableCell>
                      <TableCell className="text-center">
                        {feature.free ? (
                          <CheckIcon className="h-5 w-5 mx-auto text-primary" />
                        ) : (
                          <MinusIcon className="h-5 w-5 mx-auto text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <CheckIcon className="h-5 w-5 mx-auto text-primary" />
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}
