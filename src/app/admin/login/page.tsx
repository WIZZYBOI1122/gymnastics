import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminControls";
import { adminConfigured, isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <section className="panel login-card">
      <h1 style={{ marginTop: 0, fontSize: "1.6rem" }}>Admin sign in</h1>
      {adminConfigured() ? (
        <AdminLoginForm />
      ) : (
        <p className="form-alert" role="alert">
          The admin area is locked. Set ADMIN_PASSWORD (12+ characters) and SESSION_SECRET (32+
          characters) in your environment, then restart the server.
        </p>
      )}
    </section>
  );
}
