"use client";

import dynamic from "next/dynamic";
import Breakline from "@/common/components/elements/Breakline";
import { GITHUB_ACCOUNTS } from "@/common/constants/github";
import { CODEWARS_ACCOUNT } from "@/common/constants/codewars";

import UmamiSkeleton from "./Umami/UmamiSkeleton";
import ContributionsSkeleton from "./Contributions/ContributionsSkeleton";
import CodingActiveSkeleton from "./CodingActive/CodingActiveSkeleton";
import CodewarsSkeleton from "./Codewars/CodewarsSkeleton";
import MonkeytypeSkeleton from "./Monkeytype/MonkeytypeSkeleton";

const Umami = dynamic(() => import("./Umami"), {
  ssr: false,
  loading: () => <UmamiSkeleton />,
});

const Contributions = dynamic(() => import("./Contributions"), {
  ssr: false,
  loading: () => <ContributionsSkeleton />,
});

const CodingActive = dynamic(() => import("./CodingActive"), {
  ssr: false,
  loading: () => <CodingActiveSkeleton />,
});

const Codewars = dynamic(() => import("./Codewars"), {
  ssr: false,
  loading: () => <CodewarsSkeleton />,
});

const Monkeytype = dynamic(() => import("./Monkeytype"), {
  ssr: false,
  loading: () => <MonkeytypeSkeleton />,
});

const Dashboard = () => {
  return (
    <>
      <Umami />
      <Breakline className="my-8" />
      <Contributions endpoint={GITHUB_ACCOUNTS.endpoint} />
      <Breakline className="my-8" />
      <CodingActive />
      <Breakline className="my-8" />
      <Codewars endpoint={CODEWARS_ACCOUNT.endpoint} />
      {/* <Breakline className="my-8" /> */}
      <Monkeytype />
    </>
  );
};

export default Dashboard;
