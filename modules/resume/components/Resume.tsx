import Breakline from "@/common/components/elements/Breakline";
import { PageContentMap } from "@/common/libs/page-content";

import CareerList from "@/modules/about/components/CareerList";
import OrganizationList from "@/modules/about/components/OrganizationList";
import EducationList from "@/modules/about/components/EducationList";
import ResumeTabs from "./ResumeTabs";

interface ResumeProps {
  content?: PageContentMap;
}

const Resume = ({ content }: ResumeProps) => {
  return (
    <ResumeTabs 
      careerList={<CareerList content={content} />}
      educationList={<EducationList content={content} />}
      organizationList={<OrganizationList content={content} />}
    />
  );
};

export default Resume;
