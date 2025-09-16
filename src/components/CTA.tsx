import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function CTA() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-800 via-purple-600 to-pink-500 p-16 text-center shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Vehicle?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Contact us today for a consultation and quote. Our team is ready to help restore your vehicle to its former glory.
            </p>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
              <Link href="/contact" className="flex items-center gap-2 mx-auto">
                <MessageSquare className="h-5 w-5" />
                Get a Quote
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
