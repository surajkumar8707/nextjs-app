"use client";
import Link from "next/link";
import { login } from "@/actions/auth";
import React, { useActionState } from "react";

export default function Login() {
  const [state, action, isPending] = useActionState(login, undefined);

  console.log(state);

  return (
    <div className="container w-1/2">
      <h1 className="title">Login form</h1>
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={state?.email}
          />
          {state?.errors?.email && (
            <p className="error">{state?.errors?.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
          {state?.errors?.password && (
            <p className="error">{state?.errors?.password}</p>
          )}
        </div>

        <div className="flex items-end gap-4">
          <button disabled={isPending} className="btn-primary">
            {isPending ? "Processing..." : "Login"}
          </button>
          <Link href="/register" className="text-link">
            Or Register in here
          </Link>
        </div>
      </form>
    </div>
  );
}
