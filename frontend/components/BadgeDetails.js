import { Facebook, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BadgeDetails = ({ badge }) => {
  const shareUrl = `https://yourapp.com/badge/${badge.id}`;

  const shareBadge = (platform) => {
    let url;
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(
          `I just earned the "${badge.title}" badge!`
        )}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          shareUrl
        )}&title=${encodeURIComponent(
          badge.title
        )}&summary=${encodeURIComponent(badge.description)}`;
        break;
    }
    window.open(url, "_blank");
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{badge.title}</DialogTitle>
        <DialogDescription>{badge.description}</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center space-y-4">
        <Image
          src={badge.image || "/placeholder.svg"}
          alt={badge.title}
          width={100}
          height={100}
        />
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => shareBadge("facebook")}
          >
            <Facebook className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => shareBadge("twitter")}
          >
            <Twitter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => shareBadge("linkedin")}
          >
            <Linkedin className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default BadgeDetails;
