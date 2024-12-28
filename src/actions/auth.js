"use server";

import { getCollection } from "@/lib/db";
import { RegisterSchema, LoginSchema } from "@/lib/rules";
import { createSession } from "@/lib/sessions";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function register(state, formData) {
  const validateFields = RegisterSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      email: formData.get("email"),
    };
  }

  const { email, password } = validateFields.data;
  const userCollection = await getCollection("users");
  if (!userCollection) return { errors: { email: "Server error" } };

  const exsistingUser = await userCollection.findOne({ email });
  if (exsistingUser) {
    return {
      errors: {
        email: "Email already exsists in our database",
      },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const results = await userCollection.insertOne({
    email,
    password: hashedPassword,
  });
  console.log(results);

  await createSession(results.insertedId.toString());

  redirect("/dashboard");
  console.log(results);
}

export async function login(state, formData) {
  const validateFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      email: formData.get("email"),
    };
  }

  console.log(validateFields);

  const { email, password } = validateFields.data;

  const userCollection = await getCollection("users");
  if (!userCollection) return { errors: { email: "Server Error!" } };

  console.log({ email });

  const user = await userCollection.findOne({ email });
  if (!user) return { errors: { email: "Invalid Credentials 1" } };

  console.log(user);

  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) return { errors: { email: "Invalid credentials 2" } };

  await createSession(user._id.toString());
  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/");
}
