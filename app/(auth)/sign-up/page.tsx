"use client";

import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import { signUpSchema } from "@/lib/validations";
import { signUp } from "@/lib/actions/auth";

const Page = () => (
  <AuthForm
    type="SIGN_UP"
    schema={signUpSchema}
    defaultValues={{
      fullName: "",
      email: "",
      password: "",
    }}
    onSubmit={signUp}
  />
);
export default Page;
