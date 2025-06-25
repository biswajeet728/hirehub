"use client";

import AuthForms from "@/components/_auth-forms";
import { signInNextAuthHandler } from "@/lib/action";
import { signInSchema } from "@/lib/validators";

function page() {
  return (
    <AuthForms
      schema={signInSchema}
      type="Sign_In"
      defaultValues={{ email: "", password: "" }}
      onSubmit={signInNextAuthHandler}
    />
  );
}

export default page;
