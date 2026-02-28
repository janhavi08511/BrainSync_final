import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Calendar, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { getTranslationStats } from "@/db/api";
import type { TranslationStats } from "@/types";

export const StatsCards = () => {
  const [stats, setStats] = useState<TranslationStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getTranslationStats();
    setStats(data);
  };

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="skeleton h-4 w-20 rounded"></div>
              <div className="skeleton w-8 h-8 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="skeleton h-8 w-16 rounded mb-2"></div>
              <div className="skeleton h-3 w-24 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Translations",
      value: stats.total,
      icon: BarChart3,
      description: "All time",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Text Translations",
      value: stats.byMethod.text,
      icon: Activity,
      description: "Via text input",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Image Translations",
      value: stats.byMethod.image,
      icon: TrendingUp,
      description: "Via OCR",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Audio Translations",
      value: stats.byMethod.audio + stats.byMethod.microphone,
      icon: Calendar,
      description: "Via speech",
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="glass-card hover-glow scale-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient}`}
            >
              <card.icon className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
