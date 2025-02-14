import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import users from "@/data/users.json"; // Load users.json

export async function POST(req: Request) {
  try {
    const { passphrase } = await req.json();

    if (!passphrase) {
      return NextResponse.json({ error: "Passphrase is required!" }, { status: 400 });
    }

    // Get stored hash and isFirstTimeLogin flag
    const storedUser = users[0]; // Assuming single user for now
    if (!storedUser) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const { passphraseHash, isFirstTimeLogin } = storedUser;

    // Compare entered passphrase with stored hash
    const isMatch = await bcrypt.compare(passphrase, passphraseHash);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid passphrase!" }, { status: 401 });
    }

    // Redirect based on isFirstTimeLogin
    if (!isFirstTimeLogin) {
      return NextResponse.json({ message: "Redirecting to change passphrase!", redirect: "/change-passphrase" });
    }

    return NextResponse.json({ message: "Login successful!", redirect: "/dashboard" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
