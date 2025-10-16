import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Users, Briefcase, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">YouthGuide NA</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl">
            Your Trusted Guide to{" "}
            <span className="bg-gradient-warm bg-clip-text text-transparent">
              Opportunities
            </span>{" "}
            in Windhoek
          </h2>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Free jobs, training, courses, and community events — all in one place.
            Built for youth in Havana, by people who care.
          </p>
          <Button
            size="lg"
            className="bg-gradient-warm text-lg shadow-medium"
            onClick={() => navigate("/auth")}
          >
            Get Started — It's Free
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 shadow-soft">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Find Jobs</h3>
            <p className="text-muted-foreground">
              Discover local jobs and gigs that match your skills — free and paid opportunities.
            </p>
          </Card>

          <Card className="p-6 shadow-soft">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
              <GraduationCap className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Free Training</h3>
            <p className="text-muted-foreground">
              Access short courses, apprenticeships, and skills programs — most are completely free.
            </p>
          </Card>

          <Card className="p-6 shadow-soft">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Community Support</h3>
            <p className="text-muted-foreground">
              Connect with local organizations and events. Get help from people who understand Havana.
            </p>
          </Card>
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-card p-8 shadow-medium md:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="mb-4 text-2xl font-bold">Built with You, For You</h3>
            <p className="mb-6 text-muted-foreground">
              YouthGuide NA was created through conversations with young people in Havana.
              We only share verified opportunities from trusted sources like the City Youth Desk,
              NUST Outreach, and local community organizations.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span>✓ 100% Free</span>
              <span>✓ No Spam</span>
              <span>✓ Your Privacy Matters</span>
              <span>✓ Mobile-Friendly</span>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="mb-4 text-3xl font-bold">Ready to Find Your Next Opportunity?</h3>
        <p className="mb-8 text-lg text-muted-foreground">
          Join other youth in Windhoek who are already discovering new paths.
        </p>
        <Button
          size="lg"
          className="bg-gradient-warm text-lg shadow-medium"
          onClick={() => navigate("/auth")}
        >
          Start Chatting Now
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 YouthGuide NA — A research project to empower youth in Windhoek</p>
          <p className="mt-2">Your data stays private. We never share your information.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
