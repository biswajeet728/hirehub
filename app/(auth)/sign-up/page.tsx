"use client";

import AuthForms from "@/components/_auth-forms";
import { signUpHandler } from "@/lib/action";
import { signUpSchema } from "@/lib/validators";

function page() {
  return (
    <AuthForms
      schema={signUpSchema}
      type="Sign_Up"
      defaultValues={{
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={signUpHandler}
    />
  );
}

export default page;
