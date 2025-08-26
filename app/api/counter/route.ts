import { NextRequest, NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";
import { encodeFunctionData } from "viem";
import { counterAbi } from "@/lib/counterAbi";
import { getDefaultChain } from "@/lib/chains";

// Initialize Privy client
const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!,
  {
    walletApi: {
      authorizationPrivateKey: process.env.PRIVY_SESSION_SIGNER_PRIVATE_KEY!,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { action, walletId, contractAddress } = await request.json();

    // Validate inputs
    if (!action || !walletId || !contractAddress) {
      return NextResponse.json(
        { message: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (action !== "increment" && action !== "decrement") {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    // Check if session signer is configured
    if (!process.env.NEXT_PUBLIC_PRIVY_SESSION_SIGNER_ID) {
      return NextResponse.json(
        { message: "Session signer not configured" },
        { status: 500 }
      );
    }

    // Encode the function call
    const data = encodeFunctionData({
      abi: counterAbi,
      functionName: action,
    });

    // Get the chain configuration
    const defaultChain = getDefaultChain();
    const caip2 = `eip155:${defaultChain.id}` as `eip155:${string}`;

    // Send transaction using Privy's server SDK
    const response = await privy.walletApi.ethereum.sendTransaction({
      walletId,
      caip2,
      transaction: {
        to: contractAddress,
        data,
        chainId: defaultChain.id,
      },
      // sponsor: true, // Uncomment if you have gas sponsorship configured
    });

    return NextResponse.json({
      hash: response.hash,
      success: true,
    });
  } catch (error) {
    console.error("Failed to execute counter transaction:", error);

    // Handle specific Privy errors
    if (error instanceof Error) {
      if (error.message.includes("authorization")) {
        return NextResponse.json(
          { message: "Session signer not authorized for this wallet" },
          { status: 403 }
        );
      }
      if (error.message.includes("insufficient funds")) {
        return NextResponse.json(
          { message: "Insufficient funds to execute transaction" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: "Failed to execute transaction" },
      { status: 500 }
    );
  }
}
