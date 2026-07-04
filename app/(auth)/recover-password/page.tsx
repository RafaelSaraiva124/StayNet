"use client";

import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import { recoverPasswordSchema } from "@/lib/validations";
import { sendPasswordResetLink } from "@/lib/actions/password.actions";

const Page = () => (
  <AuthForm
    type="RECOVER_PASSWORD"
    schema={recoverPasswordSchema}
    defaultValues={{
      email: "",
    }}
    onSubmit={(data) => sendPasswordResetLink(data.email)}
  />
);

export default Page;
