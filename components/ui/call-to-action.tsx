import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BGPattern } from "@/components/bg-pattern";

function CTA() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="relative flex flex-col text-center rounded-md p-4 lg:p-14 gap-8 items-center overflow-hidden">
          <BGPattern variant="dots" mask="fade-edges" size={24} fill="#404040" className="z-0" />
          <div className="relative z-10 flex flex-col items-center gap-8">
            <div>
              <Badge>Get started</Badge>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
                Ready to Streamline Your Projects with Zira?
              </h3>
              <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
                Zira is designed to simplify complexity and boost your team&apos;s productivity. Ditch the clunky spreadsheets and scattered notes. Embrace a seamless workflow and start delivering results faster.
              </p>
            </div>
            <div className="flex flex-row gap-4">
              <Button className="gap-4" variant="outline">
                Book a Demo <PhoneCall className="w-4 h-4" />
              </Button>
              <Button className="gap-4">
                Get Started for Free <MoveRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CTA };
