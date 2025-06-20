import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { BarChart, Layout, Calendar } from "lucide-react";
import CompanyCarousel from "@/components/company-carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqs from "../data/faqs.json";
import { CTA } from "@/components/ui/call-to-action";




const features = [
  {
    title: "Task Management",
    description: "Effortlessly manage your tasks with our intuitive interface.",
    icon: Layout,
  },
  {
    title: "Time Tracking",
    description: "plan and manage sprints effectively, ensuring your team stay focused on dilivering value.",
    icon: Calendar
  },
  {
    title: "comprehensive Reporting",
    description: "gain insights into your team's progress and productivity with our detailed reporting system.",
    icon: BarChart
  }
]


export default function Home() {
  return (
    <div>
      {/* hero section */}
      <section className='flex flex-col justify-center items-center h-screen text-center p-4 pb-60'>
        <h1
          className='text-5xl md:text-6xl font-extrabold tracking-tighter select-none'
          style={{ fontFamily: "'Geist', 'Inter', sans-serif", letterSpacing: '-0.03em' }}
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-300 bg-clip-text text-transparent hover:underline hover:underline-offset-4 hover:animate-pulse">
            Streamline your workflow
          </span>
        </h1>
        <span
          className="my-4 animate-pulse text-7xl md:text-9xl font-extrabold tracking-tighter bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent select-none hover:underline hover:underline-offset-4 hover:animate-pulse"
          style={{ fontFamily: "'Geist', 'Inter', sans-serif", letterSpacing: '-0.03em' }}
        >
          zira
        </span>
        <p className="mt-2 text-lg md:text-xl text-gray-300 max-w-lg pb-7">
          An elegant platform designed to simplify complexity and boost productivity.
        </p>
        <div className="flex gap-4">
          <Link href="/signin">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
          </Link>
          <Link href="#features">
            <Button variant="outline">Learn More</Button>
          </Link>
        </div>
      </section>

      {/* features section */}
      <section id="features" className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-16 md:mb-20 select-none">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {features.map((feature, index) => (
              <SpotlightCard key={index} className="h-full">
                <div className="relative z-10 flex flex-col items-start h-full">
                  <feature.icon className="size-12 mb-4" style={{ color: 'var(--icon-color)' }} />
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--heading-text)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--paragraph-text)' }}>
                    {feature.description}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>



      {/* testimonal section */}
      {/* add crousle */}
      <CompanyCarousel />

      {/* faq section */}
      <section id="faq" className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-16 md:mb-20 select-none">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border-b">
                  <AccordionTrigger className="text-lg font-medium text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-gray-400 pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* call to action */}
      <CTA />
    </div>
  );
}
