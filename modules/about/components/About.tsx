import Breakline from "@/common/components/elements/Breakline";
import { PageContentMap } from "@/common/libs/page-content";

import Story from "./Story";
import CareerList from "./CareerList";
import OrganizationList from "./OrganizationList";
import EducationList from "./EducationList";

interface AboutProps {
  content?: PageContentMap;
}

const About = ({ content }: AboutProps) => {
  return (
    <>
      <Story content={content} />
      <Breakline className="my-8" />
      <CareerList content={content} />
      <Breakline className="my-8" />
      <OrganizationList content={content} />
      <Breakline className="my-8" />
      <EducationList content={content} />
    </>
  );
};

export default About;
