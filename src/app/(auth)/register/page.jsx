"use client";
import Link from "next/link";
import { register } from "@/actions/auth";
import React, { useActionState } from "react";

export default function Register() {
  const [state, action, isPending] = useActionState(register, undefined);

  console.log(state);

  return (
    <div className="container w-1/2">
      <h1 className="title">Register form</h1>
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
            <div className="error">
              <p>Password must: </p>
              <ul className="list-disc list-inside ml-4">
                {state?.errors?.password?.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confim Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" />
          {state?.errors?.confirmPassword && (
            <p className="error">{state?.errors?.confirmPassword}</p>
          )}
        </div>

        <div className="flex items-end gap-4">
          <button disabled={isPending} className="btn-primary">
            {isPending ? "Processing..." : "Register"}
          </button>
          <Link href="/login" className="text-link">
            Or Login in here
          </Link>
        </div>
      </form>
    </div>
  );
}
