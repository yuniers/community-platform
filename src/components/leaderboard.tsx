"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Discord from "../../public/icons/discord.svg";
import Github from "../../public/icons/github.svg";
import Telegram from "../../public/icons/telegram.svg";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { generateLeaderboard } from "@/lib/openformat";

interface LeaderboardProps {
  data: LeaderboardEntry[] | null;
  isLoading?: boolean;
  showSocialHandles?: boolean;
  metadata?: {
    user_label: string;
    token_label: string;
  };
  tokens: {
    token: {
      id: string;
      name: string;
      symbol: string;
    };
  }[];
  onTokenSelect?: (tokenId: string) => void;
  slug: string;
}

const LeaderboardHeader = ({ metadata }: Pick<LeaderboardProps, "metadata">) => {
  const t = useTranslations("overview.leaderboard");
  return (
    <TableHeader>
      <TableRow>
        <TableHead>{t("rank")}</TableHead>
        <TableHead>{metadata?.user_label ?? t("user")}</TableHead>
        <TableHead className="text-right">{metadata?.token_label ?? t("points")}</TableHead>
      </TableRow>
    </TableHeader>
  );
};

const LeaderboardSkeleton = () => (
  <Card className="h-full">
    <CardContent className="pt-6">
      <Table>
        <LeaderboardHeader />
        <TableBody>
          {[...Array(7)].map((_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={3}>
                <Skeleton className="h-16 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const EmptyState = ({ metadata }: Pick<LeaderboardProps, "metadata">) => {
  const t = useTranslations("overview.leaderboard");
  return (
    <Card variant="borderless" className="h-full">
      <CardContent>
        <Table>
          <LeaderboardHeader metadata={metadata} />
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                {t("noData")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default function Leaderboard({
  data,
  metadata,
  isLoading: initialLoading = false,
  showSocialHandles = false,
  tokens,
  onTokenSelect,
  slug,
}: LeaderboardProps) {
  const { user } = usePrivy();
  const t = useTranslations('overview.leaderboard');
  const [localData, setLocalData] = useState<LeaderboardEntry[] | null>(data);
  const [isLoading, setIsLoading] = useState(initialLoading);

  const handleTokenSelect = async (tokenId: string) => {
    setIsLoading(true);
    try {
      const newData = await generateLeaderboard(slug, tokenId);
      setLocalData(newData);
    } finally {
      setIsLoading(false);
    }
  };

  const content = isLoading ? (
    <LeaderboardSkeleton />
  ) : !localData || localData.length === 0 || localData?.error ? (
    <EmptyState metadata={metadata} />
  ) : (
    <Card variant="borderless" className="h-full">
      <CardContent>
        <Table>
          <LeaderboardHeader metadata={metadata} />
          <TableBody>
            {localData?.map((entry, index) => {
              const position = index + 1;
              const isCurrentUser =
                user?.wallet?.address && entry.user.toLowerCase() === user?.wallet?.address.toLowerCase();
              const SocialIcon =
                showSocialHandles &&
                (entry.type === "discord"
                  ? Discord
                  : entry.type === "telegram"
                  ? Telegram
                  : entry.type === "github"
                  ? Github
                  : null);

              return (
                <TableRow key={entry.user}>
                  <TableCell>
                    <div
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold",
                        position === 1
                          ? "bg-yellow-500 text-white"
                          : position === 2
                          ? "bg-gray-300 text-gray-800"
                          : position === 3
                          ? "bg-amber-600 text-white"
                          : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
                      )}
                    >
                      {position}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{showSocialHandles ? entry.handle : entry.user}</span>
                      {SocialIcon && (
                        <div className="bg-white rounded-full p-1">
                          <Image src={SocialIcon} alt={entry.type} width={16} height={16} />
                        </div>
                      )}
                      {isCurrentUser && <Badge>You</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{entry.xp_rewarded}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <Card variant="borderless" className="h-full">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Select onValueChange={handleTokenSelect}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('selectToken')} />
            </SelectTrigger>
            <SelectContent>
              {tokens?.map((i) => (
                <SelectItem key={i.token.id} value={i.token.id}>
                  {i.token.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {content}
      </CardContent>
    </Card>
  );
}
