export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdminAuth } from "@/common/libs/adminAuth";
import { checkPrivateDashboardAuth } from "@/common/libs/privateDashboardAuth";

const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder"),
);

export async function GET() {
  // Allow if admin OR private hub
  const isAdmin = await checkAdminAuth();
  const isPrivate = await checkPrivateDashboardAuth();
  if (!isAdmin && !isPrivate) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: wallets, error: wError } = await supabase.from("Wallets").select("*");
    if (wError) throw wError;

    const { data: tx, error: tError } = await supabase.from("FinancialTransactions").select("*").order("date", { ascending: false }).limit(50);
    if (tError) throw tError;

    return NextResponse.json({ wallets: wallets || [], transactions: tx || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const isAdmin = await checkAdminAuth();
  const isPrivate = await checkPrivateDashboardAuth();
  if (!isAdmin && !isPrivate) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action, payload } = await req.json();

    if (action === "create_wallet") {
      const { data, error } = await supabase.from("Wallets").insert([payload]).select();
      if (error) throw error;
      return NextResponse.json(data[0]);
    }

    if (action === "create_tx") {
      const { data, error } = await supabase.from("FinancialTransactions").insert([payload]).select();
      if (error) throw error;
      // update wallet balance manually or rely on triggers. Let's do it manually for safety if no trigger.
      const amount = payload.type === 'income' ? payload.amount : -payload.amount;
      
      const { data: wData } = await supabase.from("Wallets").select("balance").eq("id", payload.wallet_id).single();
      if (wData) {
        await supabase.from("Wallets").update({ balance: (wData.balance || 0) + amount }).eq("id", payload.wallet_id);
      }
      return NextResponse.json(data[0]);
    }

    throw new Error("Invalid action");
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
