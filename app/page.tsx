import Hero from "@/components/hero";
import FeaturedProjects from "@/components/featured-projects";
import FeaturedPosts from "@/components/featured-posts";
import Stats from "@/components/stats";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <Stats />
      <FeaturedPosts />
    </>
  );
}
