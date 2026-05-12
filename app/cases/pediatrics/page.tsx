export default function PediatricsCasePage() {
  return (
    <main className="min-h-screen py-12 px-6 lg:px-20 bg-gray-50">
      <header className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Pediatric Rehabilitation Cases
        </h1>
        <p className="text-lg text-gray-700">
          Pediatric rehab focuses on developmental support, functional goals, and age-appropriate
          exercises for kids and teens.
        </p>
      </header>

      <section className="mt-10 space-y-8 max-w-4xl mx-auto">
        <article className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Case 1: Childhood Motor Delay
          </h2>
          <p className="text-gray-700 mb-4">
            A young child with delayed motor milestones benefiting from play-based movement therapy.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Gross motor skills</li>
            <li>Balance & coordination play</li>
            <li>Family-guided intervention</li>
          </ul>
        </article>

        <article className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Case 2: Juvenile Orthopedic Support
          </h2>
          <p className="text-gray-700">
            Tailored guidance on strength and flexibility to support adolescent orthopedic conditions.
          </p>
        </article>
      </section>
    </main>
  );
}
