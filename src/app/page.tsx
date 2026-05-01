import { auth } from "@/auth";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PartnerDashboard from "@/components/PartnerDashboard";
import PublicHome from "@/components/PublicHome";
import connectDb from "@/lib/db";
import User from "@/models/user.model";

export const dynamic = "force-dynamic";

export default async function Home() {
  await connectDb();
  const session = await auth();
  const user = await User.findOne({ email: session?.user?.email })

  return (
    <div className="w-full min-h-screen  bg-white">

      {user?.role !== "admin" && <Nav /> }

      {user?.role === "partner" ? (
        <PartnerDashboard />
      ) : user?.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <PublicHome />
      )}


      <Footer />
    </div>
  );
}