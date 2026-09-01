import { PageHero } from "@/components/page/PageHero";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <PageHero
      variant="information"
      eyebrow="Error 404"
      title="This page could not be found."
      lead="The page you requested does not exist, or has moved."
    >
      <Button href={routes.home}>Return to the Academy</Button>
    </PageHero>
  );
}
