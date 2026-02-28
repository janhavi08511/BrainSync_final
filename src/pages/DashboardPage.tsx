import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslationStats, getTranslations } from "@/db/api";
import type { TranslationStats, Translation } from "@/types";
import {
  ArrowRight,
  Type,
  Image,
  Music,
  Mic,
  FileText,
  Binary,
  Headphones,
  Clock,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { StatsCards } from "@/components/dashboard/StatsCards";

import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<TranslationStats>({
    total: 0,
    byMethod: { text: 0, image: 0, audio: 0, microphone: 0, file: 0, braille: 0 },
  });
  const [recentTranslations, setRecentTranslations] = useState<Translation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [statsData, translationsData] = await Promise.all([
        getTranslationStats(),
        getTranslations(5),
      ]);
      setStats(statsData);
      setRecentTranslations(translationsData);
      setIsLoading(false);
    };

    loadData();
  }, []);


const methodIcons = {
  text: Type,
  image: Image,
  audio: Headphones,
  microphone: Mic,
  file: FileText,
  braille: Binary,
};


  // statCards array was previously declared but unused; component uses <StatsCards /> instead.

  return (
    <div className="min-h-screen gradient-mesh relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="mb-10 fade-in">
          <h1 className="text-5xl font-bold mb-3">
            <span className="gradient-text text-shadow-soft">
              {t("dashboard.title")}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("dashboard.subtitle")}
          </p>
        </div>

        <div className="mb-10">
          <StatsCards />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card className="glass-card border-2 hover:border-primary/30 transition-all">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                {t("dashboard.recentTranslations.title")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("dashboard.recentTranslations.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground text-center py-12 text-lg">
                  {t("common.loading")}
                </p>
              ) : recentTranslations.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/5 flex items-center justify-center">
                    <FileText className="w-10 h-10 text-primary/40" />
                  </div>
                  <p className="text-muted-foreground text-lg mb-2">
                    {t("dashboard.recentTranslations.empty")}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {t("dashboard.recentTranslations.emptySubtitle")}
                  </p>
                  <Button asChild className="btn-gradient">
                    <Link to="/translate">
                      <Type className="mr-2 w-4 h-4" />
                      {t("landing.cta.button")}
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTranslations.map((translation, index) => {
                    const method = translation.translation_type || translation.input_method || "text";
                    const Icon = methodIcons[method as keyof typeof methodIcons];
                    return (
                      <div
                        key={translation.id}
                        className="group flex items-start gap-4 p-4 rounded-xl border-2 border-border hover:border-primary/40 hover:shadow-medium transition-all bg-card/50 backdrop-blur-sm slide-in-left"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold truncate mb-1 group-hover:text-primary transition-colors">
                            {translation.input_text}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {translation.created_at
                              ? new Date(translation.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Button
                asChild
                variant="outline"
                className="w-full mt-6 h-12 text-base hover:btn-gradient hover:text-white transition-all"
              >
                <Link to="/history">
                  {t("dashboard.recentTranslations.viewAll")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-2 hover:border-primary/30 transition-all">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                {t("dashboard.quickActions.title")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("dashboard.quickActions.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                asChild
                className="btn-gradient w-full justify-start h-14 text-base shadow-medium hover:shadow-strong transition-all"
                size="lg"
              >
                <Link to="/translate">
                  <Type className="mr-3 w-6 h-6" />
                  {t("dashboard.quickActions.newTranslation")}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start h-14 text-base border-2 hover:border-primary/40 hover:shadow-medium transition-all"
                size="lg"
              >
                <Link to="/history">
                  <FileText className="mr-3 w-6 h-6" />
                  {t("dashboard.quickActions.viewHistory")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
