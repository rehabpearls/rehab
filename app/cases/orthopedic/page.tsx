export default function OrthopedicCasePage() {
  return (
    <main className="min-h-screen py-12 px-6 lg:px-20 bg-gray-50">
      <header className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Orthopedic Rehabilitation Cases
        </h1>
        <p className="text-lg text-gray-700">
          Explore key orthopedic case studies — from trauma recovery to post-op rehabilitation.
        </p>
      </header>

      <section className="mt-10 space-y-8 max-w-4xl mx-auto">
        {/* Case Example */}
        <article className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Case 1: Knee Ligament Injury
          </h2>
          <p className="text-gray-700 mb-4">
            A patient presents with a torn ACL after sports trauma. Rehabilitation focuses on
            strength training, balance exercises, and progressive load tolerance.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Initial assessment and pain control</li>
            <li>Mobility restoration in early phase</li>
            <li>Strength and functional training in later phases</li>
          </ul>
        </article>

        {/* Another Example */}
        <article className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Case 2: Hip Fracture Recovery
          </h2>
          <p className="text-gray-700">
            Elderly patient post hip fracture surgery focusing on safe gait training and fall
            prevention.
          </p>
        </article>
      </section>
    </main>
  );
}
