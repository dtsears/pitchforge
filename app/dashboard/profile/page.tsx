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
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Profile photo
                </h2>
                <p className="text-xs text-stone-400">
                  Override your Google photo with any public image URL.
                </p>
              </div>
              {!user?.headshotUrl && user?.image && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-600 shrink-0">
                  <svg className="w-3 h-3" viewBox="0 0 18 18" aria-hidden="true">
                    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Using Google photo
                </span>
              )}
            </div>
            <Field
              label="Photo URL"
              name="headshotUrl"
              type="url"
              defaultValue={user?.headshotUrl ?? user?.image ?? ""}
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
