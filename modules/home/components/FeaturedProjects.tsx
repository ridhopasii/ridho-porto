import Link from "next/link";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import { BiLinkExternal, BiLogoGithub } from "react-icons/bi";
import { getProjectsData } from "@/services/projects";
import { ProjectItem } from "@/common/types/projects";

const FeaturedProjects = async () => {
  // getProjectsData memetakan kolom DB (imageUrl→image, featured→is_featured,
  // showOnHome→is_show, tags→stacks, dst). Query mentah ke tabel tidak punya
  // field-field tersebut, jadi wajib lewat service ini.
  let all: ProjectItem[] = [];
  try {
    all = (await getProjectsData()) as ProjectItem[];
  } catch {
    return null;
  }

  const featuredProjects: ProjectItem[] = all
    .filter((p) => p.is_show && p.is_featured)
    .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
    .slice(0, 4);

  if (featuredProjects.length === 0) return null;

  return (
    <div className="space-y-12">
      <hr className="border-neutral-100 dark:border-neutral-800/50" />
      <section className="pt-2 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Featured Projects
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-0.5">
            Things I've built and shipped.
          </p>
        </div>
        <Link
          href="/projects"
          className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors group"
        >
          View all
          <HiArrowRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {featuredProjects.map((project: ProjectItem) => (
          <div
            key={project.id}
            className="group relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-100 dark:hover:shadow-neutral-900/50 flex flex-col"
          >
            {/* Project Image */}
            {project.image && (
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}

            {/* Project Info */}
            <div className="p-4 space-y-2 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm leading-snug line-clamp-1 flex-1">
                  {project.title}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {project.link_github && (
                    <Link
                      href={project.link_github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                      aria-label={`GitHub: ${project.title}`}
                    >
                      <BiLogoGithub size={15} />
                    </Link>
                  )}
                  {project.link_demo && (
                    <Link
                      href={project.link_demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                      aria-label={`Demo: ${project.title}`}
                    >
                      <BiLinkExternal size={15} />
                    </Link>
                  )}
                </div>
              </div>

              {project.description && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2 flex-1">
                  {project.description}
                </p>
              )}

              {project.stacks && project.stacks.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.stacks.slice(0, 4).map((stack: string) => (
                    <span
                      key={stack}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-500"
                    >
                      {stack}
                    </span>
                  ))}
                  {project.stacks.length > 4 && (
                    <span className="px-2 py-0.5 text-[11px] text-neutral-400">
                      +{project.stacks.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      </section>
    </div>
  );
};

export default FeaturedProjects;
