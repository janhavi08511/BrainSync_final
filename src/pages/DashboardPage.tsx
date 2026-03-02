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

  const [recentTranslations, setRecentTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [statsData, translationsData] = await Promise.all([
          getTranslationStats(),
          getTranslations(5),
        ]);

        setStats(statsData);
        setRecentTranslations(translationsData);
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setIsLoading(false);
      }
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

  return (
    <div className="min-h-screen gradient-mesh relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 py-10 relative z-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3">
            <span className="gradient-text">
              {t("dashboard.title")}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("dashboard.subtitle")}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-10">
          <StatsCards />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* Recent Translations */}
          <Card className="border-2 hover:border-primary/30 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                {t("dashboard.recentTranslations.title")}
              </CardTitle>
              <CardDescription>
                {t("dashboard.recentTranslations.subtitle")}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <p className="text-center py-12 text-muted-foreground">
                  {t("common.loading")}
                </p>
              ) : recentTranslations.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground">
                  {t("dashboard.recentTranslations.empty")}
                </p>
              ) : (
                <div className="space-y-3">
                  {recentTranslations.map((translation) => {
                    const method =
                      translation.translation_type ||
                      translation.input_method ||
                      "text";

                    const Icon =
                      methodIcons[method as keyof typeof methodIcons] || Type;

                    const inputPreview =
                      translation.source_text ||
                      translation.input_text ||
                      "";

                    const outputPreview =
                      translation.braille_output ||
                      translation.translated_text ||
                      "";

                    return (
                      <div
                        key={translation.id}
                        className="flex items-start gap-4 p-4 rounded-xl border hover:border-primary/40 transition-all bg-muted/20"
                      >
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">
                            {inputPreview || "No text available"}
                          </p>

                          {outputPreview && (
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {outputPreview}
                            </p>
                          )}

                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {translation.created_at
                              ? new Date(translation.created_at).toLocaleDateString()
                              : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <Button asChild variant="outline" className="w-full mt-6">
                <Link to="/history">
                  {t("dashboard.recentTranslations.viewAll")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2 hover:border-primary/30 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                {t("dashboard.quickActions.title")}
              </CardTitle>
              <CardDescription>
                {t("dashboard.quickActions.subtitle")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link to="/translate">
                  <Type className="mr-2 w-5 h-5" />
                  {t("dashboard.quickActions.newTranslation")}
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full" size="lg">
                <Link to="/history">
                  <FileText className="mr-2 w-5 h-5" />
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