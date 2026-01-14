import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  const isDatabasePersistent = !!process.env.DATABASE_URL?.includes("postgresql");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Database Info */}
      <div className="bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Database Configuration
        </h2>

        <div className="space-y-4">
          <div
            className={`p-4 rounded ${
              isDatabasePersistent
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            <p className="font-medium">
              {isDatabasePersistent ? (
                <span className="text-green-800">
                  PostgreSQL database connected
                </span>
              ) : (
                <span className="text-yellow-800">
                  SQLite database (local/development)
                </span>
              )}
            </p>
            {!isDatabasePersistent && (
              <p className="text-sm text-yellow-700 mt-2">
                SQLite does not persist reliably on serverless platforms like
                Vercel. For production use, configure a PostgreSQL database.
              </p>
            )}
          </div>

          <div className="prose prose-sm">
            <h3>Recommended Production Setup</h3>
            <p>
              For production deployments on Vercel, we recommend using a
              PostgreSQL database. Here are some options:
            </p>
            <ul>
              <li>
                <strong>Vercel Postgres</strong> - Native integration, easy setup
              </li>
              <li>
                <strong>Supabase</strong> - Free tier available, great developer
                experience
              </li>
              <li>
                <strong>PlanetScale</strong> - MySQL-compatible, serverless
              </li>
              <li>
                <strong>Neon</strong> - Serverless Postgres, generous free tier
              </li>
            </ul>

            <h3>How to Configure</h3>
            <ol>
              <li>Create a database on your chosen provider</li>
              <li>
                Copy the connection string (usually called DATABASE_URL or
                similar)
              </li>
              <li>
                In your Vercel project settings, add the environment variable:
                <code>DATABASE_URL=your_connection_string</code>
              </li>
              <li>
                Run{" "}
                <code>npx prisma db push</code> to create tables in the new
                database
              </li>
              <li>Redeploy your application</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Environment Variables
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="font-mono text-gray-600">DATABASE_URL</span>
            <span className="text-gray-400">
              {process.env.DATABASE_URL ? "Set" : "Not set"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="font-mono text-gray-600">ADMIN_PASSWORD</span>
            <span className="text-gray-400">
              {process.env.ADMIN_PASSWORD ? "Set" : "Not set"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="font-mono text-gray-600">
              INVENTORY_SESSION_SECRET
            </span>
            <span className="text-gray-400">
              {process.env.INVENTORY_SESSION_SECRET ? "Set" : "Not set"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="font-mono text-gray-600">RESEND_API_KEY</span>
            <span className="text-gray-400">
              {process.env.RESEND_API_KEY ? "Set" : "Not set"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="font-mono text-gray-600">ORDER_TO_EMAIL</span>
            <span className="text-gray-400">
              {process.env.ORDER_TO_EMAIL || "Not set"}
            </span>
          </div>
        </div>
      </div>

      {/* Security Notes */}
      <div className="bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Security Notes
        </h2>
        <div className="prose prose-sm">
          <ul>
            <li>
              Change the default <code>ADMIN_PASSWORD</code> to a strong,
              unique password
            </li>
            <li>
              Generate a secure <code>INVENTORY_SESSION_SECRET</code> using:
              <code>openssl rand -base64 32</code>
            </li>
            <li>
              Never commit <code>.env</code> files to version control
            </li>
            <li>
              Use Vercel&apos;s environment variables UI to set production secrets
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
