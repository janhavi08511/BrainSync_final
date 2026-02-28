import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Type,
  Image,
  Music,
  Mic,
  Volume2,
  History,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const features = [
    {
      icon: Type,
      title: "Text Input",
      description: "Type or paste text directly for instant Braille conversion",
      link: "/translate?tab=text",
    },
    {
      icon: Image,
      title: "Image Recognition",
      description:
        "Upload images containing text for automatic extraction and conversion",
      link: "/translate?tab=image",
    },
    {
      icon: Music,
      title: "Audio Upload",
      description: "Upload audio files to transcribe and convert to Braille",
      link: "/translate?tab=audio",
    },
    {
      icon: Mic,
      title: "Voice Recording",
      description: "Record your voice in real-time for instant transcription",
      link: "/translate?tab=microphone",
    },
    {
      icon: Volume2,
      title: "Audio Playback",
      description: "Listen to your text with high-quality text-to-speech",
      link: "/translate?tab=text",
    },
    {
      icon: History,
      title: "Translation History",
      description: "Access and manage all your previous translations",
      link: "/history",
    },
  ];

  return (
    <div className="min-h-screen gradient-mesh relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-20 space-y-6 fade-in relative pb-8">
          {/* Slideshow images behind title with dark overlay */}
          <div className="absolute inset-0 left-1/2 -translate-x-1/2 top-0 overflow-hidden pointer-events-none z-0 w-full h-full rounded-3xl">
            <div className="relative w-full h-full">
              {/* Dark overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 rounded-3xl z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1400&h=600&fit=crop"
                alt="Writing and learning"
                className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl animate-carousel-fade"
                style={{ animationDelay: "0s" }}
              />
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&h=600&fit=crop"
                alt="Collaboration"
                className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl animate-carousel-fade"
                style={{ animationDelay: "5s" }}
              />
              <img
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1400&h=600&fit=crop"
                alt="Reading and education"
                className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl animate-carousel-fade"
                style={{ animationDelay: "10s" }}
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-lg rounded-full border-2 border-white/50 mb-4 relative z-20 mt-16">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">
              Powered by Advanced OCR & AI
            </span>
          </div>
          <h1 className="text-6xl xl:text-7xl font-bold leading-tight relative z-20">
            <span className="text-white">Braille Translator</span>
          </h1>
          <p className="text-xl xl:text-2xl text-white max-w-3xl mx-auto leading-relaxed relative z-20 font-medium mb-8">
            Transform text into Braille with cutting-edge technology. Multiple
            input methods, instant results, and seamless accessibility.
          </p>
          <div className="flex gap-6 justify-center pt-2 flex-wrap relative z-20 pb-16">
            <Button
              asChild
              size="lg"
              className="liquid-button text-white border-0 text-base px-10 py-7 h-auto rounded-2xl bg-gradient-to-br from-primary via-primary-glow to-accent backdrop-blur-xl shadow-[0_8px_32px_rgba(31,38,135,0.37)] border border-white/20 hover:shadow-[0_12px_40px_rgba(31,38,135,0.5)] hover:scale-105 transition-all duration-300"
            >
              <Link to="/translate">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="liquid-button text-white text-base px-10 py-7 h-auto rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/30 shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:bg-white/20 hover:border-white/50 hover:shadow-[0_12px_40px_rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-300"
            >
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link} className="block group">
              <Card
                className="premium-card hover-glow smooth-transition border-2 hover:border-primary/30 slide-up h-full cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-primary-glow to-secondary flex items-center justify-center shadow-strong group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-primary via-primary-glow to-secondary text-white border-0 shadow-strong overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <CardContent className="p-10 xl:p-16 relative z-10">
            <div className="flex flex-col xl:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center xl:text-left">
                <h2 className="text-4xl font-bold text-shadow-soft">
                  Ready to get started?
                </h2>
                <p className="text-lg text-white/90 max-w-2xl">
                  Join thousands of users who trust our platform for accurate,
                  fast, and accessible Braille translations
                </p>
              </div>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="shadow-medium hover:shadow-strong transition-all px-8 py-6 h-auto text-base font-semibold"
              >
                <Link to="/translate">
                  Start Translating Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
