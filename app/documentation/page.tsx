export default function DocumentationPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-4xl font-bold">Documentation</h1>
        <div className="prose prose-gray dark:prose-invert">
          <h2 className="text-2xl font-bold">Getting Started</h2>
          <p>
            Welcome to our documentation. Here you'll find everything you need to get started with our platform.
          </p>
          
          <h2 className="text-2xl font-bold mt-8">Authentication</h2>
          <p>
            Our platform supports multiple authentication methods:
          </p>
          <ul>
            <li>Email and Password</li>
            <li>Google OAuth</li>
            <li>Facebook OAuth</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">Security</h2>
          <p>
            We take security seriously and implement multiple layers of protection:
          </p>
          <ul>
            <li>Two-factor authentication with email OTP</li>
            <li>reCAPTCHA protection</li>
            <li>Device fingerprinting</li>
            <li>Secure password hashing</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8">API Reference</h2>
          <p>
            Detailed API documentation is available for developers who want to integrate with our platform.
          </p>
        </div>
      </div>
    </div>
  )
}