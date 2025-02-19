"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateTokenVisibility } from "@/db/queries/tokens";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";
import { getChainFromCommunityOrCookie } from "@/lib/openformat";

interface TokenVisibilityManagerProps {
  tokens: any[];
  communityId: string;
  hiddenTokens: string[];
}

export function TokenVisibilityManager({ tokens, communityId, hiddenTokens }: TokenVisibilityManagerProps) {
  const t = useTranslations("tokens");

  const tokenTypes = {
    Base: "ERC20",
    Point: "Points",
  };

  const visibleTokens = tokens.filter(token => !hiddenTokens.includes(token.token.id));
  const hiddenTokensList = tokens.filter(token => hiddenTokens.includes(token.token.id));

  const handleToggleVisibility = async (tokenId: string, hidden: boolean) => {
    try {
      const result = await updateTokenVisibility(communityId, tokenId, hidden);
      if (result.success) {
        toast.success(hidden ? t("tokenHidden") : t("tokenUnhidden"));
      } else {
        toast.error(t("errorUpdatingVisibility"));
      }
    } catch (error) {
      toast.error(t("errorUpdatingVisibility"));
    }
  };

  const TokenRow = ({ token, isHidden }: { token: any; isHidden: boolean }) => (
    <div key={token.token.id} className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-12">
        <div className="min-w-[200px]">
          <h3 className="font-medium">{token.token.name}</h3>
          <p className="text-sm text-muted-foreground">{token.token.symbol}</p>
        </div>
        <div className="min-w-[200px]">
          <span className="text-sm text-muted-foreground">Token ID:</span>
          <div className="font-mono text-sm">{token.token.id}</div>
        </div>
        <div className="min-w-[120px]">
          <span className="text-sm text-muted-foreground">Type:</span>
          <div>{tokenTypes[token.token.tokenType as keyof typeof tokenTypes]}</div>
        </div>
        <div className="min-w-[150px]">
          <span className="text-sm text-muted-foreground">Created:</span>
          <div>{timeAgo(Number(token.token.createdAt))}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => handleToggleVisibility(token.token.id, !isHidden)}
        >
          {isHidden ? t("unhideToken") : t("hideToken")}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Visible Tokens */}
      <Card>
        <CardHeader>
          <CardTitle>{t("visibleTokens")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visibleTokens.map((token) => (
              <TokenRow key={token.token.id} token={token} isHidden={false} />
            ))}
            {visibleTokens.length === 0 && (
              <p className="text-center text-muted-foreground py-4">{t("noVisibleTokens")}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden Tokens */}
      <Card>
        <CardHeader>
          <CardTitle>{t("hiddenTokens")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hiddenTokensList.map((token) => (
              <TokenRow key={token.token.id} token={token} isHidden={true} />
            ))}
            {hiddenTokensList.length === 0 && (
              <p className="text-center text-muted-foreground py-4">{t("noHiddenTokens")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}