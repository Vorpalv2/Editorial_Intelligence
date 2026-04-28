import { prisma } from "@/src/prisma";
import argon2 from "argon2";

export async function HandleSignIn(data: { email: string; password: string }) {
  try {
    let { email, password } = data;

    const hashedPassword = await argon2.hash(password);
  } catch (error) {}
}

export async function HandleSignUp(data: {
  username: string;
  email: string;
  password: string;
  passwordCheck: string;
}) {
  try {
    let { email, password, passwordCheck, username } = data;

    // await prisma.
  } catch (error) {}
}
