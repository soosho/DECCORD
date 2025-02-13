export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-4xl font-bold">About Us</h1>
        <div className="prose prose-gray dark:prose-invert">
          <p className="text-xl text-muted-foreground">
            We are dedicated to providing the best service to our customers.
          </p>
          <h2 className="text-2xl font-bold mt-8">Our Mission</h2>
          <p>
            To deliver exceptional value through innovative solutions and outstanding customer service.
          </p>
          <h2 className="text-2xl font-bold mt-8">Our Vision</h2>
          <p>
            To be the leading provider of solutions in our industry, recognized for excellence and innovation.
          </p>
          <h2 className="text-2xl font-bold mt-8">Our Values</h2>
          <ul>
            <li>Innovation</li>
            <li>Integrity</li>
            <li>Excellence</li>
            <li>Customer Focus</li>
          </ul>
        </div>
      </div>
    </div>
  )
}