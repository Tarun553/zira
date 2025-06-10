"use client"

import React from 'react'
import { cn } from "@/lib/utils"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import companies from "@/data/companies.json";
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

const testimonials = companies.map(company => ({
  author: {
    name: company.name.charAt(0).toUpperCase() + company.name.slice(1),
    handle: `@${company.name}`,
    avatar: company.path
  },
  text: `Zira has revolutionized our workflow, making collaboration seamless and efficient.`,
}));

const CompanyCarousel = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 2000, stopOnInteraction: false })])

  return (
    <section className={cn(
      "bg-background text-foreground",
      "py-12 sm:py-24 md:py-32 px-0",
    )}>
      <div className="mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight">
            Trusted by the world&apos;s best companies
          </h2>
          <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-xl">
            Join thousands of developers who are already building the future with our platform.
          </p>
        </div>

        <div className="overflow-hidden w-full" ref={emblaRef}>
          <div className="flex gap-4 ">
            {testimonials.map((testimonial, i) => (
              <div className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0" key={i}>
                <div className="p-2 h-full">
                  <TestimonialCard {...testimonial} className="h-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CompanyCarousel;