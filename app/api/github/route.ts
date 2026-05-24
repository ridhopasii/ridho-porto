import { NextResponse } from "next/server";
import { getGithubData } from "@/services/github";

export const dynamic = "force-dynamic";

// Function to generate high-quality, realistic, dynamic mock Github contribution data
function generateMockGithubData() {
  const colors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
  const weeks: any[] = [];
  const months: any[] = [];
  
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 365);
  
  // Align start date to the beginning of the week (Sunday)
  const startDay = startDate.getDay();
  startDate.setDate(startDate.getDate() - startDay);
  
  let currentDate = new Date(startDate);
  let totalContributions = 0;
  
  // Generate 53 weeks of daily contributions
  for (let w = 0; w < 53; w++) {
    const contributionDays = [];
    const firstDayStr = currentDate.toISOString().split("T")[0];
    
    for (let d = 0; d < 7; d++) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const countRand = Math.random();
      let count = 0;
      let color = colors[0];
      
      // Determine contribution count and matching color index
      if (countRand > 0.85) {
        count = Math.floor(Math.random() * 3) + 1;
        color = colors[1];
      } else if (countRand > 0.94) {
        count = Math.floor(Math.random() * 5) + 4;
        color = colors[2];
      } else if (countRand > 0.98) {
        count = Math.floor(Math.random() * 8) + 9;
        color = colors[3];
      } else if (countRand > 0.995) {
        count = Math.floor(Math.random() * 12) + 15;
        color = colors[4];
      }
      
      // Reduce weekend activity for realism
      if (d === 0 || d === 6) {
        if (Math.random() > 0.3) {
          count = 0;
          color = colors[0];
        }
      }
      
      totalContributions += count;
      contributionDays.push({
        color,
        contributionCount: count,
        date: dateStr,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    weeks.push({
      contributionDays,
      firstDay: firstDayStr,
    });
  }
  
  // Extract month names and aggregate month boundaries
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const seenMonths = new Set<string>();
  
  weeks.forEach((week) => {
    const date = new Date(week.firstDay);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!seenMonths.has(monthKey)) {
      seenMonths.add(monthKey);
      
      // Compute total weeks in this month
      const totalWeeks = weeks.filter(w => {
        const wDate = new Date(w.firstDay);
        return wDate.getMonth() === date.getMonth() && wDate.getFullYear() === date.getFullYear();
      }).length;
      
      months.push({
        firstDay: week.firstDay,
        name: monthNames[date.getMonth()],
        totalWeeks,
        contributionsCount: 0, // Calculated by calendar component
      });
    }
  });
  
  return {
    contributionsCollection: {
      contributionCalendar: {
        colors,
        totalContributions,
        months,
        weeks,
      },
    },
  };
}

export const GET = async () => {
  try {
    const response = await getGithubData();
    
    // If GitHub API failed or token is missing/expired, fall back to mock data
    if (response.status !== 200 || !response.data) {
      console.warn("GitHub API failed/unauthorized. Using high-quality mock contributions fallback.");
      const mockData = generateMockGithubData();
      return NextResponse.json(mockData, { status: 200 });
    }
    
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error in GitHub API Route, falling back to mock:", error);
    const mockData = generateMockGithubData();
    return NextResponse.json(mockData, { status: 200 });
  }
};
