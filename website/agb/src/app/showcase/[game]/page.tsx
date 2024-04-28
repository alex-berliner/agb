import { slugify } from "@/sluggify";
import { Games, ShowcaseGame } from "../games";
import { ContentBlock } from "@/components/contentBlock";
import { ExternalLink } from "@/components/externalLink";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import {
  ScreenshotsWrapper,
  ScreenshotWrapper,
  BackToShowcaseWrapper,
  DescriptionAndScreenshots,
  Description,
} from "./styled";

export async function generateStaticParams() {
  return Games.map((game) => ({
    game: slugify(game.name),
  }));
}

export function getGame(slug: string) {
  const game = Games.find((game) => slugify(game.name) === slug);
  if (!game) {
    throw new Error("Not valid game name, this should never happen");
  }

  return game;
}

export function generateMetadata({ params }: { params: { game: string } }) {
  const game = getGame(params.game);
  return { title: game.name };
}

export default function Page({ params }: { params: { game: string } }) {
  const game = getGame(params.game);
  return <Display game={game} />;
}

function DeveloperNames({ names }: { names: string[] }) {
  if (names.length === 0) {
    throw new Error("You must specify developer names");
  }
  if (names.length === 1) {
    return names[0];
  }
  if (names.length === 2) {
    return names.join(" and ");
  }
  const first = names.slice(0, -1);
  return first.join(", ") + `, and ${names[names.length - 1]}`;
}

function Screenshots({ screenshots }: { screenshots: StaticImageData[] }) {
  return (
    <ScreenshotsWrapper>
      {screenshots.map((screenshot) => (
        <ScreenshotWrapper key={screenshot.src}>
          <Image src={screenshot} alt="" />
        </ScreenshotWrapper>
      ))}
    </ScreenshotsWrapper>
  );
}

function Display({ game }: { game: ShowcaseGame }) {
  return (
    <>
      <ContentBlock color="#AAAFFF">
        <BackToShowcaseWrapper>
          <Link href="../showcase">
            <strong>&lt;</strong> Back to showcase
          </Link>
        </BackToShowcaseWrapper>
        <h1>{game.name}</h1>
        <div>
          By: <DeveloperNames names={game.developers} />
        </div>
      </ContentBlock>
      <ContentBlock>
        <DescriptionAndScreenshots>
          <Description>{game.description}</Description>
          <Screenshots screenshots={game.screenshots} />
        </DescriptionAndScreenshots>
      </ContentBlock>
      <ContentBlock color="#256256">
        {game.itch && (
          <ExternalLink href={game.itch.href}>View on itch.io</ExternalLink>
        )}
      </ContentBlock>
    </>
  );
}
