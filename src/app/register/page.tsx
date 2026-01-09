"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  payMembershipFee: boolean;
}

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page with registration tab
    router.replace("/login?tab=register");
  }, [router]);

  return null;
}
