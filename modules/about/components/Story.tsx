import Image from "@/common/components/elements/Image";
import { getTranslations } from "next-intl/server";

import { PageContentMap, readPageContent } from "@/common/libs/page-content";

interface StoryProps {
  content?: PageContentMap;
}

const Story = async ({ content }: StoryProps) => {
  const t = await getTranslations("AboutPage");
  const paragraphData = [
    { index: 1 },
    { index: 2 },
    { index: 3 },
    { index: 4 },
  ];

  return (
    <section className="space-y-4 leading-7 text-neutral-800 dark:text-neutral-300">
      {paragraphData.map((paragraph) => (
        <div key={paragraph.index}>
          {readPageContent(
            content,
            `resume.paragraph_${paragraph.index}`,
            t(`resume.paragraph_${paragraph.index}`),
          )}
        </div>
      ))}
      <Image
        src="/images/signature.webp"
        alt="signature"
        width={100}
        height={100}
      />
    </section>
  );
};

export default Story;
