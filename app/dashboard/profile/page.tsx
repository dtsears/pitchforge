import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateProfile } from "@/app/actions/update-profile";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    select: {
      name: true,
      title: true,
      tenureYears: true,
      bio: true,
      headshotUrl: true,
      specialties: true,
      image: true,
    },
  });

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center">
          <span className="text-display font-semibold text-stone-900">
            PitchForge
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-display text-3xl font-semibold text-stone-900 mb-1">
            Your Profile
          </h1>
          <p className="text-stone-500 text-sm">
            This information appears on the introduction slide of every deck you
            generate.
          </p>
        </div>

        <form action={updateProfile} className="space-y-6">
          {/* Photo preview */}
          <div className="flex items-center gap-4 p-5 bg-white border border-stone-200 rounded-xl">
            {user?.headshotUrl || user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.headshotUrl ?? user.image ?? ""}
                alt="Profile photo"
                className="w-16 h-16 rounded-full object-cover border border-stone-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-stone-400 text-xl font-semibold">
                {user?.name?.[0] ?? "?"}
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-stone-900">
                {user?.name ?? "Your name"}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                {user?.title ?? "Account Executive"}
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-5">
            <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Basic info
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Full name"
                name="name"
                defaultValue={user?.name ?? ""}
                required
                className="col-span-2"
              />
              <Field
                label="Job title"
                name="title"
                defaultValue={user?.title ?? ""}
              />
              <Field
                label="Years at Bluehost"
                name="tenureYears"
                type="number"
                defaultValue={user?.tenureYears?.toString() ?? ""}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                About me{" "}
                <span className="text-stone-400 font-normal">
                  — appears on your intro slide
                </span>
              </label>
              <textarea
                name="bio"
                rows={4}
                defaultValue={user?.bio ?? ""}
                placeholder="2-3 sentences about your background, focus areas, and how you help customers..."
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
              />
            </div>

            <Field
              label="Specialties"
              name="specialties"
              defaultValue={user?.specialties?.join(", ") ?? ""}
              placeholder="WordPress Pro, WooCommerce, Agency Partner Program"
              hint="Comma-separated list"
            />
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
            <div>
              <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Profile photo
              </h2>
              <p className="text-xs text-stone-400">
                Paste a public image URL (LinkedIn photo, Google profile, etc.)
              </p>
            </div>
            <Field
              label="Photo URL"
              name="headshotUrl"
              type="url"
              defaultValue={user?.headshotUrl ?? ""}
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
            >
              Save profile
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 border border-stone-200 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
  hint,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-stone-600 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
        {hint && <span className="text-stone-400 font-normal ml-1">— {hint}</span>}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900"
      />
    </div>
  );
}
