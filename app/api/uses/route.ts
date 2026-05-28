export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { supabaseServer } from "@/common/libs/supabase-server";

export const GET = async () => {
  try {
    const { data: uses, error } = await supabaseServer
      .from("Uses")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(uses || [], { status: 200 });
  } catch (error: any) {
    console.error("Uses API Error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
};
