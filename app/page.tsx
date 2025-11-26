import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Pill, Stethoscope, Microscope, FileText, Calendar, Heart, Shield, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold gradient-text gradient-bg-primary">
            HealthCare
          </Link>
          <div className="space-x-2">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-healthcare-purple hover:bg-healthcare-blue" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-healthcare-blue/10 to-white py-20 md:py-32">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] opacity-10 bg-center bg-cover"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text gradient-bg-primary">
                Your Health, Our Priority
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Access healthcare services, book appointments, order medicines, and more - all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-healthcare-purple hover:bg-healthcare-blue text-white" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-healthcare-purple text-healthcare-purple hover:bg-healthcare-purple/10"
                  asChild
                >
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-healthcare-teal/20 blur-3xl"></div>
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-healthcare-pink/20 blur-3xl"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text gradient-bg-secondary">
                Comprehensive Healthcare Services
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need for your health and wellness journey in one platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Stethoscope className="h-10 w-10 text-healthcare-purple" />}
                title="Doctor Consultations"
                description="Find specialists and book appointments online"
                link="/doctors"
                color="bg-healthcare-purple/10"
                hoverColor="hover:bg-healthcare-purple/20"
              />
              <FeatureCard
                icon={<Pill className="h-10 w-10 text-healthcare-pink" />}
                title="Medicine Delivery"
                description="Order medicines online and get them delivered"
                link="/medicines"
                color="bg-healthcare-pink/10"
                hoverColor="hover:bg-healthcare-pink/20"
              />
              <FeatureCard
                icon={<Microscope className="h-10 w-10 text-healthcare-blue" />}
                title="Lab Tests"
                description="Book lab tests and get results online"
                link="/lab-tests"
                color="bg-healthcare-blue/10"
                hoverColor="hover:bg-healthcare-blue/20"
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-healthcare-teal" />}
                title="Health Articles"
                description="Read articles on health and wellness"
                link="/articles"
                color="bg-healthcare-teal/10"
                hoverColor="hover:bg-healthcare-teal/20"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-b from-white to-healthcare-blue/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text gradient-bg-accent">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Simple steps to access healthcare services</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <StepCard
                number="1"
                title="Create an Account"
                description="Register with your email and set up your profile"
                color="bg-healthcare-blue"
              />
              <StepCard
                number="2"
                title="Choose a Service"
                description="Select from doctor consultations, medicines, or lab tests"
                color="bg-healthcare-purple"
              />
              <StepCard
                number="3"
                title="Book or Order"
                description="Schedule appointments or place orders with a few clicks"
                color="bg-healthcare-pink"
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text gradient-bg-warm">Why Choose Us</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Benefits that make us the preferred healthcare platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <BenefitCard
                icon={<Calendar className="h-8 w-8 text-healthcare-yellow" />}
                title="Convenient Scheduling"
                description="Book appointments anytime, anywhere without waiting on hold"
              />
              <BenefitCard
                icon={<Shield className="h-8 w-8 text-healthcare-green" />}
                title="Secure & Private"
                description="Your health data is protected with enterprise-grade security"
              />
              <BenefitCard
                icon={<Heart className="h-8 w-8 text-healthcare-red" />}
                title="Personalized Care"
                description="Receive healthcare recommendations tailored to your needs"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-healthcare-blue to-healthcare-purple text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of users who have simplified their healthcare journey with our platform.
            </p>
            <Button size="lg" className="bg-white text-healthcare-purple hover:bg-gray-100" asChild>
              <Link href="/register">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-text gradient-bg-accent">HealthCare</h3>
              <p className="text-gray-400">Your comprehensive healthcare platform for all your medical needs.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-healthcare-teal">Services</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/doctors" className="text-gray-400 hover:text-healthcare-teal">
                    Find Doctors
                  </Link>
                </li>
                <li>
                  <Link href="/medicines" className="text-gray-400 hover:text-healthcare-teal">
                    Order Medicines
                  </Link>
                </li>
                <li>
                  <Link href="/lab-tests" className="text-gray-400 hover:text-healthcare-teal">
                    Book Lab Tests
                  </Link>
                </li>
                <li>
                  <Link href="/articles" className="text-gray-400 hover:text-healthcare-teal">
                    Health Articles
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-healthcare-purple">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-healthcare-purple">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-healthcare-purple">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-healthcare-purple">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-healthcare-purple">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-healthcare-pink">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-healthcare-pink">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-healthcare-pink">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-healthcare-pink">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} HealthCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  link,
  color,
  hoverColor,
}: {
  icon: React.ReactNode
  title: string
  description: string
  link: string
  color: string
  hoverColor: string
}) {
  return (
    <Card className={`border-none shadow-md card-hover ${color} ${hoverColor}`}>
      <CardHeader className="pb-2">
        <div className="mb-2">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full" asChild>
          <Link href={link}>Learn More</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function StepCard({
  number,
  title,
  description,
  color,
}: {
  number: string
  title: string
  description: string
  color: string
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`w-16 h-16 rounded-full ${color} text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-lg`}
      >
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="border-none shadow-md card-hover">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 p-3 rounded-full bg-gray-100">{icon}</div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
