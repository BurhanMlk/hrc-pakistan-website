import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <section className="section-pad">
      <div className="container-page flex flex-col items-center py-20 text-center">
        <Compass className="h-16 w-16 text-navy-300" />
        <h1 className="mt-6 text-5xl font-extrabold text-navy-900">404</h1>
        <p className="mt-3 text-lg text-gray-600">The page you are looking for could not be found.</p>
        <Link to="/" className="btn-primary mt-8">Return to Home</Link>
      </div>
    </section>
  );
}
