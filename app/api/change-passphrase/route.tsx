import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import users from "@/data/users.json";

const usersFilePath = path.join(process.cwd(), "data", "users.json");

export async function POST(req: Request) {
  try {
    const { newPassphrase } = await req.json();

    if (!newPassphrase || newPassphrase.length < 20) {
      return NextResponse.json({ error: "Passphrase must be at least 20 characters!" }, { status: 400 });
    }

    const hashedPassphrase = await bcrypt.hash(newPassphrase, 10);

    // Update users.json
    users[0].passphraseHash = hashedPassphrase;
    users[0].isFirstTimeLogin = true; // Mark first-time login as done

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ message: "Passphrase updated successfully!", redirect: "/dashboard" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
