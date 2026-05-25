"use client";

import Marquee from "react-fast-marquee";
import DynamicIcon from "@/common/components/DynamicIcon";

interface Skill {
  id: number;
  name: string;
  icon: string;
  background: string;
}

interface SkillsMarqueeProps {
  skills: Skill[];
}

export default function SkillsMarquee({ skills }: SkillsMarqueeProps) {
  // Split skills into 3 groups
  const row1: Skill[] = [];
  const row2: Skill[] = [];
  const row3: Skill[] = [];

  skills.forEach((skill, idx) => {
    if (idx % 3 === 0) {
      row1.push(skill);
    } else if (idx % 3 === 1) {
      row2.push(skill);
    } else {
      row3.push(skill);
    }
  });

  const renderSkillCard = (skill: Skill, idx: number) => (
    <div
      key={`${skill.id}-${idx}`}
      title={skill.name}
      className="flex items-center gap-2 px-4 py-2 mx-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 cursor-default shadow-sm select-none"
    >
      <span className="w-4 h-4 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
        <DynamicIcon name={skill.icon} />
      </span>
      <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
        {skill.name}
      </span>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden py-4 space-y-4">

      {/* Row 1: Leftward */}
      <Marquee speed={35} direction="left" pauseOnHover={true} gradient={false}>
        <div className="flex py-0.5">
          {row1.map((skill, idx) => renderSkillCard(skill, idx))}
        </div>
      </Marquee>

      {/* Row 2: Rightward */}
      <Marquee speed={30} direction="right" pauseOnHover={true} gradient={false}>
        <div className="flex py-0.5">
          {row2.map((skill, idx) => renderSkillCard(skill, idx))}
        </div>
      </Marquee>

      {/* Row 3: Leftward */}
      <Marquee speed={40} direction="left" pauseOnHover={true} gradient={false}>
        <div className="flex py-0.5">
          {row3.map((skill, idx) => renderSkillCard(skill, idx))}
        </div>
      </Marquee>
    </div>
  );
}
